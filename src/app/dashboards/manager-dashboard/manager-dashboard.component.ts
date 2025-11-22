import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaskDTO, TaskRequestDTO, TaskService } from './services/task.service';
import { SkillDTO ,SkillService} from './services/skill.service';
import { TeamMemberDTO, TeamService } from './services/team.service';
import { UserService } from './services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {
    @ViewChild('printSection') printSectionRef!: ElementRef;
showRequestsTable = false;

  currentUser: any;
  tasks: TaskDTO[] = [];
  showTaskModal = false;
  selectedTask: TaskDTO | null = null;
  taskForm: TaskDTO = this.getEmptyTaskForm();
  reportType = 'TASK_COMPLETION';
  dateFrom?: string;
  dateTo?: string;
  reportData: any;
  skills: SkillDTO[] = [];
showSkillModal = false;
selectedSkill: SkillDTO | null = null;

showDetailsModal: boolean = false;
selectedUserDetails: TeamMemberDTO | null = null;

userSkillData: any[] = []; 
skillForm: SkillDTO = this.getEmptySkillForm();

teamMembers: TeamMemberDTO[] = [];
  
showUserSkillModal: boolean = false;

loading = false;
  errorMessage = '';
  
requests: TaskRequestDTO[] = [];
  selectedRequest: TaskRequestDTO | null = null;

  reportStatusOptions: string[] = ['COMPLETED', 'PENDING', 'OVERDUE']; // Adjust based on your backend enum
reportStatus: string = 'OPEN';
userId?: number;

reports: any[] = [];
  constructor(
    private router: Router,
    private taskService: TaskService,
    private skillService: SkillService,
    private teamService:TeamService,
    private userService:UserService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.userService.getCurrentUser(userId).subscribe({
        next: (user) => {
          this.userService.setCurrentUser(user);
          this.currentUser = user;
        },
        error: (err) => console.error('Failed to load user', err)
      });
    }
    this.loadCurrentUser();
    this.loadTasks();
    this.loadSkills();
    this.loadTeamMembers(); 
    this.loadRequests();
  }
 

  fetchReportsByStatus() {
  if (!this.reportStatus) return;

  this.http.get<any[]>(`http://localhost:8000/api/reports/status/${this.reportStatus}`)
    .subscribe({
      next: (data) => this.reports = data,
      error: (err) => {
        console.error('Failed to fetch reports by status', err);
        this.reports = [];
      }
    });
}

// Fetch reports by date range
fetchReportsByDateRange() {
  if (!this.dateFrom || !this.dateTo) {
    alert('Please select both start and end dates.');
    return;
  }

  const params = new URLSearchParams();
  params.set('start', this.dateFrom);
  params.set('end', this.dateTo);

  this.http.get<any[]>(`http://localhost:8000/api/reports/dateRange?${params.toString()}`)
    .subscribe({
      next: (data) => {
        this.reports = data;
        console.log(this.reports);
      },
      error: (err) => {
        console.error('Failed to fetch reports by date range', err);
        this.reports = [];
      }
    });
}

