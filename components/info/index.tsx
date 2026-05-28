import Link from 'next/link';
import { memo } from 'react';

type TInfoProps = {
  label: string;
  duration: number; // in seconds
  labelHref?: string;
};

const Info = memo(({ label, duration, labelHref }: TInfoProps) => {
  let labelContent = (
    <span className="text-foreground text-sm font-medium md:text-[0.95rem]">
      {label}
    </span>
  );

  if (labelHref) {
    labelContent = (
      <Link
        href={labelHref}
        className="hover:text-primary rounded-sm"
        data-interactive="true"
      >
        {labelContent}
      </Link>
    );
  }

  return (
    <div className="text-default-500 flex flex-wrap items-center gap-2.5">
      {labelContent}
      <span className="bg-primary h-1.5 w-1.5 rounded-full" />
      <span className="text-default-500 text-sm">
        {Math.max(1, Math.floor(duration / 60))} min
      </span>
    </div>
  );
});
Info.displayName = 'Info';

export { Info };
