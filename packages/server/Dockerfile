FROM node:18

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy over the source
COPY ../.. .

# Generate Prisma client
RUN npm run prisma:generate;

# Expose the default port
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
