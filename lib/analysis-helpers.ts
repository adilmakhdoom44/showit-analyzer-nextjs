import type { PageData, PSIResult } from '@/types/analyzer';

// ─── Local SEO Score ─────────────────────────────────────────────────────────
const CITIES = ['new york','los angeles','chicago','houston','phoenix','philadelphia',
  'san antonio','san diego','dallas','san jose','austin','jacksonville','fort worth',
  'columbus','charlotte','indianapolis','san francisco','seattle','denver','nashville',
  'oklahoma city','el paso','washington','boston','las vegas','memphis','louisville',
  'baltimore','milwaukee','albuquerque','tucson','fresno','sacramento','kansas city',
  'mesa','atlanta','omaha','colorado springs','raleigh','long beach','virginia beach',
  'miami','oakland','minneapolis','tulsa','tampa','arlington','new orleans','wichita'];

export function calcLocalSEOScore(pageData: PageData | null): { score: number; signals: { label: string; found: boolean; pts: number }[] } {
  if (!pageData) return { score: 0, signals: [] };
  const body = (pageData.bodyText + pageData.title + pageData.metaDesc).toLowerCase();
  const h1Text = pageData.headings.find(h => h.tag === 'H1')?.text?.toLowerCase() ?? '';

  const hasCity = CITIES.some(c => body.includes(c));
  const cityInTitle = CITIES.some(c => pageData.title.toLowerCase().includes(c));
  const cityInH1 = CITIES.some(c => h1Text.includes(c));
  const cityInDesc = CITIES.some(c => pageData.metaDesc.toLowerCase().includes(c));
  const hasLocalSchema = pageData.schemaRaw?.some((s: Record<string,unknown>) =>
    ['LocalBusiness','ProfessionalService','HomeAndConstructionBusiness'].includes(s['@type'] as string)
  ) ?? false;

  const signals = [
    { label: 'City in page title', found: cityInTitle, pts: 25 },
    { label: 'City in H1 heading', found: cityInH1, pts: 25 },
    { label: 'City in meta description', found: cityInDesc, pts: 15 },
    { label: 'Location keyword on page', found: hasCity, pts: 15 },
    { label: 'LocalBusiness schema markup', found: hasLocalSchema, pts: 20 },
  ];
  const score = signals.filter(s => s.found).reduce((a, s) => a + s.pts, 0);
  return { score, signals };
}

// ─── CTA Analysis ────────────────────────────────────────────────────────────
export function analyzeCTAs(pageData: PageData | null) {
  if (!pageData) return [];
  const text = (pageData.bodyText + pageData.title).toLowerCase();
  const linkHrefs = pageData.links.map(l => l.href.toLowerCase()).join(' ');

  return [
    { icon: '📅', label: 'Booking / Scheduling CTA', found: /book|schedule|appointment|reserve|calendar/i.test(text) },
    { icon: '📧', label: 'Contact form or email link', found: pageData.hasMailto || pageData.emailInputs > 0 },
    { icon: '📞', label: 'Phone number link', found: pageData.hasTel },
    { icon: '💰', label: 'Pricing / Investment page', found: /pricing|investment|package|rate|cost/i.test(text + linkHrefs) },
    { icon: '⭐', label: 'Testimonials / Reviews', found: /testimonial|review|what.*say|client.*love/i.test(text) },
    { icon: '📍', label: 'Location / Area mentioned', found: CITIES.some(c => text.includes(c)) || /location|serving|based in|near/i.test(text) },
    { icon: '📰', label: 'Newsletter / Email signup', found: /newsletter|subscribe|email list|sign up/i.test(text) },
    { icon: '🎥', label: 'Video content', found: /youtube|vimeo|wistia|<video/i.test(pageData.bodyText) },
  ];
}

// ─── Business Page Essentials ─────────────────────────────────────────────────
export function checkBusinessEssentials(pageData: PageData | null) {
  if (!pageData) return [];
  const text = pageData.bodyText.toLowerCase();
  const links = pageData.links.map(l => l.href.toLowerCase() + ' ' + l.text.toLowerCase()).join(' ');
  const all = text + ' ' + links;

  return [
    { icon: '💼', label: 'Portfolio / Work page', found: /portfolio|our work|case stud|projects|gallery|client work/i.test(all) },
    { icon: '💰', label: 'Pricing / Investment page', found: /pricing|investment|packages|rates|cost|service fee/i.test(all) },
    { icon: '⭐', label: 'Testimonials / Reviews', found: /testimonial|review|what.*say|client.*love|happy.*client/i.test(all) },
    { icon: '📬', label: 'Contact / Booking page', found: /contact|book|schedule|enqui|inquiry/i.test(all) },
    { icon: '👤', label: 'About page', found: /about|our story|meet the team|who we are/i.test(all) },
    { icon: '📸', label: 'Instagram / Social embed', found: /instagram|elfsight|lightwidget|snapwidget/i.test(all) },
    { icon: '📝', label: 'Blog / Journal section', found: /\/blog|\/journal|\/news|\/articles/i.test(all) },
    { icon: '🎥', label: 'Video content', found: /youtube|vimeo|wistia|<video/i.test(pageData.bodyText) },
  ];
}

