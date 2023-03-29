FROM node

WORKDIR /app
COPY package* ./

RUN apt-get update
RUN npm install

EXPOSE 5173
COPY . .

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]