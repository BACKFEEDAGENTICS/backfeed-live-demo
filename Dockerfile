# Lightweight demo server — serves the portal directly, no package/license gate
FROM python:3.10-slim

WORKDIR /app

# Copy everything into the container
COPY . .

ENV PYTHONUNBUFFERED=1

# Render injects $PORT at runtime; server.py reads os.environ.get("PORT", 8085)
CMD ["python", "server.py"]
