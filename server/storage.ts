import { type Candidate, type InsertCandidate, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Candidate methods
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  getCandidates(): Promise<Candidate[]>;
  getCandidate(id: number): Promise<Candidate | undefined>;
  searchCandidates(query: string): Promise<Candidate[]>;
  updateCandidateStatus(id: number, status: string): Promise<Candidate | undefined>;

  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private candidates: Map<number, Candidate>;
  private users: Map<number, User>;
  private currentCandidateId: number;
  private currentUserId: number;
  sessionStore: session.Store;

  constructor() {
    this.candidates = new Map();
    this.users = new Map();
    this.currentCandidateId = 1;
    this.currentUserId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // Keep existing candidate methods
  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = this.currentCandidateId++;
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

  // New user methods
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
}

export const storage = new MemStorage();