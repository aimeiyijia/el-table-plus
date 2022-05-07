import Vue, { DirectiveOptions, VNode } from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import { debounce } from 'ts-debounce'

// 用于存储全局性的resize事件
const globalEventListener = {
  f: () => {}
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

const doTableResize = (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
  const { componentInstance } = vnode

  // todo ts 报 Table里面没有layout属性，但是在原型链上可以看到
  const $table = componentInstance as any
  const { value } = binding
  if (!$table.height) {
    throw new Error(
      "el-table must set the height. Such as height='10px' or height='0'"
    )
  }

  if (!$table) return
  const height = calcTableHeight(el, value)
  $table.$nextTick(() => {
    $table.layout.setHeight(height)
    $table.doLayout()
  })
}

const directive: DirectiveOptions = {
  bind(el, binding, vnode) {
    const elType = el as unknown as HTMLElement
    const resizeListener = () => doTableResize(elType, binding, vnode)
    globalEventListener.f = debounce(resizeListener, 100)
    window.addEventListener('resize', globalEventListener.f)
    // 立刻执行一次
    doTableResize(elType, binding, vnode)
  },
  update(el, binding, vnode) {
    window.removeEventListener('resize', globalEventListener.f)

    const elType = el as unknown as HTMLElement
    const resizeListener = () => doTableResize(elType, binding, vnode)
    globalEventListener.f = debounce(resizeListener, 100)
    window.addEventListener('resize', globalEventListener.f)

    doTableResize(el as unknown as HTMLElement, binding, vnode)
  },
  unbind() {
    window.removeEventListener('resize', globalEventListener.f)
  },
}

Vue.directive('height-adaptive', directive)
