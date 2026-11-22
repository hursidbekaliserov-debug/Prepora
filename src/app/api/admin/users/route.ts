import { NextRequest, NextResponse } from 'next/server';
import {
  getServerUsers,
  addOrUpdateServerUser,
  deleteServerUser,
  toggleServerUserPro
} from '@/lib/serverStore';

export async function GET() {
  try {
    const users = getServerUsers();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'register' || action === 'add') {
      const { fullName, email, password, targetExam, isPro, xp } = body;
      if (!fullName || !email) {
        return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
      }
      const user = addOrUpdateServerUser({ fullName, email, password, targetExam, isPro, xp });
      return NextResponse.json({ success: true, user, users: getServerUsers() });
    }

    if (action === 'togglePro') {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
      }
      const result = toggleServerUserPro(userId);
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'delete') {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
      }
      const users = deleteServerUser(userId);
      return NextResponse.json({ success: true, users });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
