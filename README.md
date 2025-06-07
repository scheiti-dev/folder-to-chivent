# folder-to-chivent

A utility to automatically watch a folder for new files and upload them to a Chivent event using the Chivent API. After successful upload, files are moved to an "uploaded" folder.

## Features

- Watches a specified folder for new files (images or others).
- Detects file type and gathers metadata (dimensions, size).
- Requests a signed upload URL from the Chivent API.
- Uploads the file to the provided URL.
- Moves uploaded files to a separate folder to avoid re-uploading.
- Handles authentication with automatic guest token management.

## Processing Steps

1. **Folder Watching:**  
   The app uses [chokidar](https://github.com/paulmillr/chokidar) to monitor the folder specified in `app.config.json` under `WATCH_FOLDER`.

2. **File Detection:**  
   When a new file is added, its MIME type and metadata (such as image dimensions) are determined.

3. **Upload Preparation:**  
   The app requests a signed upload URL from the Chivent API, providing file details.

4. **File Upload:**  
   The file is uploaded directly to the signed URL.

5. **Post-Upload Handling:**  
   On success, the file is moved to the folder specified by `UPLOADED_FOLDER` in `app.config.json`.

6. **Authentication:**  
   The app manages a guest token for API authentication, refreshing it as needed.

## Installation

1. **Install [Bun](https://bun.sh/):**  
   Follow the instructions on the [Bun website](https://bun.sh/) to install Bun if you haven't already.

2. **Clone this repository:**  
   ```sh
   git clone <your-repo-url>
   cd folder-to-chivent
   ```

3. **Install dependencies:**  
   ```sh
   bun install
   ```

## Configuration

Edit `app.config.json` to set your event ID, watched folder, and uploaded folder:

```json
{
  "EVENT_ID": "your_event_id",
  "UPLOADED_FOLDER": "./uploaded",
  "WATCH_FOLDER": "./watched-folder"
}
```

- `EVENT_ID`: The Chivent event ID to upload files to.
- `UPLOADED_FOLDER`: Where uploaded files will be moved.
- `WATCH_FOLDER`: The folder to watch for new files.

## Usage

Start the watcher with Bun:

```sh
bun run index.ts
```

- The app will print logs as it detects, uploads, and moves files.
- Ensure the watched and uploaded folders exist or will be created by the app.

## Notes

- Only new files added to the watched folder will be processed.
- Requires internet access to communicate with the Chivent API.
- Handles images and other file types, but metadata is extracted for images only.

## Releases

To build the application into a standalone executable with Bun, follow the [Bun bundler guide](https://bun.sh/docs/bundler/executables). Currently, only a Windows build is provided in the releases.

## Contributing

I'm happy to receive pull requests! Contributions, bug reports, and suggestions are welcome.