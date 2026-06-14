#!/bin/bash
set -e

echo "Deleting deployments..."
kubectl delete deployment iam banking-core assets api-gateway

echo "Deleting services..."
kubectl delete service iam banking-core assets api-gateway

echo "Deleting configmaps..."
kubectl delete configmap iam-config banking-config assets-config gateway-config

echo "Stopping Minikube..."
minikube stop

echo "Done."