const PHOTOS_URL = 'https://photos.kl-w.de';

const tabs = document.querySelectorAll('nav a');
const pages = [...document.querySelectorAll('[data-page]')];
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });
let currentTab;
let navigation = 0; // bumped on every route change, so a slow load can tell that it went stale

// Post and photo data ends up in markup, and the photo manifest comes from another origin.
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormat.format(date);
}

// The URL hash drives the page: #about, #resume, #blog/<slug>, #photos/<id>
async function route() {
  navigation++;
  let [tab, id] = location.hash.slice(1).split('/');
  if (!pages.some((page) => page.dataset.page === tab)) tab = 'about';
  tabs.forEach((link) => link.classList.toggle('active', link.hash === '#' + tab));
  pages.forEach((page) => page.classList.toggle('active', page.dataset.page === tab));
  document.body.dataset.tab = tab;
  if (tab !== currentTab || tab === 'blog') window.scrollTo(0, 0);
  currentTab = tab;
  if (tab !== 'photos') closeLightbox();
  if (tab === 'blog') await showPost(id);
  if (tab === 'photos') await showPhotos(id);
}

/* Blog */

const postList = document.querySelector('.posts');
const postView = document.querySelector('.blog');
let posts;

async function showPost(slug) {
  const started = navigation;
  try {
    posts ??= (await fetch('blog/posts.json').then((r) => r.json()))
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    postView.innerHTML = '<h2>Blog</h2><p>The posts could not be loaded.</p>';
    return;
  }
  if (started !== navigation) return;
  const post = posts.find((p) => p.slug === slug) ?? posts[0];

  postList.innerHTML = posts.map((p) => `
    <li><a href="#blog/${escapeHtml(p.slug)}" class="${p === post ? 'active' : ''}">
      <span class="meta">${formatDate(p.date)}</span>${escapeHtml(p.title)}
    </a></li>`).join('');

  if (!post) {
    postView.innerHTML = '<h2>Blog</h2><p>No posts yet.</p>';
    return;
  }

  let body;
  try {
    if (post.url) {
      body = `<p>${escapeHtml(post.summary)}</p>
        <p><a href="${escapeHtml(post.url)}">Read the post on ${escapeHtml(post.source)} →</a></p>`;
    } else {
      const [{ marked }, markdown] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/marked@18/lib/marked.esm.js'),
        fetch(`blog/${post.slug}.md`).then((r) => r.text()),
      ]);
      body = marked.parse(markdown);
    }
  } catch {
    body = '<p>This post could not be loaded.</p>';
  }
  if (started !== navigation) return;

  postView.innerHTML = `
    <h2>${escapeHtml(post.title)}</h2>
    <span class="meta">${formatDate(post.date)}</span>
    <div class="post-body">${body}</div>`;
  if (slug && matchMedia('(max-width: 768px)').matches) postView.scrollIntoView();
}

/* Photos */

const gallery = document.querySelector('.gallery');
const lightbox = document.querySelector('.lightbox');
const figure = lightbox.querySelector('figure');
let photos;
let photosLoading;
let openIndex;

const photoSrcset = (photo) => photo.sizes.map((size) => `${PHOTOS_URL}/${size.file} ${size.width}w`).join(', ');
const photoLabel = (photo) => photo.title || photo.caption || `Photo taken ${formatDate(photo.taken)}`.trim();

// One shared request, so overlapping navigations neither fetch nor render the gallery twice.
function loadPhotos() {
  photosLoading ??= fetch(`${PHOTOS_URL}/index.json`)
    .then((response) => {
      if (response.status === 404) return []; // nothing has been published yet
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then((list) => {
      if (!Array.isArray(list)) throw new Error('The manifest is not a list');
      gallery.innerHTML = list.length ? list.map((photo) => `
        <a href="#photos/${escapeHtml(photo.id)}">
          <img src="${escapeHtml(`${PHOTOS_URL}/${photo.sizes[0].file}`)}" srcset="${escapeHtml(photoSrcset(photo))}"
               sizes="(max-width: 768px) 50vw, 240px" width="${Number(photo.width)}" height="${Number(photo.height)}"
               alt="${escapeHtml(photoLabel(photo))}" loading="lazy">
        </a>`).join('') : '<p>No photos yet.</p>';
      photos = list;
    })
    .catch(() => {
      photosLoading = undefined; // try again on the next visit
      gallery.innerHTML = '<p>The photos could not be loaded.</p>';
    });
  return photosLoading;
}

async function showPhotos(id) {
  const started = navigation;
  await loadPhotos();
  if (started !== navigation || !photos) return;

  const index = photos.findIndex((photo) => photo.id === id);
  if (index === -1) {
    closeLightbox();
    return;
  }
  const photo = photos[index];
  const ratio = photo.width / photo.height;

  // A fresh element each time, so the previous photo never lingers while the next one loads.
  // The stylesheet sizes it from --ratio and --natural; `sizes` only steers which rendition is fetched.
  const image = new Image();
  const fit = Math.min(innerWidth, (innerHeight - 96) * ratio); // not positive while the window has no size yet, e.g. a background tab
  image.sizes = fit > 0 ? `${Math.round(fit)}px` : '100vw';
  image.srcset = photoSrcset(photo);
  image.src = `${PHOTOS_URL}/${photo.sizes.at(-1).file}`;
  image.width = photo.width;
  image.height = photo.height;
  image.alt = photoLabel(photo);
  image.style.setProperty('--ratio', ratio);
  image.style.setProperty('--natural', `${photo.sizes.at(-1).width}px`);
  const caption = document.createElement('figcaption');
  caption.textContent = [photo.title, photo.caption].filter(Boolean).join(' — ');
  figure.replaceChildren(image, caption);

  lightbox.querySelector('.lightbox-prev').href = `#photos/${photos.at(index - 1).id}`;
  lightbox.querySelector('.lightbox-next').href = `#photos/${photos[(index + 1) % photos.length].id}`;
  lightbox.classList.toggle('single', photos.length === 1);
  openIndex = index;
  if (!lightbox.open) lightbox.showModal();
}

function closeLightbox() {
  if (lightbox.open) lightbox.close();
}

// Runs for every way of closing, including the dialog's own Escape handling.
lightbox.addEventListener('close', () => {
  figure.replaceChildren();
  if (currentTab === 'photos' && location.hash !== '#photos') location.hash = '#photos';
  gallery.children[openIndex]?.focus();
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

addEventListener('keydown', (event) => {
  if (!lightbox.open || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'Escape') closeLightbox(); // the dialog does this natively as well; being explicit does not rely on it
  if (event.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
  if (event.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
});

addEventListener('hashchange', route);
route();
