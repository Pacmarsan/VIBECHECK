const express = require('express');
const app = express();
app.use(express.json());

// Add a super-simple health check that doesn't depend on root server
app.get('/api/health', (req, res) => {
  try {
     // Check if we can even load the root server
     require('../server');
     res.json({ 
       status: 'ok', 
       env: 'vercel',
       message: 'Backend logic loaded successfully' 
     });
  } catch (err: any) {
     res.status(500).json({ 
       status: 'error',
       phase: 'logic_load',
       message: err.message,
       stack: err.stack 
     });
  }
});

// Proxy all other /api calls to the main server app
app.all('/api/*', (req, res) => {
  try {
    const mainApp = require('../server').default;
    // We need to manually handle the routing here if we're wrapping it
    // Actually, on Vercel, we can just export the mainApp directly if it's correct.
    return mainApp(req, res);
  } catch (err: any) {
    res.status(500).json({ 
      error: 'Dispatch failed', 
      message: err.message 
    });
  }
});

module.exports = app;


