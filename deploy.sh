#!/bin/bash
set -e

echo "Starting Minikube..."
minikube start

echo "Building Docker images..."
docker build -t iam:latest ./IAM
docker build -t banking-core:latest ./BankingCore
docker build -t assets:latest ./Assets
docker build -t api-gateway:latest ./APIGateway

echo "Removing old images from Minikube..."
minikube image rm iam:latest || true
minikube image rm banking-core:latest || true
minikube image rm assets:latest || true
minikube image rm api-gateway:latest || true

echo "Loading images into Minikube..."
minikube image load iam:latest
minikube image load banking-core:latest
minikube image load assets:latest
minikube image load api-gateway:latest

echo "Applying Kubernetes manifests..."

echo "  IAM..."
kubectl apply -f IAM/k8s/configmap.yaml
kubectl apply -f IAM/k8s/deployment.yaml
kubectl apply -f IAM/k8s/service.yaml

echo "  BankingCore..."
kubectl apply -f BankingCore/k8s/configmap.yaml
kubectl apply -f BankingCore/k8s/deployment.yaml
kubectl apply -f BankingCore/k8s/service.yaml

echo "  Assets..."
kubectl apply -f Assets/k8s/configmap.yaml
kubectl apply -f Assets/k8s/deployment.yaml
kubectl apply -f Assets/k8s/service.yaml

echo "  APIGateway..."
kubectl apply -f APIGateway/k8s/configmap.yaml
kubectl apply -f APIGateway/k8s/deployment.yaml
kubectl apply -f APIGateway/k8s/service.yaml

echo "Restarting deployments..."
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

echo "Deploy complete."