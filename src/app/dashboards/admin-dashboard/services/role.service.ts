import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define RoleDTO inside the service file:
export interface RoleDTO {
  roleId?: number;
  roleName: string;
  description: string;
  usersCount?: number;
  permissions?: string[];
  userCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:8000/api/roles';

  constructor(private http: HttpClient) {}

  // getAllRoles(): Observable<RoleDTO[]> {
  //   return this.http.get<RoleDTO[]>(this.apiUrl);
  // }
  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(`${this.apiUrl}/roles-with-user-count`);
  }
  

  getRoleById(id: number): Observable<RoleDTO> {
    return this.http.get<RoleDTO>(`${this.apiUrl}/${id}`);
  }

  createRole(role: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(this.apiUrl, role);
  }

  updateRole(id: number, role: RoleDTO): Observable<RoleDTO> {
    return this.http.put<RoleDTO>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
