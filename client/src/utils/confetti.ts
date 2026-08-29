import confetti from 'canvas-confetti';

export function fireVictoryConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-stage confetti burst
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#38BDF8', '#06B6D4', '#0284C7', '#F59E0B'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#FB7185', '#F43F5E', '#E11D48', '#8B5CF6'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#10B981', '#38BDF8', '#F59E0B', '#FFFFFF'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
