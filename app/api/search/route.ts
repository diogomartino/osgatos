import { searchVideos } from '@/queries/search';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';

  return Response.json(await searchVideos(query));
}
