FROM node:21-alpine3.18

RUN mkdir /app
WORKDIR /app

COPY package.json /app/
RUN npm install
COPY src/ /app/src/

CMD ["npm", "run", "dev"]

EXPOSE 5000