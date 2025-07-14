FROM node:24 AS builder

WORKDIR /app

COPY . ./
RUN npm install --omit=dev

FROM node:24-alpine AS runtime

COPY --from=builder /app /app

EXPOSE 80
ENV NODE_ENV=prod
CMD node /app/src/index.js
