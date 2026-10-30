FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Para desarrollo usamos este comando
CMD ["npm", "run", "dev"]
