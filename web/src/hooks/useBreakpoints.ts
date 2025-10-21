import { useEffect, useState } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoints() {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const current = (
    Object.keys(breakpoints) as BreakpointKey[]
  ).reduce<BreakpointKey>(
    (acc, key) => (width >= breakpoints[key] ? key : acc),
    'sm',
  );

  return {
    width,
    breakpoint: current,
    isSm: width >= breakpoints.sm && width < breakpoints.md,
    isMd: width >= breakpoints.md && width < breakpoints.lg,
    isLg: width >= breakpoints.lg && width < breakpoints.xl,
    isXl: width >= breakpoints.xl && width < breakpoints['2xl'],
    is2xl: width >= breakpoints['2xl'],
  };
}
