"""
Gennoor AI Copilot - Advanced Embedding Service
Uses the most efficient embedding models with smart chunking
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import numpy as np
from sentence_transformers import SentenceTransformer
import torch
from langchain.text_splitter import RecursiveCharacterTextSplitter, TokenTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
import hashlib
import redis
import json
import asyncio
from datetime import datetime
import logging
from contextlib import asynccontextmanager

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
class Config:
    # Use BGE-small for efficiency - best balance of speed and quality
    DEFAULT_MODEL = "BAAI/bge-small-en-v1.5"

    # Alternative models for different use cases
    MODELS = {
        "efficient": "sentence-transformers/all-MiniLM-L6-v2",  # Fast, good quality
        "multilingual": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        "large": "BAAI/bge-large-en-v1.5",  # Higher quality, slower
        "e5": "intfloat/e5-small-v2",  # Efficient E5 model
        "instructor": "hkunlp/instructor-base",  # Instruction-based embeddings
    }

    # Chunking strategies
    CHUNK_SIZES = {
        "small": 256,
        "medium": 512,
        "large": 1024,
        "adaptive": None  # Will be calculated based on content
    }

    CHUNK_OVERLAP = 50
    REDIS_TTL = 3600 * 24  # 24 hours cache
    BATCH_SIZE = 32
    MAX_LENGTH = 512

config = Config()

# Models cache
models_cache = {}
redis_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for FastAPI app"""
    # Startup
    logger.info("Initializing embedding service...")

    # Initialize Redis
    global redis_client
    try:
        redis_client = redis.Redis(
            host='redis',
            port=6379,
            decode_responses=True,
            socket_connect_timeout=5
        )
        redis_client.ping()
        logger.info("Redis connected successfully")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}. Running without cache.")
        redis_client = None

    # Pre-load default model
    load_model(config.DEFAULT_MODEL)
    logger.info(f"Default model {config.DEFAULT_MODEL} loaded")

    yield

    # Shutdown
    logger.info("Shutting down embedding service...")

app = FastAPI(
    title="Gennoor AI Copilot - Embedding Service",
    description="Advanced embedding service with smart chunking and caching",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class EmbeddingRequest(BaseModel):
    texts: List[str] = Field(..., description="List of texts to embed")
    model: Optional[str] = Field(default="efficient", description="Model to use")
    chunk_strategy: Optional[str] = Field(default="medium", description="Chunking strategy")
    chunk_size: Optional[int] = Field(default=None, description="Custom chunk size")
    chunk_overlap: Optional[int] = Field(default=50, description="Chunk overlap")
    instruction: Optional[str] = Field(default=None, description="Instruction for instructor models")
    use_cache: bool = Field(default=True, description="Use Redis cache")

class ChunkRequest(BaseModel):
    text: str = Field(..., description="Text to chunk")
    strategy: str = Field(default="medium", description="Chunking strategy")
    chunk_size: Optional[int] = Field(default=None, description="Custom chunk size")
    chunk_overlap: Optional[int] = Field(default=50, description="Chunk overlap")
    preserve_sentences: bool = Field(default=True, description="Try to preserve sentence boundaries")

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    model: str
    dimensions: int
    chunks: Optional[List[str]] = None
    metadata: Dict[str, Any]

class ChunkResponse(BaseModel):
    chunks: List[str]
    metadata: Dict[str, Any]

def load_model(model_name: str) -> SentenceTransformer:
    """Load and cache embedding model"""
    if model_name not in models_cache:
        if model_name in config.MODELS:
            model_path = config.MODELS[model_name]
        else:
            model_path = model_name

        logger.info(f"Loading model: {model_path}")

        # Use GPU if available
        device = 'cuda' if torch.cuda.is_available() else 'cpu'

        # Load model with optimizations
        model = SentenceTransformer(model_path, device=device)
        model.max_seq_length = config.MAX_LENGTH

        # Enable eval mode for inference
        model.eval()

        models_cache[model_name] = model
        logger.info(f"Model {model_name} loaded successfully on {device}")

    return models_cache[model_name]

def get_cache_key(texts: List[str], model: str) -> str:
    """Generate cache key for embeddings"""
    content = json.dumps(texts, sort_keys=True) + model
    return f"emb:{hashlib.sha256(content.encode()).hexdigest()}"

def smart_chunk_text(
    text: str,
    strategy: str = "medium",
    chunk_size: Optional[int] = None,
    chunk_overlap: int = 50,
    preserve_sentences: bool = True
) -> List[str]:
    """
    Smart text chunking with multiple strategies
    """
    if not text:
        return []

    # Determine chunk size based on strategy
    if chunk_size is None:
        if strategy == "adaptive":
            # Calculate adaptive chunk size based on content
            text_length = len(text)
            if text_length < 1000:
                chunk_size = 256
            elif text_length < 5000:
                chunk_size = 512
            else:
                chunk_size = 1024
        else:
            chunk_size = config.CHUNK_SIZES.get(strategy, 512)

    # Choose splitter based on requirements
    if preserve_sentences:
        # Use recursive splitter for better sentence preservation
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ". ", "! ", "? ", ";", ":", " ", ""],
            length_function=len,
        )
    else:
        # Use token splitter for more precise control
        splitter = TokenTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    chunks = splitter.split_text(text)

    # Post-process chunks
    processed_chunks = []
    for chunk in chunks:
        # Remove leading/trailing whitespace
        chunk = chunk.strip()

        # Skip empty chunks
        if not chunk:
            continue

        # Add context prefix for better embeddings
        if strategy == "contextual" and len(processed_chunks) > 0:
            # Add a bit of context from previous chunk
            prev_context = processed_chunks[-1][-100:] if len(processed_chunks[-1]) > 100 else processed_chunks[-1]
            chunk = f"[Context: {prev_context}...] {chunk}"

        processed_chunks.append(chunk)

    return processed_chunks

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Gennoor AI Copilot - Embedding Service",
        "status": "healthy",
        "models": list(config.MODELS.keys()),
        "default_model": config.DEFAULT_MODEL,
        "cache_enabled": redis_client is not None
    }

