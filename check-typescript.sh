set -eu
HTTP_STATUS_CODE=$(curl -s -o /dev/null -I -w "%{http_code}" https://www.npmjs.com/package/@types/$1)
[ "200" -eq "$HTTP_STATUS_CODE" ]
