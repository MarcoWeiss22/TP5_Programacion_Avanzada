# ANTES:
# FROM node:18-alpine

# DESPUÉS (Usa Node 20 o superior):
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]