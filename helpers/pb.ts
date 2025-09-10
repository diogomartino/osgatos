import PocketBase from 'pocketbase';
import 'server-only';

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);

// just to make nextjs shut the fuck up
pb.autoCancellation(false);

const authenticated = false;

const getPb = async () => {
  if (!authenticated) {
    await pb
      .collection('_superusers')
      .authWithPassword(process.env.PB_USERNAME!, process.env.PB_PASSWORD!);
  }

  return pb;
};

export { getPb };
