#!/bin/bash
set -xe
# declare environment
export AWS_REGION="ap-southeast-1"
# export REGISTRY_URL=""
export SHA_SHORT=${GITHUB_SHA::7}
export IMAGE=""

# Install aws cli
pip3 install awscli

# Build and push image

# Replace / to -
BRANCH=$(echo ${GITHUB_REF_NAME} | tr / -);
# Get 20 character of bitbucket branch
BRANCH=${BRANCH::20}
# Remove last character if it equal -
if [[ ${BRANCH: -1} = "-" ]]
then
  BRANCH=${BRANCH::-1}
fi
echo ${BRANCH}

# Configure AWS credentials
aws configure set aws_access_key_id "${AWS_ACCESS_KEY}"
aws configure set aws_secret_access_key "${AWS_SECRET_KEY}"

# Get AWS SSM key for authentication
# SSH_PRIVATE_KEY=`aws ssm get-parameter --name 'system-user-build-key'  --region ap-southeast-1 --with-decryption --output=text --query 'Parameter.Value'`

IMAGE=$REGISTRY_URL/$GITHUB_REPOSITORY:$BRANCH-$SHA_SHORT-$(date +%s)
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin "${REGISTRY_URL}"

# Push docker image to PPD & STG ECR on parallel if branch is stg
## Push to STG ECR
docker build -t "${IMAGE}" -f Dockerfile .
docker push "${IMAGE}"

echo "IMAGE=$IMAGE" >> "$GITHUB_OUTPUT"
