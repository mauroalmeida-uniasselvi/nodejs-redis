#!/bin/bash

echo "clean compose from previous execution"
docker compose down -v

echo "start compose in detached mode"
docker compose up -d

echo "waiting for database to be ready"
while [ "$(docker inspect -f '{{.State.Health.Status}}' nodejs-redis-redis-1 2>/dev/null)" != "healthy" ]; do
  echo -n "."
  sleep 1
done

echo "building application"
docker build -t nodejs-redis .

echo "remove previous container application if exists"
docker rm -f nodejs-redis 2>/dev/null

echo "starting application"
docker run -it --rm \
  --name nodejs-redis \
  --network host \
  -e NODE_ENV=development \
  -e REDIS_URL=redis://:uniasselvi@localhost:6379 \
  -v "$(pwd)":/usr/src/app \
  nodejs-redis

echo "finished application run"

echo "remove application image"
docker rmi nodejs-redis

echo "clean compose from previous execution"
docker compose down -v
