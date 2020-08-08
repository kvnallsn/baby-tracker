// Portal Implementation

let state = {};

export function portal(node, selector) {
  state[selector] = state[selector] || {};

  // Store this portal's children
  state[selector].portalChildren = node.children;

  // Find where the portal should go
  state[selector].targetNode = document.querySelector(selector);

  // Backup the children of what the portal will replace
  state[selector].targetNodeChildren = state[selector].targetNode.children;

  // Replace the original contents of the targetNode with the portal
  state[selector].targetNode.innerHTML = '';
  state[selector].targetNode.append(...state[selector].portalChildren);

  // On destroy, swap back original contents
  return {
    destroy() {
      state[selector].portalChildren = state[selector].portalChildren.clone;
      state[selector].targetNode.innerHTML = '';
      state[selector].targetNode.append(...state[selector].targetNodeChildren);
    }
  }
}
