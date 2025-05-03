import { useRef, useState, useEffect } from 'react';

const useSoundEffects = () => {
  const [enabled, setEnabled] = useState(true);

  const sounds = useRef({
    button: new Audio('/sounds/button-click.mp3'),
    start: new Audio('/sounds/game-start.mp3'),
    gameOver: new Audio('/sounds/game-over.mp3'),
    correct: new Audio('/sounds/correct-answer.mp3'),
    wrong: new Audio('/sounds/wrong-answer.mp3'),
  });

  // Preload sounds on mount
  useEffect(() => {
    Object.values(sounds.current).forEach(audio => {
      audio.preload = 'auto';
      audio.load();
    });
  }, []);

  const play = (type: keyof typeof sounds.current) => {
    if (!enabled) return;
    const sound = sounds.current[type];
    if (sound) {
      sound.pause();             // Stop if still playing
      sound.currentTime = 0;     // Reset
      sound.play().catch(err => console.error(`Failed to play sound '${type}':`, err));
    }
  };

  const toggle = () => setEnabled(prev => !prev);

  return { play, enabled, toggle };
};

export default useSoundEffects;
