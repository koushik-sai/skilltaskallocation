import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserDTO {
  userId?: number;
  name: string;
  email: string;
  roleId: number;
  managerId?: number;
  status: string; // 'ACTIVE' or 'INACTIVE'
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users'; // Your backend URL

  constructor(private http: HttpClient) {}
   private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();
    getCurrentUser(userId: number): Observable<UserDTO> {
      return this.http.get<UserDTO>(`${this.apiUrl}/${userId}`);
    }
  
    setCurrentUser(user: UserDTO): void {
      this.currentUserSubject.next(user);
    }
  // Private method to generate Basic Auth headers
  private getAuthHeaders(): HttpHeaders {
    const username = 'user';
    const password = 'db1234';
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
    return new HttpHeaders({
      'Authorization': basicAuth
    });
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  createUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiUrl+"/create", user, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  updateUser(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, user, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  getUsersByRole(roleId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/role/${roleId}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
}