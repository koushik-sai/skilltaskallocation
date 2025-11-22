import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum TaskStatus {
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED'
}
export interface TaskUpdateDTO {
  updateId?: number;
  taskId: number;
  comment: string;
  status: TaskStatus;
  updatedBy: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskUpdateService {
  private apiUrl = 'http://localhost:8000/api/task-updates';

  constructor(private http: HttpClient) {}
  
  updateTaskStatus(dto: TaskUpdateDTO): Observable<TaskUpdateDTO> {
    return this.http.put<TaskUpdateDTO>(this.apiUrl, dto);
  }

  getTaskUpdates(taskId: number): Observable<TaskUpdateDTO[]> {
    return this.http.get<TaskUpdateDTO[]>(`${this.apiUrl}/${taskId}`);
  }
}
