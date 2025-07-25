const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.VIVA_API_KEY;
const MERCHANT_ID = process.env.VIVA_MERCHANT_ID;
const SOURCE_CODE = process.env.VIVA_SOURCE_CODE || 'Default';

app.use(express.static('public'));

app.get('/create-payment', async (req, res) => {
  try {
    const response = await fetch('https://api.vivapayments.com/checkout/v2/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000,
        customerTrns: 'Test Checkout via Viva',
        sourceCode: SOURCE_CODE
      })
    });

    const data = await response.json();
    if (data.checkoutUrl) {
      res.json({ redirectUrl: data.checkoutUrl });
    } else {
      res.status(500).json({ error: 'Failed to get checkout URL', data });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
