export function autoFocusOut(node, focusoutAction) {
  const focusInAction = e => e.stopPropagation();
  setTimeout(() => {
    node.addEventListener("click", focusInAction)
    window.addEventListener("click", focusoutAction)

    return {
      destroy() {
        node.removeEventListener("click", focusInAction)
        window.addEvremoveEventListenrentListener("click", focusoutAction)
      }
    }
  })
}