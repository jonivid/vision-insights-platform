# apps/worker/Dockerfile
FROM python:3.9-slim

WORKDIR /usr/src/app

# Install system deps: ffmpeg for audio, libgomp1 for OpenMP
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ffmpeg \
      libgomp1 \
 && rm -rf /var/lib/apt/lists/*

# Copy & install Python deps
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy your code
COPY . .

EXPOSE 8001
CMD ["python", "worker.py"]