// Server configuration
// This file can be updated during deployment to change the server URL

export const SERVER_CONFIG = {
  // In development, use localhost
  // In production, this will be updated by the deployment pipeline
  SERVER_URL: 'http://localhost:3000'
};

// Function to get the server URL
export const getServerUrl = () => SERVER_CONFIG.SERVER_URL; 