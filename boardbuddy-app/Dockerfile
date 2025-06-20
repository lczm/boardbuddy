FROM node:alpine AS builder

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm install

# build the website
COPY . .
RUN npm run build

EXPOSE 4173

# CMD ["npm", "run", "preview"]
CMD ["npx", "vite", "--host"]
# CMD ["npx", "vite", "preview", "--host"]