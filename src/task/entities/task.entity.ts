export class Task {
  id: string;
  title: string;
  description: string;
  status?: string;
  dueDate: Date;
  userId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}
