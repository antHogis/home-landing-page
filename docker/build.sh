#!/usr/bin/env bash

cd "$(dirname "$0")"
pushd .. > /dev/null

MODE=${1:-""}

APP="ahogis/home-landing-page"
TAG=$(node -e 'console.log(require("./package.json").version)')
NAME="${APP}:${TAG}"

case $MODE in
    local)
    # Build for current architecture only and load into local images
    docker buildx build --platform linux/amd64 -t $NAME -f ./docker/Dockerfile . --load
    ;;
    
    multiarch)
    # Create and use a new builder instance for multi-arch builds
    docker buildx create --name multiarch-builder --use 2>/dev/null || docker buildx use multiarch-builder
    
    # Build for multiple architectures (without pushing)
    # Note: Multi-platform builds stay in build cache, not local images
    docker buildx build --platform linux/amd64,linux/arm64 -t $NAME -f ./docker/Dockerfile .
    ;;
    
    push)
    # Create and use a new builder instance for multi-arch builds
    docker buildx create --name multiarch-builder --use 2>/dev/null || docker buildx use multiarch-builder
    
    # Build and push multi-architecture image directly to registry
    docker buildx build --platform linux/amd64,linux/arm64 -t $NAME -f ./docker/Dockerfile . --push
    ;;

    it)
    docker run \
        --env HLP_LINK_CONFIG_PATH=/config/links.json \
        -v "${PWD}/examples":/config \
        -v "${PWD}/examples/link-images":/app/public/link-images \
        -it $NAME /bin/sh
    ;;

    run)
    docker run \
        --env HLP_LINK_CONFIG_PATH=/config/links.json \
        -v "${PWD}/examples":/config \
        -v "${PWD}/examples/link-images":/app/public/link-images \
        --name hlp -p 8080:80 $NAME
    ;;

    *)
    echo "Usage: $0 {local|multiarch|push|it|run}"
    echo "  local         - Build for current architecture only"
    echo "  multiarch     - Build for amd64 and arm64 architectures (build cache only)"
    echo "  push          - Push existing multi-architecture image to registry"
    echo "  it            - Run interactive shell"
    echo "  run           - Run the application"
    ;;
esac
