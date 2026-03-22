const express = require('express');
const app = express();

app.use(express.json());

// Main entry point for Vercel Serverless Function
app.all('*', async (req, res) => {
  try {
    // Dynamically require the server to catch initialization errors (like missing native modules)
    const serverApp = require('../server').default;
    return serverApp(req, res);
  } catch (error: any) {
    console.error('SERVERLESS_INIT_ERROR:', error);
    res.status(500).json({
      error: 'Serverless initialization failed',
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = app;

