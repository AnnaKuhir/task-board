import { getTasks } from '@/lib/data/tasks';
import { TaskBoard } from './_components/task-board';

export default function Home() {
  const tasks = getTasks();

  return <TaskBoard initialTasks={tasks} />;
}
