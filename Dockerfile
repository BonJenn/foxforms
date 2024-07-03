FROM amazonlinux:2

# Install Node.js 16.x and necessary build tools
RUN yum update -y && \
    yum install -y gcc-c++ make && \
    curl -sL https://rpm.nodesource.com/setup_16.x | bash - && \
    yum install -y nodejs

# Install Python
RUN yum install -y python3

# Set the working directory
WORKDIR /var/task

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including bcrypt
RUN npm ci --only=production

# Bundle app source
COPY . .

# Set the CMD to use the correct format for AWS Lambda
CMD [ "node", "server/index.js" ]