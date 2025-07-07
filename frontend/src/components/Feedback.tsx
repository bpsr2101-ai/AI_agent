import React, { useState } from 'react';

interface FeedbackProps {
  sessionId: string;
  question: string;
  answer: string;
}

const Feedback: React.FC<FeedbackProps> = ({ sessionId, question, answer }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const sendFeedback = async (feedback: 'positive' | 'negative') => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, question, answer, feedback }),
      });
      setSubmitted(true);
    } catch (e) {
      setError('Could not send feedback.');
    }
  };

  if (submitted) return <div className="text-xs text-green-600 mt-1">Thank you for your feedback!</div>;

  return (
    <div className="flex gap-2 mt-1 text-lg">
      <button onClick={() => sendFeedback('positive')} aria-label="Thumbs up" className="hover:text-green-600">👍</button>
      <button onClick={() => sendFeedback('negative')} aria-label="Thumbs down" className="hover:text-red-600">👎</button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};

export default Feedback; 