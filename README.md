# SevaMed Healthcare Management System

This repository contains the SevaMed Healthcare Management System, a comprehensive healthcare solution with both frontend and backend components.

## Project Structure

```
sevamedHMS/
├── backend/          # Node.js backend API
└── frontend/         # React frontend application
```

## Development

To run the frontend locally:
```bash
cd frontend
npm start
```

To run the backend locally:
```bash
cd backend
npm start
```

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)

## Available Scripts

In the frontend directory, you can run:

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Troubleshooting

### Common Issues

1. **Build Warnings**: The build process may show ESLint warnings, but these won't prevent deployment.

2. **Routing Issues**: If routes don't work after refresh, ensure the 404.html redirect is properly configured.

3. **Asset Loading**: If assets don't load, check that `%PUBLIC_URL%` is used correctly in index.html.

### GitHub Pages Specific

1. **Custom Domain**: To use a custom domain, add a `CNAME` file to the `public` folder with your domain name.

2. **Access**: After deployment, your application will be available at:
   https://sureyogapriyanka.github.io/sevamedHMS/

## Technologies Used

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Wouter for routing
- TanStack Query for data fetching
- Radix UI components
- Lucide React icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JSON Web Tokens for authentication
- bcryptjs for password hashing
- WebSocket for real-time communication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (local or cloud)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sevamedHMS
```

2. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### Environment Configuration

#### Backend
Create a `.env` file in the `backend/` directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

#### Frontend
The frontend uses different environment files for different deployment targets:
- `.env.development` - For local development
- `.env.github` - For GitHub Pages deployment
- `.env` - Default production environment

### Running the Application

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm start
```

### Deployment

#### GitHub Pages
```bash
cd frontend
npm run deploy:github
```

#### Direct Deployment
```bash
cd frontend
npm run deploy:direct
```

## Folder Descriptions

### Backend (`backend/`)
- `src/config/` - Database and application configuration
- `src/controllers/` - Request handlers for different entities
- `src/middleware/` - Authentication and other middleware
- `src/models/` - Mongoose models for database entities
- `src/routes/` - API route definitions
- `src/websocket/` - WebSocket server implementation
- `src/seedDatabase.js` - Database seeding script

### Frontend (`frontend/`)
- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and helpers
- `src/pages/` - Page components
- `src/services/` - API service functions
- `src/types/` - TypeScript type definitions

## Development Workflow

1. Start the backend server first
2. Start the frontend development server
3. Access the application at `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Create a pull request

## License

This project is licensed under the MIT License.