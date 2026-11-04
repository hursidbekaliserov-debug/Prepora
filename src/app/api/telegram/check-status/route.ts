import { NextRequest, NextResponse } from 'next/server';
import { getReceiptRequest } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('requestId');

    if (!requestId) {
      return NextResponse.json({ success: false, message: 'requestId is required' }, { status: 400 });
    }

    const request = getReceiptRequest(requestId);
    if (!request) {
      return NextResponse.json({ success: false, message: 'So\'rov topilmadi' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      requestId: request.id,
      status: request.status,
      activationCode: request.activationCode,
      reviewedBy: request.reviewedBy,
      reviewedAt: request.reviewedAt,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
