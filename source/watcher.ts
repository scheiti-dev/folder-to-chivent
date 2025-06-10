import chokidar from 'chokidar';
import { uploadFile } from './uploader.js';
import { Configuration } from './configuration.js';

export async function startWatcher() {
  const configuration = await Configuration.getInstance();
  console.log(`👀 Watching folder: ${configuration.watchFolder}`);

  chokidar.watch(configuration.watchFolder, { awaitWriteFinish: true }).on('add', async (filePath) => {
    console.log(`📸 New file detected: ${filePath}`);
    await uploadFile(filePath);
  });
}