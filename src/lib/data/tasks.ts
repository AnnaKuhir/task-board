import type { Task } from '@/types/task';
import { MESSAGES } from '@/constants';
import { NotFoundError, ConflictError } from '@/lib/errors';

const mockTasks: Task[] = [
  {
    id: '6b8b4567-0e7e-4b1e-b13c-7a8d2f6b0b88',
    name: 'Fix login validation',
    key: 'TASK-001',
    description:
      'Полагодити валідацію полів логіну. Наразі частина некоректних значень не відловлюється, що створює проблеми для користувачів. Потрібно забезпечити стабільну роботу форми та передбачити детальні повідомлення про помилки.',
    status: 'backlog',
    labels: ['frontend', 'bug'],
  },
  {
    id: '93d3d0c6-2a5f-4a9e-b6c1-9f3a2e7a5b31',
    name: 'Create dashboard layout',
    key: 'TASK-002',
    description:
      'Зверстати основний дешборд. Має бути продумане адаптивне розташування основних блоків та зручна навігація. Дизайн повинен відповідати актуальним UI-гайдлайнам проєкту.',
    status: 'backlog',
    labels: ['frontend', 'feature'],
  },
  {
    id: 'a1f5b0c2-1e3f-4c2a-9e0d-5f3a0b1e8c7a',
    name: 'Add payment loader',
    key: 'TASK-003',
    description:
      'Показати лоадер під час створення платежу. Це допоможе користувачам зрозуміти, що система обробляє їхню дію. Також потрібно забезпечити коректне приховування лоадера у випадку помилки.',
    status: 'backlog',
    labels: ['frontend', 'feature'],
  },
  {
    id: 'f9b2c3d1-6e4a-4c1d-8e3a-7c1b2f3d4e5f',
    name: 'Mobile navigation fix',
    key: 'TASK-004',
    description:
      'Поправити меню на мобільних пристроях. Зараз частина елементів відображається некоректно, що ускладнює роботу користувача. Потрібно забезпечити плавну взаємодію та повну адаптивність.',
    status: 'in_progress',
    labels: ['frontend'],
  },
  {
    id: 'e4f7a2c3-5d6b-4a1e-9f2c-3d1e5f6a7b8c',
    name: 'SEO meta tags',
    key: 'TASK-005',
    description:
      'Додати meta теги для SEO. Це покращить видимість сторінок у пошукових системах та допоможе збільшити органічний трафік. Потрібно передбачити можливість динамічної зміни тегів залежно від контенту.',
    status: 'in_progress',
    labels: ['feature'],
  },
  {
    id: 'b6c1d2e3-7f4a-4e5d-8c2a-1e9f3a7b5d6c',
    name: 'Optimize images',
    key: 'TASK-006',
    description:
      'Оптимізувати зображення на лендингу. Вони завантажуються занадто повільно та негативно впливають на продуктивність сторінки. Необхідно зменшити розмір файлів без втрати якості та додати сучасні формати.',
    status: 'in_progress',
    labels: ['backend'],
  },
  {
    id: 'c2d3e4f5-8b9a-4c1e-9f0a-3e2d1c4b5a6f',
    name: 'Remove legacy styles',
    key: 'TASK-007',
    description:
      'Видалити старі стилі. Вони більше не використовуються та ускладнюють підтримку проєкту. Також це допоможе зменшити розмір CSS і прискорити завантаження сторінок.',
    status: 'done',
    labels: ['backend'],
  },
  {
    id: 'd1e2f3a4-5b6c-4e7d-9a8b-2c3d4e5f6a7b',
    name: 'Accessibility improvements',
    key: 'TASK-008',
    description:
      'Покращити доступність елементів. Деякі компоненти не відповідають стандартам WCAG і не озвучуються скрінрідерами. Необхідно додати ARIA-атрибути та покращити клавіатурну навігацію.',
    status: 'done',
    labels: ['feature'],
  },
  {
    id: 'e5f6a7b8-9c0d-4e1f-8a2b-3c4d5e6f7a8b',
    name: 'Form error handling',
    key: 'TASK-009',
    description:
      'Покращити обробку помилок форм. Наразі помилки відображаються не завжди коректно, що плутає користувачів. Потрібно уніфікувати формат повідомлень та забезпечити їх консистентність у різних формах.',
    status: 'done',
    labels: ['frontend', 'bug'],
  },
];

const globalForTasks = globalThis as unknown as {
  tasksMap: Map<string, Task> | undefined;
};

const tasksMap = globalForTasks.tasksMap ?? new Map<string, Task>();

if (!globalForTasks.tasksMap) {
  globalForTasks.tasksMap = tasksMap;
  mockTasks.forEach((task) => {
    tasksMap.set(task.id, task);
  });
}

export function getTasks(): Task[] {
  return Array.from(tasksMap.values());
}

export function getTaskById(id: string): Task | undefined {
  return tasksMap.get(id);
}

export function createTask(data: Omit<Task, 'id'>): Task {
  const existingTask = Array.from(tasksMap.values()).find((t) => t.key === data.key);
  if (existingTask) {
    throw new ConflictError(MESSAGES.TASK_KEY_EXISTS(data.key));
  }

  const newTask: Task = {
    id: crypto.randomUUID(),
    name: data.name,
    key: data.key,
    description: data.description || '',
    status: data.status || 'backlog',
    labels: data.labels || [],
  };

  tasksMap.set(newTask.id, newTask);
  return newTask;
}

export function updateTask(id: string, data: Partial<Task>): Task {
  const task = tasksMap.get(id);
  if (!task) {
    throw new NotFoundError(MESSAGES.TASK_NOT_FOUND);
  }

  if (data.key && data.key !== task.key) {
    const existingTask = Array.from(tasksMap.values()).find((t) => t.key === data.key);
    if (existingTask) {
      throw new ConflictError(MESSAGES.TASK_KEY_EXISTS(data.key));
    }
  }

  const { id: _ignored, ...rest } = data;
  const updatedTask = { ...task, ...rest };
  tasksMap.set(id, updatedTask);
  return updatedTask;
}

export function deleteTask(id: string): void {
  const task = tasksMap.get(id);
  if (!task) {
    throw new NotFoundError(MESSAGES.TASK_NOT_FOUND);
  }

  if (task.status === 'in_progress') {
    throw new ConflictError(MESSAGES.TASK_DELETE_IN_PROGRESS);
  }

  tasksMap.delete(id);
}
