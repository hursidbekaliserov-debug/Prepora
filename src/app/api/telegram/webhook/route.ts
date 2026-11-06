import { NextRequest, NextResponse } from 'next/server';
import {
  registerAdmin,
  getRegisteredAdmins,
  loadTelegramStore,
  approveReceiptRequest,
  rejectReceiptRequest,
  sendTelegramMessage,
  editTelegramMessageText,
  editTelegramMessageCaption,
  answerCallbackQuery,
  BOT_USERNAME,
} from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // 1. Handle Inline Button Click (callback_query)
    if (update.callback_query) {
      const cq = update.callback_query;
      const data: string = cq.data || '';
      const from = cq.from;
      const adminName = from.username ? `@${from.username}` : `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'Admin';

      if (data.startsWith('approve_')) {
        const requestId = data.replace('approve_', '');
        const res = approveReceiptRequest(requestId, adminName);

        if (res.success && res.request) {
          await answerCallbackQuery(cq.id, '✅ To\'lov tasdiqlandi va Pro faollashtirildi!', true);

          const updatedText = `✅ <b>TO'LOV TASDIQLANDI! (PREMIUM FAOLLASHTIRILDI)</b>

🆔 <b>So'rov:</b> <code>${res.request.id}</code>
👤 <b>Foydalanuvchi:</b> ${res.request.userName}
📞 <b>Telefon:</b> <code>${res.request.userPhone}</code>
💰 <b>Summa:</b> 50 000 so'm (UZCARD/HUMO)
🔑 <b>Aktivatsiya Kodi:</b> <code>${res.request.activationCode}</code>
👮‍♂️ <b>Tasdiqlagan Admin:</b> ${adminName}
⏰ <b>Tasdiqlangan Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}

✨ <i>Foydalanuvchining saytdagi hisobi avtomatik Pro (Premium) ga aylandi.</i>`;

          // Edit this message (caption if photo, or text)
          if (cq.message) {
            if (cq.message.photo) {
              await editTelegramMessageCaption(cq.message.chat.id, cq.message.message_id, updatedText);
            } else {
              await editTelegramMessageText(cq.message.chat.id, cq.message.message_id, updatedText);
            }
          }

          // Edit for other admins if broadcasted
          if (res.request.telegramMessageIds) {
            for (const item of res.request.telegramMessageIds) {
              if (item.chatId !== cq.message?.chat.id) {
                if (item.isPhoto) {
                  await editTelegramMessageCaption(item.chatId, item.messageId, updatedText);
                } else {
                  await editTelegramMessageText(item.chatId, item.messageId, updatedText);
                }
              }
            }
          }
        } else {
          await answerCallbackQuery(cq.id, '⚠️ Ushbu so\'rov allaqachon ko\'rib chiqilgan yoki topilmadi.', true);
        }
        return NextResponse.json({ ok: true });
      }

      if (data.startsWith('reject_')) {
        const requestId = data.replace('reject_', '');
        const res = rejectReceiptRequest(requestId, adminName);

        if (res.success && res.request) {
          await answerCallbackQuery(cq.id, '❌ To\'lov cheki rad etildi.', true);

          const updatedText = `❌ <b>TO'LOV CHEKI RAD ETILDI</b>

🆔 <b>So'rov:</b> <code>${res.request.id}</code>
👤 <b>Foydalanuvchi:</b> ${res.request.userName}
📞 <b>Telefon:</b> <code>${res.request.userPhone}</code>
💰 <b>Summa:</b> 50 000 so'm
👮‍♂️ <b>Rad etgan Admin:</b> ${adminName}
⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}

⚠️ <i>Foydalanuvchiga to'lov tasdiqlanmagani haqida ma'lumot berildi.</i>`;

          if (cq.message) {
            if (cq.message.photo) {
              await editTelegramMessageCaption(cq.message.chat.id, cq.message.message_id, updatedText);
            } else {
              await editTelegramMessageText(cq.message.chat.id, cq.message.message_id, updatedText);
            }
          }

          if (res.request.telegramMessageIds) {
            for (const item of res.request.telegramMessageIds) {
              if (item.chatId !== cq.message?.chat.id) {
                if (item.isPhoto) {
                  await editTelegramMessageCaption(item.chatId, item.messageId, updatedText);
                } else {
                  await editTelegramMessageText(item.chatId, item.messageId, updatedText);
                }
              }
            }
          }
        } else {
          await answerCallbackQuery(cq.id, '⚠️ Ushbu so\'rov allaqachon ko\'rib chiqilgan.', true);
        }
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ ok: true });
    }

    // 2. Handle Text Messages (/start, /admin, /stats, /pending, /help)
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = (msg.text || '').trim();
      const from = msg.from;

      if (text.startsWith('/start') || text.startsWith('/admin')) {
        const isNew = registerAdmin(chatId, from?.username, from?.first_name);

        const welcomeText = `🎓 <b>PREPORA ADMIN TO'LOV BOTIGA XUSH KELIBSIZ!</b>

