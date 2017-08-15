#!/bin/bash

# Exit on any error
set -e

sudo /opt/google-cloud-sdk/bin/gcloud docker push gcr.io/${GOOGLE_PROJECT_ID}/inventory
sudo chown -R ubuntu:ubuntu /home/ubuntu/.kube
kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=gcr.io/${GOOGLE_PROJECT_ID}/inventory:build-$CIRCLE_BUILD_NUM
