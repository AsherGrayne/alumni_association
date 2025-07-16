# Alumni Association Platform

A professional, minimalist web platform for alumni associations, enabling alumni to connect, network, find jobs, register for events, and contribute to donation campaigns. Built with a modern React frontend and a Node.js/Express backend, the platform is fully responsive and includes dark mode for an optimal user experience.

---

## Features

- **Job Portal**: Browse, post, and apply for jobs within the alumni network.
- **Events**: View, create, and register for upcoming alumni events and reunions.
- **Donations**: Explore and contribute to fundraising campaigns.
- **Profile Management**: Comprehensive member profiles with activity history and settings.
- **Dark Mode**: Accessible, professional dark mode toggle.
- **Responsive Design**: Clean, modern UI for all devices.
- **Demo Data**: Sample jobs, events, and campaigns are clearly tagged for demonstration.

---

## Screenshots

| Home Page | Job Portal | Events | Donations | Profile |
|-----------|------------|--------|-----------|---------|
| ![Home](web/public/screenshot-1.png) | ![Jobs](web/public/screenshot-2.png) | ![Events](web/public/screenshot-3.png) | ![Donations](web/public/screenshot-4.png) | ![Profile](web/public/screenshot-5.png) |

---

## Tech Stack

- **Frontend**: React (Create React App), Material-UI, CSS
- **Backend**: Node.js, Express, MongoDB (or in-memory for demo)
- **Deployment**: Firebase Hosting (frontend), Node.js server (backend)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/alumni-association-platform.git
   cd alumni-association-platform
   ```

2. **Install dependencies:**

   - **Frontend:**
     ```sh
     cd web
     npm install
     ```

   - **Backend:**
     ```sh
     cd ../backend
     npm install
     ```

### Running Locally

- **Start the backend:**
  ```sh
  cd backend
  npm start
  ```

- **Start the frontend:**
  ```sh
  cd ../web
  npm start
  ```

- The frontend runs on [http://localhost:3000](http://localhost:3000)  
  The backend API runs on [http://localhost:5000](http://localhost:5000)

---

## Deployment

- **Frontend:**  
  Build and deploy the React app to Firebase Hosting, Netlify, Vercel, or any static host.
  ```sh
  cd web
  npm run build
  # Deploy using your preferred platform
  ```

- **Backend:**  
  Deploy the Node.js/Express server to Heroku, Render, Railway, or your own server.

---

## Customization

- Update branding, colors, and content in the `web/src` and `web/public` folders.
- Adjust backend logic and data models in `backend/`.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Material-UI](https://mui.com/)
- [Firebase](https://firebase.google.com/) 