# apps/worker/enqueue.py

import os, sys
from redis import Redis
from rq import Queue

REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379')
conn = Redis.from_url(REDIS_URL)
queue = Queue('video-processing-queue', connection=conn)

def enqueue(video_id, storage_key):
    queue.enqueue('video_processor.process_video', video_id, storage_key)
    print(f"[enqueue] video_id={video_id}, storage_key={storage_key}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python enqueue.py <video_id> <storage_key>")
        sys.exit(1)
    enqueue(sys.argv[1], sys.argv[2])