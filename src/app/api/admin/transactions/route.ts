import { NextRequest, NextResponse } from 'next/server';
import {
  getServerTransactions,
  addServerTransaction,
  resetServerCash
} from '@/lib/serverStore';

export async function GET() {
  try {
    const transactions = await getServerTransactions();
    return NextResponse.json({ success: true, transactions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userName, userEmail, amount, paymentMethod } = body;

    if (action === 'reset') {
      await resetServerCash();
      const transactions = await getServerTransactions();
      return NextResponse.json({ success: true, transactions });
    }

    if (!userName || !amount) {
      return NextResponse.json({ success: false, message: 'userName and amount are required' }, { status: 400 });
    }

    const tx = await addServerTransaction({
      userName: userName.trim(),
      userEmail: userEmail ? userEmail.trim().toLowerCase() : '',
      amount: Number(amount) || 50000,
      paymentMethod: paymentMethod || 'ADMIN_MANUAL'
    });

    const transactions = await getServerTransactions();
    return NextResponse.json({ success: true, transaction: tx, transactions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
