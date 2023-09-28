# TODO: Shrink MALRO image size!

# MALRO is hosted on ARM (Hetzner)
FROM --platform=linux/arm64/v8 oven/bun:latest

WORKDIR /app

COPY . .

RUN <<EOF
    apt-get update 
    apt-get -y install curl
    # TODO: might not be needed, Bun uses libsqlite3 underhood
    apt-get -y install sqlite3
    apt-get -y install imagemagick
    bun install --production
EOF

LABEL org.opencontainers.image.url https://github.com/charnould/malro/pkgs/container/malro
LABEL org.opencontainers.image.source https://github.com/charnould/malro
LABEL org.opencontainers.image.description "MALRO Docker image"
LABEL org.opencontainers.image.title "MALRO Docker image"

EXPOSE 3000

CMD ["bun", "start"]