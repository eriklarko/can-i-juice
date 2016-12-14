set -eux
HOST="can-i-juice.com"
certbot certonly --standalone --renew-by-default --config-dir ./letsencrypt/conf --work-dir ./letsencrypt/work --logs-dir ./letsencrypt/logs --email erik@larko.se --agree-tos -d $HOST -d www.$HOST
