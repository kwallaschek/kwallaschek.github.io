Personal portfolio site, published with GitHub Pages at https://kl-w.de.

## Writing a blog post

1. Write the post in Markdown at `blog/<slug>.md`.
2. Add it to `blog/posts.json`:

   ```json
   { "slug": "<slug>", "title": "Post title", "date": "2026-09-16" }
   ```

Posts are listed newest first. An entry with `url` and `source` instead of a Markdown file links to a post published elsewhere.
