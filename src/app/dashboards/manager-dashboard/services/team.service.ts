// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// // DTO for Team Member data to be displayed
// export interface TeamMemberDTO {
//   name: string;
//   email: string;
//   skills: string[];
//   tasks: string[];
//   workload: string;
//   roleInTeam: string;
// }

// export interface TaskDTO {
//   taskName: string;
//   description: string;
//   dueDate: string;
//   assignedTo: string;
//   assignedBy: string;
// }

// // TeamGroup DTO (for creating teams, etc.)
// export interface TeamGroupDTO {
//   teamId?: number;
//   teamName: string;
//   projectName: string;
//   createdBy: number; // userId of the creator
//   createdAt?: string; // Optional for auto-generation
// }

// // TeamMember create/join DTO
// export interface TeamMemberCreateDTO {
//   userId: number;
//   teamId: number;
//   skillId: number;
//   taskId: number;
//   joinedOn: string;
//   roleInTeam: string;
// }
// export interface TeamMember {
//   id: number;
//   name: string;
//   email: string;
//   skills: string[];
//   currentTasks: string[];
//   workloadPercentage: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TeamService {

//   private baseUrl = 'http://localhost:8000/api/teams'; // Adjust backend port if needed

//   constructor(private http: HttpClient) {}

//   // GET team members for a specific team (DTO format)
//   getTeamMembers(teamId: number): Observable<TeamMemberDTO[]> {
//     return this.http.get<TeamMemberDTO[]>(`${this.baseUrl}/members/dto/${teamId}`);
//   }

//   // POST: Create a new team
//   createTeam(team: TeamGroupDTO): Observable<TeamGroupDTO> {
//     return this.http.post<TeamGroupDTO>(`${this.baseUrl}`, team);
//   }

//   // POST: Add a user to a team
//   addUserToTeam(member: TeamMemberCreateDTO): Observable<any> {
//     return this.http.post(`${this.baseUrl}/addUser`, member);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeamGroup {
  teamId?: number;
  teamName: string;
  projectName: string;
  createdBy?: number;
}


export interface TeamMemberDTO {
  userId?: number; // Add this for backend assignment
  name: string;
  email: string;
  skills: string[];
  // tasks: string[];
  tasks: { title: string }[];
  workload: string;
  roleInTeam: string;

  //userId?: number;
  teamId: number;
  taskId: number;
  skillId: number;
  joinedOn: string; // ISO date string, e.g. "2025-06-09"
  //roleInTeam: string;
}

export interface TaskAssignment {
  taskName: string;
  taskDescription: string;
  assignedToUserId: number;
  teamId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private baseUrl = 'http://localhost:8000/api/teams';

  constructor(private http: HttpClient) { }

  createTeam(teamGroup: TeamGroup): Observable<TeamGroup> {
    return this.http.post<TeamGroup>(this.baseUrl, teamGroup);
  }

  addUserToTeam(teamMember: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addUser`, teamMember);
  }

  getTeamMembers(teamId: number): Observable<TeamMemberDTO[]> {
    return this.http.get<TeamMemberDTO[]>(`${this.baseUrl}/members`);
  }
  assignTask(task: TaskAssignment): Observable<any> {
    return this.http.post(`${this.baseUrl}/assign-task`, task);
  }
}
