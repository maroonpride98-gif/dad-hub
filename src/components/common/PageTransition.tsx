import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, transitionKey }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(transitionKey);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (transitionKey !== currentKey) {
      // Fade out
      setIsVisible(false);

      // After fade out, update content and fade in
      const timeout = setTimeout(() => {
        setCurrentKey(transitionKey);
        setDisplayChildren(children);
        setIsVisible(true);
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      setIsVisible(true);
    }
  }, [transitionKey, currentKey, children]);

  // Initial mount
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
