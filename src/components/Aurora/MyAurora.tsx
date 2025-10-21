'use client';
import Aurora from './Aurora';

export function MyAurora() {
  return (
    <Aurora
      colorStops={['#00E5FF', '#BEDBFF', '#00E5FF']}
      blend={0.3}
      amplitude={0.8}
      speed={1}
    />
  );
}
