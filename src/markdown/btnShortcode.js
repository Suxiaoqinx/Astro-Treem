import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'

export default function btnShortcode() {
  return (tree) => {
    visit(tree, (node) => {
      const isDir = node.type === 'textDirective' || node.type === 'leafDirective' || node.type === 'containerDirective'
      if (!isDir || node.name !== 'btn') return

      const attrs = node.attributes || {}
      const label = (node.label && String(node.label)) || '按钮'
      const link = String(attrs.link || attrs.href || '#')
      const typeMap = { info: 'info', success: 'success', warning: 'warning', error: 'danger', import: 'primary', primary: 'primary' }
      const t = typeMap[String(attrs.type || 'primary')] || 'primary'
      const size = String(attrs.size || 'large')
      const classes = [
        'el-button',
        `el-button--${t}`,
        size === 'large' ? 'el-button--large' : (size === 'small' ? 'el-button--small' : ''),
        'is-round'
      ].filter(Boolean)

      node.data = node.data || {}
      node.data.hName = 'a'
      node.data.hProperties = { href: link, className: classes, class: classes.join(' ') }
      node.data.hChildren = [{ type: 'text', value: label }]
    })
  }
}

export const remarkBtnShortcode = [remarkDirective, btnShortcode]
