"""
Gennoor vector service — multilingual embeddings + FAISS semantic search.

One service backs every retrieval surface: the gennoor.com bot, the CRM
copilot, CRM lead search, and agent drafting. It exists as a container rather
than inside the Next.js app because the models need more RAM than the B1 App
Service plan has spare, and because a native FAISS build has no business in a
web app's deploy path.

Models (per-namespace, lazily loaded — a model you never ask for is never
loaded, so it costs no memory):
  nomic  → nomic-ai/nomic-embed-text-v2-moe   768d, ~100 languages, needs prefixes
  bge    → BAAI/bge-m3                        1024d, strong on Arabic/Swahili

Namespaces keep separate FAISS indexes and may use different models:
  site   → gennoor.com pages, course PDFs, webinars (public, multilingual)
  leads  → CRM leads (internal, English)

Indexes persist to Azure Blob so a container restart doesn't lose them, and
are rebuilt into memory on boot. IndexFlatIP over normalised vectors = exact
cosine search; at this corpus size that is both faster and simpler than an
approximate index, and FAISS handles the SIMD.
"""
from __future__ import annotations

import logging
import os
import threading
import time
from contextlib import asynccontextmanager
from typing import Any

import faiss
import numpy as np
from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("vector")

API_KEY = os.getenv("VECTOR_API_KEY", "")
BLOB_CONN = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "")
BLOB_CONTAINER = os.getenv("VECTOR_BLOB_CONTAINER", "vector-indexes")
DEFAULT_MODEL = os.getenv("VECTOR_DEFAULT_MODEL", "nomic")
MAX_SEQ_LEN = int(os.getenv("VECTOR_MAX_SEQ_LEN", "1024"))

# ── Model registry ────────────────────────────────────────────────────────
# `query_prefix`/`doc_prefix` matter: nomic v2-moe was trained with asymmetric
# prefixes and silently loses accuracy without them. bge-m3 uses none.
MODELS: dict[str, dict[str, Any]] = {
    "nomic": {
        "repo": "nomic-ai/nomic-embed-text-v2-moe",
        "dim": 768,
        "query_prefix": "search_query: ",
        "doc_prefix": "search_document: ",
        "trust_remote_code": True,
    },
    "bge": {
        "repo": "BAAI/bge-m3",
        "dim": 1024,
        "query_prefix": "",
        "doc_prefix": "",
        "trust_remote_code": False,
    },
}

NAMESPACE_MODEL = {
    "site": os.getenv("VECTOR_SITE_MODEL", DEFAULT_MODEL),
    "leads": os.getenv("VECTOR_LEADS_MODEL", DEFAULT_MODEL),
}

_loaded: dict[str, Any] = {}
_load_lock = threading.Lock()


def get_model(key: str):
    """Lazy-load and cache. Two callers racing on a cold model must not both
    pay the load, hence the lock."""
    if key not in MODELS:
        raise HTTPException(400, f"Unknown model '{key}'. Known: {list(MODELS)}")
    if key in _loaded:
        return _loaded[key]
    with _load_lock:
        if key in _loaded:
            return _loaded[key]
        from sentence_transformers import SentenceTransformer

        spec = MODELS[key]
        t0 = time.time()
        log.info("loading model %s (%s)", key, spec["repo"])
        model = SentenceTransformer(
            spec["repo"],
            trust_remote_code=spec["trust_remote_code"],
            cache_folder=os.getenv("HF_HOME", "/models"),
        )
        model.max_seq_length = MAX_SEQ_LEN
        _loaded[key] = model
        log.info("loaded %s in %.1fs", key, time.time() - t0)
        return model


def encode(model_key: str, texts: list[str], kind: str) -> np.ndarray:
    spec = MODELS[model_key]
    prefix = spec["query_prefix"] if kind == "query" else spec["doc_prefix"]
    prepared = [f"{prefix}{t}" for t in texts]
    vectors = get_model(model_key).encode(
        prepared,
        batch_size=int(os.getenv("VECTOR_BATCH", "8")),
        normalize_embeddings=True,  # cosine via inner product
        convert_to_numpy=True,
        show_progress_bar=False,
    )
    return np.asarray(vectors, dtype=np.float32)


