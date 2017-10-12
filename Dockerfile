FROM node:7.9

ENV HOME=/usr/src/app

RUN mkdir -p $HOME

WORKDIR $HOME

COPY package.json package-lock.json ./
RUN npm cache clean && npm install

COPY . .

ENTRYPOINT ["npm", "run"]
CMD ["start"]
