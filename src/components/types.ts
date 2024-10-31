export interface User {
    avatar: string | undefined;
    id: string;
    name: string;
    role?: Role;  
  }
  
  export interface Task {
    completedDate: string;
    id: number;
    title: string; 
    description: string;
    dueDate: string;
    assignedUsers: User[];
    assignedUserIds: string[],
    status: string;
    priority: string;
    startDate: string;
    parent_id?: number;
    subtasks?: Task[];
    blockers: number[];
    tagIds?: Tag[];
    tags?: Tag[];
    timeSpent?: number;
    progress?: number;
  }
  
 export  interface Comment {
    id: number;
    text: string;
    author: string;
    createdAt: string;
    parentCommentId?: number;
    replies?: Comment[];
  }

  export interface TaskHistory {
    id: number;
    taskId: number;
    changeType: 'taskCompleted' | 'newComment' | 'fileUploaded' | 'statusChanged' | 'assignedUserChanged' | 'taskCreated' | 'taskUpdated' | 'other';
    changeDescription: string;
    user: {
      avatar: undefined;
      id: string;
      name: string;
    };
    timestamp: string;  // ISO string format
  }
  
export interface Tag {
    id: string;
    name: string;
  }

  export interface Permission {
    id: string;
    name: string;               // Name of the permission, e.g., "Read Task"
    entity: string;             // Entity this permission applies to, e.g., "Task", "Capsule"
    action: string;             // Action this permission allows, e.g., "read", "write", "edit", "delete"
  }
  
  export interface Role {
    id: string;
    name: string;               // Name of the role, e.g., "Admin", "Manager"
    permissions: Permission[];  // List of permissions assigned to this role
  }