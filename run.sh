set -xeu
docker build --tag=apa -f juice.Dockerfile .
docker run --rm apa
