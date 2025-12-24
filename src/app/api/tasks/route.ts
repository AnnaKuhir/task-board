import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask } from '@/lib/data/tasks';
import { MESSAGES } from '@/constants';
import { isAppError } from '@/lib/errors';

export async function GET() {
  try {
    const tasks = getTasks();
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('[GET /api/tasks]', error);

    if (isAppError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    return NextResponse.json({ error: MESSAGES.TASK_FETCH_ERROR }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const task = createTask(data);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/tasks]', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: MESSAGES.INVALID_JSON }, { status: 400 });
    }

    if (isAppError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    const message = error instanceof Error ? error.message : MESSAGES.TASK_CREATE_ERROR;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
