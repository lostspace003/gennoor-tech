"""Bake model weights into the image at build time.

Downloading at boot would make every cold start pull ~2 GB from HuggingFace,
and the container-app cold start is already the slow path. Run as its own
Docker layer so editing app.py doesn't re-download anything.
"""
import os
import sys

from huggingface_hub import snapshot_download

REPOS = {
    "nomic": "nomic-ai/nomic-embed-text-v2-moe",
    "bge": "BAAI/bge-m3",
}

# Formats we never load: TF/Flax checkpoints, ONNX and OpenVINO exports.
# Skipping them roughly halves the download.
IGNORE = ["*.h5", "*.ot", "*.msgpack", "onnx/*", "openvino/*", "*.onnx", "*.onnx_data"]


def main() -> int:
    wanted = [k.strip() for k in os.environ.get("BAKE_MODELS", "nomic").split(",") if k.strip()]
    for key in wanted:
        if key not in REPOS:
            print(f"unknown model key '{key}'; known: {list(REPOS)}", file=sys.stderr)
            return 1
        print(f"downloading {REPOS[key]} ...", flush=True)
        snapshot_download(repo_id=REPOS[key], cache_dir="/models", ignore_patterns=IGNORE)
        print(f"done {key}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
