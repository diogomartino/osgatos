import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type TUmamiTrackPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

export type TUmamiWindow = Window & {
  umami?: {
    track: (eventName: string, payload?: TUmamiTrackPayload) => void;
  };
};
