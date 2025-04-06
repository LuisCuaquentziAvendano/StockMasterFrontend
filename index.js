const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist', 'stock-master-frontend', 'browser')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'stock-master-frontend', 'browser', 'index.html'));
});

app.listen(PORT);
