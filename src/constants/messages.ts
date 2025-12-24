export const MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  TASK_STATUS_UPDATED: 'Task status updated',

  TASK_CREATE_ERROR: 'Failed to create task',
  TASK_UPDATE_ERROR: 'Failed to update task',
  TASK_DELETE_ERROR: 'Failed to delete task',
  TASK_FETCH_ERROR: 'Failed to fetch tasks',
  TASK_NOT_FOUND: 'Task not found',

  TASK_DELETE_IN_PROGRESS: 'Cannot delete task with status "in_progress"',
  TASK_KEY_EXISTS: (key: string) => `Task with key "${key}" already exists`,
  TASK_ID_REQUIRED: 'Task ID is required for update',

  TASK_NAME_REQUIRED: 'Task name is required',
  TASK_KEY_REQUIRED: 'Task key is required',
  TASK_KEY_FORMAT: 'Task key must follow format: TASK-XXX (e.g., TASK-001)',

  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_JSON: 'Invalid JSON format in request body',
} as const;

export type MessageKey = keyof typeof MESSAGES;
