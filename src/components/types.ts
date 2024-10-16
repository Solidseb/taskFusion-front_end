export interface User {
    avatar: string | undefined;
    id: number;
    name: string;
  }
  
  export interface Task {
    completedDate: string;
    id: number;
    title: string; 
    description: string;
    dueDate: string;
    assignedUsers: User[];
    status: string;
    priority: string;
    startDate: string;
    parent_id?: number;
    subtasks?: Task[];
  }
  
 export  interface Comment {
    id: number;
    text: string;
    author: number;
    createdAt: string;
    parentCommentId?: number;
    replies?: Comment[];
  }