// Fetch reports by user
fetchReportsByUser() {
  if (!this.userId) {
    alert('Please enter a user ID.');
    return;
  }

  this.http.get<any[]>(`http://localhost:8000/api/reports/user/${this.userId}`)
    .subscribe({
      next: (data) => this.reports = data,
      error: (err) => {
        console.error('Failed to fetch reports by user', err);
        this.reports = [];
      }
    });
}

  loadRequests() {
    this.loading = true;
    this.taskService.getAllRequests().subscribe({
      next: (data: TaskRequestDTO[]) => {
        this.requests = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load requests';
        this.loading = false;
        console.error('Error loading requests:', error);
      }
    });
  }
  
  viewRequest(request: TaskRequestDTO) {
    console.log('Viewing request:', request);
    this.selectedRequest = request;
  }
  downloadCSV(): void {
  const csvRows = [];
  const headers = ['Report ID', 'Title', 'Status', 'Date', 'User'];
  csvRows.push(headers.join(','));

  for (const report of this.reports) {
    const row = [
      report.reportId || report.id,
      `"${report.title}"`,
      report.status,
      new Date(report.reportDate).toLocaleDateString(),
      report.userId || report.user?.id
    ];
    csvRows.push(row.join(','));
  }

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'reports.csv');
  a.click();
}
printPDF(): void {
  const printContents = document.getElementById('print-section')?.innerHTML;

  if (!printContents) {
    alert('Print content not found.');
    return;
  }

  const popupWindow = window.open('', '_blank', 'width=800,height=600');

  if (popupWindow) {
    popupWindow.document.open();
    popupWindow.document.write(`
      <html>
        <head>
          <title>Reports</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Reports</h2>
          ${printContents}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    popupWindow.document.close();
  } else {
    alert('Unable to open print window. Please allow popups for this site.');
  }
}
downloadExcel(): void {
  const headers = ['Report ID', 'Title', 'Status', 'Date', 'User'];
  const rows = [headers.join('\t')]; // Using tabs for better Excel compatibility

  for (const report of this.reports) {
    const row = [
      report.reportId || report.id,
      report.title,
      report.status,
      new Date(report.reportDate).toLocaleDateString(),
      report.userId || report.user?.id
    ];
    rows.push(row.join('\t')); // Tab separated
  }

  const blob = new Blob([rows.join('\n')], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reports.xls'; // note the .xls extension
  a.click();
  URL.revokeObjectURL(url);
}

  fetchUserSkillData(): void {
    this.skillService.getUserSkills().subscribe(
      (data: any[]) => {
        this.userSkillData = data;
        this.showUserSkillModal = true;
      },
      (error: any) => {
        console.error('Error fetching skill data:', error);
      }
    );
  }
  closeUserSkillModal(): void {
  this.showUserSkillModal = false;
}

 

// Variables
showAssignTaskModal1 = false;
selectedMember1: any = null;

newTask: any = {
  taskId: 0,
  title: '',
  description: '',
  priority: '',
  status: '',
  estimatedHours: 0,
  actualHours: 0,
  requiredSkillId: 0,
  assignedTo: null,     // ✅ this replaces userId
  deadline: '',
  startDate: '',
  endDate: '',
  createdBy: 2,         // Ideally from localStorage
}
// Open Modal
assignTaskToMember1(member: any) {
  this.selectedMember1 = member;
  this.newTask.assignedTo = member.userId || member.id; // make sure the property matches
  this.showAssignTaskModal1 = true;
}

// Submit Form
submitAssignTaskForm() {
  // API call or logic to assign the task
  console.log('Task assigned to:', this.newTask.userId, 'Task:', this.newTask);

 
  this.taskService.updateTask(this.newTask).subscribe({
    next: (response) => {
      console.log('Task assigned successfully:', response);
      this.closeAssignTaskModal1();
    },
    error: (error) => {
      console.error('Error assigning task:', error);
      alert('Something went wrong. Please try again.');
    }
  });
}

// Close modal manually or by background click
closeAssignTaskModal1() {
  this.showAssignTaskModal1 = false;
}

closeAssignTaskModalOnBackground(event: MouseEvent) {
  if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
    this.closeAssignTaskModal();
  }
}



openViewDetailsModal(member: TeamMemberDTO) {
  this.selectedUserDetails = member;
  this.showDetailsModal = true;
}

viewMemberDetails(): void {
    // this.selectedUserDetails = member;
    this.showDetailsModal = true;
   }

closeDetailsModal() {
  this.showDetailsModal = false;
  this.selectedUserDetails = null;
}


  selectedMember: TeamMemberDTO | null = null;

  showViewModal = false;
  showAssignTaskModal = false;

  // Task assignment form fields
  newTaskName = '';
  newTaskDescription = '';
  
  showMemberModal = false;

  newMember = {
    userId: 0,
    teamId: 0,
    skillId: 0,
    taskId: 0,
    joinedOn: '',
    roleInTeam: ''
  };

  loadTeamMembers(): void {
    const teamId = 1; // or dynamically fetch current teamId
    this.teamService.getTeamMembers(teamId).subscribe((members) => {
      this.teamMembers = members;
    });
  }
  openMemberModal(): void {
    this.showMemberModal = true;
  }

  closeMemberModalOnBackground(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeMemberModal();
    }
  }

  submitAddMemberForm(): void {
    this.teamService.addUserToTeam(this.newMember).subscribe({
      next: () => {
        alert('Member added successfully.');
        this.closeMemberModal();
        this.loadTeamMembers(); // Refresh member list if applicable
      },
      error: (err) => {
        console.error('Error adding member:', err);
        alert('Failed to add member.');
      }
    });
  }
  closeMemberModal(): void {
    this.showMemberModal = false;
  }
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['#0d6efd', '#198754', '#ffc107', '#dc3545'];
    const hash = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
  // viewMemberDetails(member: TeamMemberDTO) {
  //   console.log('Viewing member:', member);
  // }
  assignTaskToMember(member: TeamMemberDTO) {
    console.log('Assign task to:', member);
  }

  getWorkloadPercent(workload: string): string {
    const map: { [key: string]: string } = {
      Light: '25%',
      Medium: '50%',
      'Full-time': '75%',
      Overloaded: '100%',
    };
    return map[workload] || '0%';
  }

  openViewModal(member: TeamMemberDTO): void {
    this.selectedMember = member;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedMember = null;
  }

  openAssignTaskModal(member: TeamMemberDTO): void {
    this.selectedMember = member;
    this.newTaskName = '';
    this.newTaskDescription = '';
    this.showAssignTaskModal = true;
  }

  closeAssignTaskModal(): void {
    this.showAssignTaskModal = false;
    this.selectedMember = null;
  }

  submitAssignTask(): void {
    if (!this.selectedMember) return;

    const task = {
      taskName: this.newTaskName,
      taskDescription: this.newTaskDescription,
      assignedToUserId: this.selectedMember.userId!,
      teamId: 1, // Adjust if you have teamId from somewhere else
    };

    this.teamService.assignTask(task).subscribe({
      next: () => {
        //alert(`Task assigned to ${this.selectedMember?.name}`);
        this.closeAssignTaskModal();
        this.loadTeamMembers(); // Refresh the list to show new tasks/workload
      },
      error: (err) => {
        alert('Failed to assign task. Try again.');
        console.error(err);
      },
    });
  }
  //-------------->Team----------------
  
  loadCurrentUser(): void {
    const userData = localStorage.getItem('user');
    this.currentUser = userData ? JSON.parse(userData) : null;
  }

  loadTasks(): void {
    if (this.currentUser?.userId) {
      this.taskService.getTasksByCreator(this.currentUser.userId).subscribe({
        next: (data) => (this.tasks = data),
        error: (err) => console.error('Failed to load tasks:', err),
      });
    }
  }

  openCreateTaskModal(): void {
    this.taskForm = this.getEmptyTaskForm();
    this.selectedTask = null;
    this.showTaskModal = true;
  }

  editTask(task: TaskDTO): void {
    this.selectedTask = { ...task };
    this.taskForm = { ...task }; // preload form with selected task data
    this.showTaskModal = true;
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.taskId !== taskId);
        },
        error: (err) => console.error('Failed to delete task:', err),
      });
    }
  }

  submitTaskForm(): void {
    if (this.selectedTask) {
      // Update
      this.taskService.updateTask(this.taskForm).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
        },
        error: (err) => console.error('Error updating task:', err),
      });
    } else {
      // Create
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      if (user?.userId) {
        this.taskForm.createdBy = user.userId;
      }

      this.taskService.createTask(this.taskForm).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
        },
        error: (err) => console.error('Error creating task:', err),
      });
    }
  }

  getProgress(task: TaskDTO): number {
    if (!task.estimatedHours || task.estimatedHours === 0 || task.actualHours == null) return 0;
    const progress = Math.min((task.actualHours / task.estimatedHours) * 100, 100);
    return Math.round(progress);
  }

  handleTaskModalClose(updated: boolean): void {
    this.showTaskModal = false;
    if (updated) {
      this.loadTasks();
    }
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.taskForm = this.getEmptyTaskForm();
    this.selectedTask = null;
  }

  handleLogout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }

  private getEmptyTaskForm(): TaskDTO {
    const today = new Date().toISOString().split('T')[0];
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const createdById = user?.userId || 0;

    return {
      taskId: 0,
      title: '',
      description: '',
      priority: 'LOW',
      status: 'ASSIGNED',
      estimatedHours: 0,
      actualHours: 0,
      requiredSkillId: 0,
      assignedTo: 0,
      deadline: today,
      startDate: today,
      endDate: today,
      createdBy: createdById,
      skill: null,
    };
  }

  //-------------------------------skill-----------------------
  closeSkillModalOnBackground(event: MouseEvent) {
    // Only close if clicking on the modal background, not on modal content
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeSkillModal();
    }
  }
  getEmptySkillForm(): SkillDTO {
    return {
      skillId: 0,
      skillName: '',
      skillDescription: '',
      category: '',
      level: 'BEGINNER',
      createdAt: new Date().toISOString().slice(0, 16)  // Format for datetime-local
    };
  }
  
  openSkillModal() {
    this.skillForm = this.getEmptySkillForm();
    this.selectedSkill = null;
    this.showSkillModal = true;
  }
  

  
  editSkill(skill: SkillDTO) {
    this.skillForm = { ...skill };
    this.selectedSkill = skill;
    this.showSkillModal = true;
  }
  
  closeSkillModal() {
    this.showSkillModal = false;
  }
  
  submitSkillForm() {
    if (this.selectedSkill) {
      this.skillService.updateSkill(this.selectedSkill.skillId!, this.skillForm).subscribe(() => {
        this.loadSkills();
        this.closeSkillModal();
      });
    } else {
      this.skillService.addSkill(this.skillForm).subscribe(() => {
        this.loadSkills();
        this.closeSkillModal();
      });
    }
  }
  // Smooth scrolling method for sidebar navigation
scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[onclick*="${sectionId}"]`) as HTMLElement;
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Modal background click handlers
closeTaskModalOnBackground(event: MouseEvent): void {
  if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
    this.closeTaskModal();
  }
}

closeUserSkillModalOnBackground(event: MouseEvent): void {
  if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
    this.closeUserSkillModal();
  }
}


  deleteSkill(skillId: number) {
    if (confirm('Are you sure you want to delete this skill?')) {
      this.skillService.deleteSkill(skillId).subscribe(() => this.loadSkills());
    }
  }
  
  loadSkills() {
    this.skillService.getAllSkills().subscribe({
      next: (data) => {
        this.skills = data;
      },
      error: (err) => {
        console.error('Error loading skills', err);
      }
    });
  }
}

