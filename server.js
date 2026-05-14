import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db.json");

app.use(express.json());

// API Routes
app.get("/api/toys", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  res.json(data.toys);
});

app.post("/api/toys", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  const newToy = {
    ...req.body,
    id: data.toys.length > 0 ? Math.max(...data.toys.map((t) => t.id)) + 1 : 1,
    likes: req.body.likes || 0
  };
  data.toys.push(newToy);
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.status(201).json(newToy);
});

app.patch("/api/toys/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  const id = parseInt(req.params.id);
  const index = data.toys.findIndex((t) => t.id === id);
  if (index !== -1) {
    data.toys[index] = { ...data.toys[index], ...req.body };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.json(data.toys[index]);
  } else {
    res.status(404).send("Toy not found");
  }
});

app.delete("/api/toys/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  const id = parseInt(req.params.id);
  const index = data.toys.findIndex((t) => t.id === id);
  if (index !== -1) {
    data.toys.splice(index, 1);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.status(204).send();
  } else {
    res.status(404).send("Toy not found");
  }
});

// Vite middleware
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
