import React from 'react';
import type { Clue, Lang } from '../../types';

interface ClueSpotlightProps {
  content: string;
  clues: Clue[];
  lang: Lang;
}

/**
 * ClueSpotlight:
 * Highlights and numbers each red flag phrase directly inside the message text,
 * then renders a clean 1-line explanation for each numbered clue underneath.
 */
export const ClueSpotlight: React.FC<ClueSpotlightProps> = ({
  content,
  clues,
  lang,
}) => {
  // Build highlighted markup
  let renderedContent: React.ReactNode = content;

  // Render highlighted elements by replacing clue phrases
  // We sort clues by appearance in content
  const sortedClues = [...clues].sort((a, b) => {
    const idxA = content.indexOf(a.phrase[lang]);
    const idxB = content.indexOf(b.phrase[lang]);
    return idxA - idxB;
  });

  const fragments: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedClues.forEach((clue, idx) => {
    const phrase = clue.phrase[lang];
    const matchIndex = content.indexOf(phrase, lastIndex);
    if (matchIndex !== -1) {
      if (matchIndex > lastIndex) {
        fragments.push(content.slice(lastIndex, matchIndex));
      }
      fragments.push(
        <mark
          key={idx}
          className="relative inline-flex items-center px-1.5 py-0.5 rounded bg-amber-200/90 text-navy-900 font-bold border-b-2 border-check-700"
        >
          <span className="w-4 h-4 rounded-full bg-check-700 text-white text-[10px] flex items-center justify-center font-bold mr-1 shrink-0">
            {idx + 1}
          </span>
          <span>{phrase}</span>
        </mark>,
      );
      lastIndex = matchIndex + phrase.length;
    }
  });

  if (lastIndex < content.length) {
    fragments.push(content.slice(lastIndex));
  }

  return (
    <div className="space-y-3">
      {/* Annotated message body */}
      <div className="bg-sand-50/80 border border-slate-200 rounded-xl p-3.5 text-xs font-body leading-relaxed text-navy-900">
        {fragments.length > 0 ? fragments : content}
      </div>

      {/* Numbered clue explanations */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider text-slate-500 block">
          {lang === 'es' ? 'Explicación de las pistas' : 'Why These Clues Matter'}
        </span>
        {sortedClues.map((clue, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-2 text-xs bg-white border border-slate-200 rounded-lg p-2"
          >
            <span className="w-4 h-4 rounded-full bg-check-700 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-navy-900 mr-1.5">
                "{clue.phrase[lang]}":
              </span>
              <span className="text-slate-700">{clue.why[lang]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
