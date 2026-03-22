try {
  const app = require('../server').default;
  
  // Add a dedicated health check for Vercel diagnostics
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      env: process.env.VERCEL ? 'vercel' : 'local',
      dbPath: process.env.VERCEL ? '/tmp/vibecheck.db' : 'vibecheck.db'
    });
  });

  module.exports = app;
} catch (error: any) {
  console.error('Vercel Initialization Error:', error);
  const express = require('express');
  const app = express();
  app.all('*', (req, res) => {
    res.status(500).json({ 
      error: 'Initialization failed', 
      message: error.message,
      stack: error.stack
    });
  });
  module.exports = app;
}

