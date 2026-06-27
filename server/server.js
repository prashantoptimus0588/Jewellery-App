const express = require('express'); // Import express
const app = express();              // Initialize the app
const PORT = 3000;                  // Define the port

// Define a route for the home page
app.get('/', (req, res) => {
    res.send('Hello, World! This is an Express server.');
});

// Start listening for requests
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});
