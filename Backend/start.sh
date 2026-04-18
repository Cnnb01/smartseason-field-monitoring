#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "==> Running Migrations..."
python manage.py migrate --noinput

echo "==> Bootstrapping Admin User..."
python bootstrap_user.py

echo "==> Starting Gunicorn..."
gunicorn core.wsgi:application --bind 0.0.0.0:$PORT