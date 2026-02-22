FROM node:18
RUN apt update && apt install -y dnsutils traceroute
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]