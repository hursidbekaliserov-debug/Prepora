import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, examContext, conversationHistory } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const trimmed = message.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Try Gemini Live LLM if API Key is configured
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are an elite, encouraging AI tutor for Prepora specializing in IELTS (Academic & General Training) and the SAT.
The student is preparing for: "${examContext || 'IELTS & SAT'}".
Student Question: "${trimmed}"

Instructions:
- If the user writes in Uzbek, reply naturally and professionally in Uzbek. If in English, reply in English. If in Russian, reply in Russian.
- Provide direct, concrete, step-by-step answers with formulas, examples, or vocabulary.
- Keep the tone motivating, clear, and highly practical.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply && reply.trim().length > 10) {
            return NextResponse.json({
              reply: reply.trim(),
              isRealAi: true,
              engine: 'gemini-1.5-flash',
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (apiErr) {
        console.warn('Gemini API call failed, using intelligent Prepora engine:', apiErr);
      }
    }

    // 2. Intelligent Multi-Lingual Prepora Brain (Uzbek & English & Russian)
    const lower = trimmed.toLowerCase();
    let reply = "";

    // Greetings in Uzbek, English, Russian
    if (
      lower === 'salom' || lower.includes('assalomu') || lower.includes('qalaysiz') || 
      lower.includes('qandaysiz') || lower === 'hi' || lower === 'hello' || lower === 'hey' ||
      lower.includes('privet') || lower.includes('zdravstvuyte')
    ) {
      reply = `**Assalomu alaykum! Prepora AI shaxsiy repetitoriga xush kelibsiz.**\n\nMen sizga quyidagi yo'nalishlarda 24/7 yordam bera olaman:\n- **IELTS Speaking**: Jonli suhbat, Part 1, 2, 3 strategiyalari va C1/C2 so'zlar.\n- **IELTS Writing**: Task 1 (grafik tahlili) va Task 2 (insho) 4 paragrafli strukturasi va Band 8+ iboralar.\n- **IELTS Reading & Listening**: True/False/Not Given, Headings va tezkor audio belgilash usullari.\n- **SAT Math**: Desmos formulalari, kvadrat tenglamalar, parabola cho'qqisi va geometriya sirlari.\n- **SAT Reading & Writing**: Kontekstdagi so'zlar (Words in Context), tinish belgilari va transition so'zlar.\n\nSiz hozir qaysi mavzu yoki qaysi bo'lim bo'yicha mashq qilmoqchisiz?`;
    }
    // Score Target questions (e.g. "7 olish", "8 band", "1500 ball", "qanday boshlash kerak")
    else if (
      lower.includes('qanday boshla') || lower.includes('qayerdan boshla') || 
      lower.includes('maslahat') || lower.includes('rejasi') || lower.includes('plan') ||
      lower.includes('7 olish') || lower.includes('7.5') || lower.includes('8.0') || lower.includes('1500')
    ) {
      reply = `**Maqsadli ballga (IELTS 7.0+ yoki SAT 1450+) erishishning 4 bosqichli amaliy rejasi:**\n\n1. **Diagnostik Mock Test (1-kun)**:\n   - Platformadagi to'liq mock imtihonini yechib, zaif nuqtalaringizni aniqlang. Xatolarni oddiy "ko'rib chiqish" emas, maxsus *Error Log* da xato sababini yozib boring.\n\n2. **Receptive Skills (Reading & Listening)**:\n   - Har kuni kamida 1 ta passage tahlil qiling. Noto'g'ri chiqqan har bir savolda matndagi sinonim paraphrase juftliklarini daftarga qayd eting.\n\n3. **Productive Skills (Writing & Speaking)**:\n   - IELTS.GG Voice AI bo'limida har kuni kamida bitta to'liq Speaking intervyu o'tkazing.\n   - Writing uchun haftasiga 3 ta insho yozing va platformadagi AI Examiner orqali 4 mezon bo'yicha tekshirib, Band 9 namunasini o'rganing.\n\n4. **SAT Math & Desmos Mastery**:\n   - Formula yodlashdan tashqari, Desmos grafigi orqali tenglamalarni 10 soniyada yechish ko'nikmasini shakllantiring.\n\nQaysi bo'lim siz uchun eng qiyin tuyulyapti? Shundan boshlaymiz!`;
    }
    // Writing specific
    else if (lower.includes('writing') || lower.includes('insho') || lower.includes('task 1') || lower.includes('task 2') || lower.includes('essay')) {
      reply = `**IELTS Writing Task 2 da Band 8.0+ olishning oltin qoidalari:**\n\n1. **4 Paragrafli Toza Struktura**:\n   - **Introduction (2 ta gap)**: Savol matnini mukammal paraphrase qilish + Aniq o'z fikringiz (Thesis Statement).\n   - **Body 1 (4-5 ta gap)**: Asosiy dalil (Topic Sentence) + Tushuntirish + Aniq misol (Real-world example).\n   - **Body 2 (4-5 ta gap)**: Ikkinchi mustahkam argument yoki qarama-qarshi nuqtai nazar tahlili + oqibati.\n   - **Conclusion (1-2 ta gap)**: Fikringizni yangi sinonimlar bilan yakunlash (yangi g'oya kiritilmaydi).\n\n2. **Band 8+ Leksik Birikmalar (Collocations)**:\n   - *"exacerbate environmental degradation"* (muammoni og'irlashtirish)\n   - *"foster socio-economic mobility"* (ijtimoiy-iqtisodiy yuksalishni rag'batlantirish)\n   - *"exert profound ramifications on..."* (jiddiy oqibatlarga olib kelish)\n\n3. **Cohesive Devices**:\n   - "However" o'rniga: *"Notwithstanding this perspective"*, *"Conversely"*.\n   - "Because" o'rniga: *"Owing to the fact that..."*, *"Attributed to..."*.`;
    }
    // Speaking specific
    else if (lower.includes('speaking') || lower.includes('gapirish') || lower.includes('fluency') || lower.includes('cue card') || lower.includes('part 2')) {
      reply = `**IELTS Speaking imtihonida yuqori ball (Band 8.0+) sirlari:**\n\n1. **Hech qachon 'Ha' yoki 'Yo'q' deb to'xtab qolmang**:\n   - Har doim javobingizni 3 bosqichda bering: **Direct Answer** + **Why (Sababi)** + **Example/Past Experience (Misol)**.\n\n2. **Natural Signposting (Jonli bog'lovchilar)**:\n   - *"To be perfectly candid with you..."* (Ochig'ini aytsam...)\n   - *"Looking back on that particular period..."* (O'sha paytga nazar tashlasam...)\n   - *"From a broader societal standpoint..."* (Kengroq ijtimoiy nuqtai nazardan...)\n\n3. **Part 2 (1 daqiqalik tayyorgarlik)**:\n   - To'liq gaplar yozmang! Faqat 4 ta kalit so'z yozing: *Kim*, *Qachon*, *Nima voqea bo'ldi* va *Hozirgi hissiyotingiz*.\n\nBizning yangi **IELTS.GG Voice AI** bo'limida Dr. Vance bilan hoziroq jonli ovozda suhbatlashib ko'rishingiz mumkin!`;
    }
    // Reading & Listening specific
    else if (lower.includes('reading') || lower.includes('listening') || lower.includes('tfng') || lower.includes('true false') || lower.includes('o\'qish')) {
      reply = `**IELTS Reading & Listening bo'yicha kafolatlangan usullar:**\n\n1. **True / False / Not Given qoidasi**:\n   - **TRUE**: Matnda aytilgan fikr 100% to'g'ri (faqat sinonimlar orqali ifodalangan).\n   - **FALSE**: Matn savoldagi da'voga **to'g'ridan-to'g'ri ziddir** (ikkisi bir vaqtda to'g'ri bo'lishi mumkin emas).\n   - **NOT GIVEN**: Matnda bu mavzu tilga olingan bo'lishi mumkin, lekin da'voni tasdiqlash yoki inkor qilish uchun yetarli ma'lumot berilmagan. O'z tasavvuringizdan qo'shmang!\n\n2. **Listening bo'yicha oltin qoida**:\n   - Savollar orasidagi 30-40 soniyada keyingi savollarning kalit so'zlari (nouns, numbers, dates) tagiga chizing va qaysi turdagi so'z tushishini oldindan taxmin qiling (masalan, telefon raqami, ism yoki narx).`;
    }
    // SAT Math & Desmos specific
    else if (lower.includes('math') || lower.includes('sat') || lower.includes('algebra') || lower.includes('desmos') || lower.includes('geometriya') || lower.includes('tenglama')) {
      reply = `**SAT Math Modullari uchun 3 ta eng kuchli formula va Desmos usuli:**\n\n1. **Kvadrat Tenglama Cho'qqisi (Vertex Formula)**:\n   - $y = ax^2 + bx + c$ parabola uchun simmetriya o'qi doim: $x = -\\frac{b}{2a}$.\n   - Maksimal yoki minimal qiymatni topish uchun ushbu $x$ ni qaytarib funksiyaga qo'yasiz!\n\n2. **Viyet Teoremasi (Roots Shortcut)**:\n   - $ax^2 + bx + c = 0$ tenglama ildizlari yig'indisi: $x_1 + x_2 = -\\frac{b}{a}$.\n   - Ildizlar ko'paytmasi: $x_1 \\cdot x_2 = \\frac{c}{a}$. SAT da bu qoida orqali masalalarni 5 soniyada yechish mumkin!\n\n3. **Desmos Intersect Usuli**:\n   - Ikkita murakkab tenglamalar sistemasi berilganda, ularni alohida-alohida Desmos ga kiriting va ularning kesishish nuqtalarini (intersections) sichqoncha bilan bosib darhol javobni toping!`;
    }
    // Vocabulary specific
    else if (lower.includes('vocab') || lower.includes('so\'z') || lower.includes('lug\'at') || lower.includes('word')) {
      reply = `**IELTS va SAT uchun eng yuqori baholanadigan 5 ta universal akademik so'z:**\n\n1. **Substantiate** (verb) — Isbotlamoq, dalillar bilan tasdiqlamoq.\n   *Misol: "Empirical studies substantiate the claim that sleep promotes retention."*\n2. **Mitigate** (verb) — Yengillashtirmoq, zararni kamaytirmoq.\n   *Misol: "Governments must implement strict regulations to mitigate air pollution."*\n3. **Indispensable** (adj) — O'rni bosilmas, nihoyatda muhim.\n   *Misol: "Critical thinking is an indispensable asset for university students."*\n4. **Pragmatic** (adj) — Amaliy, real foydaga yo'naltirilgan.\n   *Misol: "We need a pragmatic approach to tackle youth unemployment."*\n5. **Ramification** (noun) — Murakkab oqibat, ta'sir.\n   *Misol: "Unchecked technological reliance carries profound societal ramifications."*`;
    }
    // Contextual intelligent breakdown of user query
    else {
      reply = `Siz so'ragan mavzu bo'yicha tahlil: **"${trimmed}"**\n\nUshbu yo'nalishda eng yuqori natijaga erishish uchun quyidagilarga e'tibor qaratish lozim:\n\n1. **Konseptual tushunish**: Nazariyani yodlamasdan, uning imtihon savollarida qanday formatda uchrashini (Reading/Writing konteksti yoki Math formulalari) amaliyotda ko'ring.\n2. **Kunlik 45 daqiqalik odat**: Haftada 1 marta ko'p dars qilgandan ko'ra, har kuni 45 daqiqa Prepora trenajyorlarida aniq modullarni ishlash miyada neyron bog'lanishlarini 3 barobar mustahkamlaydi.\n3. **Xatolar ustida ishlash**: Noto'g'ri chiqqan har bir savol uchun tushuntirishni sinchiklab o'qib chiqing.\n\nIstalgan paytda aniq bitta savol, insho mavzusi yoki matematika masalasini shu yerga yuborishingiz mumkin — birgalikda yechimini ko'ramiz!`;
    }

    return NextResponse.json({
      reply,
      isRealAi: false,
      engine: 'prepora-adaptive-tutor-v2',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Tutor API Route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
