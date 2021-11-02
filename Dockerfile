FROM node:12-alpine3.14 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:12-alpine3.14 AS builder
ENV GMAPKEY=CHANGEME
ENV API_KEY=CHANGEME
ENV PASS_HASH=CHANGEME
ENV FB_APIKEY=CHANGEME
ENV FB_DOMAIN=CHANGEME
ENV FB_PROJECTID=CHANGEME
ENV FB_BUCKET=CHANGEME
ENV FB_MESSAGINGSENDER=CHANGEME
ENV FB_APPID=CHANGEME
ENV FB_MEASUREMENTID=CHANGEME

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:12-alpine3.14 AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

CMD [ "npm", "run", "start"]