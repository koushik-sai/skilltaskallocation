import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TaskDTO {
  taskId?: number;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  estimatedHours?: number;
  actualHours?: number;
  requiredSkillId: number;
  assignedTo: number;
  deadline: string;
  startDate: string;
  endDate: string;
  createdBy: number;
  skill?: any;
}

export interface TaskRequestDTO {
  requestId: number;
  userId: number;
  username: string;
  taskId: number;
  requestMessage: string;
  requestDate: string;
  status: string;
  respondedBy: number | null;
  respondedAt: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  assignTask(task: TaskDTO) {
    throw new Error('Method not implemented.');
  }
  private readonly apiUrl = 'http://localhost:8000/api/tasks';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}`);
  }

  getTaskById(taskId: number): Observable<TaskDTO> {
    return this.http.get<TaskDTO>(`${this.apiUrl}/${taskId}`);
  }

  createTask(task: TaskDTO): Observable<TaskDTO> {
    return this.http.post<TaskDTO>(`${this.apiUrl}`, task);
  }

  updateTask(task: TaskDTO): Observable<TaskDTO> {
    return this.http.put<TaskDTO>(`${this.apiUrl}`, task);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  getTasksByCreator(userId: number): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/created-by/${userId}`);
  }

  getTasksByAssignee(userId: number): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/assigned-to/${userId}`);
  }

  getTasksByStatus(status: string): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/status/${status}`);
  }

  getTasksBySkill(skillId: number): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/skill/${skillId}`);
  }

  getTasksByDeadlineRange(start: string, end: string): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/deadline?start=${start}&end=${end}`);
  }

  getAllRequests(): Observable<TaskRequestDTO[]> {
  return this.http.get<TaskRequestDTO[]>('http://localhost:8000/api/task-requests/requests');
}

}
