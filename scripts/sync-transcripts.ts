import { getPb } from '@/helpers/pb';
import { TVideo } from '@/types/db';
import fs from 'fs/promises';
import path from 'path';

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const pb = await getPb();

const videos = await pb.collection('videos').getFullList<TVideo>({
  sort: 'created'
});

console.log(`Fetched ${videos.length} videos from PocketBase.`);

const transcriptsPath = path.join(process.cwd(), 'scripts', 'transcripts');

console.log(`Syncing transcripts in ${transcriptsPath}...`);

let savedCount = 0;

for (const video of videos) {
  const targetTranscript =
    video.transcriptFinal || video.transcriptv2 || video.transcript || '';
  const transcriptFilePath = path.join(transcriptsPath, `${video.id}.txt`);

  if (!(await fileExists(transcriptFilePath))) {
    console.log(
      `Transcript file for video ${video.title} (${video.id}) does not exist. Skipping update...`
    );
    continue;
  }

  const updatedTranscript = await fs.readFile(transcriptFilePath, 'utf-8');

  if (updatedTranscript !== targetTranscript) {
    console.log(
      `Updating transcript for video ${video.title} (${video.id})...`
    );

    try {
      await pb.collection('videos').update(video.id, {
        transcriptFinal: updatedTranscript
      });

      savedCount++;
    } catch (error) {
      console.error(
        `Failed to update transcript for video ${video.title} (${video.id}):`,
        error
      );
    }
  }
}

console.log(`Finished syncing transcripts. Updated ${savedCount} videos.`);
