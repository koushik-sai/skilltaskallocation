import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Enum representing skill levels
export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

// DTO interface for Skill
export interface SkillDTO {
  skillId?: number;
  skillName: string;
  skillDescription?: string;
  category?: string;
  level: string;
  createdAt: string; // ISO date string (e.g., new Date().toISOString())
}

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = 'http://localhost:8000/api/skills'; // Adjust if needed

  constructor(private http: HttpClient) {}

  // CREATE
  addSkill(skill: SkillDTO): Observable<SkillDTO> {
    return this.http.post<SkillDTO>(this.apiUrl, skill);
  }

  // READ all
  getAllSkills(): Observable<SkillDTO[]> {
    return this.http.get<SkillDTO[]>(this.apiUrl);
  }

  // READ by name
  getSkillByName(name: string): Observable<SkillDTO[]> {
    return this.http.get<SkillDTO[]>(`${this.apiUrl}/${name}`);
  }

  // UPDATE
  updateSkill(id: number, skill: SkillDTO): Observable<SkillDTO> {
    return this.http.put<SkillDTO>(`${this.apiUrl}/${id}`, skill);
  }

  // DELETE
  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getUserSkills(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/user-skills'); // Adjust the API endpoint
  }
  
}
