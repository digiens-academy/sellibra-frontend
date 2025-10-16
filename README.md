# Digiens Frontend - PrintNest Tracking

Frontend application for tracking users who access PrintNest through the Digiens platform.

## Features

- User authentication
- PrintNest iframe integration with session tracking
- User profile management
- Admin panel for user management and confirmation
- Google Sheets synchronization

## Tech Stack

- React 18
- Vite
- React Router v6
- Bootstrap 5 + SASS
- Zustand (state management)
- Axios
- React Hook Form
- React Toastify

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_PRINTNEST_URL=https://printnest.com
```

### 3. Run Development Server

```bash
npm run dev
```

Application will run on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API service files
├── components/       # React components
├── pages/            # Page components
├── store/            # Zustand stores
├── styles/           # SASS styles
├── utils/            # Utility functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

ISC

