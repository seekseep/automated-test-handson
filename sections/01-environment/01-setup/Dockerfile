FROM node:22-slim

WORKDIR /app

# 依存だけ先にインストール（キャッシュを効かせる）
COPY package.json package-lock.json* ./
RUN npm install

# アプリ本体
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
