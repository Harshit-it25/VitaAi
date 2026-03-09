import { Router } from "express";
import { chatDb } from "./db.ts";

const router = Router();

router.post("/messages", async (req, res) => {
  try {
    const { id, text, sender, intent, topic, language } = req.body;
    chatDb.saveMessage({
      id,
      text,
      sender,
      intent,
      topic,
      language
    });
    res.json({ status: "ok" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/history", (req, res) => {
  try {
    const history = chatDb.getHistory();
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/history", (req, res) => {
  try {
    chatDb.clearHistory();
    res.json({ status: "ok" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
