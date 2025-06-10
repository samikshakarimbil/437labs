import express from "express";
import path from "path";
import dotenv from "dotenv";
import { ValidRoutes } from "./shared/ValidRoutes.js";
import { fetchDataFromServer } from "./shared/ApiImageData"


dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

app.use(express.static(STATIC_DIR));

app.get("/api/hello", (req, res) => {
  res.send("Hello world");
});

app.get("/api/images", async (req, res) => {
  function waitDuration(numMs: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, numMs));
  }
  waitDuration(1500).then(() => {res.send(fetchDataFromServer())})

});
  
app.get(Object.values(ValidRoutes), (req, res) => {
  res.sendFile("index.html", { root: STATIC_DIR });
});

app.get("/images/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "..", STATIC_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
