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

declare interface ITableColumn extends ElTableColumn {
  hidden: boolean | ((columns: ITableColumn) => boolean)
}

type ElTableType = InstanceType<typeof ElTable>;
type ElTableProps = ElTableType['$props'];

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
  value: [String, Number] as PropType<string | number>,
  max: Number,
  dot: Boolean,
  type: {
    type: String as PropType<
    'success' | 'error' | 'warning' | 'info' | 'default'
    >,
    default: 'default'
  },
  show: {
    type: Boolean,
    default: true
  },
  showZero: Boolean,
  processing: Boolean,
  color: String
} as const

export default defineComponent({
  name: 'ElTableTs',
  props: ElTablePlusProps,
  setup(props) {},
  render() {}
})
