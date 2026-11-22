import { NextRequest, NextResponse } from 'next/server';
import {
  getServerTransactions,
  addServerTransaction
} from '@/lib/serverStore';

export async function GET() {
  try {
    const transactions = getServerTransactions();
    return NextResponse.json({ success: true, transactions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userName, userEmail, amount, paymentMethod } = body;

    if (!userName || !amount) {
      return NextResponse.json({ success: false, message: 'userName and amount are required' }, { status: 400 });
    }

    const tx = addServerTransaction({
      userName: userName.trim(),
      userEmail: userEmail ? userEmail.trim().toLowerCase() : '',
      amount: Number(amount) || 50000,
      paymentMethod: paymentMethod || 'ADMIN_MANUAL'
    });

    return NextResponse.json({ success: true, transaction: tx, transactions: getServerTransactions() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
