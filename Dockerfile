# Development stage
FROM node:20-alpine3.18 as development

ENV NODE_ENV=development
ENV TZ=Africa/Nairobi
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml tsconfig.json nest-cli.json  ./
COPY . .

# TODO complete for tests
RUN touch .env

RUN npm install -g pnpm && \
    pnpm install && \
    pnpx prisma generate && \
    pnpm run build && \
    rm -rf /usr/src/app/node_modules && \
    pnpm i --prod && \
    pnpx prisma generate && \
    rm -rf /usr/src/app/node_modules/.pnpm/webpack* && \
    rm -rf /usr/src/app/node_modules/.pnpm/typescript* && \
    rm -rf /usr/src/app/node_modules/.pnpm/swagger-ui-dist* && \
    rm /usr/src/app/node_modules/.pnpm/fontkit@1.9.0/node_modules/fontkit/dist/main.cjs.map && \
    rm /usr/src/app/node_modules/.pnpm/fontkit@1.9.0/node_modules/fontkit/dist/module.mjs.map && \
    # rm -rf /usr/src/app/node_modules/.pnpm/protobufjs* && \
    rm -rf /usr/src/app/node_modules/.pnpm/@types* 

# Production stage
FROM node:20-alpine3.18 as production

ENV TZ=Africa/Nairobi
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml tsconfig.json nest-cli.json ./
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/storage/assets ./storage/assets

# RUN du -hsc *
RUN cd node_modules/.pnpm && du -hsc *

EXPOSE 8080
CMD ["pnpm", "run", "start:prod"]

