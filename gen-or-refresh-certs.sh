set -eux
HOST="can-i-juice.erik.la"
certbot certonly --standalone --renew-by-default --config-dir ./letsencrypt/conf --work-dir ./letsencrypt/work --logs-dir ./letsencrypt/logs --email erik@larko.se --agree-tos -d $HOST -d www.$HOST

sudo cp "$(pwd)/letsencrypt/conf/live/$HOST/fullchain.pem" certs/default.crt
sudo cp "$(pwd)/letsencrypt/conf/live/$HOST/privkey.pem" certs/default.key
