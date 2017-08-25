function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isUndef(v) {
  return v === undefined || v === null
}


function isDef(v) {
  return v !== undefined && v !== null
}

function isTrue(v) {
  return v === true
}

function isFalse(v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
  var n = parseFloat(val);
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}


module.exports = {
  formatTime: formatTime,
  isUndef: isUndef,
  isDef: isDef,
  isTrue: isTrue,
  isFalse: isFalse,
  isPrimitive: isPrimitive,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isRegExp: isRegExp,
  isValidArrayIndex: isValidArrayIndex
}