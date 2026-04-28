import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

/* ---- MULTI-CLIENT CONFIG ---- */
const portalConfigs = {
  default: {
    brand: "Waveo WiFi",
    title: "Connect to WiFi",
    subtitle: "Fast event internet powered by Waveo.",
    color: "#0077ff",
    redirect: "https://waveo.com.au"
  },

  event123: {
    brand: "Demo Event WiFi",
    title: "Welcome to Demo Event",
    subtitle: "Enter your email to access WiFi.",
    color: "#111827",
    redirect: "https://waveo.com.au"
  }
};

/* ---- SESSION STORAGE (temporary) ---- */
const sessions = [];

/* ---- GET CONFIG ---- */
app.get("/api/config", (req, res) => {
  const site = req.query.site || "default";
  res.json(portalConfigs[site] || portalConfigs.default);
});

/* ---- SAVE SESSION ---- */
app.post("/api/session", (req, res) => {
  const session = {
    id: crypto.randomUUID(),
    email: req.body.email,
    site: req.body.site,
    device: req.body.device,
    ip: req.ip,
    createdAt: new Date().toISOString()
  };

  sessions.push(session);

  console.log("NEW SESSION:", session);

  res.json({ ok: true });
});

/* ---- BASIC ANALYTICS ---- */
app.get("/api/analytics", (req, res) => {
  res.json({
    total: sessions.length,
    uniqueEmails: [...new Set(sessions.map(s => s.email))].length
  });
});

app.listen(PORT, () => {
  console.log("Waveo portal running on port", PORT);
});
