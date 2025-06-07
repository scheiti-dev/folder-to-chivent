import chokidar from 'chokidar';
import { uploadFile } from './uploader.js';

export async function startWatcher() {
  const config = await Bun.file("./app.config.json").json();
  console.log(`👀 Watching folder: ${config.WATCH_FOLDER}`);

  chokidar.watch(config.WATCH_FOLDER, { awaitWriteFinish: true }).on('add', async (filePath) => {
    console.log(`📸 New file detected: ${filePath}`);
    await uploadFile(filePath, config);
  });
}