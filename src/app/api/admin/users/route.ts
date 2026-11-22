import { NextRequest, NextResponse } from 'next/server';
import {
  getServerUsers,
  getServerTransactions,
  addOrUpdateServerUser,
  deleteServerUser,
  toggleServerUserPro,
  resetServerCash,
  isUserBlacklisted
} from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkEmail = searchParams.get('email');

    // Check if a specific active user has been deleted/evicted by admin
    if (checkEmail) {
      const isBanned = await isUserBlacklisted(checkEmail);
      if (isBanned) {
        return NextResponse.json({ success: true, active: false, evicted: true });
      }
      return NextResponse.json({ success: true, active: true, evicted: false });
    }

    const [users, transactions] = await Promise.all([
      getServerUsers(),
      getServerTransactions()
    ]);

    return NextResponse.json({ success: true, users, transactions });
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
      const user = await addOrUpdateServerUser({ fullName, email, password, targetExam, isPro, xp });
      const [users, transactions] = await Promise.all([getServerUsers(), getServerTransactions()]);
      return NextResponse.json({ success: true, user, users, transactions });
    }

    if (action === 'togglePro') {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
      }
      const result = await toggleServerUserPro(userId);
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'delete') {
      const { userId, userEmail } = body;
      if (!userId && !userEmail) {
        return NextResponse.json({ success: false, message: 'userId or userEmail is required' }, { status: 400 });
      }
      const result = await deleteServerUser(userId, userEmail);
      const transactions = await getServerTransactions();
      return NextResponse.json({ success: true, users: result.users, minusedAmount: result.minusedAmount, transactions });
    }

    if (action === 'resetCash') {
      await resetServerCash();
      const transactions = await getServerTransactions();
      return NextResponse.json({ success: true, transactions });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
