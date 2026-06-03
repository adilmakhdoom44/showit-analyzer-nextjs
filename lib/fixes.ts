import type { FixItem } from '@/types/analyzer';

export const FIX_LIBRARY: Record<string, FixItem> = {

  // ── SEO ────────────────────────────────────────────────────────────────

  'document-title': {
    id: 'document-title',
    icon: '📝',
    name: 'Add a Page Title',
    difficulty: 'easy',
    time: '5 min',
    impact: 'Google uses your title tag as the headline in search results. Without one, your page may be skipped.',
    steps: [
      'Open your Showit project',
      'Click "Site Settings" in the top menu bar',
      'Go to the "SEO" tab',
      'Enter a descriptive title (50–60 characters) in the "Page Title" field',
      'Include your main keyword near the beginning (e.g. "Wedding Photographer – Jane Smith Photography")',
      'Click Save, then Publish your site',
    ],
    tip: 'Use the format: Primary Keyword – Brand Name (e.g. "Austin Wedding Photographer | Jane Smith")',
  },

  'meta-description': {
    id: 'meta-description',
    icon: '💬',
    name: 'Add a Meta Description',
    difficulty: 'easy',
    time: '10 min',
    impact: 'Meta descriptions appear under your link in search results and directly affect click-through rates.',
    steps: [
      'Open Showit → click "Site Settings" in the top menu',
      'Go to the "SEO" tab',
      'Find the "Meta Description" field',
      'Write a compelling description (150–160 characters)',
      'Include your main keyword naturally in the first sentence',
      'End with a call to action (e.g. "Book a consultation today")',
      'Click Save → Publish',
    ],
  },

  'image-alt': {
    id: 'image-alt',
    icon: '🖼️',
    name: 'Add Alt Text to Images',
    difficulty: 'medium',
    time: '20–30 min',
    impact: 'Alt text helps Google understand your images and improves accessibility for screen readers.',
    steps: [
      'Open your Showit canvas',
      'Click on an image that is missing alt text',
      'In the right-hand panel, look for the "Accessibility" section',
      'Find the "Alt Text" field and type a descriptive label (e.g. "Bride and groom at Austin vineyard wedding")',
      'Repeat for every portfolio image, hero image, and gallery',
      'Avoid keyword stuffing — describe what is actually in the image',
      'Click Publish when done',
    ],
    tip: 'Prioritize your hero image and the first 5 portfolio images — those are seen most by Google.',
  },

  'crawlable-anchors': {
    id: 'crawlable-anchors',
    icon: '🔗',
    name: 'Fix Uncrawlable Links',
    difficulty: 'medium',
    time: '15 min',
    impact: 'Links that Google cannot follow block it from discovering your other pages.',
    steps: [
      'In Showit, go to each button or text link on your page',
      'Click the link/button and open its "Link" settings in the right panel',
      'Make sure every link points to a real URL (not a "#" placeholder)',
      'Replace any links that say "javascript:void(0)" with actual page URLs',
      'Check your navigation menu — every item should link to a real page',
      'Publish after fixing all links',
    ],
  },

  'is-crawlable': {
    id: 'is-crawlable',
    icon: '🚫',
    name: 'Remove Noindex Tag (Page Is Blocked)',
    difficulty: 'easy',
    time: '5 min',
    impact: 'Your page has a noindex tag telling Google not to show it in search results. This is blocking your entire site from Google.',
    steps: [
      'Open Showit → Site Settings → SEO',
      'Look for a "Robots" or "Noindex" setting and make sure it is set to "Index"',
      'Also check any custom code in your site header — remove any <meta name="robots" content="noindex"> tag',
      'In your WordPress blog (if connected), go to Settings → Reading and uncheck "Discourage search engines"',
      'Publish your site',
    ],
  },

  'robots-txt': {
    id: 'robots-txt',
    icon: '🤖',
    name: 'Fix robots.txt File',
    difficulty: 'medium',
    time: '15 min',
    impact: 'An invalid robots.txt can block Google from crawling your entire site.',
    steps: [
      'Visit yoursite.com/robots.txt in your browser',
      'Check that it does NOT contain "Disallow: /" (this blocks everything)',
      'A correct basic robots.txt should contain: "User-agent: *" and "Allow: /"',
      'Add your sitemap URL: "Sitemap: https://yoursite.com/sitemap.xml"',
      'If you need to edit it, contact your hosting provider or use Showit\'s custom code section',
    ],
  },

  'hreflang': {
    id: 'hreflang',
    icon: '🌍',
    name: 'Fix hreflang Tags',
    difficulty: 'medium',
    time: '20 min',
    impact: 'Hreflang tags tell Google which language and country your pages target.',
    steps: [
      'In Showit, go to Site Settings → SEO → Custom Code (Head)',
      'Add hreflang tags if you have multiple language versions of your site',
      'Example: <link rel="alternate" hreflang="en" href="https://yoursite.com/" />',
      'If you only have one language, you may not need hreflang tags at all',
      'Use Google Search Console to verify after publishing',
    ],
  },

  'canonical': {
    id: 'canonical',
    icon: '🔁',
    name: 'Set a Canonical URL',
    difficulty: 'easy',
    time: '10 min',
    impact: 'Canonical tags prevent duplicate content issues and tell Google which version of a page is the "official" one.',
    steps: [
      'Open Showit → Site Settings → SEO',
      'Find the "Canonical URL" field (if available) and enter your preferred URL',
      'Alternatively, add a canonical tag in your site\'s custom <head> code:',
      '<link rel="canonical" href="https://yoursite.com/page-name" />',
      'Make sure your site consistently uses HTTPS and www (or non-www) everywhere',
      'Publish your changes',
    ],
  },

  'link-text': {
    id: 'link-text',
    icon: '🔗',
    name: 'Fix Empty or Generic Link Text',
    difficulty: 'easy',
    time: '10 min',
    impact: 'Links that say "click here" or have no text hurt SEO and accessibility.',
    steps: [
      'In your Showit canvas, find all buttons and text links',
      'Replace any that say "Click here", "Read more", or "Learn more" with descriptive text',
      'Good examples: "View my wedding portfolio", "Book a free consultation", "See pricing packages"',
      'Make sure any icon-only links (like social media icons) have an aria-label set',
      'Publish your changes',
    ],
  },

  // ── SPEED / IMAGES ─────────────────────────────────────────────────────

  'uses-optimized-images': {
    id: 'uses-optimized-images',
    icon: '⚡',
    name: 'Optimize Oversized Images',
    difficulty: 'easy',
    time: '20–30 min',
    impact: 'Large images are the #1 cause of slow Showit websites. Optimizing them can cut your load time in half.',
    steps: [
      'Go to Squoosh.app (free browser tool by Google) or TinyPNG.com',
      'Upload each of your large images one by one',
      'In Squoosh, set the output format to "WebP" and quality to 80%',
      'Keep image width to max 2000px for full-width backgrounds, 1000px for smaller images',
      'Download the compressed versions',
      'In Showit, click your image → right panel → click the image to replace it → upload the new compressed file',
      'Republish your site when done',
    ],
    tip: 'Start with your hero/banner images — they are almost always the largest files.',
  },

  'uses-webp-images': {
    id: 'uses-webp-images',
    icon: '🔄',
    name: 'Convert Images to WebP',
    difficulty: 'easy',
    time: '15 min',
    impact: 'WebP images are 25–35% smaller than JPG/PNG with the same quality, speeding up your site noticeably.',
    steps: [
      'Go to Squoosh.app in your browser',
      'Upload each image and select "WebP" as the output format',
      'Set quality to 80–85%',
      'Download each WebP image',
      'In Showit, replace each original image with the WebP version by clicking the image → right panel → upload',
      'Publish your site',
    ],
    tip: 'Showit fully supports WebP images. This is one of the easiest wins for speed.',
  },

  'uses-responsive-images': {
    id: 'uses-responsive-images',
    icon: '📐',
    name: 'Properly Size Images for Screen',
    difficulty: 'easy',
    time: '20 min',
    impact: 'Serving images larger than they are displayed wastes bandwidth and slows down the page.',
    steps: [
      'Identify which images are being served at a much larger size than displayed',
      'In Showit, check the actual display size of each image (right panel → image size)',
      'Resize images to match their display size — no need to upload a 4000px image if it shows at 800px',
      'For mobile: In Showit\'s mobile canvas, upload smaller versions of large images for mobile view',
      'Use Squoosh.app to resize and compress before uploading',
      'Publish after replacing all oversized images',
    ],
  },

  'offscreen-images': {
    id: 'offscreen-images',
    icon: '📜',
    name: 'Defer Offscreen / Below-Fold Images',
    difficulty: 'medium',
    time: '20 min',
    impact: 'Images below the visible screen area are loaded immediately, wasting bandwidth on content the visitor has not yet seen.',
    steps: [
      'In Showit, click on each image that appears below the fold (below what is visible on first load)',
      'In the right panel, look for a "Loading" option and set it to "Lazy"',
      'For gallery sections with many images, enable lazy loading on all images except the first visible one',
      'Do NOT lazy-load your hero/banner image — that would hurt your LCP score',
      'Publish your changes',
    ],
    tip: 'Never lazy-load the first image a visitor sees — only images that are scrolled to later.',
  },

  'uses-minified-css': {
    id: 'uses-minified-css',
    icon: '🗜️',
    name: 'Minify CSS Files',
    difficulty: 'hard',
    time: '30 min',
    impact: 'Unminified CSS files contain spaces and comments that make them larger than needed, slowing down page load.',
    steps: [
      'Showit automatically minifies its own CSS — this issue usually comes from custom CSS you have added',
      'In Showit, go to Site Settings → Custom Code → CSS',
      'Copy all your custom CSS',
      'Go to cssminifier.com and paste your CSS, then click "Minify"',
      'Copy the minified output and replace your custom CSS in Showit with it',
      'Also check if any third-party plugins or scripts are loading unminified CSS',
      'Publish your site',
    ],
    tip: 'If this is flagging Showit\'s own CSS files, there is nothing you can do — contact Showit support.',
  },

  'uses-minified-javascript': {
    id: 'uses-minified-javascript',
    icon: '🗜️',
    name: 'Minify JavaScript Files',
    difficulty: 'hard',
    time: '30 min',
    impact: 'Unminified JavaScript files are larger than needed, increasing load time.',
    steps: [
      'Showit minifies its own JavaScript — this usually flags custom scripts you have added',
      'In Showit, go to Site Settings → Custom Code → check any script tags you have added',
      'If you added inline JavaScript, minify it using jsminifier.com',
      'Replace your custom scripts with their minified versions',
      'Remove any scripts you are no longer using',
      'Publish your changes',
    ],
  },

  'unused-css-rules': {
    id: 'unused-css-rules',
    icon: '🧹',
    name: 'Remove Unused CSS',
    difficulty: 'hard',
    time: '30–45 min',
    impact: 'CSS rules that are never used still get downloaded by the browser, wasting load time.',
    steps: [
      'This is mostly controlled by Showit — their platform includes CSS for all features even if you are not using them',
      'For CSS you have added yourself: Go to Site Settings → Custom Code → CSS',
      'Review each rule — delete any that do not apply to elements on your site',
      'Remove any CSS from removed plugins or old themes',
      'If you have a connected WordPress blog, deactivate unused plugins that load extra CSS',
      'Publish your changes',
    ],
    tip: 'This audit is hard to fully resolve on Showit because the platform controls most CSS. Focus on removing your own unused custom CSS.',
  },

  'unused-javascript': {
    id: 'unused-javascript',
    icon: '🧹',
    name: 'Remove Unused JavaScript',
    difficulty: 'hard',
    time: '30 min',
    impact: 'JavaScript that is loaded but never used delays the page and wastes bandwidth.',
    steps: [
      'Go to Showit → Site Settings → Custom Code',
      'Review every script tag you have added — remove any from tools you no longer use',
      'Check for old tracking pixels (Facebook Pixel, old Google Analytics, etc.) — remove duplicates',
      'If you have a WordPress blog connected, deactivate plugins that add JavaScript you are not using',
      'Check for chat widgets, pop-up tools, or form builders that may load large scripts',
      'Publish your changes',
    ],
  },

  'uses-text-compression': {
    id: 'uses-text-compression',
    icon: '📦',
    name: 'Enable Text Compression (GZIP/Brotli)',
    difficulty: 'hard',
    time: '15 min',
    impact: 'Text compression reduces the size of HTML, CSS, and JS files sent to the browser by up to 70%.',
    steps: [
      'This is a server-level setting — Showit should handle this automatically',
      'If this is flagging on your Showit site, contact Showit Support at help.showit.co',
      'If you have a custom domain or CDN in front of your Showit site (e.g. Cloudflare), enable Gzip compression there',
      'In Cloudflare: Go to Speed → Optimization → Content Optimization → Auto Minify, and enable Gzip',
      'Republish your Showit site after making any CDN changes',
    ],
    tip: 'Most Showit sites have compression enabled by default. If this is flagging, it is likely a CDN or proxy configuration issue.',
  },

  'render-blocking-resources': {
    id: 'render-blocking-resources',
    icon: '🚧',
    name: 'Fix Render-Blocking Resources',
    difficulty: 'hard',
    time: '30 min',
    impact: 'Scripts and stylesheets that block rendering delay when visitors first see your page.',
    steps: [
      'In Showit, go to Site Settings → Custom Code → Head Scripts',
      'Find any <script> tags you have added and add the "defer" attribute: <script defer src="...">',
      'Move scripts to the bottom of the page (Body scripts) if they are not needed immediately',
      'Remove any unused third-party scripts entirely',
      'For Google Fonts: replace @import with a <link rel="preload"> tag in your head code',
      'Publish your changes',
    ],
  },

  'uses-efficient-cache-policy-on-static-assets': {
    id: 'uses-efficient-cache-policy-on-static-assets',
    icon: '⏱️',
    name: 'Improve Image Delivery & Caching',
    difficulty: 'hard',
    time: '20 min',
    impact: 'Setting proper cache headers means returning visitors load your site much faster.',
    steps: [
      'This is controlled at the server/CDN level — Showit sets cache headers automatically for its hosting',
      'If you are seeing this on images stored in Showit, contact Showit Support at help.showit.co',
      'To improve caching further, use Cloudflare as a CDN in front of your Showit site (free plan available)',
      'In Cloudflare: Go to Caching → Configuration → set Browser Cache TTL to at least 1 month',
      'Also enable Cloudflare\'s "Cache Everything" page rule for static assets',
    ],
    tip: 'Using Cloudflare\'s free CDN in front of Showit is the most impactful thing you can do for caching.',
  },

  'uses-long-cache-ttl': {
    id: 'uses-long-cache-ttl',
    icon: '⏱️',
    name: 'Serve Assets with Long Cache Policy',
    difficulty: 'hard',
    time: '20 min',
    impact: 'Assets without long cache lifetimes are re-downloaded every visit, slowing repeat visitors.',
    steps: [
      'This is a server-level setting controlled by Showit\'s hosting infrastructure',
      'For assets you control (custom fonts, images you host elsewhere): set Cache-Control to at least 1 year',
      'If using Cloudflare: Go to Caching → Cache Rules → set cache TTL to 1 year for images, CSS, and JS',
      'Contact Showit Support if this is flagging on Showit-hosted assets',
    ],
  },

  'server-response-time': {
    id: 'server-response-time',
    icon: '🚀',
    name: 'Reduce Server Response Time (TTFB)',
    difficulty: 'hard',
    time: '30 min',
    impact: 'A slow server response means everything on the page starts loading later.',
    steps: [
      'Use Cloudflare (free) as a CDN in front of your Showit site — this caches your pages closer to visitors',
      'Go to cloudflare.com → add your site → change your domain nameservers to Cloudflare',
      'In Cloudflare, enable the "Speed" optimizations: Rocket Loader, Auto Minify',
      'If you have a WordPress blog connected: go to your WordPress admin → install WP Super Cache or W3 Total Cache plugin → enable page caching',
      'Contact Showit Support if server response time remains slow after adding a CDN',
    ],
  },

  'time-to-first-byte': {
    id: 'time-to-first-byte',
    icon: '🚀',
    name: 'Improve Time to First Byte (TTFB)',
    difficulty: 'hard',
    time: '30 min',
    impact: 'TTFB measures how long your server takes to respond. Faster TTFB = everything loads sooner.',
    steps: [
      'Add Cloudflare as a free CDN in front of your Showit site',
      'In Cloudflare, enable "Argo Smart Routing" (paid) or just use the free plan caching',
      'For your WordPress blog (if connected): install a caching plugin like WP Super Cache',
      'Consider enabling Cloudflare\'s "Early Hints" feature for modern browsers',
      'Contact Showit Support if the TTFB is consistently over 600ms',
    ],
  },

  'dom-size': {
    id: 'dom-size',
    icon: '🌳',
    name: 'Reduce DOM Size',
    difficulty: 'hard',
    time: '45 min',
    impact: 'A very large DOM (too many HTML elements) slows down rendering and JavaScript execution.',
    steps: [
      'Showit generates a relatively large DOM because of its canvas-based architecture — this is partially expected',
      'Audit your pages for sections you can simplify: remove hidden elements, unused sections, or duplicate rows',
      'In Showit, delete any hidden sections or elements that you are not using',
      'Avoid stacking many overlapping elements on top of each other in the canvas — consolidate where possible',
      'Keep animation effects to a minimum — some Showit animations add extra wrapper elements',
    ],
    tip: 'A DOM size under 1,500 elements is ideal. Showit sites often run 2,000–4,000. Simplifying page design is the main lever.',
  },

  'bootup-time': {
    id: 'bootup-time',
    icon: '⚙️',
    name: 'Reduce JavaScript Execution Time',
    difficulty: 'hard',
    time: '30 min',
    impact: 'Heavy JavaScript processing delays page interactivity and frustrates users on slower devices.',
    steps: [
      'Go to Showit → Site Settings → Custom Code → review all script tags',
      'Remove any scripts you are not actively using (old tracking pixels, unused widgets)',
      'Replace heavy JavaScript libraries with lighter alternatives where possible',
      'Defer non-critical scripts: add "defer" attribute to script tags',
      'If you have a chat widget (Intercom, Drift, etc.) loading on every page, consider loading it only on the contact page',
      'For WordPress blog: deactivate plugins that load heavy JavaScript site-wide',
    ],
  },

  'mainthread-work-breakdown': {
    id: 'mainthread-work-breakdown',
    icon: '🔄',
    name: 'Minimize Main Thread Work',
    difficulty: 'hard',
    time: '30 min',
    impact: 'Too much work on the browser\'s main thread causes layout shifts and input delays.',
    steps: [
      'Reduce the number of animations running simultaneously in Showit — complex animations add main thread work',
      'Remove or defer third-party scripts that execute on page load',
      'Avoid using heavy font icon libraries (like Font Awesome full library) — use only the icons you need',
      'If using custom JavaScript, move expensive operations to a Web Worker if possible',
      'Simplify complex page layouts in Showit — fewer overlapping elements means less layout calculation',
    ],
  },

  'total-byte-weight': {
    id: 'total-byte-weight',
    icon: '📦',
    name: 'Reduce Total Page Weight',
    difficulty: 'medium',
    time: '45 min',
    impact: 'Your page is downloading too much data, making it slow — especially on mobile.',
    steps: [
      'Compress all images using Squoosh.app or TinyPNG — this is usually the biggest saving',
      'Convert images to WebP format (25–35% smaller than JPG)',
      'Remove unused fonts — if you only use 2 fonts, do not load 5',
      'In Showit, remove custom scripts and CSS you no longer need',
      'Remove unused sections and hidden elements from your pages',
      'Aim for a total page size under 3MB for best performance',
    ],
  },

  'font-display': {
    id: 'font-display',
    icon: '✍️',
    name: 'Ensure Text Visible During Font Load',
    difficulty: 'medium',
    time: '15 min',
    impact: 'Without font-display:swap, text is invisible while fonts load, creating a "flash of invisible text".',
    steps: [
      'In Showit, go to Site Settings → Custom Code → Head',
      'If you are loading Google Fonts with @import, replace it with a <link> tag that includes display=swap',
      'Example: <link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">',
      'If you are loading fonts via Showit\'s built-in font picker, this is handled automatically',
      'Publish your changes',
    ],
  },

  'efficient-animated-content': {
    id: 'efficient-animated-content',
    icon: '🎬',
    name: 'Use Video for Animated GIFs',
    difficulty: 'medium',
    time: '20 min',
    impact: 'Animated GIFs can be 10–100x larger than equivalent video files, dramatically slowing page load.',
    steps: [
      'Find any animated GIFs on your Showit site',
      'Convert them to MP4 or WebM video using Ezgif.com → GIF to MP4',
      'Remove the GIF from Showit and replace with an embed or video element',
      'In Showit, use an HTML Embed element with a <video autoplay loop muted playsinline> tag',
      'This gives the same visual effect at a fraction of the file size',
    ],
  },

  'third-party-summary': {
    id: 'third-party-summary',
    icon: '🔌',
    name: 'Reduce Third-Party Script Impact',
    difficulty: 'hard',
    time: '30 min',
    impact: 'Third-party scripts (analytics, chat, social widgets) block loading and are outside your direct control.',
    steps: [
      'Audit all third-party scripts in Showit → Site Settings → Custom Code',
      'Remove any scripts from services you no longer use',
      'Load non-critical scripts with "defer" or only on pages where they are needed',
      'Replace heavy social media embed widgets with static screenshots linked to the social page',
      'Consider loading chat widgets only after user interaction (not on page load)',
      'If using Google Tag Manager, audit your GTM container and remove unused tags',
    ],
  },

  'legacy-javascript': {
    id: 'legacy-javascript',
    icon: '📜',
    name: 'Avoid Legacy JavaScript',
    difficulty: 'hard',
    time: '30 min',
    impact: 'Polyfills for old browsers add unnecessary weight for modern browser users.',
    steps: [
      'This usually comes from third-party scripts or WordPress plugins on your Showit blog',
      'Update any WordPress plugins to their latest version',
      'Replace outdated JavaScript libraries with modern alternatives',
      'If using jQuery (common in WordPress), check if it can be removed or deferred',
      'Contact Showit Support if the legacy JavaScript is coming from Showit\'s own platform',
    ],
  },

  'lcp-lazy-loaded': {
    id: 'lcp-lazy-loaded',
    icon: '🖼️',
    name: 'Remove Lazy Load from LCP Image',
    difficulty: 'easy',
    time: '5 min',
    impact: 'Your largest visible image (hero/banner) has lazy loading enabled, which significantly delays when it appears.',
    steps: [
      'Open Showit and navigate to your homepage canvas',
      'Click on your hero/banner image (the first large image visitors see)',
      'In the right panel, look for a "Loading" option',
      'Change it from "Lazy" to "Eager" (loads immediately)',
      'Only the first visible image should be eager — all below-the-fold images can stay lazy',
      'Publish your changes',
    ],
    tip: 'This is one of the highest-impact fixes for your LCP score. Always load your hero image eagerly.',
  },

  'largest-contentful-paint': {
    id: 'largest-contentful-paint',
    icon: '🖼️',
    name: 'Improve Largest Contentful Paint (LCP)',
    difficulty: 'hard',
    time: '45 min',
    impact: 'LCP measures how fast your main content loads. Google uses this for Core Web Vitals ranking.',
    steps: [
      'Compress your hero image — use Squoosh.app to reduce it to under 200KB in WebP format',
      'Make sure your hero image is NOT lazy-loaded (set Loading to "Eager" in Showit)',
      'Add a preload hint for your hero image: <link rel="preload" as="image" href="your-hero.webp">',
      'In Showit → Site Settings → Custom Code → Head, paste the preload tag',
      'Use a CDN like Cloudflare to serve your images from servers closer to your visitors',
      'Aim for LCP under 2.5 seconds',
    ],
  },

  'cumulative-layout-shift': {
    id: 'cumulative-layout-shift',
    icon: '📐',
    name: 'Fix Layout Shifts (CLS)',
    difficulty: 'medium',
    time: '30 min',
    impact: 'Layout shifts happen when elements move after the page loads, frustrating users and hurting rankings.',
    steps: [
      'Reserve space for images by always setting explicit width and height on image elements',
      'In Showit, make sure images have fixed dimensions set — avoid auto-height images that resize on load',
      'Check for elements that load fonts and cause text to reflow — add font-display:swap to your fonts',
      'Review animations that move elements after page load — consider disabling or delaying them',
      'Avoid inserting content above existing content (e.g. banners or cookie notices that push content down)',
      'Test with Google PageSpeed Insights after each change',
    ],
  },

  'total-blocking-time': {
    id: 'total-blocking-time',
    icon: '⏱️',
    name: 'Reduce Total Blocking Time (TBT)',
    difficulty: 'hard',
    time: '30 min',
    impact: 'TBT measures how long the page is unresponsive to user input. High TBT makes your site feel frozen.',
    steps: [
      'Remove or defer heavy JavaScript in Showit → Site Settings → Custom Code',
      'Add "defer" attribute to all non-critical scripts',
      'Remove unused plugins from your WordPress blog (if connected)',
      'Replace synchronous third-party scripts with async versions',
      'Break up long JavaScript tasks — avoid scripts that run for more than 50ms continuously',
      'Test after each change using Google PageSpeed Insights',
    ],
  },

  'speed-index': {
    id: 'speed-index',
    icon: '⚡',
    name: 'Improve Speed Index',
    difficulty: 'hard',
    time: '45 min',
    impact: 'Speed Index measures how quickly content is visually displayed. Lower is better.',
    steps: [
      'Compress and optimize all above-the-fold images using Squoosh.app',
      'Minimize render-blocking CSS and JavaScript in your custom code',
      'Remove any large animations that delay visual rendering',
      'Use a CDN (Cloudflare free) to serve assets faster',
      'Keep your above-the-fold content simple — fewer elements means faster visual render',
    ],
  },

  'interactive': {
    id: 'interactive',
    icon: '⚡',
    name: 'Improve Time to Interactive (TTI)',
    difficulty: 'hard',
    time: '30 min',
    impact: 'TTI measures when visitors can actually click and interact with your page.',
    steps: [
      'Remove or defer heavy JavaScript that runs on page load',
      'Add "defer" to all script tags in Showit custom code',
      'Deactivate unused WordPress plugins that inject JavaScript',
      'Lazy-load below-the-fold images so they do not block interactivity',
      'Remove any chat widgets or pop-up scripts that load immediately',
    ],
  },

  // ── ACCESSIBILITY ────────────────────────────────────────────────────

  'color-contrast': {
    id: 'color-contrast',
    icon: '🎨',
    name: 'Fix Color Contrast',
    difficulty: 'medium',
    time: '20 min',
    impact: 'Poor contrast fails accessibility standards and makes text hard to read.',
    steps: [
      'Go to WebAIM Contrast Checker at webaim.org/resources/contrastchecker/',
      'Enter the text color and background color from your Showit design',
      'Normal text (under 18px) needs at least 4.5:1 contrast ratio',
      'Large text (18px+) needs at least 3:1 contrast ratio',
      'In Showit, click the affected text element → right panel → change text or background color',
      'Publish after all contrast issues are fixed',
    ],
  },

  'tap-targets': {
    id: 'tap-targets',
    icon: '👆',
    name: 'Fix Small Tap Targets',
    difficulty: 'easy',
    time: '15 min',
    impact: 'Buttons and links that are too small frustrate mobile visitors and hurt your mobile usability score.',
    steps: [
      'Switch to the Mobile canvas view in Showit',
      'Click on each button and link',
      'In the right panel, check the size — buttons should be at least 44×44 pixels',
      'Increase the padding on small buttons to make them easier to tap',
      'Make sure links in paragraphs have enough spacing between them',
      'Publish your changes',
    ],
  },

  // ── NETWORK / CONNECTION ─────────────────────────────────────────────

  'uses-rel-preconnect': {
    id: 'uses-rel-preconnect',
    icon: '🔌',
    name: 'Add Preconnect Links for External Resources',
    difficulty: 'medium',
    time: '15 min',
    impact: 'Preconnect tells the browser to start connecting to external servers early, reducing connection time.',
    steps: [
      'In Showit, go to Site Settings → Custom Code → Head',
      'Add preconnect tags for domains your site loads from:',
      '<link rel="preconnect" href="https://fonts.googleapis.com">',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      'If using Google Analytics: <link rel="preconnect" href="https://www.googletagmanager.com">',
      'Add a preconnect for any CDN or third-party service you load assets from',
      'Publish your changes',
    ],
  },

  'uses-rel-preload': {
    id: 'uses-rel-preload',
    icon: '⚡',
    name: 'Preload Critical Resources',
    difficulty: 'medium',
    time: '15 min',
    impact: 'Preloading key assets (fonts, hero images) tells the browser to fetch them immediately at highest priority.',
    steps: [
      'In Showit → Site Settings → Custom Code → Head, add preload tags',
      'For your hero image: <link rel="preload" as="image" href="https://your-hero-image-url.webp">',
      'For your main font: <link rel="preload" as="font" href="your-font.woff2" crossorigin>',
      'Only preload assets that are visible on first load — do not preload everything',
      'Publish and test with PageSpeed Insights',
    ],
  },

  'redirects': {
    id: 'redirects',
    icon: '↩️',
    name: 'Avoid Page Redirects',
    difficulty: 'medium',
    time: '20 min',
    impact: 'Every redirect adds a round-trip delay before the page starts loading.',
    steps: [
      'Make sure your domain consistently loads either www or non-www (not both with a redirect)',
      'In Showit → Site Settings → Domain, check your canonical domain setting',
      'Ensure your site uses HTTPS and has an automatic HTTP→HTTPS redirect (Showit handles this)',
      'Remove any unnecessary URL redirects from old pages',
      'Update internal links to point directly to the final URL (skip the redirect)',
    ],
  },

  // ── STRUCTURED DATA / AI ─────────────────────────────────────────────

  'structured-data': {
    id: 'structured-data',
    icon: '🏷️',
    name: 'Add Structured Data (Schema Markup)',
    difficulty: 'hard',
    time: '30–45 min',
    impact: 'Schema markup helps Google understand your business and can unlock rich results (star ratings, FAQ, etc.).',
    steps: [
      'Go to technicalseo.com/tools/schema-markup-generator/ or schema.org',
      'Choose your business type (LocalBusiness, Photographer, etc.)',
      'Fill in: business name, address, phone number, website, services, and price range',
      'Copy the generated JSON-LD code',
      'In Showit, add an "HTML Embed" element on your homepage',
      'Paste the schema code into the embed and publish',
      'Verify using Google\'s Rich Results Test at search.google.com/test/rich-results',
    ],
    tip: 'At minimum, add LocalBusiness schema. If you have a blog, add BlogPosting schema to each post.',
  },

  'meta-viewport': {
    id: 'meta-viewport',
    icon: '📱',
    name: 'Add Viewport Meta Tag',
    difficulty: 'easy',
    time: '5 min',
    impact: 'Without a viewport tag, mobile devices render your page like a desktop, making it unreadable.',
    steps: [
      'In Showit → Site Settings → Custom Code → Head',
      'Add: <meta name="viewport" content="width=device-width, initial-scale=1">',
      'This is usually already included by Showit — if flagged, check that you have not accidentally removed it',
      'Publish your changes',
    ],
  },

  // ── PERFORMANCE MISC ─────────────────────────────────────────────────

  'critical-request-chains': {
    id: 'critical-request-chains',
    icon: '⛓️',
    name: 'Reduce Critical Request Chains',
    difficulty: 'hard',
    time: '30 min',
    impact: 'Long chains of dependent requests mean each one must wait for the previous to finish.',
    steps: [
      'Inline small critical CSS directly in your page head instead of loading an external file',
      'In Showit → Site Settings → Custom Code → Head, paste any critical CSS inline',
      'Avoid loading CSS files that then load more CSS files (CSS @import chains)',
      'Use preload for the most important external resources',
      'Defer or async non-critical scripts',
    ],
  },

  'network-rtt': {
    id: 'network-rtt',
    icon: '🌐',
    name: 'Reduce Network Round Trip Time',
    difficulty: 'hard',
    time: '30 min',
    impact: 'High round-trip times mean each network request takes longer — a CDN reduces this significantly.',
    steps: [
      'Use Cloudflare (free) as a CDN to serve your site from servers closer to your visitors',
      'Go to cloudflare.com → add your site → update nameservers',
      'Enable Cloudflare\'s "Cache Everything" page rule for static pages',
      'This is mostly outside Showit\'s direct control — a CDN is the best solution',
    ],
  },

  'bf-cache': {
    id: 'bf-cache',
    icon: '↩️',
    name: 'Enable Back/Forward Cache (bfcache)',
    difficulty: 'medium',
    time: '20 min',
    impact: 'bfcache allows pages to load instantly when visitors press the browser back button.',
    steps: [
      'Avoid using unload event listeners in your custom JavaScript — these disable bfcache',
      'In Showit → Site Settings → Custom Code, remove any scripts that use window.onunload or window.onbeforeunload',
      'Replace tracking scripts that use unload events with modern alternatives that support bfcache',
      'Test bfcache support in Chrome DevTools → Application → Back/Forward Cache',
    ],
  },

  'duplicated-javascript': {
    id: 'duplicated-javascript',
    icon: '📄',
    name: 'Remove Duplicate JavaScript Modules',
    difficulty: 'medium',
    time: '20 min',
    impact: 'Loading the same JavaScript library twice wastes bandwidth and can cause conflicts.',
    steps: [
      'Check if the same library is loaded more than once (e.g. jQuery loaded twice)',
      'In Showit → Site Settings → Custom Code, remove any duplicate script tags',
      'Check your WordPress plugins (if connected) — some plugins load jQuery or other libraries redundantly',
      'Use your browser\'s Network tab to identify duplicate script requests',
    ],
  },

  'no-document-write': {
    id: 'no-document-write',
    icon: '⚠️',
    name: 'Avoid document.write()',
    difficulty: 'hard',
    time: '20 min',
    impact: 'document.write() blocks page parsing and significantly delays rendering.',
    steps: [
      'Find any custom JavaScript in Showit → Site Settings → Custom Code that uses document.write()',
      'Replace document.write() calls with DOM manipulation methods like innerHTML or appendChild',
      'If the code comes from a third-party script, contact the provider for a modern version',
      'Remove the script entirely if the functionality is not essential',
    ],
  },

};

export function getRelevantFixes(auditIds: string[]): FixItem[] {
  return auditIds
    .filter(id => FIX_LIBRARY[id])
    .map(id => FIX_LIBRARY[id]);
}

// Fallback fix for audits not in the library
export function getFallbackFix(auditId: string, auditTitle: string, auditDescription?: string): FixItem {
  return {
    id: auditId,
    icon: '🔧',
    name: auditTitle,
    difficulty: 'medium',
    time: '20–30 min',
    impact: auditDescription ?? 'Fixing this issue will improve your overall site performance and score.',
    steps: [
      'This issue was detected by Google PageSpeed Insights on your Showit site.',
      'Copy this issue title and search it on Google for the latest guidance.',
      'Check Showit\'s help center at help.showit.co for Showit-specific instructions.',
      'Review your site\'s custom code in Showit → Site Settings → Custom Code for related settings.',
      'After making changes, re-run the analyzer to confirm the issue is resolved.',
    ],
    tip: 'If this issue relates to server or hosting settings, contact Showit Support — many performance settings are managed by Showit\'s platform.',
  };
}