// ─── SERP Position Estimator ─────────────────────────────────────────────────
export interface SERPFactor {
  label: string;
  passed: boolean;
  pts: number;
  tip: string;
}

export function estimateSERPPosition(pageData: PageData | null, mobile: PSIResult): {
  totalScore: number;
  position: string;
  positionColor: string;
  factors: SERPFactor[];
} {
  const cats = mobile.lighthouseResult?.categories ?? mobile.categories;
  const mobPerf = (cats?.performance?.score ?? 0) * 100;
  const seoScore = (cats?.seo?.score ?? 0) * 100;

  const factors: SERPFactor[] = [
    {
      label: 'Mobile performance ≥ 60',
      passed: mobPerf >= 60,
      pts: 25,
      tip: 'Improve mobile speed - compress images and reduce JavaScript',
    },
    {
      label: 'Page title present',
      passed: (pageData?.title?.length ?? 0) > 0,
      pts: 15,
      tip: 'Add a descriptive page title (50–60 characters)',
    },
    {
      label: 'Meta description present',
      passed: (pageData?.metaDesc?.length ?? 0) > 0,
      pts: 10,
      tip: 'Add a compelling meta description (150–160 characters)',
    },
    {
      label: 'H1 heading present',
      passed: pageData?.headings?.some(h => h.tag === 'H1') ?? false,
      pts: 10,
      tip: 'Add one clear H1 heading that includes your main keyword',
    },
    {
      label: 'Content 300+ words',
      passed: (pageData?.wordCount ?? 0) >= 300,
      pts: 10,
      tip: 'Add more content - at least 300 words helps Google understand your page',
    },
    {
      label: 'SEO score ≥ 70',
      passed: seoScore >= 70,
      pts: 20,
      tip: 'Fix SEO issues flagged in the SEO tab',
    },
    {
      label: 'Schema / structured data',
      passed: (pageData?.schema ?? 0) > 0,
      pts: 5,
      tip: 'Add LocalBusiness schema markup to help Google understand your business',
    },
    {
      label: 'Location keyword detected',
      passed: CITIES.some(c => (pageData?.bodyText ?? '').toLowerCase().includes(c)),
      pts: 5,
      tip: 'Mention your city/area on the page to improve local search visibility',
    },
  ];

  const totalScore = factors.filter(f => f.passed).reduce((a, f) => a + f.pts, 0);

  let position: string;
  let positionColor: string;
  if (totalScore >= 85) { position = 'Top of Page 1 🎉 (positions 1–3)'; positionColor = '#10b981'; }
  else if (totalScore >= 70) { position = 'Page 1 visible (positions 4–10)'; positionColor = '#34d399'; }
  else if (totalScore >= 50) { position = 'Lower Page 1 or Page 2 (positions 11–30)'; positionColor = '#f59e0b'; }
  else if (totalScore >= 35) { position = 'Pages 2–3 (hard to find)'; positionColor = '#f97316'; }
  else { position = 'Page 4+ (very hard to find)'; positionColor = '#ef4444'; }

  return { totalScore, position, positionColor, factors };
}

// ─── Font & Third-Party Script Detection ─────────────────────────────────────
export function detectFonts(bodyText: string) {
  const fonts: { name: string; type: string; warning?: string }[] = [];
  if (/fonts\.googleapis\.com/i.test(bodyText)) fonts.push({ name: 'Google Fonts', type: 'CDN', warning: 'Add font-display:swap to prevent invisible text' });
  if (/typekit|use\.typekit\.net/i.test(bodyText)) fonts.push({ name: 'Adobe Fonts (Typekit)', type: 'CDN' });
  if (/fonts\.bunny\.net/i.test(bodyText)) fonts.push({ name: 'Bunny Fonts', type: 'CDN' });
  if (/cloud\.typography/i.test(bodyText)) fonts.push({ name: 'Hoefler & Co', type: 'CDN' });
  if (/use\.fontawesome\.com/i.test(bodyText)) fonts.push({ name: 'Font Awesome', type: 'Icon font', warning: 'Use SVG icons instead for better performance' });
  if (/cdnjs.*font|font.*cdnjs/i.test(bodyText)) fonts.push({ name: 'CDN Fonts', type: 'CDN' });
  if (fonts.length === 0) fonts.push({ name: 'No external fonts detected', type: 'System/Self-hosted' });
  return fonts;
}

