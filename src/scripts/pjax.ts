const CONTAINER_ID = 'pjax-container'
const PROGRESS_ID = 'pjax-progress'
const PROGRESS_STYLE_ID = 'pjax-progress-style'
const SPINNER_CLASS = 'spinner'
const SANDBOX_ID = 'img-sandbox'
const SANDBOX_STYLE_ID = 'img-sandbox-style'
const SKELETON_ID = 'page-skeleton'
const SKELETON_STYLE_ID = 'page-skeleton-style'
let sandboxImages: string[] = []
let sandboxIndex = 0
let sandboxProgressTimer: number | null = null

function ensureProgressDom() {
  if (!document.getElementById(PROGRESS_STYLE_ID)) {
    const style = document.createElement('style')
    style.id = PROGRESS_STYLE_ID
    style.textContent = `#${PROGRESS_ID}{position:fixed;inset:0;background:rgba(255,255,255,.6);backdrop-filter:blur(2px);z-index:9999;opacity:0;transition:opacity .2s ease;display:flex;align-items:center;justify-content:center;pointer-events:none}
#${PROGRESS_ID} .${SPINNER_CLASS}{width:48px;height:48px;border:4px solid rgba(64,158,255,.3);border-top-color:#409eff;border-radius:50%;animation:pjax-spin 1s linear infinite}
@keyframes pjax-spin{to{transform:rotate(360deg)}}`
    document.head.appendChild(style)
  }
  if (!document.getElementById(PROGRESS_ID)) {
    const overlay = document.createElement('div')
    overlay.id = PROGRESS_ID
    const spinner = document.createElement('div')
    spinner.className = SPINNER_CLASS
    overlay.appendChild(spinner)
    document.body.appendChild(overlay)
  }
}

function startProgress() {
  ensureProgressDom()
  ensureSkeletonDom()
  const overlay = document.getElementById(PROGRESS_ID) as HTMLElement | null
  if (!overlay) return
  overlay.style.opacity = '1'
  overlay.style.pointerEvents = 'auto'
  const sk = document.getElementById(SKELETON_ID) as HTMLElement | null
  if (sk) sk.classList.add('show')
}

function doneProgress() {
  const overlay = document.getElementById(PROGRESS_ID) as HTMLElement | null
  if (!overlay) return
  window.setTimeout(() => {
    overlay.style.opacity = '0'
    overlay.style.pointerEvents = 'none'
  }, 300)
  const sk = document.getElementById(SKELETON_ID) as HTMLElement | null
  if (sk) {
    window.setTimeout(() => { sk.classList.remove('show') }, 300)
  }
}

// Image sandbox (lightbox)
function ensureSandboxDom() {
  if (!document.getElementById(SANDBOX_STYLE_ID)) {
    const style = document.createElement('style')
    style.id = SANDBOX_STYLE_ID
    style.textContent = `#${SANDBOX_ID}{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.35);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;pointer-events:none}
#${SANDBOX_ID}.show{opacity:1;pointer-events:auto}
#${SANDBOX_ID} .panel{background:#fff;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.25);max-width:90vw;max-height:80vh;overflow:auto}
#${SANDBOX_ID} .panel-img{display:block;max-width:80vw;max-height:70vh;margin:24px;border-radius:8px}
#${SANDBOX_ID} .controls{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.9);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.2);padding:8px 12px}
#${SANDBOX_ID} .btn{border:none;background:#f2f3f5;color:#333;border-radius:6px;padding:6px 10px;cursor:pointer}
#${SANDBOX_ID} .btn:disabled{opacity:.5;cursor:not-allowed}
#${SANDBOX_ID} .indicator{color:#666;font-size:12px}
#${SANDBOX_ID} .progress{position:fixed;bottom:64px;left:50%;transform:translateX(-50%);width:60%;max-width:480px;height:4px;background:rgba(255,255,255,.9);border-radius:2px;overflow:hidden;box-shadow:0 6px 16px rgba(0,0,0,.15)}
#${SANDBOX_ID} .progress.hidden{display:none}
#${SANDBOX_ID} .progress-bar{height:100%;width:0;background:#409eff;border-radius:2px;transition:width .2s ease}`
    document.head.appendChild(style)
  }
  if (!document.getElementById(SANDBOX_ID)) {
    const box = document.createElement('div')
    box.id = SANDBOX_ID
    const panel = document.createElement('div')
    panel.className = 'panel'
    const img = document.createElement('img')
    img.className = 'panel-img'
    panel.appendChild(img)
    box.appendChild(panel)

    const controls = document.createElement('div')
    controls.className = 'controls'
    const prev = document.createElement('button')
    prev.className = 'btn prev'
    prev.textContent = '‹'
    const indicator = document.createElement('span')
    indicator.className = 'indicator'
    indicator.textContent = '1/1'
    const next = document.createElement('button')
    next.className = 'btn next'
    next.textContent = '›'
    const close = document.createElement('button')
    close.className = 'btn close'
    close.textContent = '✕'
    controls.appendChild(prev)
    controls.appendChild(indicator)
    controls.appendChild(next)
    controls.appendChild(close)
    box.appendChild(controls)

    const progress = document.createElement('div')
    progress.className = 'progress hidden'
    const progressBar = document.createElement('div')
    progressBar.className = 'progress-bar'
    progress.appendChild(progressBar)
    box.appendChild(progress)

    box.addEventListener('click', (e) => {
      const t = e.target as HTMLElement
      const isInsidePanel = t.closest('.panel')
      const isBtn = t.closest('.btn')
      if (!isInsidePanel && !isBtn) closeSandbox()
    })
    document.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key
      if (k === 'Escape') closeSandbox()
      else if (k === 'ArrowLeft') moveSandbox(-1)
      else if (k === 'ArrowRight') moveSandbox(1)
    })
    document.body.appendChild(box)
  }
}

