import { NextRequest, NextResponse } from 'next/server';
import {
  createReceiptRequest,
  broadcastReceiptToAdmins,
  getRegisteredAdmins,
} from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userName, userPhone, userAccountEmail, transactionProof, photoBase64 } = body;

    const cleanedProof = (transactionProof || '').trim();
    const cleanedPhone = (userPhone || '').trim();
    const cleanedName = (userName || '').trim();

    if (!cleanedProof) {
      return NextResponse.json(
        { success: false, message: 'Iltimos, to\'lov cheki raqamini yoki ma\'lumotini kiriting!' },
        { status: 400 }
      );
    }

    if (!cleanedPhone) {
      return NextResponse.json(
        { success: false, message: 'Iltimos, telefon raqamingizni kiriting!' },
        { status: 400 }
      );
    }

    // Filter out common dummy values
    const fakePatterns = ['123456', '1234567', '12345678', '111111', '000000', 'TEST', 'DEMO'];
    if (fakePatterns.includes(cleanedProof) || /^(\d)\1+$/.test(cleanedProof)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Noto\'g\'ri chek raqami! Soxta yoki ketma-ket raqamlar qabul qilinmaydi. Iltimos, haqiqiy to\'lov chekini yuboring.',
        },
        { status: 400 }
      );
    }

    // To'lov cheki skrinshotini (rasmini) yuklash qat'iyan majburiy
    if (!photoBase64 || typeof photoBase64 !== 'string' || (!photoBase64.startsWith('data:image') && !photoBase64.startsWith('http'))) {
      return NextResponse.json(
        {
          success: false,
          message: 'To\'lov cheki skrinshotini (rasmini) yuklash majburiy! Iltimos, Payme yoki Click orqali qilingan to\'lov chekining aniq skrinshotini yuklang.',
        },
        { status: 400 }
      );
    }

    // Create the receipt request
    const request = createReceiptRequest({
      userName: cleanedName || 'O\'quvchi',
      userPhone: cleanedPhone,
      userAccountEmail,
      transactionProof: cleanedProof,
      photoBase64,
    });

    // Broadcast to Telegram Admins
    const adminsCount = await broadcastReceiptToAdmins(request);
    const registeredAdmins = getRegisteredAdmins();

    return NextResponse.json({
      success: true,
      message: 'Chekingiz qabul qilindi va admin tekshiruviga yuborildi!',
      requestId: request.id,
      adminsNotified: adminsCount,
      hasAdmins: registeredAdmins.length > 0,
    });
  } catch (err: any) {
    console.error('Error submitting receipt:', err);
    return NextResponse.json(
      { success: false, message: 'Serverda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.' },
      { status: 500 }
    );
  }
}