export function detectThirdPartyScripts(bodyText: string) {
  const scripts: { name: string; category: string; impact: 'low' | 'medium' | 'high' }[] = [];
  if (/googletagmanager\.com|gtm\.js/i.test(bodyText)) scripts.push({ name: 'Google Tag Manager', category: 'Analytics', impact: 'medium' });
  if (/google-analytics\.com|gtag\.js|G-[A-Z0-9]+/i.test(bodyText)) scripts.push({ name: 'Google Analytics 4', category: 'Analytics', impact: 'low' });
  if (/connect\.facebook\.net|fbq\(/i.test(bodyText)) scripts.push({ name: 'Meta Pixel', category: 'Advertising', impact: 'medium' });
  if (/hotjar\.com/i.test(bodyText)) scripts.push({ name: 'Hotjar', category: 'Heatmaps', impact: 'high' });
  if (/clarity\.ms/i.test(bodyText)) scripts.push({ name: 'Microsoft Clarity', category: 'Heatmaps', impact: 'medium' });
  if (/intercom\.io|intercomcdn/i.test(bodyText)) scripts.push({ name: 'Intercom', category: 'Chat', impact: 'high' });
  if (/tawk\.to/i.test(bodyText)) scripts.push({ name: 'Tawk.to', category: 'Chat', impact: 'high' });
  if (/crisp\.chat/i.test(bodyText)) scripts.push({ name: 'Crisp Chat', category: 'Chat', impact: 'medium' });
  if (/calendly\.com/i.test(bodyText)) scripts.push({ name: 'Calendly', category: 'Booking', impact: 'medium' });
  if (/acuityscheduling|acuity/i.test(bodyText)) scripts.push({ name: 'Acuity Scheduling', category: 'Booking', impact: 'medium' });
  if (/dubsado/i.test(bodyText)) scripts.push({ name: 'Dubsado', category: 'CRM', impact: 'low' });
  if (/honeybook/i.test(bodyText)) scripts.push({ name: 'HoneyBook', category: 'CRM', impact: 'low' });
  if (/youtube\.com\/embed|youtu\.be/i.test(bodyText)) scripts.push({ name: 'YouTube Embed', category: 'Video', impact: 'high' });
  if (/player\.vimeo\.com/i.test(bodyText)) scripts.push({ name: 'Vimeo Embed', category: 'Video', impact: 'high' });
  if (/wistia\.com/i.test(bodyText)) scripts.push({ name: 'Wistia', category: 'Video', impact: 'medium' });
  if (/elfsight\.com|lightwidget|snapwidget/i.test(bodyText)) scripts.push({ name: 'Instagram Widget', category: 'Social', impact: 'medium' });
  if (/mailchimp\.com|mc\.js/i.test(bodyText)) scripts.push({ name: 'Mailchimp', category: 'Email Marketing', impact: 'low' });
  if (/convertkit\.com|ck\.js/i.test(bodyText)) scripts.push({ name: 'ConvertKit/Kit', category: 'Email Marketing', impact: 'low' });
  if (/flodesk/i.test(bodyText)) scripts.push({ name: 'Flodesk', category: 'Email Marketing', impact: 'low' });
  if (/recaptcha\.net|recaptcha/i.test(bodyText)) scripts.push({ name: 'Google reCAPTCHA', category: 'Security', impact: 'medium' });
  return scripts;
}

// ─── Booking Tool Detector ────────────────────────────────────────────────────
export function detectBookingTool(bodyText: string): { name: string; found: boolean } {
  const b = bodyText.toLowerCase();
  if (/sproutstudio|sprout\.studio/i.test(b)) return { name: 'Sprout Studio', found: true };
  if (/honeybook/i.test(b)) return { name: 'HoneyBook', found: true };
  if (/dubsado/i.test(b)) return { name: 'Dubsado', found: true };
  if (/calendly\.com/i.test(b)) return { name: 'Calendly', found: true };
  if (/acuityscheduling|acuity/i.test(b)) return { name: 'Acuity Scheduling', found: true };
  if (/17hats/i.test(b)) return { name: '17Hats', found: true };
  if (/studioninja/i.test(b)) return { name: 'Studio Ninja', found: true };
  if (/tave\.com/i.test(b)) return { name: 'Tave', found: true };
  if (/pixifi/i.test(b)) return { name: 'Pixifi', found: true };
  if (/táve|tave/i.test(b)) return { name: 'Táve', found: true };
  if (/shootq/i.test(b)) return { name: 'ShootQ', found: true };
  if (/iris-works/i.test(b)) return { name: 'Iris Works', found: true };
  if (/book|schedule|appointment|reserve|calendar/i.test(b)) return { name: 'Custom / Unknown', found: true };
  return { name: 'None detected', found: false };
}

// ─── Contact Form Detector ────────────────────────────────────────────────────
export function detectContactForm(bodyText: string, formCount: number): { name: string; found: boolean } {
  const b = bodyText.toLowerCase();
  if (/typeform\.com|typeform/i.test(b)) return { name: 'Typeform', found: true };
  if (/gravityforms|gravity.*form/i.test(b)) return { name: 'Gravity Forms', found: true };
  if (/contact-form-7|wpcf7/i.test(b)) return { name: 'Contact Form 7', found: true };
  if (/wpforms/i.test(b)) return { name: 'WPForms', found: true };
  if (/jotform/i.test(b)) return { name: 'JotForm', found: true };
  if (/formstack/i.test(b)) return { name: 'Formstack', found: true };
  if (/cognito.*form|cognitoforms/i.test(b)) return { name: 'Cognito Forms', found: true };
  if (/wufoo/i.test(b)) return { name: 'Wufoo', found: true };
  if (/showit.*form|showit/i.test(b) && formCount > 0) return { name: 'Showit Native Form', found: true };
  if (formCount > 0) return { name: 'Native HTML Form', found: true };
  return { name: 'No contact form found', found: false };
}

// ─── Global SEO Score ─────────────────────────────────────────────────────────
export function calcGlobalSEOScore(pageData: PageData | null, mobile: PSIResult): { score: number; signals: { label: string; found: boolean; pts: number }[] } {
  const cats = mobile.lighthouseResult?.categories ?? mobile.categories;
  const audits = mobile.lighthouseResult?.audits ?? mobile.audits ?? {};
  const psiSEO = (cats?.seo?.score ?? 0) * 100;

  const signals = [
    { label: 'Page title present (50–60 chars)', found: (pageData?.title?.length ?? 0) >= 50 && (pageData?.title?.length ?? 0) <= 60, pts: 15 },
    { label: 'Meta description present (150–160 chars)', found: (pageData?.metaDesc?.length ?? 0) >= 150 && (pageData?.metaDesc?.length ?? 0) <= 160, pts: 15 },
    { label: 'H1 heading present', found: pageData?.headings?.some(h => h.tag === 'H1') ?? false, pts: 10 },
    { label: 'Canonical URL set', found: !!pageData?.canonical, pts: 10 },
    { label: 'Page is indexable (no noindex)', found: !pageData?.hasNoIndex, pts: 10 },
    { label: 'HTTPS secure connection', found: audits['is-on-https']?.score === 1, pts: 10 },
    { label: 'Structured data / Schema', found: (pageData?.schema ?? 0) > 0, pts: 10 },
    { label: 'Open Graph tags present', found: !!pageData?.og?.title, pts: 5 },
    { label: 'Language attribute set', found: !!pageData?.lang, pts: 5 },
    { label: 'Google PSI SEO score ≥ 80', found: psiSEO >= 80, pts: 10 },
  ];

  const score = signals.filter(s => s.found).reduce((a, s) => a + s.pts, 0);
  return { score, signals };
}

// ─── Keyword Filter ───────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  // Common English stop words
  'this','that','with','from','have','been','were','they','what','when','where','which',
  'will','your','their','there','about','also','more','than','some','then','into','over',
  'each','very','just','like','after','before','would','could','should','shall','might',
  'must','been','being','having','doing','going','coming','taking','making','using',
  'only','other','another','under','within','without','during','through','between',
  'these','those','same','such','both','many','most','much','even','back','well',
  'still','here','down','away','again','upon','around','while','since','until',
  'across','along','among','behind','beside','against','towards','whether','because',
  'then','them','they','have','from','been','with','will','your','that','this','were',
  'page','site','website','click','read','more','view','learn','about','contact','home',
  // CSS / HTML / JS terms
  'font','size','color','background','padding','margin','border','width','height',
  'display','position','style','class','span','href','data','none','auto','flex',
  'grid','block','inline','fixed','absolute','relative','rgba','webkit','scroll',
  'overflow','opacity','cursor','pointer','center','left','right','false','true',
  'null','undefined','function','return','const','type','import','export','value',
  'image','images','https','http','html','body','head','meta','link','script','text',
  'section','footer','header','main','article','aside','figure','content','canvas',
  'object','array','string','number','boolean','default','index','event','render',
  // Showit internal JSON config properties (appear in raw HTML source)
  'bgmediatype','bgfilltype','bgcolor','bgopacity','bgpos','bgscale','bgimage','bgrepeat',
  'bgtransition','bgvideo','bgvideoloop','bgvideoauto','bgvideostart','bgvideoend',
  'locking','visible','states','scrolloffset','dropdown','aspect','ratio','fade','cover',
  'slug','canvas','canvasid','widgetid','pageid','siteid','sectionid','elementid',
  'zindex','zorder','layer','layers','layout','widget','widgets','element','elements',
  'showit','showitsite','showitapp','showitdesign','showitcms',
  'animtype','animdelay','animduration','animoffset','animeasing','animation',
  'fontweight','fontfamily','fontsize','fontcolor','fontcase','fontstyle','fontline',
  'textalign','textcolor','textshadow','textdecoration','textoverflow','letterspacing',
  'lineheight','wordspacing','boxshadow','borderradius','borderstyle','bordercolor',
  'transform','transition','translate','rotate','scale','skew','matrix',
  'minwidth','maxwidth','minheight','maxheight','itemscount','itemspacing',
  'mobilehidden','tablethidden','desktophidden','responsive','breakpoint',
  'hover','active','focus','disabled','checked','selected','expanded','collapsed',
  'true','false','null','undefined','object','array','number','integer','float',
  // Generic noise words - visual/layout config terms that leak from Showit JSON
  'colors','color','horizontal','vertical','silver','north','south','east','west',
  'face','faces','sizes','weights','shapes','shadows','stroke','fill','opacity',
  'offset','rules','cover','ratio','states','side','house','nature','title',
  'name','item','items','list','icon','button','input','label','form','field',
  'area','region','zone','group','wrap','wrapper','container','inner','outer',
  // Showit section/page names appearing in HTML source
  'assets','static','hero','intro','floating','galleries','gallery','portfolio',
  'mobile','desktop','tablet','phone','device','viewport','breakpoint',
  'menu','navigation','sidebar','column','columns','rows',
  'vigin','virgin','virginia','outro','banner','slider','carousel',
  'photo','photos','shoot','session','booking','book',
  'pricing','price','packages','package','service','services','blog','post','posts',
  'wedding','engagement','family','senior','newborn','maternity','boudoir',
  'commercial','editorial','lifestyle','fashion','portrait','portraits',
  'lightroom','photoshop','preset','presets','camera','lens','lighting',
  'pinterest','instagram','facebook','twitter','tiktok','youtube','social',
]);

