#!/bin/bash
set -e

./wait-for-it.sh db:5432 --timeout=60 --strict -- echo "Database is up"

echo "========================="
echo "=== Generating Prisma ==="
echo "========================="
npx prisma generate

echo "==========================="
echo "=== Applying Migrations ==="
echo "==========================="
npx prisma migrate deploy || { echo "Migration failed"; }

exec "$@"