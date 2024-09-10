# MarkSnap: Instant Image-to-Markdown Converter

MarkSnap is a user-friendly web application designed to speed up the workflow of technical writers, bloggers, and documentation specialists. It allows users to instantly convert images into markdown syntax, saving time and improving productivity in content creation processes.

## Features

- **Drag-and-Drop Upload**: Easily upload multiple images with a simple drag-and-drop interface.
- **Instant Markdown Conversion**: Automatically generates markdown syntax for uploaded images.
- **Bulk Processing**: Handle multiple images at once for efficient workflow.
- **Custom Captions**: Add and edit captions for each image directly in the app.
- **Preview Functionality**: See how your markdown will render in real-time.
- **Copy-to-Clipboard**: One-click copying of generated markdown for easy integration into your documents.
- **Image Hosting**: Automatic uploading to Imgur for hassle-free image hosting.
- **History Tracking**: Keep track of your recently uploaded images for quick access.
- **Responsive Design**: Seamless experience across desktop and mobile devices.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Imgur API Client ID (for image hosting)

### Installation

1. Clone the repository
2. Install dependencies:
```sh
npm install
```
3. Create a `.env.local` file in the root directory and add your Imgur Client ID:
```env
NEXT_PUBLIC_IMGUR_CLIENT_ID=your_imgur_client_id_here
```
4. Run the development server:
```sh
npm run dev
```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Navigate to the Upload page.
2. Drag and drop images onto the designated area, or click to select files from your device.
3. Add captions to your images if desired.
4. Click the "Upload" button to process your images.
5. Once uploaded, you'll see the generated markdown for each image.
6. Use the "Copy Markdown" button to copy the generated syntax to your clipboard.
7. Paste the markdown into your document or content management system.

## Configuration

You can customize various aspects of MarkSnap by modifying the settings in the `config.js` file:

- `MAX_FILE_SIZE`: Maximum allowed file size for uploads (default: 5MB)
- `MAX_FILES`: Maximum number of files allowed per upload (default: 5)
- `DEFAULT_CAPTION_PREFIX`: Default prefix for image captions
- `DEFAULT_CAPTION_SUFFIX`: Default suffix for image captions
