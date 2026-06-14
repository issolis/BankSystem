#!/bin/bash
set -e

echo "Starting Minikube..."
minikube start

echo "Restarting deployments..."
kubectl rollout restart deployment/iam
kubectl rollout restart deployment/banking-core
kubectl rollout restart deployment/assets
kubectl rollout restart deployment/api-gateway

echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=iam --timeout=180s
kubectl wait --for=condition=ready pod -l app=banking-core --timeout=180s
kubectl wait --for=condition=ready pod -l app=assets --timeout=180s
kubectl wait --for=condition=ready pod -l app=api-gateway --timeout=180s

echo ""
echo "Starting port-forward to access the API Gateway at http://localhost:3003"
echo "Press Ctrl+C to stop."
kubectl port-forward svc/api-gateway 3003:3003