// Copyright 2014 Andrei Karpushonak

'use strict'

var ECMA_SIZES = require('./byte_size')

function allProperties (obj) {
  const stringProperties = []
  for (var prop in obj) {
    stringProperties.push(prop)
  }
  if (Object.getOwnPropertySymbols) {
    var symbolProperties = Object.getOwnPropertySymbols(obj)
    Array.prototype.push.apply(stringProperties, symbolProperties)
  }
  return stringProperties
}

function sizeOfObject (seen, object) {
  if (object == null) {
    return 0
  }
  // Do not recalculate circular references
  if (seen.has(object)) {
    return 0
  }
  seen.add(object)

  var bytes = 0
  var properties = allProperties(object)
  for (var i = 0; i < properties.length; i++) {
    var key = properties[i]
    bytes += getCalculator(seen)(key)
    bytes += getCalculator(seen)(object[key])
  }

  return bytes
}
function sizeOfMap (seen, object) {
  if (object == null) {
    return 0
  }
  // Do not recalculate circular references
  if (seen.has(object)) {
    return 0
  }
  seen.add(object)

  var bytes = 0
  const it = object.keys()
  let next = it.next()
  while (!next.done) {
    const key = next.value
    bytes += getCalculator(seen)(key)

    const value = object.get(key)
    bytes += getCalculator(seen)(value)

    next = it.next()
  }

  return bytes
}
function sizeOfSet (seen, object) {
  if (object == null) {
    return 0
  }
  // Do not recalculate circular references
  if (seen.has(object)) {
    return 0
  }
  seen.add(object)

  var bytes = 0
  const it = object.values()
  let next = it.next()
  while (!next.done) {
    const value = next.value
    bytes += getCalculator(seen)(value)

    next = it.next()
  }

  return bytes
}

function getCalculator (seen) {
  return function calculator (object) {
    var objectType = typeof (object)
    switch (objectType) {
      case 'string':
        return object.length * ECMA_SIZES.STRING
      case 'boolean':
        return ECMA_SIZES.BOOLEAN
      case 'number': case 'bigint':
        return ECMA_SIZES.NUMBER
      case 'symbol': {
        const isGlobalSymbol = Symbol.keyFor && Symbol.keyFor(object)
        return isGlobalSymbol ? Symbol.keyFor(object).length * ECMA_SIZES.STRING : (object.toString().length - 8) * ECMA_SIZES.STRING
      }
      case 'object':
        if (Array.isArray(object)) {
          return object.map(getCalculator(seen)).reduce(function (acc, curr) {
            return acc + curr
          }, 0)
        } else if (object instanceof Map) {
          return sizeOfMap(seen, object)
        } else if (object instanceof Set) {
          return sizeOfSet(seen, object)
        } else if (object instanceof Date) {
          return ECMA_SIZES.NUMBER
        } else if (object && object.byteLength) {
          // Typed arrays have BYTES_PER_ELEMENT and byteLength which can be used instead
          return object.byteLength
        } else {
          return sizeOfObject(seen, object)
        }
      default:
        return 0
    }
  }
}

/**
 * Main module's entry point
 * Calculates Bytes for the provided parameter
 * @param object - handles object/string/boolean
 * @returns {*}
 */
function sizeof (object) {
  return getCalculator(new WeakSet())(object)
}

module.exports = sizeof
