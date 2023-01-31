FROM node:lts-alpine

COPY . .

ENV DATABASE_URL="postgresql://root:root@postgres:5432/realtime_esgi?schema=public"
ENV AUTH0_CLIENT_ID="EUxu9sQcefjLAsWCwZTjijgNmyFZocs6"
ENV AUTH0_CLIENT_SECRET="iOKvlCg79njk_Tw4db9EYXEviCe2ZRnLXP1IRbgenZZHf8wRGf5hltFsoTHuLh7s"
ENV AUTH0_ISSUER="https://dev-y6kdczi508jzoej5.us.auth0.com"
ENV NEXTAUTH_SECRET="secrettttt"
ENV NEXTAUTH_URL="http://localhost:3000/"

EXPOSE 3000

RUN yarn install