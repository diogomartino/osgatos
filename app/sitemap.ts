import { getFileUrl } from '@/helpers/get-file-url';
import { getShows } from '@/queries/shows';
import { getAllVideos } from '@/queries/videos';
import type { MetadataRoute } from 'next';

const getVideosMapping = async (): Promise<MetadataRoute.Sitemap> => {
  const videos = await getAllVideos();

  return videos.map((video) => {
    const youtubeId = video.videoUrl.split('/').pop();

    console.log('caralho', getFileUrl(video, video.thumbnail));

    return {
      url: `${process.env.NEXT_PUBLIC_URL}/watch/${video.id}`,
      lastModified: new Date(video.updated),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      videos: [
        {
          title: video.title,
          description: video.transcript.slice(0, 160),
          thumbnail_loc: getFileUrl(video, video.thumbnail),
          embed_loc: `${process.env.NEXT_PUBLIC_URL}/watch/${video.id}`,
          player_loc: `https://www.youtube.com/embed/${youtubeId}`,
          publication_date: new Date(video.created).toISOString()
        }
      ]
    };
  });
};

const getShowsMapping = async (): Promise<MetadataRoute.Sitemap> => {
  const shows = await getShows();

  return shows.map((show) => ({
    url: `${process.env.NEXT_PUBLIC_URL}/show/${show.slug}`,
    lastModified: new Date(show.updated),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [videos, shows] = await Promise.all([
    getVideosMapping(),
    getShowsMapping()
  ]);

  return [
    {
      url: process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1
    },
    ...videos,
    ...shows
  ];
}
