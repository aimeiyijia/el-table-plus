export function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
export function isBoolean(val: any): boolean {
  return Object.prototype.toString.call(val) === '[object Boolean]'
}
export function isString(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export function isFunction(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Function]'
}

export function isArray(val: any): boolean {
  return Object.prototype.toString.call(val) === '[object Array]'
}

export function isUndefined(val: any): boolean {
  return val === undefined
}
