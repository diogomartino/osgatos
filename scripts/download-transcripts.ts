import { getPb } from '@/helpers/pb';
import { TVideo } from '@/types/db';
import fs from 'fs/promises';
import path from 'path';

const pb = await getPb();

const videos = await pb.collection('videos').getFullList<TVideo>({
  sort: 'created'
});

console.log(`Fetched ${videos.length} videos from PocketBase.`);

const transcriptsPath = path.join(process.cwd(), 'scripts', 'transcripts');

await fs.mkdir(transcriptsPath, { recursive: true });

console.log(`Saving transcripts to ${transcriptsPath}...`);

for (const video of videos) {
  const targetTranscript =
    video.transcriptFinal || video.transcriptv2 || video.transcript || '';

  try {
    await fs.writeFile(
      path.join(transcriptsPath, `${video.id}.txt`),
      targetTranscript
    );

    console.log(`Saved transcript for video ${video.title} (${video.id}).`);
  } catch (error) {
    console.error(
      `Failed to save transcript for video ${video.title} (${video.id}):`,
      error
    );
  }
}
