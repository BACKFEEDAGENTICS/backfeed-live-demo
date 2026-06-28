# Use official slim Python image as base
FROM python:3.10-slim

# Set working directory in container
WORKDIR /app

# Copy the application source files into the container
COPY . .

# Install the backfeed package and dependencies
RUN pip install --no-cache-dir .

# Expose the server port
EXPOSE 8085

# Environment variables for headless deployment
ENV BACKFEED_LICENSE_KEY=BF-F58J-FQT2-GODV
ENV PYTHONUNBUFFERED=1

# Start the application via the get-backfeed command
# We bind host to 0.0.0.0 for Docker networking and disable the browser auto-open
CMD ["sh", "-c", "get-backfeed --host 0.0.0.0 --port ${PORT:-8085} --no-browser"]
