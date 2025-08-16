const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello! Weather app is running...");
});

app.listen(PORT, () => {
  console.log("Wheather app is running on http://localhost:" + PORT);
});