function renderSandbox() {
  ensureSandboxDom()
  const box = document.getElementById(SANDBOX_ID) as HTMLElement | null
  const img = box?.querySelector('.panel-img') as HTMLImageElement | null
  const indicator = box?.querySelector('.indicator') as HTMLElement | null
  const prevBtn = box?.querySelector('.prev') as HTMLButtonElement | null
  const nextBtn = box?.querySelector('.next') as HTMLButtonElement | null
  const progress = box?.querySelector('.progress') as HTMLElement | null
  const progressBar = box?.querySelector('.progress-bar') as HTMLElement | null
  if (!box || !img || !indicator || !prevBtn || !nextBtn) return
  // start loading progress (indeterminate to 90%)
  if (progress && progressBar) {
    progress.classList.remove('hidden')
    progressBar.style.width = '0%'
    if (sandboxProgressTimer) { window.clearInterval(sandboxProgressTimer); sandboxProgressTimer = null }
    let p = 0
    sandboxProgressTimer = window.setInterval(() => {
      p += Math.random() * 12 + 8
      if (p > 90) p = 90
      progressBar.style.width = `${p}%`
    }, 180) as unknown as number
  }

  // set image src and bind onload/onerror
  img.onload = () => {
    if (sandboxProgressTimer) { window.clearInterval(sandboxProgressTimer); sandboxProgressTimer = null }
    if (progressBar) progressBar.style.width = '100%'
    window.setTimeout(() => { progress && progress.classList.add('hidden'); if (progressBar) progressBar.style.width = '0%' }, 300)
  }
  img.onerror = () => {
    if (sandboxProgressTimer) { window.clearInterval(sandboxProgressTimer); sandboxProgressTimer = null }
    progress && progress.classList.add('hidden')
    if (progressBar) progressBar.style.width = '0%'
  }

  img.src = sandboxImages[sandboxIndex]
  indicator.textContent = `${sandboxIndex + 1}/${sandboxImages.length}`
  prevBtn.disabled = sandboxImages.length <= 1 || sandboxIndex === 0
  nextBtn.disabled = sandboxImages.length <= 1 || sandboxIndex === sandboxImages.length - 1
  box.classList.add('show')
}

function closeSandbox() {
  const box = document.getElementById(SANDBOX_ID) as HTMLElement | null
  if (!box) return
  box.classList.remove('show')
}

function moveSandbox(step: number) {
  const next = sandboxIndex + step
  if (next < 0 || next >= sandboxImages.length) return
  sandboxIndex = next
  renderSandbox()
}

function onImageClick(e: Event) {
  const target = e.target as HTMLElement
  const container = document.getElementById(CONTAINER_ID)
  if (!container) return
  const contentRoot = container.querySelector('.post-content-card .prose') as HTMLElement | null
  // only enable sandbox on post article page
  if (!contentRoot) return
  const img = target.closest('img') as HTMLImageElement | null
  if (!img) return
  if (!contentRoot.contains(img)) return
  const a = target.closest('a') as HTMLAnchorElement | null
  if (a && contentRoot.contains(a)) {
    const href = a.getAttribute('href') || ''
    // open sandbox only when anchor points to an image or no href
    if (!href || /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(href)) e.preventDefault()
  }
  // collect images only within article content
  const imgs = Array.from(contentRoot.querySelectorAll('img')) as HTMLImageElement[]
  sandboxImages = imgs.map((x) => x.src)
  sandboxIndex = Math.max(0, sandboxImages.findIndex((s) => s === img.src))
  const box = document.getElementById(SANDBOX_ID) as HTMLElement | null
  if (box) {
    const prevBtn = box.querySelector('.prev') as HTMLButtonElement | null
    const nextBtn = box.querySelector('.next') as HTMLButtonElement | null
    const closeBtn = box.querySelector('.close') as HTMLButtonElement | null
    prevBtn && prevBtn.addEventListener('click', () => moveSandbox(-1))
    nextBtn && nextBtn.addEventListener('click', () => moveSandbox(1))
    closeBtn && closeBtn.addEventListener('click', () => closeSandbox())
  }
  renderSandbox()
}

ensureSandboxDom()
document.addEventListener('click', onImageClick, true)

function isSameOrigin(url: string) {
  try {
    const u = new URL(url, window.location.href)
    return u.origin === window.location.origin
  } catch {
    return false
  }
}

