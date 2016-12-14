# can-i-juice
Are there type definitions for a package in typescript or flow?

## TODO
- [x] Make docker image bind to host port
- [x] Put the persistent cache in a volume. It's in `/web-server/cache/response-cache`
- [x] Run the web server as a non-root user in the docker image. Too impractical with the cache in a volume.
- [x] Add end-point showing the x most commonly looked up packages
- [x] Web page with a search field and the x most commonly looked up packages
- [x] Proper logging, just do `docker-compose logs`
- [ ] https
