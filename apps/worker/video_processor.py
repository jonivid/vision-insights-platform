# apps/worker/video_processor.py

import os
import gzip
import json
import logging
import subprocess

import whisper
import whisperx
import requests
import boto3

# ── 1) Whisper & WhisperX models (loaded once) ────────────────────────────────
MODEL_NAME = os.getenv("WHISPER_MODEL", "small")
DEVICE     = "cpu"
whisper_model = whisper.load_model(MODEL_NAME, device=DEVICE)
align_model, metadata = whisperx.load_align_model(
    language_code="en",
    device=DEVICE
)

# ── 2) MinIO / S3 client setup ────────────────────────────────────────────────
S3_ENDPOINT = os.getenv("S3_ENDPOINT")       # e.g. http://minio:9000
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")   # e.g. minio
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")   # e.g. minio123
S3_BUCKET     = os.getenv("S3_BUCKET")       # e.g. videos

s3 = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
)

API_URL = os.getenv("API_URL")  # e.g. http://backend:3001

# ── 3) Helper: download from MinIO ────────────────────────────────────────────
def download_from_s3(key: str, local_path: str):
    logging.info(f"🔽 Downloading s3://{S3_BUCKET}/{key} → {local_path}")
    s3.download_file(S3_BUCKET, key, local_path)
    return local_path

# ── 4) Main processing function ───────────────────────────────────────────────
def process_video(video_id: str, storage_key: str):
    try:
        # 4.a) Fetch the MP4 from MinIO
        local_mp4 = f"/tmp/{video_id}.mp4"
        download_from_s3(storage_key, local_mp4)

        # 4.b) Extract WAV audio
        local_wav = f"/tmp/{video_id}.wav"
        subprocess.run([
            "ffmpeg", "-y",
            "-i", local_mp4,
            "-vn", "-acodec", "pcm_s16le",
            "-ar", "16000", "-ac", "1",
            local_wav
        ], check=True)

        # 4.c) Whisper transcription (segment-level)
        result = whisper_model.transcribe(local_wav)
        segments = result["segments"]
        full_text = result["text"]

        # 4.d) WhisperX word‐level alignment
        logging.info("⏱ Running word-level alignment…")
        aligned = whisperx.align(
            segments, align_model, metadata, local_wav,
            device=DEVICE
        )
        word_segments = aligned["word_segments"]

        # 4.e) Compress & POST back to backend
        payload = { "text": full_text, "words": word_segments }
        gz_data = gzip.compress(json.dumps(payload).encode("utf-8"))
        headers = {
            "Content-Type": "application/json",
            "Content-Encoding": "gzip",
        }
        resp = requests.post(
            f"{API_URL}/videos/{video_id}/transcript",
            data=gz_data,
            headers=headers,
            timeout=120,
        )
        resp.raise_for_status()
        logging.info(f"✅ Transcript saved for video {video_id}")

    except Exception as err:
        logging.error(f"❌ Error processing video {video_id}", exc_info=err)
        # you could push to a DLQ here if needed