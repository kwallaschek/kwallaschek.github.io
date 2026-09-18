Personal portfolio site, published with GitHub Pages at https://kl-w.de.

## Writing a blog post

1. Write the post in Markdown at `blog/<slug>.md`.
2. Add it to `blog/posts.json`:

   ```json
   { "slug": "<slug>", "title": "Post title", "date": "2026-09-16" }
   ```

Posts are listed newest first. An entry with `url` and `source` instead of a Markdown file links to a post published elsewhere.

## Publishing photos

Photos are not stored in this repo. They live in a Cloudflare R2 bucket served at
https://photos.kl-w.de. The site reads `index.json` from there and loads the images directly.

One-time setup:

1. Cloudflare → R2 → create the bucket `kl-w-photos`. In its settings, connect the custom
   domain `photos.kl-w.de` and paste `tools/photos/cors.json` as the CORS policy.
2. R2 → Manage API tokens → create an account token with Object Read & Write on that bucket.
   Copy `tools/photos/.env.example` to `tools/photos/.env` and fill it in.
3. Install the AWS CLI (`brew install awscli`). R2 speaks the S3 protocol and the CLI is only
   the client for it; nothing is sent to AWS.
4. `cd tools/photos && npm install`

Each time you add, change or remove photos:

1. Edit the `PHOTOS_SRC` folder. To add titles or captions, keep a `captions.json` next to
   the photos:

   ```json
   { "DSC_0123.jpg": { "title": "Shinagawa at dusk", "caption": "35mm, f/2" } }
   ```

2. `cd tools/photos && npm run publish`

The bucket mirrors the folder. Every photo is resized to 480, 1200 and 2400px WebP with the
EXIF data (including GPS) stripped, `index.json` is rebuilt sorted by the date taken, and
whatever is in the bucket but no longer in the folder is deleted. File names carry a
fingerprint of the photo, so a re-exported photo shows up at once despite the year-long
cache lifetime of the images.

`npm run preview` lists what a publish would upload and delete without doing it.
`npm run build` only writes the files to `tools/photos/out/`.

Cloudflare's edge can keep serving a deleted photo from its cache for a while. If one has to
disappear right away, purge its URL under Caching → Configuration in the Cloudflare dashboard.
