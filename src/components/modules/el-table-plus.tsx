import {
  h,
  ref,
  defineComponent,
  computed,
  watchEffect,
  toRaw,
  PropType,
  withDirectives,
  DirectiveArguments,
  reactive,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  watch
} from 'vue'
import vHeightAdaptive from '../directives/height-adaptive'
import { generateUUID } from '../utils/uuid'
import { isBoolean, isString, isObject, isUndefined, isFunction } from '../utils/types'
import { omit } from '../utils/opera'

import type { ElTable, ElPagination, ElTableColumn } from 'element-plus'
// 样式
import '../styles/index.scss'

import usePag from '../utils/store'

// Exclude<T, U> - 用于从类型T中去除不在U类型中的成员
// Extract<T, U> - 用于从类型T中取出可分配给U类型的成员
// NonNullable<T> - 用于从类型T中去除undefined和null类型
// ReturnType<T> - 获取函数类型的返回类型
// InstanceType<T> - 获取构造函数的实例类型

// 默认分页配置
declare class ElTableTsDefPagination {
  pageSizes: number[]
  layout: string
  background: boolean
  defaultPageSize: number
  defaultCurrentPage: number
}

declare interface IDirectives {
  heightAdaptive?: {
    bottomOffset: number
  }
}



type ElTableType = InstanceType<typeof ElTable>;
type ElTableColumType = InstanceType<typeof ElTableColumn>;
type ElPaginationType = InstanceType<typeof ElPagination>;

declare interface IElTablePlusColumn extends ElTableColumType {
  hidden: boolean | ((columns: IElTablePlusColumn) => boolean)
}

const ElTablePlusProps = {
  data: {
    type: [Array] as PropType<any[]>,
    default: () => [],
  },
  columns: {
    type: [Array] as PropType<IElTablePlusColumn[]>,
    default: () => [],
  },
  colAttrs: {
    type: [Object] as PropType<IElTablePlusColumn>,
    default: () => ({}),
  },
  autoToTop: {
    type: Boolean,
    default: true
  },
  directives: {
    type: [Object] as PropType<boolean | IDirectives | undefined>,
    default: () => { return { heightAdaptive: { bottomOffset: 40 } } },
  },
  pagination: {
    type: [Object, Boolean] as PropType<boolean | ElPaginationType>,
    default: () => { },
  },
  total: {
    type: Number,
    default: 0,
  }
  // onClick: [Function] as PropType<(e: MouseEvent) => void>,
} as const

