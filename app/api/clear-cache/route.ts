import { CacheKey } from '@/statics';
import { revalidateTag } from 'next/cache';

const serverKey = process.env.CLEAR_CACHE_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key && serverKey && key === serverKey) {
    Object.values(CacheKey).forEach((tag) => {
      console.log('revalidating tag:', tag);

      revalidateTag(tag);
    });

    return Response.json({ success: true });
  }

  return Response.json({ success: false, lol: process.env });
}
