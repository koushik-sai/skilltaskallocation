// src/app/services/task.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ====== MODEL CLASSES ======
export interface SkillInfo {
  skillId: number;
  skillName: string;
  importanceLevel: string;
}

export interface Task {
  taskId: number;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  status: string;
  skills: SkillInfo[];  // Related task_skill entries
  estimatedHours?: number;
  actualHours?: number;
  assignedTo?: number;
}

// ====== SERVICE ======
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api/tasks';  // Backend endpoint

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }
  getTasksByAssignedTo(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`http://localhost:8000/api/tasks/assigned-to/${userId}`);
  }
}
