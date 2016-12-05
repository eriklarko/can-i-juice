FROM ubuntu:16.10

ADD ./setup_node_6.x.sh /setup_node_6.x.sh
RUN /setup_node_6.x.sh

ADD ./yarn.pubkey.gpg /yarn.pubkey.gpg 
RUN apt-key add /yarn.pubkey.gpg
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list

RUN apt-get update \
    && apt-get install -y nodejs yarn git

RUN npm install -g typescript
RUN npm install -g flow-typed

ADD ./check-flow.sh /bin/check-flow.sh
ADD ./check-typescript.sh /bin/check-typescript.sh

RUN check-typescript.sh react || true
RUN check-flow.sh react || true

ADD ./web-server /web-server
WORKDIR /web-server
RUN npm install && npm start
