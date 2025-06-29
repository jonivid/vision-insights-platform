import redis
import json

REDIS_HOST = "redis"
REDIS_PORT = 6379
REDIS_QUEUE = "video-processing"

def push_test_job(video_id: str, storage_key: str):
    """Utility to enqueue a single test job."""
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    job = {"videoId": video_id, "storageKey": storage_key}
    r.lpush(REDIS_QUEUE, json.dumps(job))
    print(f"📤 Pushed job: {job}")

if __name__ == "__main__":
    # change these to your real values when testing
    push_test_job("sample-video-id", "/tmp/sample.mp4")