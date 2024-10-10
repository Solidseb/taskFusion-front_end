export interface User {
    avatar: string | undefined;
    id: number;
    name: string;
  }
  
  export interface Task {
    id: number;
    title: string; 
    description: string;
    dueDate: string;
    assignedUsers: User[];
    status: string;
    priority: string;
  }
  