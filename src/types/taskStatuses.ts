export const TASK_STATUSES = {
    BACKLOG: 'Backlog',
    TO_DO: 'To Do',
    IN_PROGRESS: 'In Progress',
    HIGH_PRIORITY: 'In Progress - High Priority',
    REVIEW: 'Review/Approval',
    IN_TESTING: 'In Testing',
    NEEDS_REVISION: 'Needs Revision',
    BLOCKED: 'Blocked',
    ON_HOLD: 'On Hold',
    PENDING_DEPENDENCIES: 'Pending Dependencies',
    PREPARING: 'Preparing',
    SCHEDULED: 'Scheduled',
    WAITING_FOR_FEEDBACK: 'Waiting for Feedback',
    READY_FOR_RELEASE: 'Ready for Release',
    COMPLETED: 'Completed',
    CANCELED: 'Canceled',
    DEFERRED: 'Deferred',
    ARCHIVED: 'Archived',
  } as const;
  
  // Optional: Create a type for valid status keys
  export type TaskStatus = keyof typeof TASK_STATUSES;
  
  // Optional: Create a type for valid status values
  export type TaskStatusValue = typeof TASK_STATUSES[TaskStatus];