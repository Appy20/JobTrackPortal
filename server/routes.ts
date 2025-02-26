import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertCandidateSchema } from "@shared/schema";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req: any, file: any, cb: any) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express) {
  app.post("/api/candidates", upload.single("resumeFile"), async (req: any, res) => {
    try {
      const candidateData = JSON.parse(req.body.data);
      const parsedData = insertCandidateSchema.parse(candidateData);

      let resumePath = undefined;
      if (req.file) {
        // In a real app, save the file and store the path
        resumePath = `resume_${Date.now()}.pdf`;
      }

      const candidate = await storage.createCandidate({
        ...parsedData,
        resumePath,
      });

      res.json(candidate);
    } catch (error) {
      res.status(400).json({ error: "Invalid candidate data" });
    }
  });

  app.get("/api/candidates", async (_req, res) => {
    const candidates = await storage.getCandidates();
    res.json(candidates);
  });

  app.get("/api/candidates/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: "Search query required" });
    }
    const results = await storage.searchCandidates(query);
    res.json(results);
  });

  app.patch("/api/candidates/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status required" });
    }

    const candidate = await storage.updateCandidateStatus(Number(id), status);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json(candidate);
  });

  const httpServer = createServer(app);
  return httpServer;
}