@app.post("/embed", response_model=EmbeddingResponse)
async def create_embeddings(request: EmbeddingRequest):
    """
    Create embeddings for given texts with smart chunking
    """
    try:
        # Check cache if enabled
        if request.use_cache and redis_client:
            cache_key = get_cache_key(request.texts, request.model)
            cached_result = redis_client.get(cache_key)
            if cached_result:
                logger.info("Returning cached embeddings")
                return json.loads(cached_result)

        # Load model
        model = load_model(request.model)

        # Process texts with chunking if needed
        all_chunks = []
        chunk_mapping = []  # Track which chunks belong to which text

        for text in request.texts:
            if len(text) > config.MAX_LENGTH:
                # Text needs chunking
                chunks = smart_chunk_text(
                    text,
                    strategy=request.chunk_strategy,
                    chunk_size=request.chunk_size,
                    chunk_overlap=request.chunk_overlap
                )
                all_chunks.extend(chunks)
                chunk_mapping.append(len(chunks))
            else:
                all_chunks.append(text)
                chunk_mapping.append(1)

        # Create embeddings
        if request.instruction and "instructor" in request.model:
            # Use instruction-based embeddings
            embeddings = model.encode(
                [[request.instruction, chunk] for chunk in all_chunks],
                batch_size=config.BATCH_SIZE,
                show_progress_bar=False,
                convert_to_numpy=True
            )
        else:
            # Standard embeddings
            embeddings = model.encode(
                all_chunks,
                batch_size=config.BATCH_SIZE,
                show_progress_bar=False,
                convert_to_numpy=True,
                normalize_embeddings=True  # Normalize for cosine similarity
            )

        # Convert to list
        embeddings_list = embeddings.tolist()

        # Prepare response
        response_data = {
            "embeddings": embeddings_list,
            "model": request.model,
            "dimensions": len(embeddings_list[0]) if embeddings_list else 0,
            "chunks": all_chunks if len(all_chunks) != len(request.texts) else None,
            "metadata": {
                "total_chunks": len(all_chunks),
                "chunk_mapping": chunk_mapping,
                "strategy": request.chunk_strategy,
                "timestamp": datetime.utcnow().isoformat()
            }
        }

        # Cache result if enabled
        if request.use_cache and redis_client:
            redis_client.setex(
                cache_key,
                config.REDIS_TTL,
                json.dumps(response_data)
            )

        return response_data

    except Exception as e:
        logger.error(f"Error creating embeddings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chunk", response_model=ChunkResponse)
async def chunk_text(request: ChunkRequest):
    """
    Chunk text using smart strategies
    """
    try:
        chunks = smart_chunk_text(
            request.text,
            strategy=request.strategy,
            chunk_size=request.chunk_size,
            chunk_overlap=request.chunk_overlap,
            preserve_sentences=request.preserve_sentences
        )

        return {
            "chunks": chunks,
            "metadata": {
                "total_chunks": len(chunks),
                "strategy": request.strategy,
                "avg_chunk_size": sum(len(c) for c in chunks) / len(chunks) if chunks else 0,
                "timestamp": datetime.utcnow().isoformat()
            }
        }

    except Exception as e:
        logger.error(f"Error chunking text: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed-search")
async def embed_for_search(query: str, model: str = "efficient"):
    """
    Create embeddings optimized for search queries
    """
    try:
        model_instance = load_model(model)

        # Add search prefix for better retrieval
        search_query = f"search query: {query}"

        embedding = model_instance.encode(
            search_query,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

        return {
            "embedding": embedding.tolist(),
            "model": model,
            "dimensions": len(embedding),
            "query": query
        }

    except Exception as e:
        logger.error(f"Error creating search embedding: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_models():
    """List available embedding models"""
    return {
        "models": config.MODELS,
        "default": config.DEFAULT_MODEL,
        "loaded": list(models_cache.keys())
    }

@app.post("/preload-model")
async def preload_model(model_name: str):
    """Preload a model into memory"""
    try:
        load_model(model_name)
        return {"status": "success", "model": model_name}
    except Exception as e:
        logger.error(f"Error preloading model: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/cache")
async def clear_cache():
    """Clear Redis cache"""
    if redis_client:
        redis_client.flushdb()
        return {"status": "success", "message": "Cache cleared"}
    return {"status": "info", "message": "No cache available"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)