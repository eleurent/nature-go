# Nature GO - PWA Frontend

This directory contains the Progressive Web App (PWA) frontend for Nature GO, built with React, Vite, TypeScript, and Material UI.

## Prerequisites

- Node.js (v18 or later recommended)
- npm

## Installation

1. Navigate to this directory:
   ```bash
   cd frontend-pwa
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To run the application in development mode (with hot reloading):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Production Build

To build the application for production:

```bash
npm run build
```

This will generate the static files in the `dist` directory.

## Features

- **PWA Support**: Installable on mobile devices, offline capabilities via Service Workers.
- **Authentication**: User login and profile management.
- **Field Work**: Camera integration for capturing observations.
- **Herbarium/Collection**: View discovered species (Botany, Ornithology).
- **University**: Take quizzes and exams to test your knowledge.
- **Naturalist Aesthetic**: Styled to resemble a 19th-century scientific journal.

## Configuration

The API URL can be configured via the `VITE_API_URL` environment variable. By default, it points to `http://localhost:8000/`.
