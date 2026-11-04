'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ExamEngine from '@/components/ExamEngine';
import AudioPlayer from '@/components/AudioPlayer';
import { ieltsListeningQuestions } from '@/data/ieltsQuestions';

export default function IeltsListeningPage() {
  const [currentPart, setCurrentPart] = useState<number>(1);

  // Group audio script for the active part
  const partScripts: Record<number, string> = {
    1: `Office Clerk: Good morning! Welcome to the Greenfield Cycling Club office. How can I assist you today?
Caller: Hello, I saw an advertisement in the local paper about weekend tours and I would like to register.
Office Clerk: Excellent. We offer three tiers of rides: Beginner, Intermediate, and Advanced. Which group fits your current fitness level?
Caller: Well, I have been cycling regularly for about two years, so Intermediate would be ideal.
Office Clerk: Our weekend rides depart promptly at 8:30 AM. We gather every Saturday morning right beside the old windmill in North Park.
Office Clerk: For safety reasons, all participants must wear an approved protective helmet and have functioning front and rear lights fitted on their bikes.
Caller: And how much does annual membership cost?
Office Clerk: It is normally fifty pounds, but this month we have a promotion, so standard annual membership is forty-five pounds. Also, with our official club badge, Pedal Works downtown gives all active members fifteen percent off all replacement parts and servicing.
Office Clerk: Could I have an emergency contact number?
Caller: Certainly, it is 07700 900482, my brother Mark.
Office Clerk: Our next big excursion is the autumn foliage ride, scheduled for the fourteenth of October. We will follow the scenic 30-kilometre loop around Lake Derwent, that is D-E-R-W-E-N-T.
Caller: I will use the online debit card portal you mentioned, thank you.`,
    2: `Curator: Welcome to the preview tour of the newly refurbished Maritime Heritage Centre! Over the past eighteen months, our primary goal was not merely cosmetic, but transforming historical archives into hands-on interactive galleries for families and schools.
While all open galleries are accessible freely with general admission, please note that the Deep-Sea Submersible Simulator has strict capacity limits and requires a complimentary advance booking pass.
On the mezzanine floor, our waterfront bistro serves sustainably caught seafood sourced directly each morning from Cornish harbors. Regarding ticket pricing, children under five enter completely free, while students receive a forty percent reduction.
At the central info desk, visitors can borrow audio headsets translated into eight languages, including French, Mandarin, and Spanish. Looking out into the central plaza, the newly constructed gift shop is situated directly adjacent to the historic courtyard fountain.
In addition, every Thursday evening, the Great Timber Hall will host acoustic maritime concerts and lectures from renowned marine biologists. If anyone in the community wishes to get involved, we are recruiting volunteer guides specifically for our weekend knot-tying and ropework workshops.
Accessibility was paramount. For visually impaired patrons, every primary exhibit incorporates tactile relief maps, braille placards, and touchable 3D scale models.
Lastly, parking behind the east wing is validated free of charge for the first two hours upon stamping your ticket at our front desk.`,
    3: `Professor Hall: Welcome, Liam and Sarah. Let us discuss your seminar paper draft.
Liam: Thanks, Professor Hall. As you know, our paper focuses on vertical hydroponic farming in arid urban areas.
Sarah: The water figures were astonishing. Our closed-loop recycled irrigation systems saved ninety percent of freshwater compared to traditional open fields.
Liam: However, the commercial barrier remains capital expenditure, particularly high-efficiency horticultural LED lighting arrays and HVAC chillers.
Professor Hall: To strengthen your empirical evidence, I strongly advise adding a detailed case study from Singapore, where high land values accelerated commercial vertical adoption. In Section Three, you relied too heavily on marketing whitepapers published by hydroponic apparatus manufacturers. You must cross-reference peer-reviewed agronomy journals.
Sarah: Exactly. We also tracked geochemical nutrient solution parameters, ensuring the pH consistently remained between 5.5 and 6.5 to prevent mineral lockout. Liam will analyze the crop yields per square meter, while I take charge of synthesizing the comprehensive carbon footprint calculations.
Professor Hall: Make sure your revised draft is uploaded to the portal by next Tuesday at 5:00 PM sharp. And keep in mind for the symposium, presentations cannot exceed fifteen minutes, followed by five minutes of Q&A.`,
    4: `Lecturer: Good morning, ladies and gentlemen. Today we explore deep-ocean biology, specifically bioluminescence. Chemically, it is the emission of cold light generated by a biochemical reaction within living organisms.
The reaction involves two key biochemical components: a substrate molecule named luciferin, and a protein catalyst known as luciferase.
Remarkably, this is considered cold light; almost ninety-eight percent of the chemical energy is emitted as visible luminescence, radiating virtually zero wasted thermal heat.
One extraordinary evolutionary adaptation is counter-illumination. Midwater squids emit light from ventral photophores that matches the intensity and wavelength of downwelling sunlight from the surface, effectively eliminating their shadow from predators beneath.
The deep-sea anglerfish utilizes a fleshy bulbous lure at the tip of a modified dorsal spine, termed the esca, inhabited by symbiotic bioluminescent bacteria.
In surface coastal waters, single-celled dinoflagellates generate brilliant blue sparkling displays when subjected to mechanical stress, such as breaking waves or swimming marine mammals.
Beyond marine ecology, these bioluminescent enzymes revolutionized modern biotechnology. Green fluorescent proteins act as optical biological markers, allowing cancer oncologists to observe cellular division in real time.
Why are roughly eighty percent of ocean emissions in the blue-green spectrum? Because water absorbs longer red wavelengths quickly, whereas blue-green light transmits the furthest distance through deep seawater.
A fascinating exception is the deep-sea dragonfish Malacosteus, which produces far-red light. Since virtually all its prey species lack red photoreceptors, it acts like a covert sniper scope.
Looking forward, architectural bio-engineers are researching transgenic autoluminescent flora capable of illuminating urban highways, potentially replacing carbon-intensive municipal street lighting.`,
  };

  const audioComponent = (
    <div className="space-y-4">
      {/* Part tabs */}
      <div className="flex items-center gap-2 pb-2">
        {[1, 2, 3, 4].map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPart(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              currentPart === p
                ? 'bg-blue-950 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-blue-950'
            }`}
          >
            Part {p} Audio
          </button>
        ))}
      </div>

      <AudioPlayer
        title={`IELTS Listening Section Part ${currentPart}`}
        partNumber={currentPart}
        script={partScripts[currentPart]}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-blue-950 flex flex-col">
      <ExamEngine
        title="IELTS Official Listening Practice (40 Questions)"
        exam="IELTS"
        sectionName="listening"
        questions={ieltsListeningQuestions}
        timeLimitMinutes={30}
        audioPlayerComponent={audioComponent}
      />
    </div>
  );
}
