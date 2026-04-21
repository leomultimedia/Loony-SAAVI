FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build || echo "Direct TS execution config"
# We run via ts-node or compiled JS
EXPOSE 3001
CMD ["npx", "ts-node", "src/main.ts"]
