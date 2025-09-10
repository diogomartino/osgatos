import { Chip } from '@heroui/chip';
import Link from 'next/link';
import { memo } from 'react';

type TInfoProps = {
  label: string;
  duration: number; // in seconds
  labelHref?: string;
};

const Info = memo(({ label, duration, labelHref }: TInfoProps) => {
  let labelContent = (
    <Chip color="primary" variant="solid">
      {label}
    </Chip>
  );

  if (labelHref) {
    labelContent = <Link href={labelHref}>{labelContent}</Link>;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {labelContent}
      <span className="text-sm opacity-70">•</span>
      <span className="text-sm">{Math.floor(duration / 60)} min</span>
    </div>
  );
});
Info.displayName = 'Info';

export { Info };
