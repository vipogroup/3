import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Helper to get tasks collection
async function getTasksCollection() {
  const { getDb } = await import('@/lib/db');
  const db = await getDb();
  return db.collection('admin_tasks');
}

// Helper to check if user is admin
async function checkAdmin(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) return null;
  
  try {
    const { jwtVerify } = await import('jose');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(tokenMatch[1], secret);
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

// PATCH - Update task (toggle completed, edit, etc.)
export async function PATCH(req, { params }) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const body = await req.json();
    const col = await getTasksCollection();
    const task = await col.findOne({ _id: new ObjectId(id) });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updates = { updatedAt: new Date() };

    if (body.action === 'toggle') {
      updates.completed = !task.completed;
      if (updates.completed) {
        updates.completedAt = new Date();
      }
    } else {
      if (body.title) updates.title = body.title;
      if (body.description !== undefined) updates.description = body.description;
      if (body.type) updates.type = body.type;
      if (body.priority) updates.priority = body.priority;
      if (body.completed !== undefined) updates.completed = body.completed;
    }

    await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const updatedTask = await col.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(req, { params }) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const col = await getTasksCollection();
    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
