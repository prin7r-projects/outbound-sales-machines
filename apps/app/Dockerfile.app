FROM wasp-lang/wasp:0.16.0 AS builder

WORKDIR /repo
COPY apps/app /repo/apps/app
WORKDIR /repo/apps/app
RUN wasp build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3001

COPY --from=builder /repo/apps/app/.wasp/build/server /app/server
COPY --from=builder /repo/apps/app/.wasp/build/client /app/client

RUN npm install --omit=dev --prefix /app/server

EXPOSE 3001
CMD ["node", "/app/server/server.js"]
