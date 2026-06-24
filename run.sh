#!/bin/bash
docker rm -f metal_all 2>/dev/null
docker run -d -p 8080:80 --name metal_all nstarx.azurecr.io/metal_all:latest
echo "Running at http://localhost:8080/"
open http://localhost:8080/