export function getFilteredKeywords(bodyText: string): Array<[string, number]> {
  const words = bodyText.toLowerCase()
    // Strip URLs
    .replace(/https?:\/\/\S+/g, ' ')
    // Strip JSON-like keys: "someKey": → remove
    .replace(/"[a-z][a-z0-9]*"\s*:/g, ' ')
    // Strip Showit section/widget class names and IDs
    .replace(/\b(canvas|widget|section|element|layer|page|site|block|comp|node)[_-]?[a-z0-9_-]*/gi, ' ')
    // Strip file paths and asset names
    .replace(/\/(assets|static|images|img|media|uploads|files|wp-content|wp-includes)[^\s]*/gi, ' ')
    // Strip words that are purely uppercase abbreviations or IDs
    .replace(/\b[A-Z]{2,}\b/g, ' ')
    // Strip hex colors
    .replace(/#[0-9a-fA-F]{3,8}\b/g, ' ')
    // Strip anything that looks like a camelCase or compound config key
    .replace(/\b[a-z]*(bg|id|ids|css|url|src|img|btn|nav|div|px|em|rem|rgb|hex|svg|cdn|api|cms|seo|json|xml|js|ts)[a-z0-9]*\b/g, ' ')
    // Strip short tokens, numbers, punctuation
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => {
      if (w.length <= 3) return false;
      if (w.length >= 20) return false;
      if (STOP_WORDS.has(w)) return false;
      if (/^\d+$/.test(w)) return false;
      // Reject words with 4+ consecutive consonants (gibberish / encoded strings)
      if (/[^aeiou]{4,}/i.test(w)) return false;
      // Reject words where vowels are less than 28% of letters (font hash tokens, IDs, designer names)
      const vowels = (w.match(/[aeiou]/g) || []).length;
      if (vowels / w.length < 0.28) return false;
      // Reject font names and CSS noise words
      if (/^(muli|lato|mono|bold|thin|light|black|italic|oblique|regular|medium|heavy|ultra|semi|extra|condensed|expanded|narrow|wide|rounded|display|headline|caption|body|text|sans|serif|slab|script|handwriting|decorative|symbol|emoji|icon|dingbat|webfont|woff|ttf|otf|eot|subset|unicode|latin|greek|cyrillic|arabic|hebrew|chinese|japanese|korean|devanagari)$/i.test(w)) return false;
      // Reject obvious CSS animation / transition terms
      if (/^(fadein|fadeout|slidein|slideout|zoomin|zoomout|bounce|pulse|shake|spin|flip|rotate|scale|translate|skew|matrix|keyframe|easing|linear|ease|cubic|bezier|spring|tween|morph|blend|wipe|reveal|parallax|sticky|scroll|trigger|threshold|observer|intersection|mutation|resize|load|unload|mount|unmount|render|hydrate|rehydrate|serialize|deserialize|stringify|parse|encode|decode|hash|token|timestamp|version|revision|build|release|deploy|compile|bundle|chunk|vendor|polyfill|shim|mixin|helper|utility|plugin|module|component|service|provider|factory|singleton|instance|prototype|constructor|destructor|getter|setter|accessor|mutator)$/i.test(w)) return false;
      return true;
    });

  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] ?? 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 25);
}

