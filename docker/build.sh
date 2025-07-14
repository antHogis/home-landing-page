#!/usr/bin/env bash

cd "$(dirname "$0")"
pushd .. > /dev/null

MODE=${1:-""}

APP="ahogis/home-landing-page"
TAG=$(node -e 'console.log(require("./package.json").version)')
NAME="${APP}:${TAG}"

docker build . -t $NAME -f ./docker/Dockerfile

case $MODE in
    push)
	docker push $NAME
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
    echo "Warning: No mode specified"
    ;;
esac
