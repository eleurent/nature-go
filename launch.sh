#!/bin/bash

# Start the Django backend server in the background
cd backend/nature_go
python manage.py runserver &

# Start the Expo React Native frontend
cd ../../frontend
npx expo start --tunnel
