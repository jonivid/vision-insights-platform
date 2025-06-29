import os
import json
import time
import logging
from redis import Redis
from video_processor import process_video  

QUEUE      = 'video-processing-queue'
REDIS_URL  = os.getenv('REDIS_URL', 'redis://redis:6379')

def main():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s"
    )

    # Connect to Redis
    conn = Redis.from_url(REDIS_URL, decode_responses=True)
    try:
        conn.ping()
        logging.info(f"✅ Connected to Redis at {REDIS_URL}")
    except Exception as e:
        logging.error(f"❌ Cannot connect to Redis ({REDIS_URL}): {e}")
        return

    logging.info(f"👷 Worker listening on queue '{QUEUE}'")

    while True:
        logging.debug("⏳ Waiting for next job (BRPOP)…")
        result = conn.brpop(QUEUE, timeout=5)
        if not result:
            logging.debug("⏲️  No job received, looping again")
            continue

        _, payload = result
        logging.info(f"📥 Got raw payload: {payload!r}")

        # Parse JSON
        try:
            job = json.loads(payload)
        except Exception:
            logging.error("⚠️  Malformed JSON payload, skipping")
            continue

        vid = job.get('videoId')
        key = job.get('storageKey')
        if not vid or not key:
            logging.warning("⚠️  Missing videoId or storageKey, skipping")
            continue

        logging.info(f"🚀 Processing videoId={vid}, storageKey={key}")
        try:
            process_video(vid, key)
            logging.info(f"✅ Finished videoId={vid}")
        except Exception:
            logging.exception(f"❌ Error processing videoId={vid}")

if __name__ == '__main__':
    main()