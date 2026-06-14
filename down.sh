#!/bin/bash
set -e

echo "Deleting all Kubernetes resources..."
kubectl delete all --all --ignore-not-found
kubectl delete configmap --all --ignore-not-found

echo "Stopping Minikube..."
minikube stop

echo "Done."