# Bulkwala Frontend

This is the frontend for the Bulkwala e-commerce platform built with React and Vite.

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Deployment

This application is configured for deployment on Vercel. The [vercel.json](vercel.json) file contains the deployment configuration.

## Features

- User authentication (login/signup)
- Product browsing and search
- Shopping cart functionality
- Wishlist management
- Order placement and tracking
- Admin dashboard for product management
- Seller dashboard for inventory management
- Video support for product displays
- Responsive design for all devices

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the production build locally

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_BACKEND_URL=https://bulkwala-backend.onrender.com
```