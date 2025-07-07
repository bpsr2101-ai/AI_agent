import React from 'react';

interface Citation {
  source: string;
  snippet: string;
}

const Citations: React.FC<{ citations: Citation[] }> = ({ citations }) => {
  if (!citations || citations.length === 0) return null;
  return (
    <div className="mt-2 text-xs text-gray-600">
      <div className="font-semibold">Citations:</div>
      <ul className="list-disc ml-5">
        {citations.map((c, i) => (
          <li key={i} className="mb-1">
            <span className="font-mono bg-gray-200 px-1 rounded">{c.source}</span>: {c.snippet}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Citations; 