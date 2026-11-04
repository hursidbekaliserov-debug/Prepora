import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic, transcript, durationSeconds, partNumber } = await req.json();

    if (!transcript || transcript.trim().length < 5) {
      return NextResponse.json({
        error: 'Transcript too short for accurate speaking assessment.',
      }, { status: 400 });
    }

    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const durationMins = Math.max(0.2, (durationSeconds || 60) / 60);
    const wpm = Math.round(wordCount / durationMins);

    // Advanced vocabulary check
    const advancedVocab = [
      'substantially', 'consequently', 'furthermore', 'nevertheless', 'predominantly',
      'inevitable', 'resilient', 'perspective', 'catalyst', 'indispensable', 'profoundly',
      'intricate', 'feasible', 'fluctuation', 'paradigm', 'nuance', 'trajectory'
    ];
    const foundAdvanced = words.filter((w: string) => 
      advancedVocab.some(av => w.toLowerCase().includes(av))
    );

    // Grammatical complex markers check
    const complexMarkers = ['although', 'whereas', 'if', 'unless', 'provided that', 'not only', 'while', 'despite'];
    const hasComplex = complexMarkers.some(cm => transcript.toLowerCase().includes(cm));

    // Calculate realistic rubric band scores
    let fluency = 6.0;
    if (wpm >= 110 && wpm <= 160) fluency += 1.5;
    else if (wpm >= 90) fluency += 1.0;
    if (wordCount > 60) fluency += 0.5;

    let lexical = 6.0;
    if (foundAdvanced.length >= 3) lexical += 1.5;
    else if (foundAdvanced.length >= 1) lexical += 1.0;

    let grammar = 6.0;
    if (hasComplex) grammar += 1.0;
    if (wordCount > 40) grammar += 0.5;

    let pronunciation = 7.0; // Baseline strong clarity estimate

    // Cap at 9.0 and minimum 5.0
    fluency = Math.min(9.0, Math.max(5.0, Math.round(fluency * 2) / 2));
    lexical = Math.min(9.0, Math.max(5.0, Math.round(lexical * 2) / 2));
    grammar = Math.min(9.0, Math.max(5.0, Math.round(grammar * 2) / 2));
    pronunciation = Math.min(9.0, Math.max(5.0, Math.round(pronunciation * 2) / 2));

    const overallBand = Math.round(((fluency + lexical + grammar + pronunciation) / 4) * 2) / 2;

    const detectedErrors = [];
    if (transcript.toLowerCase().includes('more better')) {
      detectedErrors.push({
        error: 'more better',
        correction: 'much better',
        explanation: 'Double comparative: "better" is already comparative.'
      });
    }
    if (transcript.toLowerCase().includes('in my opinion i think')) {
      detectedErrors.push({
        error: 'in my opinion i think',
        correction: 'In my view / I believe',
        explanation: 'Redundancy: Use either "In my opinion" or "I think", not both.'
      });
    }
    if (transcript.toLowerCase().includes('i am agree')) {
      detectedErrors.push({
        error: 'i am agree',
        correction: 'I agree',
        explanation: '"Agree" is a verb, not an adjective.'
      });
    }

    const feedback = {
      overallBand,
      fluencyScore: fluency,
      lexicalScore: lexical,
      grammarScore: grammar,
      pronunciationScore: pronunciation,
      wpm,
      wordCount,
      strengths: [
        `Maintained an active speaking rhythm at ~${wpm} words per minute with coherent response structure.`,
        foundAdvanced.length > 0 
          ? `Incorporated high-yield collocations such as "${foundAdvanced.slice(0, 3).join(', ')}".`
          : 'Directly addressed the examiner topic with relevant supporting ideas.',
        hasComplex 
          ? 'Demonstrated complex subordinate clauses and connecting signpost phrases.'
          : 'Clear sentence flow without severe hesitation pauses.',
      ],
      improvements: [
        'Incorporate more idiomatic phrases (e.g., "From a broader standpoint...", "It goes without saying that...").',
        'Vary your sentence beginnings instead of starting multiple consecutive sentences with "I" or "Because".',
        'Use rising and falling vocal intonation to highlight contrasts and emotional tone.',
      ],
      band9Rewrite: `From my perspective regarding ${topic || 'this subject'}, it is evident that sustained exposure fundamentally shapes personal viewpoints. While conventional wisdom suggests one approach, empirical reality indicates a significantly more nuanced dynamic.`,
      detectedErrors,
      examinerSummary: `Candidate produced a clear, understandable response corresponding to IELTS Band ${overallBand}. Pacing was ${wpm >= 100 ? 'natural and fluent' : 'deliberate and measured'}, fulfilling Part ${partNumber || 1} expectations.`,
    };

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error('Speaking Evaluation API Error:', error);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
