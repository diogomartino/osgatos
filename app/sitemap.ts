import { getSiteUrl, siteConfig } from '@/config/site';
import { getFileUrl } from '@/helpers/get-file-url';
import { getVideoMetadataDescription } from '@/helpers/get-video-metadata-description';
import { getYoutubeId } from '@/helpers/get-youtube-id';
import { getShows } from '@/queries/shows';
import { getAllVideos } from '@/queries/videos';
import type { MetadataRoute } from 'next';

const siteUrl = getSiteUrl();

const getVideosMapping = async (): Promise<MetadataRoute.Sitemap> => {
  const videos = await getAllVideos();

  return videos.map((video) => {
    const youtubeId = getYoutubeId(video.videoUrl);
    const playerLoc = youtubeId
      ? `https://www.youtube.com/embed/${youtubeId}`
      : video.videoUrl;

    return {
      url: `${siteUrl}/watch/${video.id}`,
      lastModified: new Date(video.updated),
      changeFrequency: 'weekly',
      priority: 0.7,
      videos: [
        {
          title: video.title,
          description: getVideoMetadataDescription({
            title: video.title
          }),
          thumbnail_loc:
            getFileUrl(video, video.thumbnail) || siteConfig.defaultOgImage,
          embed_loc: `${siteUrl}/watch/${video.id}`,
          player_loc: playerLoc,
          publication_date: new Date(video.created).toISOString()
        }
      ]
    };
  });
};

const getShowsMapping = async (): Promise<MetadataRoute.Sitemap> => {
  const shows = await getShows();

  return shows.map((show) => ({
    url: `${siteUrl}/show/${show.slug}`,
    lastModified: new Date(show.updated),
    changeFrequency: 'weekly',
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
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    },
    ...videos,
    ...shows
  ];
}
