/**
 * Backend server URL for API requests (AuthContext) and Socket.IO (VideoMeet).
 * Toggle IS_PROD to switch between Render production and local development.
 */
const IS_PROD = true;

const server = IS_PROD
    ? "https://liveloopbackend.onrender.com" // Render production backend
    : "http://localhost:8000"; // Local backend (npm run dev in /backend)

export default server;
