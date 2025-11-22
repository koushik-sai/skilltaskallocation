// src/app/services/skill.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SkillDTO {
  skillId?: number;
  skillName: string;
  skillDescription?: string;
  category?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt?: string;
  userId?: number; 
}

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private baseUrl = 'http://localhost:8000/api/skills';

  constructor(private http: HttpClient) {}

  getAllSkills(): Observable<SkillDTO[]> {
    return this.http.get<SkillDTO[]>(this.baseUrl);
  }

  addSkill(skill: SkillDTO): Observable<SkillDTO> {
    return this.http.post<SkillDTO>(this.baseUrl, skill);
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  updateSkill(id: number, skill: SkillDTO): Observable<SkillDTO> {
    return this.http.put<SkillDTO>(`${this.baseUrl}/${id}`, skill);
  }

  getBySkillName(name: string): Observable<SkillDTO[]> {
    return this.http.get<SkillDTO[]>(`${this.baseUrl}/${name}`);
  }
  // src/app/employee-dashboard/services/skill.service.ts

getSkillsByUserId(userId: number): Observable<SkillDTO[]> {
  return this.http.get<SkillDTO[]>(`${this.baseUrl}/user/${userId}`);
}

}
