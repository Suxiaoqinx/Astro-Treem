import { visit } from 'unist-util-visit';

export function rehypeTableWrapper() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table') {
        // Check if already wrapped to prevent infinite loops or double wrapping
        if (
          parent &&
          parent.tagName === 'div' &&
          Array.isArray(parent.properties.className) &&
          parent.properties.className.includes('table-wrapper')
        ) {
          return;
        }

        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-wrapper'],
          },
          children: [node],
        };

        parent.children[index] = wrapper;
      }
    });
  };
}
