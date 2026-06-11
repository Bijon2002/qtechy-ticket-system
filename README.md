# QTechy Ticket System

A full-stack support ticket management system built using the **MERN** (MongoDB, Express, React, Node.js) stack. The application allows users to submit, track, and manage support tickets, while providing a dashboard with analytics and user management capabilities.

**Live Demo (Frontend)**: [https://qtechy-ticket-system.pages.dev](https://qtechy-ticket-system.pages.dev)  
**Backend API**: [https://qtechy-ticket-system.onrender.com/api](https://qtechy-ticket-system.onrender.com/api)

## Test Credentials

For reviewing the live application, you can log in using the following test credentials:

- **Admin**: `admin@qtechy.com` / `Admin1101`
- **Agent**: `Testagent@gmail.com` / `testagent1101`
- **User**: `testuser@gmail.com` / `testuser1101`

## Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **State Management**: Redux Toolkit & React Redux
- **Routing**: React Router DOM
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Security & Validation**: Helmet, CORS, express-validator
- **Logging**: Morgan

## Features

- **Authentication & Authorization**: Secure login and registration with JWT. Role-based access control (Admin, User, etc.).
- **Dashboard**: High-level overview with visual charts (via Recharts) displaying ticket statistics and metrics.
- **Ticket Management**: Create, view, update, and close support tickets. Includes priority and status tracking.
- **User Management**: Admins can view and manage user accounts.
- **Settings**: Manage user profiles and application preferences.
- **Responsive UI**: Fully responsive modern UI built with TailwindCSS.

## Project Structure

The repository is split into two main directories:
- `/Backend`: Contains the Node.js/Express REST API.
- `/Frontend`: Contains the React/Vite web application.

## Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd qtechy-ticket-system
```

### 2. Backend Setup

```bash
# Navigate to the Backend directory
cd Backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and update the values
cp .env.example .env

# Start the development server (runs on nodemon)
npm run dev
```

**Required Backend Environment Variables (`Backend/.env`)**:
- `PORT` (e.g., 5000)
- `MONGO_URI` (Your MongoDB connection string)
- `JWT_SECRET` (A strong secret key for JWT signing)

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to the Frontend directory
cd Frontend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and update the values
cp .env.example .env

# Start the Vite development server
npm run dev
```

**Required Frontend Environment Variables (`Frontend/.env`)**:
- `VITE_API_URL` (The backend URL, e.g., `http://localhost:5000/api` for local development or `https://qtechy-ticket-system.onrender.com/api` for production)

## Available Scripts

### Backend (`/Backend`)
- `npm start`: Starts the production server.
- `npm run dev`: Starts the development server with Nodemon.

### Frontend (`/Frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint to find issues in the code.

## License

This project is licensed under the ISC License.
