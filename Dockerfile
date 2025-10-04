FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make our entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# The port the app runs on
EXPOSE 8000

# The command to run the application
CMD ["/app/entrypoint.sh"]