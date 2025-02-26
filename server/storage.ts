import { type Candidate, type InsertCandidate } from "@shared/schema";

export interface IStorage {
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  getCandidates(): Promise<Candidate[]>;
  getCandidate(id: number): Promise<Candidate | undefined>;
  searchCandidates(query: string): Promise<Candidate[]>;
  updateCandidateStatus(id: number, status: string): Promise<Candidate | undefined>;
}

export class MemStorage implements IStorage {
  private candidates: Map<number, Candidate>;
  private currentId: number;

  constructor() {
    this.candidates = new Map();
    this.currentId = 1;
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = this.currentId++;
    const candidate: Candidate = {
      ...insertCandidate,
      id,
      status: insertCandidate.status || "new",
      resumePath: insertCandidate.resumePath || null,
      notes: insertCandidate.notes || null
    };
    this.candidates.set(id, candidate);
    return candidate;
  }

  async getCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidates.values());
  }

  async getCandidate(id: number): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }

  async searchCandidates(query: string): Promise<Candidate[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.candidates.values()).filter(candidate => 
      candidate.name.toLowerCase().includes(lowercaseQuery) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
    );
  }

  async updateCandidateStatus(id: number, status: string): Promise<Candidate | undefined> {
    const candidate = this.candidates.get(id);
    if (!candidate) return undefined;

    const updatedCandidate = { ...candidate, status };
    this.candidates.set(id, updatedCandidate);
    return updatedCandidate;
  }
}

export const storage = new MemStorage();