${isNew ? '✅ <b>Siz muvaffaqiyatli Prepora admini sifatida ro\'yxatga olindingiz!</b>' : 'ℹ️ <i>Siz allaqachon botga ulangan adminsiz.</i>'}

🔔 <b>Bu bot nima qiladi?</b>
O'quvchilar saytda 50 000 so'm to'lov qilib chek yuklashganda, sizga ushbu botga to'g'ridan-to'g'ri xabarnoma va <b>[ ✅ Tasdiqlash ]</b> / <b>[ ❌ Rad etish ]</b> tugmalari keladi.
Siz kartangizga pul tushganini tekshirib, 1 ta tugma bilan foydalanuvchiga Pro berishingiz mumkin.

<b>Mavjud buyruqlar:</b>
📊 /stats - To'lovlar va faollik statistikasi
⏳ /pending - Hozir kutilayotgan to'lovlar
❓ /help - Botdan foydalanish yo'riqnomasi`;

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prepora.uz';
        await sendTelegramMessage(chatId, welcomeText, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🚀 Prepora Platformasini Ochish (Web App)',
                  web_app: { url: siteUrl },
                },
              ],
              [
                {
                  text: '🎁 Do\'stlarni Taklif Qilish (Bepul Pro)',
                  web_app: { url: `${siteUrl}/referral` },
                },
              ],
            ],
          },
        });
        return NextResponse.json({ ok: true });
      }

      if (text === '/stats') {
        const store = loadTelegramStore();
        const admins = getRegisteredAdmins();
        const allRequests = Object.values(store.requests);
        const approved = allRequests.filter((r) => r.status === 'APPROVED').length;
        const pending = allRequests.filter((r) => r.status === 'PENDING').length;
        const rejected = allRequests.filter((r) => r.status === 'REJECTED').length;

        const statsText = `📊 <b>PREPORA TO'LOV STATISTIKASI:</b>

👥 <b>Ulangan adminlar soni:</b> ${admins.length} ta
📥 <b>Jami kelgan cheklar:</b> ${allRequests.length} ta
✅ <b>Tasdiqlangan (Pro berilgan):</b> ${approved} ta (Jami: ${(approved * 50000).toLocaleString('uz-UZ')} so'm)
⏳ <b>Kutilayotgan (Kutishda):</b> ${pending} ta
❌ <b>Rad etilgan:</b> ${rejected} ta`;

        await sendTelegramMessage(chatId, statsText);
        return NextResponse.json({ ok: true });
      }

      if (text === '/pending') {
        const store = loadTelegramStore();
        const pending = Object.values(store.requests).filter((r) => r.status === 'PENDING');

        if (pending.length === 0) {
          await sendTelegramMessage(chatId, '✅ Hozirda kutilayotgan yangi cheklar yo\'q. Barcha to\'lovlar ko\'rib chiqilgan!');
        } else {
          let listText = `⏳ <b>KUTILAYOTGAN CHEKLAR (${pending.length} ta):</b>\n\n`;
          for (const req of pending.slice(-5)) {
            listText += `• <b>${req.id}</b> - ${req.userName} (${req.userPhone})\nTranzaksiya: <code>${req.transactionProof}</code>\n\n`;
          }
          await sendTelegramMessage(chatId, listText);
        }
        return NextResponse.json({ ok: true });
      }

      if (text === '/help') {
        const helpText = `ℹ️ <b>YORDAM VA YO'RIQNOMA:</b>

1. O'quvchi saytda karta raqamiga 50 000 so'm to'laydi.
2. Chek ma'lumotini saytdan kiritganda, bot sizga darhol xabar va tugmalarni yuboradi.
3. Kartangizni tekshirib, <b>[ ✅ Tasdiqlash ]</b> ni bossangiz, o'quvchining hisobi avtomatik Pro ga o'tadi!`;
        await sendTelegramMessage(chatId, helpText);
        return NextResponse.json({ ok: true });
      }

      // Default response
      await sendTelegramMessage(chatId, `Assalomu alaykum! Buyruqlar ro'yxatini ko'rish uchun /help ni bosing.`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const admins = getRegisteredAdmins();
  return NextResponse.json({
    status: 'online',
    bot: BOT_USERNAME,
    connectedAdminsCount: admins.length,
    admins: admins.map((a) => ({ chatId: a.chatId, username: a.username, firstName: a.firstName })),
  });
}

