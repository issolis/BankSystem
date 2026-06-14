#!/bin/bash
set -e

echo "Starting Minikube..."
minikube start

echo "Starting pods..."
kubectl rollout restart deployment/iam
kubectl rollout restart deployment/banking-core
kubectl rollout restart deployment/assets
kubectl rollout restart deployment/api-gateway

echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=iam --timeout=120s
kubectl wait --for=condition=ready pod -l app=banking-core --timeout=120s
kubectl wait --for=condition=ready pod -l app=assets --timeout=120s
kubectl wait --for=condition=ready pod -l app=api-gateway --timeout=120s

echo "Run in a separate terminal: minikube tunnel"
echo "Then access the API Gateway at: http://localhost:3003"

echo "Done."