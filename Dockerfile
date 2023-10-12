FROM node:18

# working directory
WORKDIR /redis-demo

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# expose port 3000
EXPOSE 3000

# run the app
CMD ["npm", "start"]


