import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send(process.env.DATABASE_URL);
});

app.listen(3000, () => {
  console.log("Server is running");
});
