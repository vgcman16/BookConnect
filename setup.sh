#!/bin/bash

# Create necessary directories
mkdir -p app/models
mkdir -p app/services
mkdir -p app/views/auth
mkdir -p app/views/profile
mkdir -p app/styles

# Move files to their correct locations
mv src/app/models/* app/models/
mv src/app/services/* app/services/
mv src/app/views/auth/* app/views/auth/
mv src/app/views/profile/* app/views/profile/
mv src/app/styles/* app/styles/
mv src/app/app.ts app/
mv src/app/app.css app/
mv src/app/app-root.xml app/

# Clean up
rm -rf src

# Update package.json main entry
sed -i '' 's/"main": "src\/app\/app.ts"/"main": "app\/app.ts"/g' package.json

# Install additional dependencies
npm install @nativescript/theme @nativescript/firebase-core @nativescript/firebase-messaging @nativescript/local-notifications @nativescript/imagepicker
