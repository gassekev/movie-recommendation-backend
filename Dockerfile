FROM node:8.7

ENV HOME=/usr/src/app

RUN mkdir -p $HOME

WORKDIR $HOME

COPY package.json package-lock.json ./
RUN npm install

COPY . .

USER node

CMD ["npm", "run", "start"]