// ─── What's Working ───────────────────────────────────────────────────────────
export function getPassingChecks(pageData: PageData | null, mobile: PSIResult) {
  const cats = mobile.lighthouseResult?.categories ?? mobile.categories;
  const audits = mobile.lighthouseResult?.audits ?? mobile.audits ?? {};
  const passing: { icon: string; label: string }[] = [];

  if (audits['is-on-https']?.score === 1) passing.push({ icon: '🔒', label: 'HTTPS / SSL enabled' });
  if ((pageData?.title?.length ?? 0) > 0) passing.push({ icon: '📝', label: 'Page title set' });
  if ((pageData?.metaDesc?.length ?? 0) > 0) passing.push({ icon: '💬', label: 'Meta description present' });
  if (pageData?.headings?.some(h => h.tag === 'H1')) passing.push({ icon: '🏷️', label: 'H1 heading found' });
  if (pageData?.canonical) passing.push({ icon: '🔗', label: 'Canonical URL set' });
  if (pageData?.lang) passing.push({ icon: '🌐', label: `Language declared (${pageData.lang})` });
  if (pageData?.favicon) passing.push({ icon: '🖼️', label: 'Favicon present' });
  if (pageData?.analytics?.ga4 || pageData?.analytics?.gtm) passing.push({ icon: '📊', label: 'Analytics tracking installed' });
  if ((pageData?.schema ?? 0) > 0) passing.push({ icon: '🏷️', label: 'Structured data (Schema) found' });
  if (pageData?.og?.title) passing.push({ icon: '📱', label: 'Open Graph tags present' });
  if (pageData?.regions?.main) passing.push({ icon: '🏗️', label: 'Semantic HTML structure (<main>)' });
  if ((cats?.performance?.score ?? 0) >= 0.9) passing.push({ icon: '⚡', label: 'Excellent mobile performance' });
  if ((cats?.seo?.score ?? 0) >= 0.9) passing.push({ icon: '🔍', label: 'Strong SEO score' });
  if ((cats?.accessibility?.score ?? 0) >= 0.9) passing.push({ icon: '♿', label: 'Great accessibility score' });
  if (audits['uses-https']?.score === 1 || audits['is-on-https']?.score === 1)
    passing.push({ icon: '🛡️', label: 'Secure connection (HTTPS)' });
  if ((pageData?.images?.length ?? 0) > 0 && (pageData?.images?.filter(i => !i.hasAlt).length ?? 0) === 0)
    passing.push({ icon: '✅', label: 'All images have alt text' });

  return passing;
}
