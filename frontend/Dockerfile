# Step 1: Build the React app
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the app using nginx
FROM nginx:alpine

# Copy the build output from the previous step to nginx's public directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration, if any
# If you need a custom config for nginx, uncomment the next line and ensure the nginx.conf file exists
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to be accessible outside the container
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
