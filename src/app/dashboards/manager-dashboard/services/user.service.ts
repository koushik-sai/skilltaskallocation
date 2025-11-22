import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserDTO {
  userId: number;
  name: string;
  email: string;
  roleId: number;
  managerId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8000/api/users';
  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentUser(userId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${userId}`);
  }

  setCurrentUser(user: UserDTO): void {
    this.currentUserSubject.next(user);
  }
}