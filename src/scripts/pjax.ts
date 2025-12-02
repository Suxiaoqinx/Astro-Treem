const CONTAINER_ID = 'pjax-container'
const PROGRESS_ID = 'pjax-progress'
const PROGRESS_STYLE_ID = 'pjax-progress-style'
let progressTimer: number | null = null

function ensureProgressDom() {
  if (!document.getElementById(PROGRESS_STYLE_ID)) {
    const style = document.createElement('style')
    style.id = PROGRESS_STYLE_ID
    style.textContent = `#${PROGRESS_ID}{position:fixed;top:0;left:0;height:2px;width:0;background:#409eff;z-index:9999;opacity:0;transition:width .2s ease, opacity .3s ease}`
    document.head.appendChild(style)
  }
  if (!document.getElementById(PROGRESS_ID)) {
    const bar = document.createElement('div')
    bar.id = PROGRESS_ID
    document.body.appendChild(bar)
  }
}

function setBarWidth(p: number) {
  const bar = document.getElementById(PROGRESS_ID)
  if (bar) (bar as HTMLElement).style.width = `${Math.max(0, Math.min(100, p))}%`
}

function startProgress() {
  ensureProgressDom()
  const bar = document.getElementById(PROGRESS_ID) as HTMLElement | null
  if (!bar) return
  bar.style.opacity = '1'
  setBarWidth(0)
  if (progressTimer) window.clearInterval(progressTimer)
  let p = 0
  progressTimer = window.setInterval(() => {
    p += Math.random() * 12 + 8
    if (p > 90) p = 90
    setBarWidth(p)
  }, 200) as unknown as number
}

function doneProgress() {
  const bar = document.getElementById(PROGRESS_ID) as HTMLElement | null
  if (progressTimer) { window.clearInterval(progressTimer); progressTimer = null }
  if (!bar) return
  setBarWidth(100)
  window.setTimeout(() => {
    bar.style.opacity = '0'
    setBarWidth(0)
  }, 300)
}

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
    if (!replace) history.pushState({}, '', url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    doneProgress()
  } else {
    doneProgress()
    window.location.href = url
  }
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
