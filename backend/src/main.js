// Use ES6 import syntax for dotenv
import dotenv from "dotenv";
// Import startServer function from the setup/server module
import { startServer } from "./setup/server.js";

// Load environment variables from .env file
const config = dotenv.config().parsed || {};
startServer(config);
