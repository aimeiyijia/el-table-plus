import { h, defineComponent, computed, PropType, CSSProperties } from 'vue'
import '../directives/height-adaptive.ts'
import { generateUUID } from '../utils/uuid'
import { isBoolean, isString, isObject, isUndefined, isFunction } from '../utils/types'
import { omit } from '../utils/opera'

import type { ElTable, ElPagination, ElTableColumn } from 'element-plus'
// 样式
import '../styles/index.scss'

import PagStore from '../utils/store'

// Exclude<T, U> - 用于从类型T中去除不在U类型中的成员
// Extract<T, U> - 用于从类型T中取出可分配给U类型的成员
// NonNullable<T> - 用于从类型T中去除undefined和null类型
// ReturnType<T> - 获取函数类型的返回类型
// InstanceType<T> - 获取构造函数的实例类型

// 默认分页配置
declare class ElTableTsDefPagination {
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
  background: boolean
}

declare interface IDirectives {
  heightAdaptive?: {
    bottomOffset: number;
    topOffset: number;
  }
}



type ElTableType = InstanceType<typeof ElTable>;
type ElTableColumType = InstanceType<typeof ElTableColumn>;
type ElTableProps = ElTableType['$props'];

declare interface IElTablePlusColumn extends ElTableColumType {
  hidden: boolean | ((columns: IElTablePlusColumn) => boolean)
}

type UserElTableColumnProps = {
  slotName?: string;
  headerSlot?: string;
  render?: (...arg: any[]) => any;
  children?: ElTableColumnProps[];
};

export type ElTableColumnProps = InstanceType<typeof ElTableColumn>['$props'] &
  UserElTableColumnProps;

export type ConditionalKeys<Base, Condition> = NonNullable<
  // Wrap in `NonNullable` to strip away the `undefined` type from the produced union.
  {
    // Map through all the keys of the given base type.
    [Key in keyof Base]: Key extends Condition // Pick only keys with types extending the given `Condition` type.
      ? // Retain this key since the condition passes.
        Key
      : // Discard this key since the condition fails.
        never;

    // Convert the produced object into a union type of the keys which passed the conditional test.
  }[keyof Base]
>;

type eventKeyVal = {
  [key in keyof ElTableType]: key extends `on${infer stringA}`
    ? `on${stringA}`
    : never;
};
type EmitKeyMethod = ConditionalKeys<ElTableType, `on${string}`>;
type eventKey = NonNullable<eventKeyVal[keyof eventKeyVal]>;
type CamelEventKey<T extends string> = {
  [key in T]: key extends `on${infer stringA}-${infer stringB}`
    ? `on${stringA}${Capitalize<stringB>}`
    : key;
};
type eventJsx = CamelEventKey<
  CamelEventKey<EmitKeyMethod>[keyof CamelEventKey<EmitKeyMethod>]
>;
type eventKeyName = eventJsx[keyof eventJsx];
type eventMethodProps = {
  [key in eventKeyName]: (...args: any[]) => any;
};

const ElTablePlusProps = {
  data: {
    type: [Array] as PropType<any[]>,
    default: () => [],
  },
  columns: {
    type: [Array] as PropType<IElTablePlusColumn[]>,
    default: () => [],
  },
  onClick: [Function] as PropType<(e: MouseEvent) => void>,
  // value: [String, Number] as PropType<string | number>,
  // max: Number,
  // dot: Boolean,
  // type: {
  //   type: String as PropType<
  //   'success' | 'error' | 'warning' | 'info' | 'default'
  //   >,
  //   default: 'default'
  // },
  // show: {
  //   type: Boolean,
  //   default: true
  // },
  // showZero: Boolean,
  // processing: Boolean,
  // color: String
} as const

export default defineComponent({
  name: 'ElTablePlus',
  props: ElTablePlusProps,
  setup(props, { attrs }) {
    console.log(props, '属性')
    console.log(attrs, '属性678')
  },
  render() {
    console.log(this)
    // 移除不支持自定义插槽的列类型 type[index/selection]
    const noSlots = ['index', 'selection']

    // 移除分页事件，防止事件冲突
    const tableListeners = omit(this.$listeners, ['page-change', 'current-change', 'size-change', 'prev-click', 'next-click'])
    // 从插槽中移除内置的插槽 pagination，empty，append
    const customScopedSlots = omit(this.$scopedSlots, ['pagination', 'empty', 'append'])
    const { empty, append } = this.$scopedSlots
    // 内置插槽
    const inScopedSlots = {
      scopedSlots: {
        empty,
        append: () => {
          return append && append(this.data)
        }
      }
    }

    const getCellValue = (column: ITableColumn, row: any) => {
      return column.prop.split('.').reduce((obj, cur) => {
        if (obj) {
          return obj[cur]
        }
      }, row)
    }


    const renderColumns = (columns: ITableColumn[]) =>
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
          const options = Object.assign({ ...this.columnsAttrs, scopedSlots: {}, prop: '' }, c)
          let sampleScopedSlots = {}


          const scopedSlots = {
            default: ({ row, column: elColumn, $index, store, _self }: { row: any, column: TableColumn, $index: number, store: any, _self: any }) => {

              const column: any = Object.assign({}, options, elColumn)

              // 获取单元格的原始值
              const cellValue = getCellValue(column, row)

              if (column.scopedSlots && column.scopedSlots.customRender && !isString(column.scopedSlots.customRender)) {
                console.error("slotName must be string")
                return
              }

              // 自定义单元格 指定slot name的优先级比自定义渲染函数优先级低
              column.customRender =
                column.customRender ||
                customScopedSlots[column.scopedSlots.customRender]
              if (column.customRender) {
                return column.customRender({
                  cellValue,
                  row,
                  column,
                  $index,
                  h,
                  store,
                  _self
                })
              }
              return cellValue
            },
            header: ({ column: elColumn, $index, store, _self }: { column: ITableColumn, $index: number, store: any, _self: any }) => {
              const column: any = Object.assign({}, options, elColumn)

              if (column.scopedSlots && column.scopedSlots.customTitle && !isString(column.scopedSlots.customTitle)) {
                console.error("slotName must be string")
                return
              }

              column.customTitle =
                column.customTitle ||
                customScopedSlots[column.scopedSlots.customTitle]
              if (column.customTitle) {
                return column.customTitle({
                  column,
                  $index,
                  h,
                  store,
                  _self
                })
              }
              return column.label
            }
          }

          if (!noSlots.includes(options.type)) {
            sampleScopedSlots = {
              scopedSlots
            }
          }

          return (
            <el-table-column
              key={generateUUID()}
              {...{ props: options }}
              {...sampleScopedSlots}
            />
          )
        }).filter(o => o)
    return (
      <div class="el-table-ts">
        <el-table
          ref="ElTableTsRef"
          height="0"
          data={this.data}
          {...{ props: this.$attrs }}
        >
          {renderColumns(this.columns)}
        </el-table>
      </div>
    )
  }
})
