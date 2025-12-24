export type Status = 'backlog' | 'in_progress' | 'done';

export type Label = 'frontend' | 'backend' | 'bug' | 'feature' | 'urgent';

export interface Task {
  id: string;
  name: string;
  key: string;
  description: string;
  status: Status;
  labels: Label[];
}
