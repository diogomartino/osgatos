'use client';

import { track } from '@/helpers/track';
import type { TUmamiTrackPayload } from '@/types';
import Link from 'next/link';
import { ReactNode } from 'react';

type TTrackedLinkProps = {
  href: string;
  event: string;
  payload?: TUmamiTrackPayload;
  className?: string;
  children: ReactNode;
};

/** Lets server-rendered links report a click without going client-side. */
const TrackedLink = ({
  href,
  event,
  payload,
  className,
  children
}: TTrackedLinkProps) => (
  <Link href={href} className={className} onClick={() => track(event, payload)}>
    {children}
  </Link>
);

export { TrackedLink };