export default defineComponent({
  name: 'ElTablePlus',
  props: ElTablePlusProps,
  emits: ['scroll', 'page-change', 'current-change', 'size-change', 'prev-click', 'next-click'],
  setup(props, { attrs, slots, emit }) {

    console.log(props, 'props')
    console.log(attrs, 'attrs')

    const { PagStore, setCurrentPage, setPageSize } = usePag()
    console.log(PagStore, '23456')
    // 是否展示分页器
    let isShowPag = ref(true)

    const ElTablePlusRef = ref(null)
    let tableInstance: any
    onMounted(() => {
      console.log(ElTablePlusRef.value, '表格容器')
      tableInstance = ElTablePlusRef.value
    })

    function setTableScrollToTop() {
      if (isUndefined(props.autoToTop) || (isBoolean(props.autoToTop) && props.autoToTop)) {
        tableInstance.setScrollTop(0)
      }
    }

    // 统一化的列配置项
    const columnsAttrs = computed<IElTablePlusColumn>(() => props.colAttrs)
    // 移除掉分页相关的属性后剩下的表格属性
    const tableAttrs = omit(attrs, ['page-change', 'current-change', 'size-change', 'prev-click', 'next-click'])

    // 默认分页配置
    const defPagination: ElTableTsDefPagination = {
      pageSizes: [10, 20, 30, 50],
      layout: 'prev, pager, next, sizes, total',
      background: true,
      defaultPageSize: 10,
      defaultCurrentPage: 1
    }
    watchEffect(() => {
      const pagination = props.pagination
      if (isBoolean(pagination)) {
        isShowPag.value = (pagination as boolean)
      }
      if (isObject(pagination)) {
        isShowPag.value = true
        Object.assign(defPagination, pagination)
        const { defaultCurrentPage, defaultPageSize } = pagination as ElPaginationType
        defaultCurrentPage && setCurrentPage(defaultCurrentPage)
        defaultPageSize && setPageSize(defaultPageSize)
      }
    })

    watch(() => PagStore.currentPage, (val, oldVal) => {
      // 如果新值大于旧值则点击的是下一步，否则则为上一步
      val > oldVal ? handleNextClick() : handlePrevClick()
    })
    watch(() => PagStore.pageSize, () => {
      handlePageSizeChange()
    })

    function handlePageSizeChange() {
      emit('size-change', { ...PagStore })
    }

    function handleCurrentChange() {
      emit('page-change', { ...PagStore })
    }

    function handlePrevClick() {
      emit('prev-click', { ...PagStore })
    }

    function handleNextClick() {
      emit('next-click', { ...PagStore })
    }

    // 移除掉表格、分页的插槽，得到所有ElTablePlus的插槽
    const customScopedSlots = omit(slots, ['pagination', 'empty', 'append'])

    const getheightAdaptiveValue = () => {
      const defaultBottomOffset = 40
      const { heightAdaptive } = props.directives as IDirectives

      if (heightAdaptive) {
        const { bottomOffset } = heightAdaptive
        if (bottomOffset || bottomOffset === 0) {
          return bottomOffset
        }
        return defaultBottomOffset
      }
      console.log(defaultBottomOffset, '高度----')
      return defaultBottomOffset
    }

    let directives: DirectiveArguments = reactive([])
    watchEffect(() => {
      directives.length = 0
      const directivesProps = props.directives

      // 关闭全部指令
      if (isBoolean(directivesProps) && !directivesProps) return []


      const { heightAdaptive } = directivesProps as IDirectives
      // 是否关闭高度自适应指令
      // 不设置或者为true都开启
      if (!isBoolean(heightAdaptive) || (isBoolean(heightAdaptive) && heightAdaptive)) {
        directives.push([vHeightAdaptive, { bottomOffset: getheightAdaptiveValue() }])
      }
      return directives
    })

    return {
      columnsAttrs,
      tableAttrs, customScopedSlots,
      directives,
      ElTablePlusRef,
      defPagination,
      PagStore,
      isShowPag,
      handlePageSizeChange,
      handleCurrentChange,
    }
  },
  render() {

    // 移除不支持自定义插槽的列类型 type[index/selection]
    const noSlots = ['index', 'selection']

    // 从插槽中移除内置的插槽 pagination，empty，append
    const customScopedSlots = this.customScopedSlots
    const { empty, append } = this.$slots
    // 内置插槽
    const inScopedSlots = {
      vSlots: {
        empty,
        append: () => {
          return append && append(this.data)
        }
      }
    }

    const getCellValue = (column: IElTablePlusColumn, row: any) => {
      return column?.prop?.split('.').reduce((obj, cur) => {
        if (obj) {
          return obj[cur]
        }
      }, row)
    }


    const renderColumns = (columns: IElTablePlusColumn[]) =>
      columns
        .map(c => {
          const { hidden } = c
          let willHidden = false
          if (isFunction(hidden)) {
            willHidden = (hidden as Function)(c)
          } else {
            willHidden = isBoolean(hidden) ? hidden as boolean : false
          }
          if (willHidden) return
          const singleColumnsAttrs = Object.assign({ ...this.columnsAttrs, slots: {}, prop: '' }, c)

          let slots = {}
          if (!noSlots.includes(singleColumnsAttrs.type)) {
            slots = {
              default: ({ row, column: elColumn, $index }: { row: any, column: typeof ElTableColumn, $index: number }) => {
                const column: any = Object.assign({}, singleColumnsAttrs, elColumn)

                // 获取单元格的原始值
                const cellValue = getCellValue(column, row)

                if (column.slots && column.slots.customRender && !isString(column.slots.customRender)) {
                  console.error("slotName must be string")
                  return
                }

                // 自定义单元格 指定slot name的优先级比自定义渲染函数优先级低
                column.customRender =
                  column.customRender ||
                  customScopedSlots[column.slots.customRender]
                if (column.customRender) {
                  return column.customRender({
                    cellValue,
                    row: toRaw(row),
                    column,
                    $index,
                  })
                }
                return cellValue
              },
              header: ({ column: elColumn, $index }: { column: IElTablePlusColumn, $index: number }) => {
                const column: any = Object.assign({}, singleColumnsAttrs, elColumn)

                if (column.slots && column.slots.customTitle && !isString(column.slots.customTitle)) {
                  console.error("slotName must be string")
                  return
                }

                column.customTitle =
                  column.customTitle ||
                  customScopedSlots[column.slots.customTitle]
                if (column.customTitle) {
                  return column.customTitle({
                    column,
                    $index,
                  })
                }
                return column.label
              }
            }
          }

          return (
            <el-table-column
              key={generateUUID()}
              {...singleColumnsAttrs}
              vSlots={slots}
            />
          )
        }).filter(o => o)

    const renderPageSlot = () => {
      if (!this.$slots.hasOwnProperty('pagination')) return
      return this.$slots.pagination!({
        total: this.total,
        config: omit(this.defPagination, ['pageSize', 'currentPage'])
      })
    }

    const ElTablePlus = (
      <el-table
        ref="ElTablePlusRef"
        height="0"
        data={this.data}
        {...this.$attrs}
        {...inScopedSlots}
      >
        {renderColumns(this.columns)}
      </el-table>
    )

    return (
      <div class="el-table-plus">
        {withDirectives(ElTablePlus, this.directives)}
        {this.isShowPag && (
          <el-pagination
            {...this.defPagination}
            v-models={[[this.PagStore.currentPage, 'current-page'], [this.PagStore.pageSize, 'page-size']]}
            total={this.total}
          >
            {renderPageSlot() && <span class="el-pagination__slot">{renderPageSlot()}</span>}
          </el-pagination>
        )}
      </div>
    )
  }
})
