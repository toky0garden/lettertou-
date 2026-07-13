import os
from pathlib import Path


UPLOAD_DIR = (
    Path("/tmp") / "lettertou" / "uploads"
    if os.getenv("VERCEL")
    else Path(__file__).resolve().parents[1] / "uploads"
)
