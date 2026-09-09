import type { TUmamiTrackPayload, TUmamiWindow } from '@/types';

const track = (event: string, payload?: TUmamiTrackPayload) => {
  if (typeof window === 'undefined') return;

  (window as TUmamiWindow).umami?.track(event, payload);
};

export { track };
