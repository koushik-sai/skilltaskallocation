import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type RequestStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED';

export interface TaskRequestDTO {
  requestId?: number;
  userId: number;
  taskId: number;
  requestMessage: string;
  requestDate?: string;
  status?: RequestStatus;
  respondedBy?: number;
  respondedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskRequestService {
  private baseUrl = 'http://localhost:8000/api/task-requests';

  constructor(private http: HttpClient) {}

  createTaskRequest(dto: TaskRequestDTO): Observable<TaskRequestDTO> {
    return this.http.post<TaskRequestDTO>(`${this.baseUrl}`, dto);
  }

  getRequestsByUser(userId: number): Observable<TaskRequestDTO[]> {
    return this.http.get<TaskRequestDTO[]>(`${this.baseUrl}/user/${userId}`);
  }

  getRequestsByTask(taskId: number): Observable<TaskRequestDTO[]> {
    return this.http.get<TaskRequestDTO[]>(`${this.baseUrl}/task/${taskId}`);
  }

  respondToRequest(requestId: number, status: RequestStatus, respondedBy: number): Observable<TaskRequestDTO> {
    return this.http.put<TaskRequestDTO>(`${this.baseUrl}/${requestId}/respond`, null, {
      params: {
        status: status,
        respondedBy: respondedBy.toString()
      }
    });
  }

  deleteRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${requestId}`);
  }
}
