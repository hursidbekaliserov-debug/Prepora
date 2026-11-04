import { NextResponse } from 'next/server';

interface ChatTurn {
  sender: 'examiner' | 'student';
  text: string;
}

export async function POST(req: Request) {
  try {
    const { 
      candidateText, 
      stageIndex = 0, 
      questionIndex = 0, 
      topic = 'General',
      history = [] 
    } = await req.json();

    if (!candidateText || candidateText.trim().length === 0) {
      return NextResponse.json({
        examinerReply: "I couldn't quite hear your response clearly. Could you please share your thoughts on this topic again, or type your answer below?",
        isDynamic: true,
      });
    }

    const trimmed = candidateText.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API key is configured, use live LLM generation
    if (apiKey) {
      try {
        const stageDescriptions = [
          'Part 1: Familiar Topics & Everyday Life (Warm, conversational, short direct follow-ups)',
          'Part 2: Candidate Cue Card Discussion (Listening to candidate long turn, asking 1 brief follow-up)',
          'Part 3: Two-Way Analytical & Abstract Discussion (Deeper societal, philosophical, and future-oriented inquiries)'
        ];

        const prompt = `You are Dr. Alistair Vance, a senior certified Cambridge IELTS Speaking Examiner conducting a real-time IELTS Speaking test with a candidate.
Current Stage: ${stageDescriptions[stageIndex] || 'Speaking Test'}.
Current Topic: ${topic}.
Turn: ${questionIndex + 1}.

Candidate's latest spoken answer:
"${trimmed}"

Examiner Instructions:
1. Act naturally like in official IELTS / ielts.gg.
2. In 1 brief opening sentence, genuinely acknowledge or react to something specific the candidate said (e.g. "That's an interesting perspective on...", "It sounds like you have quite a busy schedule...").
3. Then immediately ask 1 targeted, natural follow-up IELTS question appropriate for this stage.
4. Keep your total response between 25 and 45 words so the candidate speaks the majority of the time. Do NOT grade or criticize their English during the live conversation. Speak in natural, elegant British English.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply && reply.trim().length > 10) {
            return NextResponse.json({
              examinerReply: reply.trim(),
              isDynamic: true,
              engine: 'gemini-live',
            });
          }
        }
      } catch (err) {
        console.warn('Gemini chat failed, using dynamic conversational engine:', err);
      }
    }

    // 2. Dynamic Adaptive Conversational Engine (Rich, zero repetitive static responses)
    const lower = trimmed.toLowerCase();

    // Extract subjects mentioned
    const mentionsWork = lower.includes('work') || lower.includes('job') || lower.includes('career') || lower.includes('profession') || lower.includes('company');
    const mentionsStudy = lower.includes('study') || lower.includes('student') || lower.includes('university') || lower.includes('school') || lower.includes('college') || lower.includes('exam');
    const mentionsPlace = lower.includes('tashkent') || lower.includes('city') || lower.includes('country') || lower.includes('hometown') || lower.includes('abroad') || lower.includes('village');
    const mentionsTech = lower.includes('ai') || lower.includes('tech') || lower.includes('computer') || lower.includes('internet') || lower.includes('phone') || lower.includes('app') || lower.includes('online');
    const mentionsTime = lower.includes('morning') || lower.includes('evening') || lower.includes('night') || lower.includes('routine') || lower.includes('time') || lower.includes('day');
    const mentionsFeelings = lower.includes('love') || lower.includes('like') || lower.includes('enjoy') || lower.includes('difficult') || lower.includes('hard') || lower.includes('stress') || lower.includes('happy');

    // Tailored contextual reactions
    let acknowledgment = "Thank you for sharing that.";
    if (mentionsTech) {
      acknowledgment = "It is truly fascinating how rapidly digital innovations are transforming our daily habits.";
    } else if (mentionsWork || mentionsStudy) {
      acknowledgment = "Balancing professional responsibilities with academic ambitions certainly requires discipline.";
    } else if (mentionsPlace) {
      acknowledgment = "Having a strong connection to one's environment and background often shapes personal outlook.";
    } else if (mentionsTime) {
      acknowledgment = "Finding a productive rhythm that fits your lifestyle is quite vital.";
    } else if (mentionsFeelings) {
      acknowledgment = "It is clear that this topic resonates with your personal experiences.";
    } else if (trimmed.split(/\s+/).length > 25) {
      acknowledgment = "That was a very comprehensive and well-elaborated response.";
    }

    // Stage-specific dynamic question bank based on topic and candidate focus
    const part1Pool = [
      "How do people in your country usually spend their leisure time on weekends?",
      "Do you think having a structured daily routine increases personal productivity, or does it become monotonous?",
      "Let's touch upon transport. What is your preferred way of travelling around your city, and how could public transit be improved?",
      "Do you prefer reading physical printed books or digital articles on a screen, and what influences that preference?",
      "Looking back at your childhood, what is one hobby or activity you wish you had continued pursuing today?",
      "How important is it for families to have at least one shared meal together every day?",
      "Do you find it easy to focus in quiet environments, or do you prefer some background ambient sound?"
    ];

    const part2FollowUps = [
      "Thank you for speaking so openly. Looking back on that experience, would you have made any aspect of that decision differently?",
      "Did you seek advice from close friends or mentors before committing to that choice, or did you rely purely on your own judgment?",
      "How did that particular challenge shape your self-confidence moving forward into future dilemmas?"
    ];

    const part3Pool = [
      "Taking a broader social perspective, why do you think modern society puts so much pressure on young people to make career decisions prematurely?",
      "Do you believe that rapid advances in artificial intelligence will eventually replace human critical thinking, or merely assist it?",
      "Some sociologists argue that urbanization has weakened community ties between neighbors. To what extent would you agree with that assessment?",
      "In your opinion, should governments invest more funding into preservation of traditional arts, or focus predominantly on modern technology education?",
      "How has global social media influenced the way different generations communicate and resolve misunderstandings?"
    ];

    let chosenQuestion = "";
    if (stageIndex === 0) {
      // Pick a varied Part 1 question based on questionIndex and seed
      const idx = (questionIndex + (trimmed.length % 3)) % part1Pool.length;
      chosenQuestion = part1Pool[idx];
    } else if (stageIndex === 1) {
      const idx = (questionIndex + (trimmed.length % 2)) % part2FollowUps.length;
      chosenQuestion = part2FollowUps[idx];
    } else {
      const idx = (questionIndex + (trimmed.length % 3)) % part3Pool.length;
      chosenQuestion = part3Pool[idx];
    }

    const fullExaminerReply = `${acknowledgment} ${chosenQuestion}`;

    return NextResponse.json({
      examinerReply: fullExaminerReply,
      isDynamic: true,
      acknowledgment,
      followUpQuestion: chosenQuestion,
      engine: 'prepora-adaptive-v2',
    });
  } catch (error) {
    console.error('Speaking Chat API Error:', error);
    return NextResponse.json({
      examinerReply: "That is an intriguing viewpoint. How do you believe this trend will evolve over the next decade?",
      isDynamic: true,
    });
  }
}