# ── Index store ───────────────────────────────────────────────────────────
class Namespace:
    """A FAISS index plus the payloads that go with it.

    FAISS only stores vectors and integer ids, so ids and metadata live
    alongside in plain dicts and are persisted with the index.
    """

    def __init__(self, name: str, dim: int):
        self.name = name
        self.dim = dim
        self.index = faiss.IndexIDMap2(faiss.IndexFlatIP(dim))
        self.meta: dict[int, dict[str, Any]] = {}
        self.key_to_id: dict[str, int] = {}
        self.next_id = 1
        self.lock = threading.Lock()
        self.dirty = False

    def upsert(self, items: list[dict[str, Any]], vectors: np.ndarray) -> int:
        with self.lock:
            # Replacing an existing key means removing the old vector first —
            # otherwise the same document accumulates copies across re-indexes.
            replace = [self.key_to_id[i["id"]] for i in items if i["id"] in self.key_to_id]
            if replace:
                self.index.remove_ids(np.asarray(replace, dtype=np.int64))
            ids = []
            for item in items:
                key = item["id"]
                num = self.key_to_id.get(key)
                if num is None:
                    num = self.next_id
                    self.next_id += 1
                    self.key_to_id[key] = num
                ids.append(num)
                self.meta[num] = {"id": key, "text": item.get("text", ""), "meta": item.get("meta") or {}}
            self.index.add_with_ids(vectors, np.asarray(ids, dtype=np.int64))
            self.dirty = True
            return len(ids)

    def remove(self, keys: list[str]) -> int:
        with self.lock:
            ids = [self.key_to_id.pop(k) for k in keys if k in self.key_to_id]
            if not ids:
                return 0
            self.index.remove_ids(np.asarray(ids, dtype=np.int64))
            for i in ids:
                self.meta.pop(i, None)
            self.dirty = True
            return len(ids)

    def clear(self):
        with self.lock:
            self.index = faiss.IndexIDMap2(faiss.IndexFlatIP(self.dim))
            self.meta.clear()
            self.key_to_id.clear()
            self.next_id = 1
            self.dirty = True

    def search(self, vector: np.ndarray, top_k: int) -> list[dict[str, Any]]:
        if self.index.ntotal == 0:
            return []
        k = min(top_k, self.index.ntotal)
        scores, ids = self.index.search(vector.reshape(1, -1), k)
        hits = []
        for score, num in zip(scores[0], ids[0]):
            if num == -1:
                continue
            entry = self.meta.get(int(num))
            if entry:
                hits.append({"id": entry["id"], "score": float(score), "text": entry["text"], "meta": entry["meta"]})
        return hits

    def existing_keys(self) -> list[str]:
        return list(self.key_to_id.keys())


_namespaces: dict[str, Namespace] = {}
_ns_lock = threading.Lock()


def get_namespace(name: str) -> Namespace:
    if name not in NAMESPACE_MODEL:
        raise HTTPException(400, f"Unknown namespace '{name}'. Known: {list(NAMESPACE_MODEL)}")
    with _ns_lock:
        ns = _namespaces.get(name)
        if ns is None:
            ns = Namespace(name, MODELS[NAMESPACE_MODEL[name]]["dim"])
            _namespaces[name] = ns
        return ns


# ── Persistence ───────────────────────────────────────────────────────────
def _blob_client(blob_name: str):
    from azure.storage.blob import BlobServiceClient

    if not BLOB_CONN:
        return None
    svc = BlobServiceClient.from_connection_string(BLOB_CONN)
    container = svc.get_container_client(BLOB_CONTAINER)
    try:
        container.create_container()
    except Exception:
        pass
    return container.get_blob_client(blob_name)


def persist(ns: Namespace):
    """Snapshot index + payloads to blob. Best-effort: a storage failure must
    never take the search path down — the in-memory index is still correct."""
    client = _blob_client(f"{ns.name}.faiss")
    if client is None:
        return
    try:
        import io
        import json
        import pickle

        with ns.lock:
            raw = faiss.serialize_index(ns.index)
            payload = pickle.dumps(
                {"meta": ns.meta, "key_to_id": ns.key_to_id, "next_id": ns.next_id, "dim": ns.dim}
            )
            ns.dirty = False
        client.upload_blob(io.BytesIO(bytes(raw)), overwrite=True)
        _blob_client(f"{ns.name}.pkl").upload_blob(io.BytesIO(payload), overwrite=True)
        _blob_client(f"{ns.name}.json").upload_blob(
            io.BytesIO(json.dumps({"count": ns.index.ntotal, "dim": ns.dim, "savedAt": time.time()}).encode()),
            overwrite=True,
        )
        log.info("persisted namespace %s (%d vectors)", ns.name, ns.index.ntotal)
    except Exception as exc:  # noqa: BLE001
        log.error("persist failed for %s: %s", ns.name, exc)


