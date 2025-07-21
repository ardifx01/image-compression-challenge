# Image Compression S2

An advanced web application for compressing and sharing images, built with Next.js, TypeScript, and Prisma. Users can upload images, compress them efficiently, and share/download the results.

## Features

- Upload images via drag-and-drop or file picker
- Efficient image compression
- Gallery view for uploaded/compressed images
- Shareable links for compressed images
- Modern UI with reusable components

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Prisma** (ORM)
- **React**
- **Tailwind CSS**

## Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in required values (database, etc.)
3. **Run database migrations:**
   ```bash
   bunx prisma migrate dev
   ```
4. **Start the development server:**
   ```bash
   bun dev
   ```

## Usage

- Visit `http://localhost:3000`
- Upload images and view compressed results
- Share or download compressed images

## Project Structure

- `app/` - Next.js app directory (pages, API routes)
- `components/` - Reusable React components
- `lib/` - Utility functions and Prisma client
- `prisma/` & `generated/prisma/` - Database schema and generated client
- `public/` - Static assets

## License

MIT
