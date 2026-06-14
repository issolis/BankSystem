#!/bin/bash
set -e

echo "Starting Minikube..."
minikube start

echo "Cleaning up old resources..."
kubectl delete all --all --ignore-not-found
kubectl delete configmap --all --ignore-not-found

echo "Pointing Docker to Minikube..."
eval $(minikube docker-env)

echo "Building Docker images inside Minikube..."
docker build -t iam:latest ./IAM
docker build -t banking-core:latest ./BankingCore
docker build -t assets:latest ./Assets
docker build -t api-gateway:latest ./APIGateway

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

echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=iam --timeout=180s
kubectl wait --for=condition=ready pod -l app=banking-core --timeout=180s
kubectl wait --for=condition=ready pod -l app=assets --timeout=180s
kubectl wait --for=condition=ready pod -l app=api-gateway --timeout=180s

echo ""
echo "Deploy complete."
echo "Starting port-forward to access the API Gateway at http://localhost:3003"
echo "Press Ctrl+C to stop."
kubectl port-forward svc/api-gateway 3003:3003