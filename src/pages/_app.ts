import type { App } from 'vue'
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY, ElMessage } from 'element-plus'

export default (app: App) => {
  app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
  app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
  if (typeof window !== 'undefined') {
    ;(window as any).ElMessage = ElMessage
  }
}
