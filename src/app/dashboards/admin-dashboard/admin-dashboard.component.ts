import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, UserDTO } from './services/user.service';
import { RoleDTO, RoleService } from './services/role.service';
import { Permission, PermissionService } from './services/permission.service';

// declare var bootstrap: any; // To use Bootstrap modal programmatically

declare var bootstrap: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  selectedRole: string = 'Admin';

  users: UserDTO[] = [];
  roles = ['Admin', 'Editor'];
  currentUser: UserDTO | null = null;
  selectedUser: UserDTO = { name: '', email: '', roleId: 0,status: 'ACTIVE', password: '' };
  isEditMode: boolean = false;

  rolesList: RoleDTO[] = [];
  selectedRoleData: RoleDTO = { roleName: '', description: '', permissions: [] };
  isEditRoleMode = false;
  roleModalInstance: any;
  rolePermissionsInput = '';

  permissions: Permission[] = [];
  selectedPermission: Permission = {
    permissionName: '',
    description: ''
  };

  constructor(private router: Router, private userService: UserService,private roleService:RoleService,private permissionService: PermissionService) {}

  ngOnInit() {
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
    this.loadUsers();
    this.loadRoles();
    this.loadPermissions();
  }

  ngAfterViewInit() {
    // Initialize smooth scrolling after view is initialized
    this.initializeSmoothScrolling();
  }

  initializeSmoothScrolling() {
    // Add smooth scrolling function to window object so it can be called from HTML
    (window as any).scrollToSection = (sectionId: string) => {
      this.scrollToSection(sectionId);
    };

    // Set up intersection observer for automatic nav highlighting
    this.setupIntersectionObserver();
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update active nav link
      this.updateActiveNavLink(sectionId);
    }
  }

  updateActiveNavLink(activeSection: string) {
    // Remove active class from all nav links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current section's nav link
    const navMapping: { [key: string]: string } = {
      'admin-dashboard': 'nav-dashboard',
      'user-management': 'nav-users',
      'role-management': 'nav-roles',
      'permission-management': 'nav-permissions'
    };
    
    const activeNavId = navMapping[activeSection];
    if (activeNavId) {
      const activeNav = document.getElementById(activeNavId);
      if (activeNav) {
        activeNav.classList.add('active');
      }
    }
  }

  setupIntersectionObserver() {
    const sections = document.querySelectorAll('.section-anchor');
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveNavLink(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });

    // Set initial active state
    setTimeout(() => {
      this.updateActiveNavLink('admin-dashboard');
    }, 100);
  }

  private loading=false;
  // loadUsers() {
  //   if (this.loading) {
  //     console.log('Skipping loadUsers call, already loading');
  //     return;
  //   }
  //   this.loading = true;
  //   this.userService.getAllUsers().subscribe({
  //     next: (data) => {
  //       console.log('Received users:', data.length); 
  //       this.users = data;
  //       this.loading = false;
  //       console.log('Loaded users:', this.users);
  //     },
  //     error: (err) => console.error('Failed to load users:', err)
  //   });
  // }

  loadUsers() {
  if (this.loading) {
    console.log('Skipping loadUsers call, already loading');
    return;
  }
  console.log('Calling loadUsers()');
  this.loading = true;
  this.userService.getAllUsers().subscribe({
    next: (data) => {
      console.log('Received users:', data.length, data);
      this.users = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to load users:', err);
      this.loading = false;
    }
  });
}

  handleLogout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  // === Modal Functions ===
  openAddUserModal() {
    this.selectedUser = { name: '', email: '', roleId: 0, status: 'ACTIVE', password: '' };
    this.isEditMode = false;
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
  openEditUserModal(user: UserDTO) {
    this.selectedUser = { ...user };
    this.isEditMode = true;
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // saveUser() {
  //   if (this.isEditMode && this.selectedUser.userId) {
  //     this.userService.updateUser(this.selectedUser.userId, this.selectedUser).subscribe({
  //       next: () => {
  //         this.loadUsers();
  //         this.closeModal();
  //       },
  //       error: (err) => console.error('Update failed:', err)
  //     });
  //   } else {
  //     this.userService.createUser(this.selectedUser).subscribe({
  //       next: () => {
  //         this.loadUsers();
  //         this.closeModal();
  //       },
  //       error: (err) => console.error('Create failed:', err)
  //     });
  //   }
  // }

  isSaving = false;

saveUser() {
  if (this.isSaving) return;

  this.isSaving = true;

  const callback = () => {
    this.loadUsers();
    this.closeModal();
    this.isSaving = false;
  };

  if (this.isEditMode && this.selectedUser.userId) {
    this.userService.updateUser(this.selectedUser.userId, this.selectedUser).subscribe({
      next: callback,
      error: (err) => {
        console.error('Update failed:', err);
        this.isSaving = false;
      }
    });
  } else {
    this.userService.createUser(this.selectedUser).subscribe({
      next: callback,
      error: (err) => {
        console.error('Create failed:', err);
        this.isSaving = false;
      }
    });
  }
}

  // deleteUser(userId: number) {
  //   if (confirm('Are you sure to delete this user?')) {
  //     this.userService.deleteUser(userId).subscribe({
  //       next: () => {
  //         console.log(`Deleted user with ID: ${userId}`);
  //         this.loadUsers()},
  //       error: (err) => {
  //         const errorMsg = typeof err.error === 'string'
  //         ? err.error
  //         : 'Delete failed. The user might manage others.';
  //       alert(errorMsg);
  //     }
  //   });
  //   }
  // }

  deleteUser(userId: number) {
  if (confirm('Are you sure to delete this user?')) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        console.log(`Deleted user with ID: ${userId}`);
        // Instead of reloading entire list, remove the user from the local array
        this.users = this.users.filter(user => user.userId !== userId);
      },
      error: (err) => {
        const errorMsg = typeof err.error === 'string'
          ? err.error
          : 'Delete failed. The user might manage others.';
        alert(errorMsg);
      }
    });
  }
}
  closeModal() {
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  //<---------------------Role management------------>
  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        this.rolesList = data;
        console.log('Roles loaded:', this.rolesList);
      },
      error: (err) => {
        console.error('Failed to load roles:', err);
        alert('Could not load roles.');
      },
    });
  }
  
  openAddRoleModal() {
    this.selectedRoleData = {
      roleName: '',
      description: '',
      permissions: [],
    };
    this.rolePermissionsInput = '';
    this.isEditRoleMode = false;
    this.openRoleModal();
  }
  
  editRole(role: RoleDTO) {
    this.selectedRoleData = { ...role };
    this.rolePermissionsInput = (role.permissions ?? []).join(', ');
    this.isEditRoleMode = true;
    this.openRoleModal();
  }
  
  deleteRole(id: number | undefined) {
    if (!id) {
      console.error('Invalid role ID for deletion.');
      return;
    }
  
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.rolesList = this.rolesList.filter(r => r.roleId !== id);
          alert('Role deleted successfully.');
        },
        error: (err) => {
          console.error('Failed to delete role:', err);
          alert('Delete failed. Role may be in use.');
        },
      });
    }
  }
  
  saveRole() {
    // Convert comma-separated permissions to array
    this.selectedRoleData.permissions = this.rolePermissionsInput
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  
    if (this.isEditRoleMode && this.selectedRoleData.roleId) {
      this.roleService.updateRole(this.selectedRoleData.roleId, this.selectedRoleData).subscribe({
        next: (updatedRole) => {
          const idx = this.rolesList.findIndex(r => r.roleId === updatedRole.roleId);
          if (idx !== -1) {
            this.rolesList[idx] = updatedRole;
          }
          alert('Role updated successfully.');
          this.closeRoleModal();
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update role.');
        },
      });
    } else {
      this.roleService.createRole(this.selectedRoleData).subscribe({
        next: (newRole) => {
          this.rolesList.push(newRole);
          alert('Role created successfully.');
          this.closeRoleModal();
        },
        error: (err) => {
          console.error('Create failed:', err);
          alert('Failed to create role.');
        },
      });
    }
  }
  
  openRoleModal() {
    const el = document.getElementById('roleModal');
    if (el) {
      this.roleModalInstance = new bootstrap.Modal(el);
      this.roleModalInstance.show();
    }
  }
  
  closeRoleModal() {
    const el = document.getElementById('roleModal');
    if (el) {
      const instance = bootstrap.Modal.getInstance(el);
      instance?.hide();
    }
  }
  
  //<--------------------Ends--------------->

  
  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
      },
      error: (err) => {
        console.error('Error loading permissions:', err);
      }
    });
  }

  // Open modal to add a new permission
  openAddModal(): void {
    this.selectedPermission = {
      permissionName: '',
      description: ''
    };
    this.isEditMode = false;
    this.showModal();
  }

  // Open modal to edit existing permission
  openEditModal(permission: Permission): void {
    this.selectedPermission = { ...permission }; // clone
    this.isEditMode = true;
    this.showModal();
  }

  // Save permission (create or update)
  savePermission(): void {
    if (this.isEditMode && this.selectedPermission.permissionId) {
      this.permissionService.updatePermission(
        this.selectedPermission.permissionId,
        this.selectedPermission
      ).subscribe({
        next: () => this.loadPermissions(),
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      this.permissionService.createPermission(this.selectedPermission).subscribe({
        next: () => this.loadPermissions(),
        error: (err) => console.error('Create failed:', err)
      });
    }
  }

  // Delete a permission
  deletePermission(id: number | undefined): void {
    if (!id) return;
    const confirmDelete = confirm('Are you sure you want to delete this permission?');
    if (confirmDelete) {
      this.permissionService.deletePermission(id).subscribe({
        next: () => this.loadPermissions(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  // Show the Bootstrap modal
  private showModal(): void {
    const modalElement = document.getElementById('permissionModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onRoleChange(event: any) {
    console.log('Role Changed:', this.selectedRole);
    const roleId = this.getRoleId(this.selectedRole);
    this.userService.getUsersByRole(roleId).subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to fetch users by role:', err)
    });
  }

  getRoleId(roleName: string): number {
    switch (roleName) {
      case 'Admin': return 1;
      case 'Editor': return 2;
      default: return 0;
    }
  }

}
