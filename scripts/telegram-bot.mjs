// scripts/telegram-bot.mjs
// Prepora Telegram Admin To'lov Boti (Polling Runner)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const STORE_FILE = path.join(DATA_DIR, 'telegram-store.json');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8858599978:AAERP8DmBetwSkSSelxq5uAwhs7mtH4MHlQ';
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify({ admins: [], requests: {} }, null, 2), 'utf-8');
  }
}

function loadStore() {
  ensureData();
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { admins: [], requests: {} };
  }
}

function saveStore(data) {
  ensureData();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function tgRequest(method, payload = {}) {
  try {
    const res = await fetch(`${API_BASE}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error(`Error calling ${method}:`, err.message);
    return null;
  }
}

async function sendMessage(chatId, text, extra = {}) {
  return await tgRequest('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    ...extra,
  });
}

async function editMessageText(chatId, messageId, text, extra = {}) {
  return await tgRequest('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'HTML',
    ...extra,
  });
}

async function editMessageCaption(chatId, messageId, caption, extra = {}) {
  return await tgRequest('editMessageCaption', {
    chat_id: chatId,
    message_id: messageId,
    caption,
    parse_mode: 'HTML',
    ...extra,
  });
}

async function answerCallbackQuery(callbackQueryId, text = '', showAlert = false) {
  return await tgRequest('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert,
  });
}

async function handleUpdate(update) {
  // 1. Callback query (Inline tugmalar)
  if (update.callback_query) {
    const cq = update.callback_query;
    const data = cq.data || '';
    const from = cq.from;
    const adminName = from.username ? `@${from.username}` : `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'Admin';

    const store = loadStore();

    if (data.startsWith('approve_')) {
      const reqId = data.replace('approve_', '');
      const req = store.requests[reqId];

      if (req && req.status === 'PENDING') {
        const activationCode = `PREPORA-PRO-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
        req.status = 'APPROVED';
        req.activationCode = activationCode;
        req.reviewedAt = new Date().toISOString();
        req.reviewedBy = adminName;
        saveStore(store);

        await answerCallbackQuery(cq.id, '✅ To\'lov tasdiqlandi va Pro berildi!', true);

        const updatedText = `✅ <b>TO'LOV TASDIQLANDI! (PREMIUM FAOLLASHTIRILDI)</b>

🆔 <b>So'rov:</b> <code>${req.id}</code>
👤 <b>Foydalanuvchi:</b> ${req.userName}
📞 <b>Telefon:</b> <code>${req.userPhone}</code>
💰 <b>Summa:</b> 50 000 so'm (UZCARD/HUMO)
🔑 <b>Aktivatsiya Kodi:</b> <code>${activationCode}</code>
👮‍♂️ <b>Tasdiqlagan Admin:</b> ${adminName}
⏰ <b>Tasdiqlangan Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}

✨ <i>Foydalanuvchining saytdagi hisobi avtomatik Pro ga aylandi!</i>`;

        if (cq.message) {
          if (cq.message.photo) {
            await editMessageCaption(cq.message.chat.id, cq.message.message_id, updatedText);
          } else {
            await editMessageText(cq.message.chat.id, cq.message.message_id, updatedText);
          }
        }

        // Notify user if submitted via telegram directly
        if (req.telegramUserChatId) {
          await sendMessage(
            req.telegramUserChatId,
            `🎉 <b>To'lovingiz tasdiqlandi!</b>\n\nPrepora Pro faollashtirildi. Sizning aktivatsiya kodingiz:\n<code>${activationCode}</code>`
          );
        }

        console.log(`[BOT] Approved request ${reqId} by ${adminName}`);
      } else {
        await answerCallbackQuery(cq.id, '⚠️ Ushbu so\'rov allaqachon ko\'rib chiqilgan.', true);
      }
      return;
    }

    if (data.startsWith('reject_')) {
      const reqId = data.replace('reject_', '');
      const req = store.requests[reqId];

      if (req && req.status === 'PENDING') {
        req.status = 'REJECTED';
        req.reviewedAt = new Date().toISOString();
        req.reviewedBy = adminName;
        saveStore(store);

        await answerCallbackQuery(cq.id, '❌ To\'lov rad etildi.', true);

        const updatedText = `❌ <b>TO'LOV CHEKI RAD ETILDI</b>

🆔 <b>So'rov:</b> <code>${req.id}</code>
👤 <b>Foydalanuvchi:</b> ${req.userName}
📞 <b>Telefon:</b> <code>${req.userPhone}</code>
💰 <b>Summa:</b> 50 000 so'm
👮‍♂️ <b>Rad etgan Admin:</b> ${adminName}
⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}

⚠️ <i>Foydalanuvchiga to'lov cheki tasdiqlanmagani ma'lum qilindi.</i>`;

        if (cq.message) {
          if (cq.message.photo) {
            await editMessageCaption(cq.message.chat.id, cq.message.message_id, updatedText);
          } else {
            await editMessageText(cq.message.chat.id, cq.message.message_id, updatedText);
          }
        }

        if (req.telegramUserChatId) {
          await sendMessage(
            req.telegramUserChatId,
            `❌ To'lov chekingiz admin tomonidan rad etildi. Karta hisobiga 50 000 so'm tushmagan yoki chek noto'g'ri.`
          );
        }

        console.log(`[BOT] Rejected request ${reqId} by ${adminName}`);
      } else {
        await answerCallbackQuery(cq.id, '⚠️ Ushbu so\'rov allaqachon ko\'rib chiqilgan.', true);
      }
      return;
    }
  }

  // 2. Oddiy xabarlar (/start, /admin, /stats, /pending, /help)
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const from = msg.from;

    // 2.1 Agar foydalanuvchi to'lov cheki skrinshotini (rasm) botga yuborsa
    if (msg.photo && msg.photo.length > 0) {
      const store = loadStore();
      const isAdmin = store.admins.some((a) => a.chatId === chatId);

      if (!isAdmin) {
        const bestPhoto = msg.photo[msg.photo.length - 1];
        const fileId = bestPhoto.file_id;
        const caption = msg.caption || 'To\'lov cheki skrinshoti';
        const reqId = `REQ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        const userName = from?.first_name || 'Foydalanuvchi';
        const userPhone = from?.username ? `@${from.username}` : `Telegram ID: ${chatId}`;

        store.requests[reqId] = {
          id: reqId,
          userName,
          userPhone,
          transactionProof: caption,
          amount: "50 000 so'm",
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          telegramUserChatId: chatId,
          telegramMessageIds: [],
        };
        saveStore(store);

        const adminCaption = `📸 <b>YANGI TO'LOV CHEKI SKRINSHOTI (TELEGRAMDAN)!</b>

🆔 <b>So'rov ID:</b> <code>${reqId}</code>
👤 <b>Foydalanuvchi:</b> ${userName}
📞 <b>Bog'lanish:</b> ${userPhone}
💰 <b>Summa:</b> 50 000 so'm (UZCARD/HUMO)
📅 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}

🧾 <b>Izoh:</b> ${caption}

⚠️ <i>Admin tekshiruvi: Skrinshotni tekshirib, hisobga pul tushgan bo'lsa tasdiqlang:</i>`;

        const inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '✅ Tasdiqlash & Pro Berish', callback_data: `approve_${reqId}` },
              { text: '❌ Rad Etish', callback_data: `reject_${reqId}` },
            ],
          ],
        };

        for (const admin of store.admins) {
          await tgRequest('sendPhoto', {
            chat_id: admin.chatId,
            photo: fileId,
            caption: adminCaption,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard,
          });
        }

        await sendMessage(
          chatId,
          `✅ To'lov cheki skrinshotingiz qabul qilindi!\n\nAdminlar ko'rib chiqib 50 000 so'm to'lovni tasdiqlashi bilan sizga shu yerda bildirishnoma keladi.`
        );
        return;
      }
    }

    // Faqat ruxsat berilgan yagona rasmiy admin (@Alisherov_00 yoki maxfiy parol)
    const senderUsername = (from?.username || '').toLowerCase();
    const isAuthorizedOwner = 
      senderUsername === 'alisherov_00' || 
      senderUsername === 'hursidbekaliserov' || 
      chatId === 8902348376 ||
      text.includes('prepora2026');

    if (text.startsWith('/start') || text.startsWith('/admin')) {
      const store = loadStore();

      // Oddiy foydalanuvchi botga yozsa, u admin bo'la olmaydi!
      if (!isAuthorizedOwner) {
        await sendMessage(
          chatId,
          `🎓 <b>PREPORA RASMIY BILDIRISHNOMA BOTI</b>\n\nAssalomu alaykum, <b>${from?.first_name || 'Hurmatli foydalanuvchi'}</b>!\n\nUshbu bot Prepora platformasining to'lov va xabarnomalar tizimi hisoblanadi.\n\n🌐 <b>Saytga kirish:</b> https://prepora-ruddy.vercel.app\n🎁 <b>Bepul Pro olish:</b> Do'stlaringizni taklif qiling!`
        );
        return;
      }

      // Faqat ruxsat etilgan admin:
      const exists = store.admins.some((a) => a.chatId === chatId);
      if (!exists) {
        store.admins.push({
          chatId,
          username: from?.username,
          firstName: from?.first_name,
          addedAt: new Date().toISOString(),
        });
        saveStore(store);
      }

      const welcomeText = `🎓 <b>PREPORA ADMIN BOSHQARUV PANELIGA XUSH KELIBSIZ!</b>
      
Assalomu alaykum, <b>${from?.first_name || 'Admin'}</b> (@${from?.username || 'Alisherov_00'})!
Siz Prepora platformasining yagona vakolatli administratori sifatida ro'yxatdasiz.

🔔 <b>Bu tizim qanday ishlaydi?</b>
Foydalanuvchilar saytdan 50 000 so'm to'lov qilib chek yuborganlarida, to'g'ridan-to'g'ri faqat sizga skrinshot va <b>[ ✅ Tasdiqlash ]</b> / <b>[ ❌ Rad etish ]</b> tugmalari keladi.
Kartangizga pul tushganini tekshirib, 1 ta tugma bilan foydalanuvchiga Pro obunani faollashtirib berasiz.

<b>Admin buyruqlari:</b>
📊 /stats - To'lovlar statistikasi
⏳ /pending - Kutilayotgan to'lovlar
❓ /help - Yo'riqnoma`;

      const webAppUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prepora.uz';
      await sendMessage(chatId, welcomeText, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Prepora Platformasini Ochish (Web App)',
                web_app: { url: webAppUrl },
              },
            ],
            [
              {
                text: '🎁 Do\'stlarni Taklif Qilish (Bepul Pro)',
                web_app: { url: `${webAppUrl}/referral` },
              },
            ],
          ],
        },
      });
      console.log(`[BOT] Registered/welcomed admin ${chatId} (${from?.username || from?.first_name})`);
      return;
    }

    if (text === '/stats') {
      if (!isAuthorizedOwner) {
        await sendMessage(chatId, "⛔ Bu buyruq faqat bosh admin uchun!");
        return;
      }
      const store = loadStore();
      const allRequests = Object.values(store.requests);
      const approved = allRequests.filter((r) => r.status === 'APPROVED').length;
      const pending = allRequests.filter((r) => r.status === 'PENDING').length;
      const rejected = allRequests.filter((r) => r.status === 'REJECTED').length;

      const statsText = `📊 <b>PREPORA TO'LOV STATISTIKASI:</b>

👥 <b>Ulangan adminlar:</b> ${store.admins.length} ta
📥 <b>Jami kelgan cheklar:</b> ${allRequests.length} ta
✅ <b>Tasdiqlangan:</b> ${approved} ta (Jami: ${(approved * 50000).toLocaleString('uz-UZ')} so'm)
⏳ <b>Kutilayotgan:</b> ${pending} ta
❌ <b>Rad etilgan:</b> ${rejected} ta`;

      await sendMessage(chatId, statsText);
      return;
    }

    if (text === '/pending') {
      if (!isAuthorizedOwner) {
        await sendMessage(chatId, "⛔ Bu buyruq faqat bosh admin uchun!");
        return;
      }
      const store = loadStore();
      const pending = Object.values(store.requests).filter((r) => r.status === 'PENDING');

      if (pending.length === 0) {
        await sendMessage(chatId, '✅ Hozirda kutilayotgan yangi cheklar yo\'q. Barcha to\'lovlar ko\'rib chiqilgan!');
      } else {
        let listText = `⏳ <b>KUTILAYOTGAN CHEKLAR (${pending.length} ta):</b>\n\n`;
        for (const req of pending.slice(-5)) {
          listText += `• <b>${req.id}</b> - ${req.userName} (${req.userPhone})\nTranzaksiya: <code>${req.transactionProof}</code>\n\n`;
        }
        await sendMessage(chatId, listText);
      }
      return;
    }

    if (text === '/help') {
      const helpText = `ℹ️ <b>YORDAM VA YO'RIQNOMA:</b>

1. O'quvchi saytda karta raqamiga 50 000 so'm to'laydi.
2. Chek ma'lumotini saytdan kiritganda, bot sizga darhol xabar va tugmalarni yuboradi.
3. Kartangizni tekshirib, <b>[ ✅ Tasdiqlash ]</b> ni bossangiz, o'quvchining hisobi avtomatik Pro ga o'tadi!`;
      await sendMessage(chatId, helpText);
      return;
    }

    // Default
    await sendMessage(chatId, `Assalomu alaykum! Buyruqlar ro'yxatini ko'rish uchun /help ni bosing.`);
  }
}

async function startPolling() {
  console.log('🤖 Prepora Telegram Bot Polling boshlanmoqda...');
  // Delete webhook if set, so polling works cleanly
  await tgRequest('deleteWebhook');

  const me = await tgRequest('getMe');
  if (!me?.ok) {
    console.error('Bot token noto\'g\'ri yoki Telegram API ga ulanib bo\'lmadi:', me);
    return;
  }
  console.log(`✅ Bot faol: @${me.result.username} (${me.result.first_name})`);

  let offset = 0;
  while (true) {
    try {
      const res = await fetch(`${API_BASE}/getUpdates?offset=${offset}&timeout=20`);
      const data = await res.json();

      if (data?.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (err) {
      console.error('Polling xatosi:', err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startPolling();

