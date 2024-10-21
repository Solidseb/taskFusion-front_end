export interface User {
    avatar: string | undefined;
    id: string;
    name: string;
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
  