def restore(name: str):
    client = _blob_client(f"{name}.faiss")
    if client is None:
        return
    try:
        import pickle

        raw = client.download_blob().readall()
        payload = pickle.loads(_blob_client(f"{name}.pkl").download_blob().readall())
        ns = get_namespace(name)
        with ns.lock:
            ns.index = faiss.deserialize_index(np.frombuffer(raw, dtype=np.uint8))
            ns.meta = payload["meta"]
            ns.key_to_id = payload["key_to_id"]
            ns.next_id = payload["next_id"]
        log.info("restored namespace %s (%d vectors)", name, ns.index.ntotal)
    except Exception as exc:  # noqa: BLE001
        log.info("no saved index for %s (%s) — starting empty", name, type(exc).__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    for name in NAMESPACE_MODEL:
        restore(name)
    # Warm the default model so the first real request isn't the one paying
    # the load. Backgrounded so the health probe can pass immediately.
    threading.Thread(target=lambda: get_model(DEFAULT_MODEL), daemon=True).start()
    yield
    for ns in _namespaces.values():
        if ns.dirty:
            persist(ns)


app = FastAPI(title="Gennoor Vector Service", version="1.0.0", lifespan=lifespan)


def require_key(x_api_key: str = Header(default="")):
    # The ACA ingress is public, so the shared secret is the only thing between
    # the internet and the index. Never make this optional in production.
    if not API_KEY:
        raise HTTPException(500, "VECTOR_API_KEY not configured")
    if x_api_key != API_KEY:
        raise HTTPException(401, "Unauthorized")


# ── Schemas ───────────────────────────────────────────────────────────────
class EmbedRequest(BaseModel):
    texts: list[str]
    kind: str = Field(default="document", pattern="^(query|document)$")
    model: str | None = None


class Item(BaseModel):
    id: str
    text: str
    meta: dict[str, Any] | None = None


class UpsertRequest(BaseModel):
    items: list[Item]
    replaceAll: bool = False


class SearchRequest(BaseModel):
    query: str
    topK: int = 8
    filter: dict[str, Any] | None = None


# ── Routes ────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "ok": True,
        "models": {k: {"dim": v["dim"], "loaded": k in _loaded} for k, v in MODELS.items()},
        "namespaces": {
            name: {
                "model": NAMESPACE_MODEL[name],
                "vectors": _namespaces[name].index.ntotal if name in _namespaces else 0,
            }
            for name in NAMESPACE_MODEL
        },
    }


@app.post("/embed", dependencies=[Depends(require_key)])
def embed(req: EmbedRequest):
    if not req.texts:
        return {"vectors": [], "dim": 0}
    key = req.model or DEFAULT_MODEL
    vectors = encode(key, req.texts, req.kind)
    return {"vectors": vectors.tolist(), "dim": int(vectors.shape[1]), "model": key}


@app.post("/index/{namespace}/upsert", dependencies=[Depends(require_key)])
def upsert(namespace: str, req: UpsertRequest):
    ns = get_namespace(namespace)
    if req.replaceAll:
        ns.clear()
    if not req.items:
        persist(ns)
        return {"upserted": 0, "total": ns.index.ntotal}
    model_key = NAMESPACE_MODEL[namespace]
    vectors = encode(model_key, [i.text for i in req.items], "document")
    count = ns.upsert([i.model_dump() for i in req.items], vectors)
    persist(ns)
    return {"upserted": count, "total": ns.index.ntotal, "dim": ns.dim}


@app.post("/index/{namespace}/search", dependencies=[Depends(require_key)])
def search(namespace: str, req: SearchRequest):
    ns = get_namespace(namespace)
    model_key = NAMESPACE_MODEL[namespace]
    qv = encode(model_key, [req.query], "query")[0]
    # Over-fetch when filtering so the filter doesn't starve the result set
    hits = ns.search(qv, req.topK * 4 if req.filter else req.topK)
    if req.filter:
        hits = [h for h in hits if all(h["meta"].get(k) == v for k, v in req.filter.items())][: req.topK]
    return {"hits": hits, "total": ns.index.ntotal}


@app.post("/index/{namespace}/remove", dependencies=[Depends(require_key)])
def remove(namespace: str, ids: list[str]):
    ns = get_namespace(namespace)
    removed = ns.remove(ids)
    persist(ns)
    return {"removed": removed, "total": ns.index.ntotal}


@app.get("/index/{namespace}/keys", dependencies=[Depends(require_key)])
def keys(namespace: str):
    """Lets the caller compute a delta instead of re-embedding everything."""
    ns = get_namespace(namespace)
    return {"keys": ns.existing_keys(), "total": ns.index.ntotal}
