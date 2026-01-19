import React, { useState, useEffect } from 'react';

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
}

interface ReactionAnimationProps {
  emoji: string;
  onComplete?: () => void;
}

export const ReactionAnimation: React.FC<ReactionAnimationProps> = ({
  emoji,
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '64px',
        animation: 'heartBeat 0.5s ease-in-out, floatUp 1s ease-out 0.5s forwards',
        pointerEvents: 'none',
        zIndex: 400,
      }}
    >
      {emoji}
    </div>
  );
};

// Multiple floating reactions
export const FloatingReactions: React.FC<{
  reactions: FloatingReaction[];
  onRemove: (id: string) => void;
}> = ({ reactions, onRemove }) => {
  useEffect(() => {
    reactions.forEach((reaction) => {
      const timer = setTimeout(() => {
        onRemove(reaction.id);
      }, 1500);
      return () => clearTimeout(timer);
    });
  }, [reactions, onRemove]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 400,
        overflow: 'hidden',
      }}
    >
      {reactions.map((reaction) => (
        <div
          key={reaction.id}
          style={{
            position: 'absolute',
            bottom: '100px',
            left: `${reaction.x}%`,
            fontSize: '32px',
            animation: 'floatUp 1.5s ease-out forwards',
          }}
        >
          {reaction.emoji}
        </div>
      ))}
    </div>
  );
};

// Hook for managing floating reactions
export function useFloatingReactions() {
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  const addReaction = (emoji: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = 20 + Math.random() * 60; // Random position between 20-80%

    setReactions((prev) => [...prev, { id, emoji, x }]);
  };

  const removeReaction = (id: string) => {
    setReactions((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    reactions,
    addReaction,
    removeReaction,
  };
}
