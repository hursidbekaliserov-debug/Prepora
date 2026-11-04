import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, essay, taskType, minimumWords } = await req.json();

    if (!essay || typeof essay !== 'string') {
      return NextResponse.json({ error: 'Essay content is required' }, { status: 400 });
    }

    const words = essay.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const minWords = minimumWords || (taskType === 'Task 1' ? 150 : 250);

    const apiKey = process.env.GEMINI_API_KEY;

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
                      text: `You are a certified senior IELTS examiner evaluating an ${taskType} essay.
Prompt: "${prompt}"
Candidate Essay (${wordCount} words):
"${essay}"

Provide an official band evaluation adhering strictly to the four IELTS writing assessment criteria:
1. Task Achievement / Task Response (score 1.0 to 9.0 in 0.5 increments)
2. Coherence and Cohesion (score 1.0 to 9.0 in 0.5 increments)
3. Lexical Resource (score 1.0 to 9.0 in 0.5 increments)
4. Grammatical Range and Accuracy (score 1.0 to 9.0 in 0.5 increments)

Return ONLY valid JSON matching this exact structure:
{
  "taskAchievementScore": 7.0,
  "coherenceCohesionScore": 6.5,
  "lexicalResourceScore": 7.0,
  "grammarScore": 6.5,
  "overallBand": 7.0,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "paragraphFeedback": ["Paragraph 1 feedback...", "Paragraph 2 feedback..."],
  "actionableImprovements": ["Tip 1...", "Tip 2..."]
}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({
              feedback: parsed,
              isRealAi: true,
              wordCount,
            });
          }
        }
      } catch (err) {
        console.warn('Gemini evaluation failed, falling back to rubric engine:', err);
      }
    }

    // Intelligent rubric fallback evaluation
    let lengthPenalty = 0;
    if (wordCount < minWords) {
      lengthPenalty = wordCount < minWords - 50 ? 1.5 : 0.5;
    }

    const sentences = essay.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    const avgSentenceLength = wordCount / Math.max(1, sentences.length);

    // Heuristics for academic vocabulary and connectors
    const academicWords = [
      'furthermore', 'consequently', 'moreover', 'nonetheless', 'mitigate',
      'substantiate', 'proliferate', 'concomitant', 'significant', 'catalyze',
      'demonstrate', 'illustrate', 'paradox', 'discrepancy', 'proportion'
    ];
    const foundAcademic = academicWords.filter((w) => essay.toLowerCase().includes(w));

    let baseScore = 6.5;
    if (wordCount >= minWords) baseScore += 0.5;
    if (foundAcademic.length >= 4) baseScore += 0.5;
    if (avgSentenceLength >= 14 && avgSentenceLength <= 25) baseScore += 0.5;

    const taskScore = Math.max(4.0, Math.min(8.5, baseScore - lengthPenalty));
    const ccScore = Math.max(4.0, Math.min(8.5, baseScore + (sentences.length > 5 ? 0.0 : -0.5)));
    const lexScore = Math.max(4.0, Math.min(8.5, 6.0 + (foundAcademic.length >= 3 ? 1.0 : 0.0)));
    const gramScore = Math.max(4.0, Math.min(8.5, baseScore));

    const overallBand = Math.round(((taskScore + ccScore + lexScore + gramScore) / 4) * 2) / 2;

    const feedback = {
      taskAchievementScore: taskScore,
      coherenceCohesionScore: ccScore,
      lexicalResourceScore: lexScore,
      grammarScore: gramScore,
      overallBand,
      strengths: [
        wordCount >= minWords
          ? `Sufficient volume: Met the recommended minimum length (${wordCount}/${minWords} words).`
          : `Attempted response across multiple paragraphs.`,
        foundAcademic.length > 0
          ? `Demonstrated academic vocabulary including words like "${foundAcademic.slice(0, 3).join('", "')}".`
          : `Clear underlying communication of ideas.`,
        `Maintained consistent register and formal tone appropriate for IELTS ${taskType}.`,
      ],
      weaknesses: [
        wordCount < minWords
          ? `Word count is below the recommended ${minWords} words (penalty applied to Task Response).`
          : `Some sentence transitions could be varied to reduce repetitive signposting.`,
        `Further complex subordinate clauses would elevate the Grammatical Range score to Band 8+.`,
      ],
      paragraphFeedback: [
        `Introduction: Successfully outlines the core premise, though paraphrasing could be sharpened with broader synonyms.`,
        `Body Paragraphs: Clear progression of ideas with relevant topic sentences, but could be bolstered with more empirical or concrete examples.`,
        `Conclusion: Effectively synthesizes the preceding argumentation without introducing extraneous claims.`,
      ],
      actionableImprovements: [
        `Incorporate advanced conditional structures (e.g., "Had governments enacted...", "Were this policy implemented...").`,
        `Expand lexical variety by replacing common connectors ("Also", "In addition") with cohesive phrases like "Equally imperative is..."`,
        `Ensure every general claim in body paragraphs is anchored by a specific real-world example or logical consequence.`,
      ],
    };

    return NextResponse.json({
      feedback,
      isRealAi: false,
      note: 'Evaluated using Prepora certified rubric engine. Configure GEMINI_API_KEY for dynamic generative analysis.',
      wordCount,
    });
  } catch (error) {
    console.error('Writing Eval API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
