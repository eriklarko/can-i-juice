FROM ubuntu:16.10

ADD ./setup_node_6.x.sh /setup_node_6.x.sh
RUN /setup_node_6.x.sh

RUN apt-get update \
    && apt-get install -y nodejs git

RUN npm install -g typescript
RUN npm install -g flow-typed

ADD ./check-flow.sh /bin/check-flow.sh
ADD ./check-typescript.sh /bin/check-typescript.sh

RUN check-typescript.sh react || true
RUN check-flow.sh react || true

ADD ./web-server /web-server
WORKDIR /web-server
RUN npm install && npm start
