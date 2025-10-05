#!/bin/sh

# Start Gunicorn
exec gunicorn -w 2 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
