const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;

const getYoutubeId = (url: string | undefined) => {
  if (!url) return '';

  if (youtubeIdPattern.test(url)) return url;

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return parsedUrl.pathname.split('/').filter(Boolean)[0] ?? '';
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsedUrl.searchParams.get('v');

      if (videoId) return videoId;

      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      const videoPathIndex = pathParts.findIndex((part) =>
        ['embed', 'shorts', 'v'].includes(part)
      );

      if (videoPathIndex >= 0) {
        return pathParts[videoPathIndex + 1] ?? '';
      }
    }
  } catch {
    return url.split('/').pop()?.split('?')[0] ?? '';
  }

  return '';
};

export { getYoutubeId };
