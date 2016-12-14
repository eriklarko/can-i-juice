set -xeu
pushd web-server/front-end > /dev/null
trap 'popd > /dev/null' EXIT

node_modules/.bin/gulp
docker-compose build
docker-compose up -d
