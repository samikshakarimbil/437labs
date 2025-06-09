import express from 'express';
import path from 'path';
import { ValidRoutes } from './shared/ValidRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

// Serve static files from React build
app.use(express.static(STATIC_DIR));

// Your existing hello route
app.get('/hello', (req, res) => {
    res.send('Hello world');
});

// Handle all valid routes by serving the main index.html
// React Router will handle the client-side routing
Object.values(ValidRoutes).forEach(route => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, '..', STATIC_DIR, 'index.html'));
    });
});

// Also handle the dynamic image details route (/images/:id)
app.get('/images/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', STATIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});