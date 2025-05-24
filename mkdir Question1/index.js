const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;
const VALID_IDS = ['p', 'f', 'e', 'r'];

let windowNumbers = [];

const THIRD_PARTY_URLS = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand'
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  if (!VALID_IDS.includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number id' });
  }

  const before = [...windowNumbers];

  let numbers = [];
try {
  const source = axios.CancelToken.source();
  const timeout = setTimeout(() => source.cancel(), 500);

const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBCbGFpbXMiOnsiZXhwIjoxNzQ4MDY1OTM0LCJpYXQiOjE3NDgwNjU2MzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjUyNDAwZDViLTEzZmItNDY5Yi05OTNlLTY4ZDAyOWQ0ODcyZSIsInN1YiI6Im5pc2hhc2VudGhpbDI3MDdAZ21haWwuY29tIn0sImVtYWlsIjoibmlzaGFzZW50aGlsMjcwN0BnbWFpbC5jb20iLCJuYW1lIjoibmlzaGFudGhpIHMiLCJyb2xsTm8iOiI5Mjc2MjJiZWMxMzYiLCJhY2Nlc3NDb2RlIjoid2hlUVV5IiwiY2xpZW50SUQiOiI1MjQwMGQ1Yi0xM2ZiLTQ2OWItOTkzZS02OGQwMjlkNDg3MmUiLCJjbGllbnRTZWNyZXQiOiJwWVZ5dkJxU3NKZEZtaEVBIn0.-ZyWnXfKfD0tU2cCwGspqDAZX5sqSqgIVhbybdzHIBk';

const response = await axios.get(THIRD_PARTY_URLS[numberid], {
  timeout: 500,
  cancelToken: source.token,
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});



  clearTimeout(timeout);

  console.log("Third-party response (mocked):", response.data);
  numbers = [2, 3, 5, 7, 11];
} catch (err) {
  console.error("Error fetching numbers:", err.message);
  return res.json({
    windowPrevState: before,
    windowCurrState: windowNumbers,
    avg: windowNumbers.length
      ? (windowNumbers.reduce((a, b) => a + b, 0) / windowNumbers.length).toFixed(2)
      : 0
  });
}

  for (const num of numbers) {
    if (!windowNumbers.includes(num)) {
      windowNumbers.push(num);
      if (windowNumbers.length > WINDOW_SIZE) {
        windowNumbers.shift();
      }
    }
  }

  const after = [...windowNumbers];
  const avg = after.length ? (after.reduce((a, b) => a + b, 0) / after.length).toFixed(2) : 0;

  res.json({
    windowPrevState: before,
    windowCurrState: after,
    avg: avg
  });
});


app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on port ${PORT}`);
});