import type { ObjectDirective, DirectiveBinding, VNode } from 'vue'
import { nextTick } from 'vue'
import { debounce } from 'ts-debounce'

// 用于存储全局性的resize事件
const globalEventListener = {
  f: () => { }
}

interface HTMLElement {
  f: () => void
  offsetTop: number
  offsetParent: HTMLElement
}

interface IOffset {
  bottomOffset: number
  topOffset: number
}

//
function getOffsetTop(elem: HTMLElement): number {
  let top = elem.offsetTop;
  let parent = elem.offsetParent;
  while (parent) {
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return top;
}

// 表格从页面底部开始的高度。

const calcTableHeight = (element: HTMLElement, offset: IOffset) => {
  const wiH = window.innerHeight || 400

  const offsetTop = getOffsetTop(element)

  const elOB = offset.bottomOffset || 40

  const height = wiH - elOB - offsetTop
  return height
}

const doTableResize = async (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
  const { instance } = binding
  // https://github.com/vuejs/core/issues/2562
  const $table: any = instance!.$refs['ElTablePlusRef']
  const { value } = binding

  if (!$table) return
  const height = calcTableHeight(el, value)
  $table.$nextTick(() => {
    $table.layout.setHeight(height)
    $table.doLayout()
  })
}

const vHeightAdaptive: ObjectDirective = {
  mounted(el: HTMLElement, binding: any, vnode: VNode) {
    const elType = el as unknown as HTMLElement
    const resizeListener = () => doTableResize(elType, binding, vnode)
    globalEventListener.f = debounce(resizeListener, 100)
    window.addEventListener('resize', globalEventListener.f)
    // 立刻执行一次
    doTableResize(elType, binding, vnode)
  },
  updated(el, binding, vnode) {
    window.removeEventListener('resize', globalEventListener.f)

    const elType = el as unknown as HTMLElement
    const resizeListener = () => doTableResize(elType, binding, vnode)
    globalEventListener.f = debounce(resizeListener, 100)
    window.addEventListener('resize', globalEventListener.f)

    doTableResize(el as unknown as HTMLElement, binding, vnode)
  },
  unmounted() {
    window.removeEventListener('resize', globalEventListener.f)
  },
}

export default vHeightAdaptive
