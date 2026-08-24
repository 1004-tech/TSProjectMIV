import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT ?? 3000;
const CLIENT_DIST = path.join(__dirname, "../../client/dist");

app.use(express.json());
app.use(express.static(CLIENT_DIST));

// API routes
/*
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from the TypeScript server!" });
});
*/

// All other routes serve index.html — the client router handles the rest
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});