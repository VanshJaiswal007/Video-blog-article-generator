import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import getTranscript from './routes/getTranscript.js';
import generateArticle from './routes/generateArticle.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/api/getTranscript', getTranscript);
app.post('/api/generateArticle', generateArticle);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
