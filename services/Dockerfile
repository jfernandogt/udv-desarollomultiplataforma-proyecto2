FROM node:22-slim

ARG file=personas.js
ENV file=${file}
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm ci
COPY . /app
CMD ["sh", "-c", "node $file"]