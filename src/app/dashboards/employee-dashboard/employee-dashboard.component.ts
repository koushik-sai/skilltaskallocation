import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SkillDTO, SkillService } from './services/skill.service';
import { SkillLevel } from '../manager-dashboard/services/skill.service';
import { UserDTO, UserService } from './services/user.service';
import { Task, TaskService } from './services/task.service';
import { TaskStatus, TaskUpdateService } from './services/taskupdate.service';
import { TaskRequestDTO, TaskRequestService } from './services/taskrequest.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  currentUser: UserDTO | null = null;
  skills: SkillDTO[] = [];
  newSkill: Partial<SkillDTO> = {};
  editSkillData: SkillDTO | null = null;

  showAddModal = false;
  tasks: Task[] = [];
  myTasks: Task[] = []; 

  selectedTaskId: number | null = null;
  updateComment: string = '';
  updateStatus: string = 'COMPLETED';
  showUpdateModal: boolean = false;

  showRequestModal = false; 
  requestMessage = '';
  constructor(private router: Router, private skillService: SkillService,private userService:UserService, private taskService: TaskService,private taskUpdateService:TaskUpdateService,private taskRequestService: TaskRequestService ) {}
  //currentUser: { userId: number; name: string } = { userId: 0, name: '' };

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    console.log('User ID from localStorage:', userId);
    if (userId) {
      this.loadSkillsByUserId(userId);
      this.userService.getCurrentUser(userId).subscribe({
        next: (user) => {
          this.userService.setCurrentUser(user);
          this.currentUser = user;
        },
        error: (err) => console.error('Failed to load user', err)
      });
    }
    
    this.loadTasks();
    if (userId) {
      this.loadTask(userId);
    }
  }

  loadTasks(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.taskService.getAllTasks().subscribe({
      // next: (data) => this.tasks = data,
      next: (data) => {
        this.tasks = data.filter(task => task.assignedTo !== userId); // <-- Adjust field here
      },
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  loadTask(userId: number): void {
    this.taskService.getTasksByAssignedTo(userId).subscribe({
      next: (data) => this.myTasks = data,
      error: (err) => console.error('Error loading tasks', err)
    });
  }
  
  calculateProgress(task: Task): number {
    if (task.estimatedHours && task.actualHours) {
      return Math.min(100, Math.round((task.actualHours / task.estimatedHours) * 100));
    }
    return 0;
  }
  
  
  onUpdate(taskId: number): void {
    alert(`You clicked Update for Task ID: ${taskId}`);
    // You can open a modal or navigate to a task update route here
  }
  openUpdateModal(taskId: number): void {
    this.selectedTaskId = taskId;
    this.updateComment = '';
    this.updateStatus = 'COMPLETED';
    this.showUpdateModal = true;
  }
  
  submitTaskUpdate(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!this.selectedTaskId || !userId) return;
  
    const dto = {
      taskId: this.selectedTaskId,
      comment: this.updateComment,
      status: this.updateStatus as TaskStatus,
      updatedBy: userId
    };
  
    this.taskUpdateService.updateTaskStatus(dto).subscribe({
      next: () => {
        this.showUpdateModal = false;
        this.loadTask(userId); // reload tasks
      },
      error: (err) => console.error('Update failed:', err)
    });
  }
  //------------taskrequest------------
  openRequestModal(taskId: number): void {
    this.selectedTaskId = taskId;
    this.requestMessage = '';
    this.showRequestModal = true;
  }

  submitTaskRequest(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId || !this.selectedTaskId) {
      alert('Invalid user or task ID');
      return;
    }

    const requestDTO: TaskRequestDTO = {
      userId: userId,
      taskId: this.selectedTaskId,
      requestMessage: this.requestMessage,
      status: 'REQUESTED'
    };

    this.taskRequestService.createTaskRequest(requestDTO).subscribe({
      next: (response) => {
        alert('Task request submitted successfully!');
        this.showRequestModal = false;
        this.requestMessage = '';
      },
      error: (err) => {
        console.error('Failed to request task:', err);
        alert('Failed to submit task request');
      }
    });
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
    this.selectedTaskId = null;
    this.requestMessage = '';
  }
  // myTasks = [
  //   {
  //     title: 'Fix Landing Page',
  //     status: 'IN_PROGRESS',
  //     deadline: new Date(),
  //     progress: 40
  //   },
  //   {
  //     title: 'Refactor Login Logic',
  //     status: 'PENDING',
  //     deadline: new Date(),
  //     progress: 0
  //   }
  // ];

  availableTasks = [
    {
      taskId: 1,
      title: 'Optimize Database Queries',
      requiredSkills: [{ skillName: 'SQL' }, { skillName: 'Performance Tuning' }],
      deadline: new Date(),
      priority: 'HIGH'
    }
  ];

  mySkills = [
    {
      skillId: 1,
      skillName: 'Angular',
      skillDescription: 'Frontend development with Angular',
      proficiencyLevel: 4
    },
    {
      skillId: 2,
      skillName: 'TypeScript',
      skillDescription: 'Strong typed JavaScript superset',
      proficiencyLevel: 3
    }
  ];

  allSkills = [
    { skillId: 1, skillName: 'Angular' },
    { skillId: 2, skillName: 'TypeScript' },
    { skillId: 3, skillName: 'Node.js' },
    { skillId: 4, skillName: 'SQL' }
  ];

  // ------------------ UI Modals ------------------

  openAddModal(): void {
    this.newSkill = {};
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newSkill = {};
  }

  openEditModal(skill: SkillDTO): void {
    this.editSkillData = { ...skill }; // deep copy
  }

  closeEditModal(): void {
    this.editSkillData = null;
  }

  // ------------------ Skill Actions ------------------

  // loadSkills(): void {
  //   this.skillService.getAllSkills().subscribe({
  //     next: (data) => (this.skills = data),
  //     error: (err) => console.error('Error loading skills', err)
  //   });
  // }
  loadSkillsByUserId(userId: number): void {
    this.skillService.getSkillsByUserId(userId).subscribe({
      next: (skills) => this.skills = skills ?? [],  // <-- this might be null
      error: (err) => console.error('Error loading user skills', err)
    });
  }
  


  getStars(level: string | undefined): number {
    switch (level) {
      case 'BEGINNER':
        return 1;
      case 'INTERMEDIATE':
        return 3;
      case 'ADVANCED':
        return 5;
      default:
        return 0;
    }
  }

  addSkill(): void {
    const userId = Number(localStorage.getItem('userId'));

    if (!this.newSkill.skillName || !this.newSkill.level) {
      alert('Please fill in all required fields');
      return;
    }

    const skillToAdd: SkillDTO = {
      skillName: this.newSkill.skillName,
      skillDescription: this.newSkill.skillDescription,
      category: this.newSkill.category,
      level: this.newSkill.level as SkillLevel,
      createdAt: new Date().toISOString(),
      userId: userId
    };

    this.skillService.addSkill(skillToAdd).subscribe({
      next: (res) => {
        if (!this.skills) {
          this.skills = [];
        }
        this.skills.push(res);
        this.closeAddModal();
      },
      error: (err) => console.error('Error adding skill:', err)
    });
  }

  updateSkill(): void {
    if (!this.editSkillData) return;

    this.skillService.updateSkill(this.editSkillData.skillId!, this.editSkillData).subscribe({
      next: (updated) => {
        const index = this.skills.findIndex(s => s.skillId === updated.skillId);
        if (index !== -1) {
          this.skills[index] = updated;
        }
        this.closeEditModal();
      },
      error: (err) => console.error('Error updating skill:', err)
    });
  }

  deleteSkill(id: number): void {
    if (confirm('Are you sure you want to delete this skill?')) {
      this.skillService.deleteSkill(id).subscribe({
        // next: () =>  this.loadSkillsByUserId(userId),
        next: () => {
          this.skills = this.skills.filter(skill => skill.skillId !== id);
        },
        error: (err) => console.error('Error deleting skill', err)
      });
    }
  }

  // ------------------ Navigation / Logout ------------------

  handleLogout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }

  // ------------------ Task Modal (optional) ------------------

  selectedTask: any = null;
  showProgressModal = false;
  showSkillSelectionModal = false;
  showTaskDetailsModal = false;

  updateTaskProgress(task: any) {
    this.selectedTask = task;
    this.showProgressModal = true;
  }

  handleProgressModalClose(updatedTask: any) {
    if (updatedTask) {
      const index = this.myTasks.findIndex(t => t.title === updatedTask.title);
      if (index !== -1) this.myTasks[index] = updatedTask;
    }
    this.showProgressModal = false;
  }

  openSkillSelectionModal() {
    this.showSkillSelectionModal = true;
  }

  handleSkillSelectionModalClose(updatedSkills: any[]) {
    this.mySkills = updatedSkills;
    this.showSkillSelectionModal = false;
  }

  viewTaskDetails(task: any) {
    this.selectedTask = task;
    this.showTaskDetailsModal = true;
  }

  handleTaskDetailsModalClose() {
    this.showTaskDetailsModal = false;
  }

  requestTask(taskId: number) {
    console.log('Requested task ID:', taskId);
  }
// Add this method to your EmployeeDashboardComponent class

scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    });
    
    // Optional: Update active nav link
    this.updateActiveNavLink(sectionId);
  }
}

// Optional: Method to update active nav link styling
updateActiveNavLink(activeSection: string): void {
  // Remove active class from all nav links
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Add active class to current section's nav link
  const currentNavLink = document.querySelector(`[onclick*="${activeSection}"]`) as HTMLElement;
  if (currentNavLink) {
    currentNavLink.classList.add('active');
  }
}
  removeSkill(skillId: number) {
    this.mySkills = this.mySkills.filter(skill => skill.skillId !== skillId);
  }
}
