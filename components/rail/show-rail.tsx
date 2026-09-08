import { getFileUrl } from '@/helpers/get-file-url';
import { TShow } from '@/types/db';
import { memo } from 'react';
import { Poster } from '../poster';
import { Rail } from './index';

type TShowRailProps = {
  title: string;
  shows: TShow[];
};

const ShowRail = memo(({ title, shows }: TShowRailProps) => (
  <Rail title={title}>
    {shows.map((show, index) => (
      <li key={show.id} className="rail-item w-[9.5rem] md:w-[12rem]">
        <Poster
          href={`/show/${show.slug}`}
          imageUrl={getFileUrl(show, show.cover)}
          title={show.title}
          priority={index < 4}
        />
      </li>
    ))}
  </Rail>
));
ShowRail.displayName = 'ShowRail';

export { ShowRail };
