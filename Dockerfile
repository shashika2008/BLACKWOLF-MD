FROM node:lts-buster
RUN git clone https://github.com/shashika2008/BLACKwolf-MD/root/shashika2008
WORKDIR /root/shashika2008
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["npm", "start"]

