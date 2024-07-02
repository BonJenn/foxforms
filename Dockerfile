FROM ubuntu:20.04

# Install Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Install production dependencies
RUN npm install --only=production

# Clean up unnecessary files
RUN rm -rf /usr/src/app/node_modules/bcrypt/lib/binding/*

# Install Python before rebuilding bcrypt
RUN apt-get update && apt-get install -y python3 python3-pip
RUN ln -s /usr/bin/python3 /usr/bin/python

# Rebuild bcrypt for the correct architecture
RUN npm rebuild bcrypt --build-from-source

CMD [ "index.handler" ]
