# Changelog

## [1.0.0] - 2024-06-07

### Added
- Initial release of `folder-to-chivent`.
- Watches a specified folder for new files using `chokidar`.
- Detects file type and gathers metadata (dimensions, size).
- Requests signed upload URLs from the Chivent API.
- Uploads files to the provided signed URLs.
- Moves successfully uploaded files to a separate folder.
- Handles authentication with automatic guest token management.
- Configuration via `app.config.json`.
- Logging for all major steps and errors.
