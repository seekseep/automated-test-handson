FROM node:22-slim

# pg は純 JS なのでネイティブビルド不要（ビルドツールは入れない）

WORKDIR /app

# 依存だけ先にインストール（キャッシュを効かせる）
COPY package.json package-lock.json* ./
RUN npm install

# アプリ本体
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
