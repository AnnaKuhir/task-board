import { NextRequest, NextResponse } from 'next/server';
import { updateTask, deleteTask } from '@/lib/data/tasks';
import { MESSAGES } from '@/constants';
import { isAppError } from '@/lib/errors';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const task = updateTask(id, data);
    return NextResponse.json({ task });
  } catch (error) {
    console.error('[PUT /api/tasks/:id]', { id: (await params).id, error });

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: MESSAGES.INVALID_JSON }, { status: 400 });
    }

    if (isAppError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    const message = error instanceof Error ? error.message : MESSAGES.TASK_UPDATE_ERROR;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/tasks/:id]', { id: (await params).id, error });

    if (isAppError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    const message = error instanceof Error ? error.message : MESSAGES.TASK_DELETE_ERROR;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