function runScripts(root: HTMLElement) {
  const scripts = Array.from(root.querySelectorAll('script'))
  for (const s of scripts) {
    const copy = document.createElement('script')
    // copy attributes
    for (const { name, value } of Array.from(s.attributes)) copy.setAttribute(name, value)
    if ((s as HTMLScriptElement).src) {
      copy.src = (s as HTMLScriptElement).src
    } else {
      copy.textContent = s.textContent || ''
    }
    // prevent infinite loop when re-inserting same inline marker
    copy.removeAttribute('data-astro-cid')
    document.head.appendChild(copy)
  }
}

async function navigate(url: string, replace = false) {
  const container = document.getElementById(CONTAINER_ID)
  if (!container) {
    window.location.href = url
    return
  }
  startProgress()
  const prevMinH = container.style.minHeight
  container.style.minHeight = `${container.offsetHeight}px`
  const res = await fetch(url, { headers: { 'X-PJAX': 'true' } })
  const ct = res.headers.get('content-type') || ''
  const html = await res.text()
  const dom = new DOMParser().parseFromString(html, 'text/html')
  const next = dom.getElementById(CONTAINER_ID)
  const title = dom.querySelector('title')?.textContent || document.title
  if (next && ct.includes('text/html')) {
    container.innerHTML = next.innerHTML
    document.title = title
    runScripts(container)
    try {
      document.dispatchEvent(new Event('astro:page-load'))
    } catch {}
    if (!replace) history.pushState({}, '', url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    doneProgress()
  } else {
    doneProgress()
    window.location.href = url
  }
  // release layout lock
  container.style.minHeight = prevMinH
}

function onClick(e: Event) {
  const target = e.target as HTMLElement
  const a = target?.closest('a') as HTMLAnchorElement | null
  if (!a) return
  const href = a.getAttribute('href') || ''
  if (!href || !isSameOrigin(href)) return
  if (a.target === '_blank') return
  const me = e as MouseEvent
  if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return
  const url = new URL(href, window.location.href)
  // allow same-page hash navigation without PJAX
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return
  e.preventDefault()
  navigate(href)
}

window.addEventListener('popstate', () => navigate(window.location.href, true))
document.addEventListener('click', onClick, true)

;(window as any).pjaxNavigate = navigate
function ensureSkeletonDom() {
  if (!document.getElementById(SKELETON_STYLE_ID)) {
    const style = document.createElement('style')
    style.id = SKELETON_STYLE_ID
    style.textContent = `#${SKELETON_ID}{position:fixed;inset:0;z-index:9998;background:#fff;opacity:0;transition:opacity .2s;pointer-events:none}
#${SKELETON_ID}.show{opacity:1;pointer-events:auto}
#${SKELETON_ID} .wrap{max-width:85rem;margin:0 auto;padding:24px}
#${SKELETON_ID} .grid{display:grid;gap:24px;align-items:start;grid-template-columns:360px 1fr}
#${SKELETON_ID} .card{border:1px solid #e5e7eb;border-radius:20px;padding:16px;background:#fafafa}
#${SKELETON_ID} .skel{height:14px;border-radius:8px;background:linear-gradient(90deg,#eee 25%,#f5f5f5 45%,#eee 65%);background-size:200% 100%;animation:shimmer 1.2s ease-in-out infinite}
#${SKELETON_ID} .bar{height:24px;margin:8px 0}
#${SKELETON_ID} .line{margin:8px 0}
#${SKELETON_ID} .block{height:160px;border-radius:12px;margin:8px 0}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`
    document.head.appendChild(style)
  }
  if (!document.getElementById(SKELETON_ID)) {
    const box = document.createElement('div')
    box.id = SKELETON_ID
    const wrap = document.createElement('div')
    wrap.className = 'wrap'
    const grid = document.createElement('div')
    grid.className = 'grid'
    const left = document.createElement('div')
    const right = document.createElement('div')
    const lcard1 = document.createElement('div'); lcard1.className = 'card'; lcard1.innerHTML = `<div class="bar skel"></div><div class="line skel"></div><div class="line skel"></div>`
    const lcard2 = document.createElement('div'); lcard2.className = 'card'; lcard2.innerHTML = `<div class="line skel"></div><div class="line skel"></div><div class="line skel"></div><div class="line skel"></div>`
    const lcard3 = document.createElement('div'); lcard3.className = 'card'; lcard3.innerHTML = `<div class="line skel"></div><div class="line skel"></div><div class="line skel"></div>`
    left.appendChild(lcard1); left.appendChild(lcard2); left.appendChild(lcard3)
    const rcard = document.createElement('div'); rcard.className = 'card'; rcard.innerHTML = `<div class="bar skel"></div><div class="line skel"></div><div class="line skel"></div><div class="block skel"></div><div class="line skel"></div>`
    right.appendChild(rcard)
    grid.appendChild(left); grid.appendChild(right)
    wrap.appendChild(grid)
    box.appendChild(wrap)
    document.body.appendChild(box)
  }
}
