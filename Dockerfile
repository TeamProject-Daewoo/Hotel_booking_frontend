# 1단계: 빌드 환경 (Node.js)
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 서빙 환경 (Nginx)
FROM nginx:1.21-alpine

# 위 'builder' 단계에서 생성된 빌드 결과물을 Nginx의 웹 루트로 복사
COPY --from=builder /app/dist /usr/share/nginx/html
