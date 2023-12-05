#!/bin/bash
set -xe

aws ecr get-login-password | docker login --username AWS --password-stdin "${REGISTRY_URL}"
aws s3api get-object --bucket gobacsi-env --key dev/.env.dev "${REMOTE_ENV}"
docker rm -f dev-clinic-service
docker run -e START_COMMAND=start --env-file ./clinic-service/.env --name dev-clinic-service -p 3000:3000 -d "${IMAGE}"
