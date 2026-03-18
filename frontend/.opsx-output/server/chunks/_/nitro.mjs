import process from 'node:process'
import http from 'node:http'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import { Buffer as Buffer$1 } from 'node:buffer'
import { toValue } from 'vue'
import { createConsola, consola } from 'consola'
import * as csrf from 'uncsrf'
import { importEncryptSecret } from 'uncsrf'
import { createRouterMatcher } from 'vue-router'
import { LRUCache } from 'lru-cache'
import { promises, existsSync } from 'node:fs'
import { resolve as resolve$2, dirname as dirname$1, join, extname } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { getIcons } from '@iconify/utils'
import { createHash } from 'node:crypto'
import { XMLParser } from 'fast-xml-parser'
import { FilterXSS } from 'xss'
import { z } from 'zod'
import ms from 'ms'
import { readFile as readFile$1 } from 'node:fs/promises'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import satori from 'satori'
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'ipx'

globalThis._importMeta_ = globalThis._importMeta_ || { url: 'file:///_entry.js', env: process.env }

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/
function jsonParseTransform(key, value) {
  if (key === '__proto__' || key === 'constructor' && value && typeof value === 'object' && 'prototype' in value) {
    warnKeyDropped(key)
    return
  }
  return value
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`)
}
function destr(value, options = {}) {
  if (typeof value !== 'string') {
    return value
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf('\\') === -1) {
    return value.slice(1, -1)
  }
  const _value = value.trim()
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case 'true': {
        return true
      }
      case 'false': {
        return false
      }
      case 'undefined': {
        return void 0
      }
      case 'null': {
        return null
      }
      case 'nan': {
        return Number.NaN
      }
      case 'infinity': {
        return Number.POSITIVE_INFINITY
      }
      case '-infinity': {
        return Number.NEGATIVE_INFINITY
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError('[destr] Invalid JSON')
    }
    return value
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error('[destr] Possible prototype pollution')
      }
      return JSON.parse(value, jsonParseTransform)
    }
    return JSON.parse(value)
  } catch (error) {
    if (options.strict) {
      throw error
    }
    return value
  }
}

const HASH_RE = /#/g
const AMPERSAND_RE = /&/g
const SLASH_RE = /\//g
const EQUAL_RE = /=/g
const IM_RE = /\?/g
const PLUS_RE = /\+/g
const ENC_CARET_RE = /%5e/gi
const ENC_BACKTICK_RE = /%60/gi
const ENC_PIPE_RE = /%7c/gi
const ENC_SPACE_RE = /%20/gi
const ENC_SLASH_RE = /%2f/gi
const ENC_ENC_SLASH_RE = /%252f/gi
function encode(text) {
  return encodeURI('' + text).replace(ENC_PIPE_RE, '|')
}
function encodeQueryValue(input) {
  return encode(typeof input === 'string' ? input : JSON.stringify(input)).replace(PLUS_RE, '%2B').replace(ENC_SPACE_RE, '+').replace(HASH_RE, '%23').replace(AMPERSAND_RE, '%26').replace(ENC_BACKTICK_RE, '`').replace(ENC_CARET_RE, '^').replace(SLASH_RE, '%2F')
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, '%3D')
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, '%23').replace(IM_RE, '%3F').replace(ENC_ENC_SLASH_RE, '%2F').replace(AMPERSAND_RE, '%26').replace(PLUS_RE, '%2B')
}
function encodeParam(text) {
  return encodePath(text).replace(SLASH_RE, '%2F')
}
function decode$1(text = '') {
  try {
    return decodeURIComponent('' + text)
  } catch {
    return '' + text
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, '%252F'))
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, ' '))
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, ' '))
}

function parseQuery(parametersString = '') {
  const object = /* @__PURE__ */ Object.create(null)
  if (parametersString[0] === '?') {
    parametersString = parametersString.slice(1)
  }
  for (const parameter of parametersString.split('&')) {
    const s = parameter.match(/([^=]+)=?(.*)/) || []
    if (s.length < 2) {
      continue
    }
    const key = decodeQueryKey(s[1])
    if (key === '__proto__' || key === 'constructor') {
      continue
    }
    const value = decodeQueryValue(s[2] || '')
    if (object[key] === void 0) {
      object[key] = value
    } else if (Array.isArray(object[key])) {
      object[key].push(value)
    } else {
      object[key] = [object[key], value]
    }
  }
  return object
}
function encodeQueryItem(key, value) {
  if (typeof value === 'number' || typeof value === 'boolean') {
    value = String(value)
  }
  if (!value) {
    return encodeQueryKey(key)
  }
  if (Array.isArray(value)) {
    return value.map(
      _value => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join('&')
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`
}
function stringifyQuery(query) {
  return Object.keys(query).filter(k => query[k] !== void 0).map(k => encodeQueryItem(k, query[k])).filter(Boolean).join('&')
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/
const JOIN_LEADING_SLASH_RE = /^\.?\//
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === 'boolean') {
    opts = { acceptRelative: opts }
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString)
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false)
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol)
}
function hasTrailingSlash(input = '', respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith('/')
  }
  return TRAILING_SLASH_RE.test(input)
}
function withoutTrailingSlash(input = '', respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || '/'
  }
  if (!hasTrailingSlash(input, true)) {
    return input || '/'
  }
  let path = input
  let fragment = ''
  const fragmentIndex = input.indexOf('#')
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex)
    fragment = input.slice(fragmentIndex)
  }
  const [s0, ...s] = path.split('?')
  const cleanPath = s0.endsWith('/') ? s0.slice(0, -1) : s0
  return (cleanPath || '/') + (s.length > 0 ? `?${s.join('?')}` : '') + fragment
}
function withTrailingSlash(input = '', respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith('/') ? input : input + '/'
  }
  if (hasTrailingSlash(input, true)) {
    return input || '/'
  }
  let path = input
  let fragment = ''
  const fragmentIndex = input.indexOf('#')
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex)
    fragment = input.slice(fragmentIndex)
    if (!path) {
      return fragment
    }
  }
  const [s0, ...s] = path.split('?')
  return s0 + '/' + (s.length > 0 ? `?${s.join('?')}` : '') + fragment
}
function hasLeadingSlash(input = '') {
  return input.startsWith('/')
}
function withoutLeadingSlash(input = '') {
  return (hasLeadingSlash(input) ? input.slice(1) : input) || '/'
}
function withLeadingSlash(input = '') {
  return hasLeadingSlash(input) ? input : '/' + input
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input
  }
  const _base = withoutTrailingSlash(base)
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length]
    if (!nextChar || nextChar === '/' || nextChar === '?') {
      return input
    }
  }
  return joinURL(_base, input)
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input
  }
  const _base = withoutTrailingSlash(base)
  if (!input.startsWith(_base)) {
    return input
  }
  const nextChar = input[_base.length]
  if (nextChar && nextChar !== '/' && nextChar !== '?') {
    return input
  }
  const trimmed = input.slice(_base.length)
  return trimmed[0] === '/' ? trimmed : '/' + trimmed
}
function withQuery(input, query) {
  const parsed = parseURL(input)
  const mergedQuery = { ...parseQuery(parsed.search), ...query }
  parsed.search = stringifyQuery(mergedQuery)
  return stringifyParsedURL(parsed)
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search)
}
function isEmptyURL(url) {
  return !url || url === '/'
}
function isNonEmptyURL(url) {
  return url && url !== '/'
}
function joinURL(base, ...input) {
  let url = base || ''
  for (const segment of input.filter(url2 => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, '')
      url = withTrailingSlash(url) + _segment
    } else {
      url = segment
    }
  }
  return url
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/
  const input = _input.filter(Boolean)
  const segments = []
  let segmentsDepth = 0
  for (const i of input) {
    if (!i || i === '/') {
      continue
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === '.') {
        continue
      }
      if (s === '..') {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue
        }
        segments.pop()
        segmentsDepth--
        continue
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(':/')) {
        segments[segments.length - 1] += '/' + s
        continue
      }
      segments.push(s)
      segmentsDepth++
    }
  }
  let url = segments.join('/')
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith('/') && !url.startsWith('/')) {
      url = '/' + url
    } else if (input[0]?.startsWith('./') && !url.startsWith('./')) {
      url = './' + url
    }
  } else {
    url = '../'.repeat(-1 * segmentsDepth) + url
  }
  if (input[input.length - 1]?.endsWith('/') && !url.endsWith('/')) {
    url += '/'
  }
  return url
}
function withHttps(input) {
  return withProtocol(input, 'https://')
}
function withProtocol(input, protocol) {
  let match = input.match(PROTOCOL_REGEX)
  if (!match) {
    match = input.match(/^\/{2,}/)
  }
  if (!match) {
    return protocol + input
  }
  return protocol + input.slice(match[0].length)
}
function isEqual$1(a, b, options = {}) {
  if (!options.trailingSlash) {
    a = withTrailingSlash(a)
    b = withTrailingSlash(b)
  }
  if (!options.leadingSlash) {
    a = withLeadingSlash(a)
    b = withLeadingSlash(b)
  }
  if (!options.encoding) {
    a = decode$1(a)
    b = decode$1(b)
  }
  return a === b
}

const protocolRelative = Symbol.for('ufo:protocolRelative')
function parseURL(input = '', defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  )
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ''] = _specialProtoMatch
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: '',
      host: '',
      search: '',
      hash: ''
    }
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input)
  }
  const [, protocol = '', auth, hostAndPath = ''] = input.replace(/\\/g, '/').match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || []
  let [, host = '', path = ''] = hostAndPath.match(/([^#/?]*)(.*)?/) || []
  if (protocol === 'file:') {
    path = path.replace(/\/(?=[A-Za-z]:)/, '')
  }
  const { pathname, search, hash } = parsePath(path)
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : '',
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  }
}
function parsePath(input = '') {
  const [pathname = '', search = '', hash = ''] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1)
  return {
    pathname,
    search,
    hash
  }
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || ''
  const search = parsed.search ? (parsed.search.startsWith('?') ? '' : '?') + parsed.search : ''
  const hash = parsed.hash || ''
  const auth = parsed.auth ? parsed.auth + '@' : ''
  const host = parsed.host || ''
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || '') + '//' : ''
  return proto + auth + host + pathname + search + hash
}

function parse$1(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string')
  }
  const obj = {}
  const opt = {}
  const dec = opt.decode || decode
  let index = 0
  while (index < str.length) {
    const eqIdx = str.indexOf('=', index)
    if (eqIdx === -1) {
      break
    }
    let endIdx = str.indexOf(';', index)
    if (endIdx === -1) {
      endIdx = str.length
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(';', eqIdx - 1) + 1
      continue
    }
    const key = str.slice(index, eqIdx).trim()
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1
      continue
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim()
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1)
      }
      obj[key] = tryDecode(val, dec)
    }
    index = endIdx + 1
  }
  return obj
}
function decode(str) {
  return str.includes('%') ? decodeURIComponent(str) : str
}
function tryDecode(str, decode2) {
  try {
    return decode2(str)
  } catch {
    return str
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/
function serialize$2(name, value, options) {
  const opt = options || {}
  const enc = opt.encode || encodeURIComponent
  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid')
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid')
  }
  const encodedValue = enc(value)
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError('argument val is invalid')
  }
  let str = name + '=' + encodedValue
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }
    str += '; Max-Age=' + Math.floor(maxAge)
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid')
    }
    str += '; Domain=' + opt.domain
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid')
    }
    str += '; Path=' + opt.path
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError('option expires is invalid')
    }
    str += '; Expires=' + opt.expires.toUTCString()
  }
  if (opt.httpOnly) {
    str += '; HttpOnly'
  }
  if (opt.secure) {
    str += '; Secure'
  }
  if (opt.priority) {
    const priority = typeof opt.priority === 'string' ? opt.priority.toLowerCase() : opt.priority
    switch (priority) {
      case 'low': {
        str += '; Priority=Low'
        break
      }
      case 'medium': {
        str += '; Priority=Medium'
        break
      }
      case 'high': {
        str += '; Priority=High'
        break
      }
      default: {
        throw new TypeError('option priority is invalid')
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite
    switch (sameSite) {
      case true: {
        str += '; SameSite=Strict'
        break
      }
      case 'lax': {
        str += '; SameSite=Lax'
        break
      }
      case 'strict': {
        str += '; SameSite=Strict'
        break
      }
      case 'none': {
        str += '; SameSite=None'
        break
      }
      default: {
        throw new TypeError('option sameSite is invalid')
      }
    }
  }
  if (opt.partitioned) {
    str += '; Partitioned'
  }
  return str
}
function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]' || val instanceof Date
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || '').split(';').filter(str => typeof str === 'string' && !!str.trim())
  const nameValuePairStr = parts.shift() || ''
  const parsed = _parseNameValuePair(nameValuePairStr)
  const name = parsed.name
  let value = parsed.value
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value)
  } catch {
  }
  const cookie = {
    name,
    value
  }
  for (const part of parts) {
    const sides = part.split('=')
    const partKey = (sides.shift() || '').trimStart().toLowerCase()
    const partValue = sides.join('=')
    switch (partKey) {
      case 'expires': {
        cookie.expires = new Date(partValue)
        break
      }
      case 'max-age': {
        cookie.maxAge = Number.parseInt(partValue, 10)
        break
      }
      case 'secure': {
        cookie.secure = true
        break
      }
      case 'httponly': {
        cookie.httpOnly = true
        break
      }
      case 'samesite': {
        cookie.sameSite = partValue
        break
      }
      default: {
        cookie[partKey] = partValue
      }
    }
  }
  return cookie
}
function _parseNameValuePair(nameValuePairStr) {
  let name = ''
  let value = ''
  const nameValueArr = nameValuePairStr.split('=')
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift()
    value = nameValueArr.join('=')
  } else {
    value = nameValuePairStr
  }
  return { name, value }
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
}

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  }
  const normalizeTrailingSlash = p => options.strictTrailingSlash ? p : p.replace(/\/$/, '') || '/'
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path])
    }
  }
  return {
    ctx,
    lookup: path => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: path => remove(ctx, normalizeTrailingSlash(path))
  }
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path]
  if (staticPathNode) {
    return staticPathNode.data
  }
  const sections = path.split('/')
  const params = {}
  let paramsFound = false
  let wildcardNode = null
  let node = ctx.rootNode
  let wildCardParam = null
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode
      wildCardParam = sections.slice(i).join('/')
    }
    const nextNode = node.children.get(section)
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i
        node = node.placeholderChildren.find(c => c.maxDepth === remaining) || null
      } else {
        node = node.placeholderChildren[0] || null
      }
      if (!node) {
        break
      }
      if (node.paramName) {
        params[node.paramName] = section
      }
      paramsFound = true
    } else {
      node = nextNode
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode
    params[node.paramName || '_'] = wildCardParam
    paramsFound = true
  }
  if (!node) {
    return null
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    }
  }
  return node.data
}
function insert(ctx, path, data) {
  let isStaticRoute = true
  const sections = path.split('/')
  let node = ctx.rootNode
  let _unnamedPlaceholderCtr = 0
  const matchedNodes = [node]
  for (const section of sections) {
    let childNode
    if (childNode = node.children.get(section)) {
      node = childNode
    } else {
      const type = getNodeType(section)
      childNode = createRadixNode({ type, parent: node })
      node.children.set(section, childNode)
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === '*' ? `_${_unnamedPlaceholderCtr++}` : section.slice(1)
        node.placeholderChildren.push(childNode)
        isStaticRoute = false
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || '_'
        isStaticRoute = false
      }
      matchedNodes.push(childNode)
      node = childNode
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0)
  }
  node.data = data
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node
  }
  return node
}
function remove(ctx, path) {
  let success = false
  const sections = path.split('/')
  let node = ctx.rootNode
  for (const section of sections) {
    node = node.children.get(section)
    if (!node) {
      return success
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || ''
    node.data = null
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection)
      node.parent.wildcardChildNode = null
      node.parent.placeholderChildren = []
    }
    success = true
  }
  return success
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  }
}
function getNodeType(str) {
  if (str.startsWith('**')) {
    return NODE_TYPES.WILDCARD
  }
  if (str[0] === ':' || str === '*') {
    return NODE_TYPES.PLACEHOLDER
  }
  return NODE_TYPES.NORMAL
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable('', router.ctx.rootNode)
  return _createMatcher(table, router.ctx.options.strictTrailingSlash)
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: path => _matchRoutes(path, table, strictTrailingSlash)
  }
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  }
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith('/')) {
    path = path.slice(0, -1) || '/'
  }
  const matches = []
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + '/')) {
      matches.push(value)
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + '/')) {
      const subPath = '/' + path.slice(key.length).split('/').splice(2).join('/')
      matches.push(..._matchRoutes(subPath, value))
    }
  }
  const staticMatch = table.static.get(path)
  if (staticMatch) {
    matches.push(staticMatch)
  }
  return matches.filter(Boolean)
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length)
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable()
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes('*') || path.includes(':'))) {
        if (node.data) {
          table.static.set(path, node.data)
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace('/**', ''), node.data)
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable('', node)
        if (node.data) {
          subTable.static.set('/', node.data)
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ''), subTable)
        return
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace('//', '/'), child)
    }
  }
  _addNode(initialPath, initialNode)
  return table
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false
  }
  if (Symbol.iterator in value) {
    return false
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === '[object Module]'
  }
  return true
}

function _defu(baseObject, defaults, namespace = '.', merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger)
  }
  const object = Object.assign({}, defaults)
  for (const key in baseObject) {
    if (key === '__proto__' || key === 'constructor') {
      continue
    }
    const value = baseObject[key]
    if (value === null || value === void 0) {
      continue
    }
    if (merger && merger(object, key, value, namespace)) {
      continue
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]]
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : '') + key.toString(),
        merger
      )
    } else {
      object[key] = value
    }
  }
  return object
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, '', merger), {})
  )
}
const defu = createDefu()
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === 'function') {
    object[key] = currentValue(object[key])
    return true
  }
})

function o$1(n) { throw new Error(`${n} is not implemented yet!`) } let i$2 = class i extends EventEmitter {__unenv__ = {}; readableEncoding = null; readableEnded = true; readableFlowing = false; readableHighWaterMark = 0; readableLength = 0; readableObjectMode = false; readableAborted = false; readableDidRead = false; closed = false; errored = null; readable = false; destroyed = false; static from(e, t) { return new i(t) }constructor(e) { super() }_read(e) {}read(e) {}setEncoding(e) { return this }pause() { return this }resume() { return this }isPaused() { return true }unpipe(e) { return this }unshift(e, t) {}wrap(e) { return this }push(e, t) { return false }_destroy(e, t) { this.removeAllListeners() }destroy(e) { return this.destroyed = true, this._destroy(e), this }pipe(e, t) { return {} }compose(e, t) { throw new Error('Method not implemented.') }[Symbol.asyncDispose]() { return this.destroy(), Promise.resolve() } async* [Symbol.asyncIterator]() { throw o$1('Readable.asyncIterator') }iterator(e) { throw o$1('Readable.iterator') }map(e, t) { throw o$1('Readable.map') }filter(e, t) { throw o$1('Readable.filter') }forEach(e, t) { throw o$1('Readable.forEach') }reduce(e, t, r) { throw o$1('Readable.reduce') }find(e, t) { throw o$1('Readable.find') }findIndex(e, t) { throw o$1('Readable.findIndex') }some(e, t) { throw o$1('Readable.some') }toArray(e) { throw o$1('Readable.toArray') }every(e, t) { throw o$1('Readable.every') }flatMap(e, t) { throw o$1('Readable.flatMap') }drop(e, t) { throw o$1('Readable.drop') }take(e, t) { throw o$1('Readable.take') }asIndexedPairs(e) { throw o$1('Readable.asIndexedPairs') }}; let l$2 = class l extends EventEmitter {__unenv__ = {}; writable = true; writableEnded = false; writableFinished = false; writableHighWaterMark = 0; writableLength = 0; writableObjectMode = false; writableCorked = 0; closed = false; errored = null; writableNeedDrain = false; writableAborted = false; destroyed = false; _data; _encoding = 'utf8'; constructor(e) { super() }pipe(e, t) { return {} }_write(e, t, r) { if (this.writableEnded) { r && r(); return } if (this._data === void 0) this._data = e; else { const s = typeof this._data == 'string' ? Buffer$1.from(this._data, this._encoding || t || 'utf8') : this._data, a = typeof e == 'string' ? Buffer$1.from(e, t || this._encoding || 'utf8') : e; this._data = Buffer$1.concat([s, a]) } this._encoding = t, r && r() }_writev(e, t) {}_destroy(e, t) {}_final(e) {}write(e, t, r) { const s = typeof t == 'string' ? this._encoding : 'utf8', a = typeof t == 'function' ? t : typeof r == 'function' ? r : void 0; return this._write(e, s, a), true }setDefaultEncoding(e) { return this }end(e, t, r) { const s = typeof e == 'function' ? e : typeof t == 'function' ? t : typeof r == 'function' ? r : void 0; if (this.writableEnded) return s && s(), this; const a = e === s ? void 0 : e; if (a) { const u = t === s ? void 0 : t; this.write(a, u, s) } return this.writableEnded = true, this.writableFinished = true, this.emit('close'), this.emit('finish'), this }cork() {}uncork() {}destroy(e) { return this.destroyed = true, delete this._data, this.removeAllListeners(), this }compose(e, t) { throw new Error('Method not implemented.') }[Symbol.asyncDispose]() { return Promise.resolve() }}; const c$2 = class c {allowHalfOpen = true; _destroy; constructor(e = new i$2(), t = new l$2()) { Object.assign(this, e), Object.assign(this, t), this._destroy = m(e._destroy, t._destroy) }}; function _$1() { return Object.assign(c$2.prototype, i$2.prototype), Object.assign(c$2.prototype, l$2.prototype), c$2 } function m(...n) { return function (...e) { for (const t of n)t(...e) } } const g = _$1(); let A$1 = class A extends g {__unenv__ = {}; bufferSize = 0; bytesRead = 0; bytesWritten = 0; connecting = false; destroyed = false; pending = false; localAddress = ''; localPort = 0; remoteAddress = ''; remoteFamily = ''; remotePort = 0; autoSelectFamilyAttemptedAddresses = []; readyState = 'readOnly'; constructor(e) { super() }write(e, t, r) { return false }connect(e, t, r) { return this }end(e, t, r) { return this }setEncoding(e) { return this }pause() { return this }resume() { return this }setTimeout(e, t) { return this }setNoDelay(e) { return this }setKeepAlive(e, t) { return this }address() { return {} }unref() { return this }ref() { return this }destroySoon() { this.destroy() }resetAndDestroy() { const e = new Error('ERR_SOCKET_CLOSED'); return e.code = 'ERR_SOCKET_CLOSED', this.destroy(e), this }}; class y extends i$2 {aborted = false; httpVersion = '1.1'; httpVersionMajor = 1; httpVersionMinor = 1; complete = true; connection; socket; headers = {}; trailers = {}; method = 'GET'; url = '/'; statusCode = 200; statusMessage = ''; closed = false; errored = null; readable = false; constructor(e) { super(), this.socket = this.connection = e || new A$1() } get rawHeaders() { const e = this.headers, t = []; for (const r in e) if (Array.isArray(e[r])) for (const s of e[r])t.push(r, s); else t.push(r, e[r]); return t } get rawTrailers() { return [] }setTimeout(e, t) { return this } get headersDistinct() { return p(this.headers) } get trailersDistinct() { return p(this.trailers) }} function p(n) { const e = {}; for (const [t, r] of Object.entries(n))t && (e[t] = (Array.isArray(r) ? r : [r]).filter(Boolean)); return e } class w extends l$2 {statusCode = 200; statusMessage = ''; upgrading = false; chunkedEncoding = false; shouldKeepAlive = false; useChunkedEncodingByDefault = false; sendDate = false; finished = false; headersSent = false; strictContentLength = false; connection = null; socket = null; req; _headers = {}; constructor(e) { super(), this.req = e }assignSocket(e) { e._httpMessage = this, this.socket = e, this.connection = e, this.emit('socket', e), this._flush() }_flush() { this.flushHeaders() }detachSocket(e) {}writeContinue(e) {}writeHead(e, t, r) { e && (this.statusCode = e), typeof t == 'string' && (this.statusMessage = t, t = void 0); const s = r || t; if (s && !Array.isArray(s)) for (const a in s) this.setHeader(a, s[a]); return this.headersSent = true, this }writeProcessing() {}setTimeout(e, t) { return this }appendHeader(e, t) { e = e.toLowerCase(); const r = this._headers[e], s = [...Array.isArray(r) ? r : [r], ...Array.isArray(t) ? t : [t]].filter(Boolean); return this._headers[e] = s.length > 1 ? s : s[0], this }setHeader(e, t) { return this._headers[e.toLowerCase()] = t, this }setHeaders(e) { for (const [t, r] of Object.entries(e)) this.setHeader(t, r); return this }getHeader(e) { return this._headers[e.toLowerCase()] }getHeaders() { return this._headers }getHeaderNames() { return Object.keys(this._headers) }hasHeader(e) { return e.toLowerCase() in this._headers }removeHeader(e) { delete this._headers[e.toLowerCase()] }addTrailers(e) {}flushHeaders() {}writeEarlyHints(e, t) { typeof t == 'function' && t() }} const E = (() => { const n = function () {}; return n.prototype = Object.create(null), n })(); function R$1(n = {}) { const e = new E(), t = Array.isArray(n) || H(n) ? n : Object.entries(n); for (const [r, s] of t) if (s) { if (e[r] === void 0) { e[r] = s; continue }e[r] = [...Array.isArray(e[r]) ? e[r] : [e[r]], ...Array.isArray(s) ? s : [s]] } return e } function H(n) { return typeof n?.entries == 'function' } function v(n = {}) { if (n instanceof Headers) return n; const e = new Headers(); for (const [t, r] of Object.entries(n)) if (r !== void 0) { if (Array.isArray(r)) { for (const s of r)e.append(t, String(s)); continue }e.set(t, String(r)) } return e } const S$1 = new Set([101, 204, 205, 304]); async function b$1(n, e) { const t = new y(), r = new w(t); t.url = e.url?.toString() || '/'; let s; if (!t.url.startsWith('/')) { const d = new URL(t.url); s = d.host, t.url = d.pathname + d.search + d.hash }t.method = e.method || 'GET', t.headers = R$1(e.headers || {}), t.headers.host || (t.headers.host = e.host || s || 'localhost'), t.connection.encrypted = t.connection.encrypted || e.protocol === 'https', t.body = e.body || null, t.__unenv__ = e.context, await n(t, r); let a = r._data; (S$1.has(r.statusCode) || t.method.toUpperCase() === 'HEAD') && (a = null, delete r._headers['content-length']); const u = { status: r.statusCode, statusText: r.statusMessage, headers: r._headers, body: a }; return t.destroy(), r.destroy(), u } async function C$1(n, e, t = {}) { try { const r = await b$1(n, { url: e, ...t }); return new Response(r.body, { status: r.status, statusText: r.statusText, headers: v(r.headers) }) } catch (r) { return new Response(r.toString(), { status: Number.parseInt(r.statusCode || r.code) || 500, statusText: r.statusText }) } }

function useBase(base, handler) {
  base = withoutTrailingSlash(base)
  if (!base || base === '/') {
    return handler
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || '/'
    const _path = event._path || event.node.req.url || '/'
    event._path = withoutBase(event.path || '/', base)
    event.node.req.url = event._path
    try {
      return await handler(event)
    } finally {
      event._path = event.node.req.url = _path
    }
  })
}

function hasProp(obj, prop) {
  try {
    return prop in obj
  } catch {
    return false
  }
}

class H3Error extends Error {
  static __h3_error__ = true
  statusCode = 500
  fatal = false
  unhandled = false
  statusMessage
  data
  cause
  constructor(message, opts = {}) {
    super(message, opts)
    if (opts.cause && !this.cause) {
      this.cause = opts.cause
    }
  }

  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    }
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage)
    }
    if (this.data !== void 0) {
      obj.data = this.data
    }
    return obj
  }
}
function createError$1(input) {
  if (typeof input === 'string') {
    return new H3Error(input)
  }
  if (isError(input)) {
    return input
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? '', {
    cause: input.cause || input
  })
  if (hasProp(input, 'stack')) {
    try {
      Object.defineProperty(err, 'stack', {
        get() {
          return input.stack
        }
      })
    } catch {
      try {
        err.stack = input.stack
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode)
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode)
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage
  } else if (input.statusText) {
    err.statusMessage = input.statusText
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage)
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        '[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.'
      )
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled
  }
  return err
}
function sendError(event, error, debug) {
  if (event.handled) {
    return
  }
  const h3Error = isError(error) ? error : createError$1(error)
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  }
  if (debug) {
    responseBody.stack = (h3Error.stack || '').split('\n').map(l => l.trim())
  }
  if (event.handled) {
    return
  }
  const _code = Number.parseInt(h3Error.statusCode)
  setResponseStatus(event, _code, h3Error.statusMessage)
  event.node.res.setHeader('content-type', MIMES.json)
  event.node.res.end(JSON.stringify(responseBody, void 0, 2))
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true
}

function parse(multipartBodyBuffer, boundary) {
  let lastline = ''
  let state = 0 /* INIT */
  let buffer = []
  const allParts = []
  let currentPartHeaders = []
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null
    const currByte = multipartBodyBuffer[i]
    const newLineChar = currByte === 10 || currByte === 13
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte)
    }
    const newLineDetected = currByte === 10 && prevByte === 13
    if (0 /* INIT */ === state && newLineDetected) {
      if ('--' + boundary === lastline) {
        state = 1 /* READING_HEADERS */
      }
      lastline = ''
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(':')
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase()
          const value = lastline.slice(i2 + 1).trim()
          currentPartHeaders.push([name, value])
        }
      } else {
        state = 2 /* READING_DATA */
        buffer = []
      }
      lastline = ''
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = ''
      }
      if ('--' + boundary === lastline) {
        const j = buffer.length - lastline.length
        const part = buffer.slice(0, j - 1)
        allParts.push(process$1(part, currentPartHeaders))
        buffer = []
        currentPartHeaders = []
        lastline = ''
        state = 3 /* READING_PART_SEPARATOR */
      } else {
        buffer.push(currByte)
      }
      if (newLineDetected) {
        lastline = ''
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */
    }
  }
  return allParts
}
function process$1(data, headers) {
  const dataObj = {}
  const contentDispositionHeader = headers.find(h => h[0] === 'content-disposition')?.[1] || ''
  for (const i of contentDispositionHeader.split(';')) {
    const s = i.split('=')
    if (s.length !== 2) {
      continue
    }
    const key = (s[0] || '').trim()
    if (key === 'name' || key === 'filename') {
      const _value = (s[1] || '').trim().replace(/"/g, '')
      dataObj[key] = Buffer.from(_value, 'latin1').toString('utf8')
    }
  }
  const contentType = headers.find(h => h[0] === 'content-type')?.[1] || ''
  if (contentType) {
    dataObj.type = contentType
  }
  dataObj.data = Buffer.from(data)
  return dataObj
}

function getQuery(event) {
  return getQuery$1(event.path || '')
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {}
  if (opts.decode) {
    params = { ...params }
    for (const key in params) {
      params[key] = decode$1(params[key])
    }
  }
  return params
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts)
  return params[name]
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === 'string') {
    if (event.method === expected) {
      return true
    }
  } else if (expected.includes(event.method)) {
    return true
  }
  return false
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: 'HTTP method is not allowed.'
    })
  }
}
function getRequestHeaders(event) {
  const _headers = {}
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key]
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(', ') : val
  }
  return _headers
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event)
  const value = headers[name.toLowerCase()]
  return value
}
const getHeader = getRequestHeader
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers['x-forwarded-host']
    const xForwardedHost = (_header || '').split(',').shift()?.trim()
    if (xForwardedHost) {
      return xForwardedHost
    }
  }
  return event.node.req.headers.host || 'localhost'
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers['x-forwarded-proto'] === 'https') {
    return 'https'
  }
  return event.node.req.connection?.encrypted ? 'https' : 'http'
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts)
  const protocol = getRequestProtocol(event, opts)
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    '/'
  )
  return new URL(path, `${protocol}://${host}`)
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, 'x-forwarded-for')?.split(',').shift()?.trim()
    if (xForwardedFor) {
      return xForwardedFor
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress
  }
}

const RawBodySymbol = Symbol.for('h3RawBody')
const ParsedBodySymbol = Symbol.for('h3ParsedBody')
const PayloadMethods$1 = ['PATCH', 'POST', 'PUT', 'DELETE']
function readRawBody(event, encoding = 'utf8') {
  assertMethod(event, PayloadMethods$1)
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved
      }
      if (typeof _resolved.pipeTo === 'function') {
        return new Promise((resolve, reject) => {
          const chunks = []
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk)
              },
              close() {
                resolve(Buffer.concat(chunks))
              },
              abort(reason) {
                reject(reason)
              }
            })
          ).catch(reject)
        })
      } else if (typeof _resolved.pipe === 'function') {
        return new Promise((resolve, reject) => {
          const chunks = []
          _resolved.on('data', (chunk) => {
            chunks.push(chunk)
          }).on('end', () => {
            resolve(Buffer.concat(chunks))
          }).on('error', reject)
        })
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved))
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString())
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then(uint8arr => Buffer.from(uint8arr))
      }
      return Buffer.from(_resolved)
    })
    return encoding ? promise2.then(buff => buff.toString(encoding)) : promise2
  }
  if (!Number.parseInt(event.node.req.headers['content-length'] || '') && !/\bchunked\b/i.test(
    String(event.node.req.headers['transfer-encoding'] ?? '')
  )) {
    return Promise.resolve(void 0)
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = []
      event.node.req.on('error', (err) => {
        reject(err)
      }).on('data', (chunk) => {
        bodyData.push(chunk)
      }).on('end', () => {
        resolve(Buffer.concat(bodyData))
      })
    }
  )
  const result = encoding ? promise.then(buff => buff.toString(encoding)) : promise
  return result
}
async function readBody(event, options = {}) {
  const request = event.node.req
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol]
  }
  const contentType = request.headers['content-type'] || ''
  const body = await readRawBody(event)
  let parsed
  if (contentType === 'application/json') {
    parsed = _parseJSON(body, options.strict ?? true)
  } else if (contentType.startsWith('application/x-www-form-urlencoded')) {
    parsed = _parseURLEncodedBody(body)
  } else if (contentType.startsWith('text/')) {
    parsed = body
  } else {
    parsed = _parseJSON(body, options.strict ?? false)
  }
  request[ParsedBodySymbol] = parsed
  return parsed
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, 'content-type')
  if (!contentType || !contentType.startsWith('multipart/form-data')) {
    return
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1]
  if (!boundary) {
    return
  }
  const body = await readRawBody(event, false)
  if (!body) {
    return
  }
  return parse(body, boundary)
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return
  }
  const bodyStream = event.web?.request?.body || event._requestBody
  if (bodyStream) {
    return bodyStream
  }
  const _hasRawBody = RawBodySymbol in event.node.req || 'rawBody' in event.node.req || 'body' in event.node.req || '__unenv__' in event.node.req
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false)
        if (_rawBody) {
          controller.enqueue(_rawBody)
        }
        controller.close()
      }
    })
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on('data', (chunk) => {
        controller.enqueue(chunk)
      })
      event.node.req.on('end', () => {
        controller.close()
      })
      event.node.req.on('error', (err) => {
        controller.error(err)
      })
    }
  })
}
function _parseJSON(body = '', strict) {
  if (!body) {
    return void 0
  }
  try {
    return destr(body, { strict })
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid JSON body'
    })
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body)
  const parsedForm = /* @__PURE__ */ Object.create(null)
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]]
      }
      parsedForm[key].push(value)
    } else {
      parsedForm[key] = value
    }
  }
  return parsedForm
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ['public', ...opts.cacheControls || []]
  let cacheMatched = false
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`)
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime)
    const ifModifiedSince = event.node.req.headers['if-modified-since']
    event.node.res.setHeader('last-modified', modifiedTime.toUTCString())
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true
    }
  }
  if (opts.etag) {
    event.node.res.setHeader('etag', opts.etag)
    const ifNonMatch = event.node.req.headers['if-none-match']
    if (ifNonMatch === opts.etag) {
      cacheMatched = true
    }
  }
  event.node.res.setHeader('cache-control', cacheControls.join(', '))
  if (cacheMatched) {
    event.node.res.statusCode = 304
    if (!event.handled) {
      event.node.res.end()
    }
    return true
  }
  return false
}

const MIMES = {
  html: 'text/html',
  json: 'application/json'
}

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g
function sanitizeStatusMessage(statusMessage = '') {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, '')
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode
  }
  if (typeof statusCode === 'string') {
    statusCode = Number.parseInt(statusCode, 10)
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode
  }
  return statusCode
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || '', opts.path || '/'].join(';')
}

function parseCookies(event) {
  return parse$1(event.node.req.headers.cookie || '')
}
function getCookie(event, name) {
  return parseCookies(event)[name]
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: '/', ...serializeOptions }
  }
  const newCookie = serialize$2(name, value, serializeOptions)
  const currentCookies = splitCookiesString(
    event.node.res.getHeader('set-cookie')
  )
  if (currentCookies.length === 0) {
    event.node.res.setHeader('set-cookie', newCookie)
    return
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions)
  event.node.res.removeHeader('set-cookie')
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie)
    const key = getDistinctCookieKey(parsed.name, parsed)
    if (key === newCookieKey) {
      continue
    }
    event.node.res.appendHeader('set-cookie', cookie)
  }
  event.node.res.appendHeader('set-cookie', newCookie)
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, '', {
    ...serializeOptions,
    maxAge: 0
  })
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap(c => splitCookiesString(c))
  }
  if (typeof cookiesString !== 'string') {
    return []
  }
  const cookiesStrings = []
  let pos = 0
  let start
  let ch
  let lastComma
  let nextStart
  let cookiesSeparatorFound
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1
    }
    return pos < cookiesString.length
  }
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos)
    return ch !== '=' && ch !== ';' && ch !== ','
  }
  while (pos < cookiesString.length) {
    start = pos
    cookiesSeparatorFound = false
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos)
      if (ch === ',') {
        lastComma = pos
        pos += 1
        skipWhitespace()
        nextStart = pos
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === '=') {
          cookiesSeparatorFound = true
          pos = nextStart
          cookiesStrings.push(cookiesString.slice(start, lastComma))
          start = pos
        } else {
          pos = lastComma + 1
        }
      } else {
        pos += 1
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start))
    }
  }
  return cookiesStrings
}

const defer = typeof setImmediate === 'undefined' ? fn => fn() : setImmediate
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type)
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data)
      }
      resolve()
    })
  })
}
function sendNoContent(event, code) {
  if (event.handled) {
    return
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode
  }
  const _code = sanitizeStatusCode(code, 204)
  if (_code === 204) {
    event.node.res.removeHeader('content-length')
  }
  event.node.res.writeHead(_code)
  event.node.res.end()
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    )
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text)
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader('content-type')) {
    event.node.res.setHeader('content-type', type)
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  )
  event.node.res.setHeader('location', location)
  const encodedLoc = location.replace(/"/g, '%22')
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`
  return send(event, html, MIMES.html)
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name)
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    )
  }
}
const setHeaders = setResponseHeaders
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value)
}
const setHeader = setResponseHeader
function appendResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    appendResponseHeader(event, name, value)
  }
}
const appendHeaders = appendResponseHeaders
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name)
  if (!current) {
    event.node.res.setHeader(name, value)
    return
  }
  if (!Array.isArray(current)) {
    current = [current.toString()]
  }
  event.node.res.setHeader(name, [...current, value])
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name)
}
function isStream(data) {
  if (!data || typeof data !== 'object') {
    return false
  }
  if (typeof data.pipe === 'function') {
    if (typeof data._read === 'function') {
      return true
    }
    if (typeof data.abort === 'function') {
      return true
    }
  }
  if (typeof data.pipeTo === 'function') {
    return true
  }
  return false
}
function isWebResponse(data) {
  return typeof Response !== 'undefined' && data instanceof Response
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== 'object') {
    throw new Error('[h3] Invalid stream provided.')
  }
  event.node.res._data = stream
  if (!event.node.res.socket) {
    event._handled = true
    return Promise.resolve()
  }
  if (hasProp(stream, 'pipeTo') && typeof stream.pipeTo === 'function') {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk)
        }
      })
    ).then(() => {
      event.node.res.end()
    })
  }
  if (hasProp(stream, 'pipe') && typeof stream.pipe === 'function') {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res)
      if (stream.on) {
        stream.on('end', () => {
          event.node.res.end()
          resolve()
        })
        stream.on('error', (error) => {
          reject(error)
        })
      }
      event.node.res.on('close', () => {
        if (stream.abort) {
          stream.abort()
        }
      })
    })
  }
  throw new Error('[h3] Invalid or incompatible stream provided.')
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === 'set-cookie') {
      event.node.res.appendHeader(key, splitCookiesString(value))
    } else {
      event.node.res.setHeader(key, value)
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    )
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText)
  }
  if (response.redirected) {
    event.node.res.setHeader('location', response.url)
  }
  if (!response.body) {
    event.node.res.end()
    return
  }
  return sendStream(event, response.body)
}

function resolveCorsOptions(options = {}) {
  const defaultOptions = {
    origin: '*',
    methods: '*',
    allowHeaders: '*',
    exposeHeaders: '*',
    credentials: false,
    maxAge: false,
    preflight: {
      statusCode: 204
    }
  }
  return defu(options, defaultOptions)
}
function isPreflightRequest(event) {
  const origin = getRequestHeader(event, 'origin')
  const accessControlRequestMethod = getRequestHeader(
    event,
    'access-control-request-method'
  )
  return event.method === 'OPTIONS' && !!origin && !!accessControlRequestMethod
}
function isCorsOriginAllowed(origin, options) {
  const { origin: originOption } = options
  if (!origin || !originOption || originOption === '*' || originOption === 'null') {
    return true
  }
  if (Array.isArray(originOption)) {
    return originOption.some((_origin) => {
      if (_origin instanceof RegExp) {
        return _origin.test(origin)
      }
      return origin === _origin
    })
  }
  return originOption(origin)
}
function createOriginHeaders(event, options) {
  const { origin: originOption } = options
  const origin = getRequestHeader(event, 'origin')
  if (!origin || !originOption || originOption === '*') {
    return { 'access-control-allow-origin': '*' }
  }
  if (typeof originOption === 'string') {
    return { 'access-control-allow-origin': originOption, 'vary': 'origin' }
  }
  return isCorsOriginAllowed(origin, options) ? { 'access-control-allow-origin': origin, 'vary': 'origin' } : {}
}
function createMethodsHeaders(options) {
  const { methods } = options
  if (!methods) {
    return {}
  }
  if (methods === '*') {
    return { 'access-control-allow-methods': '*' }
  }
  return methods.length > 0 ? { 'access-control-allow-methods': methods.join(',') } : {}
}
function createCredentialsHeaders(options) {
  const { credentials } = options
  if (credentials) {
    return { 'access-control-allow-credentials': 'true' }
  }
  return {}
}
function createAllowHeaderHeaders(event, options) {
  const { allowHeaders } = options
  if (!allowHeaders || allowHeaders === '*' || allowHeaders.length === 0) {
    const header = getRequestHeader(event, 'access-control-request-headers')
    return header
      ? {
          'access-control-allow-headers': header,
          'vary': 'access-control-request-headers'
        }
      : {}
  }
  return {
    'access-control-allow-headers': allowHeaders.join(','),
    'vary': 'access-control-request-headers'
  }
}
function createExposeHeaders(options) {
  const { exposeHeaders } = options
  if (!exposeHeaders) {
    return {}
  }
  if (exposeHeaders === '*') {
    return { 'access-control-expose-headers': exposeHeaders }
  }
  return { 'access-control-expose-headers': exposeHeaders.join(',') }
}
function appendCorsPreflightHeaders(event, options) {
  appendHeaders(event, createOriginHeaders(event, options))
  appendHeaders(event, createCredentialsHeaders(options))
  appendHeaders(event, createExposeHeaders(options))
  appendHeaders(event, createMethodsHeaders(options))
  appendHeaders(event, createAllowHeaderHeaders(event, options))
}
function appendCorsHeaders(event, options) {
  appendHeaders(event, createOriginHeaders(event, options))
  appendHeaders(event, createCredentialsHeaders(options))
  appendHeaders(event, createExposeHeaders(options))
}

function handleCors(event, options) {
  const _options = resolveCorsOptions(options)
  if (isPreflightRequest(event)) {
    appendCorsPreflightHeaders(event, options)
    sendNoContent(event, _options.preflight.statusCode)
    return true
  }
  appendCorsHeaders(event, options)
  return false
}

const PayloadMethods = /* @__PURE__ */ new Set(['PATCH', 'POST', 'PUT', 'DELETE'])
const ignoredHeaders = /* @__PURE__ */ new Set([
  'transfer-encoding',
  'accept-encoding',
  'connection',
  'keep-alive',
  'upgrade',
  'expect',
  'host',
  'accept'
])
async function proxyRequest(event, target, opts = {}) {
  let body
  let duplex
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event)
      duplex = 'half'
    } else {
      body = await readRawBody(event, false).catch(() => void 0)
    }
  }
  const method = opts.fetchOptions?.method || event.method
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith('/') }),
    opts.fetchOptions?.headers,
    opts.headers
  )
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  })
}
async function sendProxy(event, target, opts = {}) {
  let response
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    })
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: 'Bad Gateway',
      cause: error
    })
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  )
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText)
  const cookies = []
  for (const [key, value] of response.headers.entries()) {
    if (key === 'content-encoding') {
      continue
    }
    if (key === 'content-length') {
      continue
    }
    if (key === 'set-cookie') {
      cookies.push(...splitCookiesString(value))
      continue
    }
    event.node.res.setHeader(key, value)
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      'set-cookie',
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            'domain'
          )
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            'path'
          )
        }
        return cookie
      })
    )
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response)
  }
  if (response._data !== void 0) {
    return response._data
  }
  if (event.handled) {
    return
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer())
    return event.node.res.end(data)
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk)
    }
  }
  return event.node.res.end()
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null)
  const reqHeaders = getRequestHeaders(event)
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === 'host' && opts?.host) {
      headers[name] = reqHeaders[name]
    }
  }
  return headers
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === 'string' && req.startsWith('/')
      }),
      ...init?.headers
    }
  })
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch
  }
  if (globalThis.fetch) {
    return globalThis.fetch
  }
  throw new Error(
    'fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js.'
  )
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === 'string' ? { '*': map } : map
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, 'gi'),
    (match, prefix, previousValue) => {
      let newValue
      if (previousValue in _map) {
        newValue = _map[previousValue]
      } else if ('*' in _map) {
        newValue = _map['*']
      } else {
        return match
      }
      return newValue ? prefix + newValue : ''
    }
  )
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean)
  if (_inputs.length === 0) {
    return defaults
  }
  const merged = new Headers(defaults)
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === 'function' ? input.entries() : Object.entries(input)
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value)
      }
    }
  }
  return merged
}

class H3Event {
  '__is_event__' = true
  // Context
  node
  // Node
  web
  // Web
  context = {}
  // Shared
  // Request
  _method
  _path
  _headers
  _requestBody
  // Response
  _handled = false
  // Hooks
  _onBeforeResponseCalled
  _onAfterResponseCalled
  constructor(req, res) {
    this.node = { req, res }
  }

  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || 'GET').toUpperCase()
    }
    return this._method
  }

  get path() {
    return this._path || this.node.req.url || '/'
  }

  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers)
    }
    return this._headers
  }

  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent
  }

  respondWith(response) {
    return Promise.resolve(response).then(
      _response => sendWebResponse(this, _response)
    )
  }

  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`
  }

  toJSON() {
    return this.toString()
  }

  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req
  }

  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res
  }
}
function isEvent(input) {
  return hasProp(input, '__is_event__')
}
function createEvent(req, res) {
  return new H3Event(req, res)
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers()
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item)
      }
    } else if (value) {
      headers.set(name, value)
    }
  }
  return headers
}

function defineEventHandler(handler) {
  if (typeof handler === 'function') {
    handler.__is_handler__ = true
    return handler
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  }
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks)
  }
  _handler.__is_handler__ = true
  _handler.__resolve__ = handler.handler.__resolve__
  _handler.__websocket__ = handler.websocket
  return _handler
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event)
      if (event.handled) {
        return
      }
    }
  }
  const body = await handler(event)
  const response = { body }
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response)
    }
  }
  return response.body
}
const eventHandler = defineEventHandler
function isEventHandler(input) {
  return hasProp(input, '__is_handler__')
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      '[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.',
      _route && _route !== '/'
        ? `
     Route: ${_route}`
        : '',
      `
     Handler: ${input}`
    )
  }
  return input
}
function defineLazyEventHandler(factory) {
  let _promise
  let _resolved
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved)
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r
        if (typeof handler2 !== 'function') {
          throw new TypeError(
            'Invalid lazy handler result. It should be a function:',
            handler2
          )
        }
        _resolved = { handler: toEventHandler(r.default || r) }
        return _resolved
      })
    }
    return _promise
  }
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event)
    }
    return resolveHandler().then(r => r.handler(event))
  })
  handler.__resolve__ = resolveHandler
  return handler
}
const lazyEventHandler = defineLazyEventHandler

function createApp(options = {}) {
  const stack = []
  const handler = createAppEventHandler(stack, options)
  const resolve = createResolver(stack)
  handler.__resolve__ = resolve
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options))
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket()
    }
  }
  return app
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3)
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3)
    }
  } else if (typeof arg1 === 'string') {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    )
  } else if (typeof arg1 === 'function') {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }))
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }))
  }
  return app
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || '/'
    const _reqPath = event._path || event.node.req.url || '/'
    let _layerPath
    if (options.onRequest) {
      await options.onRequest(event)
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue
        }
        _layerPath = _reqPath.slice(layer.route.length) || '/'
      } else {
        _layerPath = _reqPath
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue
      }
      event._path = _layerPath
      event.node.req.url = _layerPath
      const val = await layer.handler(event)
      const _body = val === void 0 ? void 0 : await val
      if (_body !== void 0) {
        const _response = { body: _body }
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true
          await options.onBeforeResponse(event, _response)
        }
        await handleHandlerResponse(event, _response.body, spacing)
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true
          await options.onAfterResponse(event, _response)
        }
        return
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true
          await options.onAfterResponse(event, void 0)
        }
        return
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || '/'}.`
      })
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true
      await options.onAfterResponse(event, void 0)
    }
  })
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath
    for (const layer of stack) {
      if (layer.route === '/' && !layer.handler.__resolve__) {
        continue
      }
      if (!path.startsWith(layer.route)) {
        continue
      }
      _layerPath = path.slice(layer.route.length) || '/'
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue
      }
      let res = { route: layer.route, handler: layer.handler }
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath)
        if (!_res) {
          continue
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || '/', _res.route || '/')
        }
      }
      return res
    }
  }
}
function normalizeLayer(input) {
  let handler = input.handler
  if (handler.handler) {
    handler = handler.handler
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler)
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route)
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  }
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event)
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val)
    }
    if (isStream(val)) {
      return sendStream(event, val)
    }
    if (val.buffer) {
      return send(event, val)
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === 'function') {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type)
      })
    }
    if (val instanceof Error) {
      throw createError$1(val)
    }
    if (typeof val.end === 'function') {
      return true
    }
  }
  const valType = typeof val
  if (valType === 'string') {
    return send(event, val, MIMES.html)
  }
  if (valType === 'object' || valType === 'boolean' || valType === 'number') {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json)
  }
  if (valType === 'bigint') {
    return send(event, val.toString(), MIMES.json)
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  })
}
function cachedFn(fn) {
  let cache
  return () => {
    if (!cache) {
      cache = fn()
    }
    return cache
  }
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || '/'
      const { pathname } = typeof url === 'string' ? parseURL(url) : url
      const resolved = await evResolver(pathname)
      return resolved?.handler?.__websocket__ || {}
    }
  }
}

const RouterMethods = [
  'connect',
  'delete',
  'get',
  'head',
  'options',
  'post',
  'put',
  'trace',
  'patch'
]
function createRouter(opts = {}) {
  const _router = createRouter$1({})
  const routes = {}
  let _matcher
  const router = {}
  const addRoute = (path, handler, method) => {
    let route = routes[path]
    if (!route) {
      routes[path] = route = { path, handlers: {} }
      _router.insert(path, route)
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m)
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path)
    }
    return router
  }
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || 'all')
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method)
  }
  const matchHandler = (path = '/', method = 'get') => {
    const qIndex = path.indexOf('?')
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex))
    }
    const matched = _router.lookup(path)
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: 'Not Found',
          statusMessage: `Cannot find any route matching ${path || '/'}.`
        })
      }
    }
    let handler = matched.handlers[method] || matched.handlers.all
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router)
      }
      const _matches = _matcher.matchAll(path).reverse()
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method]
          matched.handlers[method] = matched.handlers[method] || handler
          break
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all
          matched.handlers.all = matched.handlers.all || handler
          break
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: 'Method Not Allowed',
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      }
    }
    return { matched, handler }
  }
  const isPreemptive = opts.preemptive || opts.preemtive
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    )
    if ('error' in match) {
      if (isPreemptive) {
        throw match.error
      } else {
        return
      }
    }
    event.context.matchedRoute = match.matched
    const params = match.matched.params || {}
    event.context.params = params
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null
      }
      return res
    })
  })
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path)
    const match = matchHandler(path)
    if ('error' in match) {
      return
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    }
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path)
      if (!_res) {
        return
      }
      res = { ...res, ..._res }
    }
    return res
  }
  return router
}
function toNodeListener(app) {
  const toNodeHandle = async function (req, res) {
    const event = createEvent(req, res)
    try {
      await app.handler(event)
    } catch (_error) {
      const error = createError$1(_error)
      if (!isError(_error)) {
        error.unhandled = true
      }
      setResponseStatus(event, error.statusCode, error.statusMessage)
      if (app.options.onError) {
        await app.options.onError(error, event)
      }
      if (event.handled) {
        return
      }
      if (error.unhandled || error.fatal) {
        console.error('[h3]', error.fatal ? '[fatal]' : '[unhandled]', error)
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error })
      }
      await sendError(event, error, !!app.options.debug)
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error })
      }
    }
  }
  return toNodeHandle
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key]
    const name = parentName ? `${parentName}:${key}` : key
    if (typeof subHook === 'object' && subHook !== null) {
      flatHooks(subHook, hooks, name)
    } else if (typeof subHook === 'function') {
      hooks[name] = subHook
    }
  }
  return hooks
}
const defaultTask = { run: function_ => function_() }
const _createTask = () => defaultTask
const createTask = typeof console.createTask !== 'undefined' ? console.createTask : _createTask
function serialTaskCaller(hooks, args) {
  const name = args.shift()
  const task = createTask(name)
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  )
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift()
  const task = createTask(name)
  return Promise.all(hooks.map(hook => task.run(() => hook(...args))))
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0)
  }
}

class Hookable {
  constructor() {
    this._hooks = {}
    this._before = void 0
    this._after = void 0
    this._deprecatedMessages = void 0
    this._deprecatedHooks = {}
    this.hook = this.hook.bind(this)
    this.callHook = this.callHook.bind(this)
    this.callHookWith = this.callHookWith.bind(this)
  }

  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== 'function') {
      return () => {
      }
    }
    const originalName = name
    let dep
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name]
      name = dep.to
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : '')
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set()
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message)
        this._deprecatedMessages.add(message)
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, 'name', {
          get: () => '_' + name.replace(/\W+/g, '_') + '_hook_cb',
          configurable: true
        })
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || []
    this._hooks[name].push(function_)
    return () => {
      if (function_) {
        this.removeHook(name, function_)
        function_ = void 0
      }
    }
  }

  hookOnce(name, function_) {
    let _unreg
    let _function = (...arguments_) => {
      if (typeof _unreg === 'function') {
        _unreg()
      }
      _unreg = void 0
      _function = void 0
      return function_(...arguments_)
    }
    _unreg = this.hook(name, _function)
    return _unreg
  }

  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_)
      if (index !== -1) {
        this._hooks[name].splice(index, 1)
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name]
      }
    }
  }

  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === 'string' ? { to: deprecated } : deprecated
    const _hooks = this._hooks[name] || []
    delete this._hooks[name]
    for (const hook of _hooks) {
      this.hook(name, hook)
    }
  }

  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks)
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name])
    }
  }

  addHooks(configHooks) {
    const hooks = flatHooks(configHooks)
    const removeFns = Object.keys(hooks).map(
      key => this.hook(key, hooks[key])
    )
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg()
      }
    }
  }

  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks)
    for (const key in hooks) {
      this.removeHook(key, hooks[key])
    }
  }

  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key]
    }
  }

  callHook(name, ...arguments_) {
    arguments_.unshift(name)
    return this.callHookWith(serialTaskCaller, name, ...arguments_)
  }

  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name)
    return this.callHookWith(parallelTaskCaller, name, ...arguments_)
  }

  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0
    if (this._before) {
      callEachWith(this._before, event)
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    )
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event)
        }
      })
    }
    if (this._after && event) {
      callEachWith(this._after, event)
    }
    return result
  }

  beforeEach(function_) {
    this._before = this._before || []
    this._before.push(function_)
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_)
        if (index !== -1) {
          this._before.splice(index, 1)
        }
      }
    }
  }

  afterEach(function_) {
    this._after = this._after || []
    this._after.push(function_)
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_)
        if (index !== -1) {
          this._after.splice(index, 1)
        }
      }
    }
  }
}
function createHooks() {
  return new Hookable()
}

const s$1 = globalThis.Headers, i$1 = globalThis.AbortController, l$1 = globalThis.fetch || (() => { throw new Error('[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!') })

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts)
    this.name = 'FetchError'
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || ''
  const method = ctx.request?.method || ctx.options?.method || 'GET'
  const url = ctx.request?.url || String(ctx.request) || '/'
  const requestStr = `[${method}] ${JSON.stringify(url)}`
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : '<no response>'
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ''}`
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  )
  for (const key of ['request', 'options', 'response']) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key]
      }
    })
  }
  for (const [key, refKey] of [
    ['data', '_data'],
    ['status', 'status'],
    ['statusCode', 'status'],
    ['statusText', 'statusText'],
    ['statusMessage', 'statusText']
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey]
      }
    })
  }
  return fetchError
}

const payloadMethods = new Set(
  Object.freeze(['PATCH', 'POST', 'PUT', 'DELETE'])
)
function isPayloadMethod(method = 'GET') {
  return payloadMethods.has(method.toUpperCase())
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false
  }
  const t = typeof value
  if (t === 'string' || t === 'number' || t === 'boolean' || t === null) {
    return true
  }
  if (t !== 'object') {
    return false
  }
  if (Array.isArray(value)) {
    return true
  }
  if (value.buffer) {
    return false
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false
  }
  return value.constructor && value.constructor.name === 'Object' || typeof value.toJSON === 'function'
}
const textTypes = /* @__PURE__ */ new Set([
  'image/svg',
  'application/xml',
  'application/xhtml',
  'application/html'
])
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i
function detectResponseType(_contentType = '') {
  if (!_contentType) {
    return 'json'
  }
  const contentType = _contentType.split(';').shift() || ''
  if (JSON_RE.test(contentType)) {
    return 'json'
  }
  if (contentType === 'text/event-stream') {
    return 'stream'
  }
  if (textTypes.has(contentType) || contentType.startsWith('text/')) {
    return 'text'
  }
  return 'blob'
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  )
  let query
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    }
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  }
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input)
  }
  const headers = new Headers(defaults)
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value)
    }
  }
  return headers
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context)
      }
    } else {
      await hooks(context)
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
])
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304])
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions
  async function onError(context) {
    const isAbort = context.error && context.error.name === 'AbortError' && !context.options.timeout || false
    if (context.options.retry !== false && !isAbort) {
      let retries
      if (typeof context.options.retry === 'number') {
        retries = context.options.retry
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1
      }
      const responseCode = context.response && context.response.status || 500
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === 'function' ? context.options.retryDelay(context) : context.options.retryDelay || 0
        if (retryDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        })
      }
    }
    const error = createFetchError(context)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw)
    }
    throw error
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    }
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase()
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest)
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        )
      }
    }
    if (typeof context.request === 'string') {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL)
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query)
        delete context.options.query
      }
      if ('query' in context.options) {
        delete context.options.query
      }
      if ('params' in context.options) {
        delete context.options.params
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get('content-type')
        if (typeof context.options.body !== 'string') {
          context.options.body = contentType === 'application/x-www-form-urlencoded'
            ? new URLSearchParams(
                context.options.body
              ).toString()
            : JSON.stringify(context.options.body)
        }
        if (!contentType) {
          context.options.headers.set('content-type', 'application/json')
        }
        if (!context.options.headers.has('accept')) {
          context.options.headers.set('accept', 'application/json')
        }
      } else if (
        // ReadableStream Body
        'pipeTo' in context.options.body && typeof context.options.body.pipeTo === 'function' // Node.js Stream Body
        || typeof context.options.body.pipe === 'function'
      ) {
        if (!('duplex' in context.options)) {
          context.options.duplex = 'half'
        }
      }
    }
    let abortTimeout
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController()
      abortTimeout = setTimeout(() => {
        const error = new Error(
          '[TimeoutError]: The operation was aborted due to timeout'
        )
        error.name = 'TimeoutError'
        error.code = 23
        controller.abort(error)
      }, context.options.timeout)
      context.options.signal = controller.signal
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      )
    } catch (error) {
      context.error = error
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        )
      }
      return await onError(context)
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout)
      }
    }
    const hasBody = (context.response.body // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
      || context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== 'HEAD'
    if (hasBody) {
      const responseType = (context.options.parseResponse ? 'json' : context.options.responseType) || detectResponseType(context.response.headers.get('content-type') || '')
      switch (responseType) {
        case 'json': {
          const data = await context.response.text()
          const parseFunction = context.options.parseResponse || destr
          context.response._data = parseFunction(data)
          break
        }
        case 'stream': {
          context.response._data = context.response.body || context.response._bodyInit
          break
        }
        default: {
          context.response._data = await context.response[responseType]()
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      )
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        )
      }
      return await onError(context)
    }
    return context.response
  }
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options)
    return r._data
  }
  $fetch.raw = $fetchRaw
  $fetch.native = (...args) => fetch(...args)
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  })
  return $fetch
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || 'false')
  if (!useKeepAlive) {
    return l$1
  }
  const agentOptions = { keepAlive: true }
  const httpAgent = new http.Agent(agentOptions)
  const httpsAgent = new https.Agent(agentOptions)
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === 'http:' ? httpAgent : httpsAgent
    }
  }
  return function nodeFetchWithKeepAlive(input, init) {
    return l$1(input, { ...nodeFetchOptions, ...init })
  }
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch()
const Headers$1 = globalThis.Headers || s$1
const AbortController$1 = globalThis.AbortController || i$1
const ofetch = createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController: AbortController$1 })
const $fetch$1 = ofetch

function wrapToPromise(value) {
  if (!value || typeof value.then !== 'function') {
    return Promise.resolve(value)
  }
  return value
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_))
  } catch (error) {
    return Promise.reject(error)
  }
}
function isPrimitive$1(value) {
  const type = typeof value
  return value === null || type !== 'object' && type !== 'function'
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value)
  return !proto || proto.isPrototypeOf(Object)
}
function stringify(value) {
  if (isPrimitive$1(value)) {
    return String(value)
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value)
  }
  if (typeof value.toJSON === 'function') {
    return stringify(value.toJSON())
  }
  throw new Error('[unstorage] Cannot stringify value!')
}
const BASE64_PREFIX = 'base64:'
function serializeRaw(value) {
  if (typeof value === 'string') {
    return value
  }
  return BASE64_PREFIX + base64Encode(value)
}
function deserializeRaw(value) {
  if (typeof value !== 'string') {
    return value
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value
  }
  return base64Decode(value.slice(BASE64_PREFIX.length))
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, 'base64')
  }
  return Uint8Array.from(
    globalThis.atob(input),
    c => c.codePointAt(0)
  )
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString('base64')
  }
  return globalThis.btoa(String.fromCodePoint(...input))
}

const storageKeyProperties = [
  'has',
  'hasItem',
  'get',
  'getItem',
  'getItemRaw',
  'set',
  'setItem',
  'setItemRaw',
  'del',
  'remove',
  'removeItem',
  'getMeta',
  'setMeta',
  'removeMeta',
  'getKeys',
  'clear',
  'mount',
  'unmount'
]
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base)
  if (!base) {
    return storage
  }
  const nsStorage = { ...storage }
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = '', ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    )
  }
  nsStorage.getKeys = (key = '', ...arguments_) => storage.getKeys(base + key, ...arguments_).then(keys => keys.map(key2 => key2.slice(base.length)))
  nsStorage.keys = nsStorage.getKeys
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      item => typeof item === 'string' ? base + item : { ...item, key: base + item.key }
    )
    const results = await storage.getItems(prefixedItems, commonOptions)
    return results.map(entry => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }))
  }
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map(item => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }))
    return storage.setItems(prefixedItems, commonOptions)
  }
  return nsStorage
}
function normalizeKey$1(key) {
  if (!key) {
    return ''
  }
  return key.split('?')[0]?.replace(/[/\\]/g, ':').replace(/:+/g, ':').replace(/^:|:$/g, '') || ''
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(':'))
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base)
  return base ? base + ':' : ''
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true
  }
  let substrCount = 0
  let index = key.indexOf(':')
  while (index > -1) {
    substrCount++
    index = key.indexOf(':', index + 1)
  }
  return substrCount <= depth
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== '$'
  }
  return key[key.length - 1] !== '$'
}

function defineDriver$1(factory) {
  return factory
}

const DRIVER_NAME$2 = 'memory'
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map()
  return {
    name: DRIVER_NAME$2,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key)
    },
    getItem(key) {
      return data.get(key) ?? null
    },
    getItemRaw(key) {
      return data.get(key) ?? null
    },
    setItem(key, value) {
      data.set(key, value)
    },
    setItemRaw(key, value) {
      data.set(key, value)
    },
    removeItem(key) {
      data.delete(key)
    },
    getKeys() {
      return [...data.keys()]
    },
    clear() {
      data.clear()
    },
    dispose() {
      data.clear()
    }
  }
})

function createStorage(options = {}) {
  const context = {
    mounts: { '': options.driver || memory() },
    mountpoints: [''],
    watching: false,
    watchListeners: [],
    unwatch: {}
  }
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        }
      }
    }
    return {
      base: '',
      relativeKey: key,
      driver: context.mounts['']
    }
  }
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      mountpoint => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map(mountpoint => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }))
  }
  const onChange = (event, key) => {
    if (!context.watching) {
      return
    }
    key = normalizeKey$1(key)
    for (const listener of context.watchListeners) {
      listener(event, key)
    }
  }
  const startWatch = async () => {
    if (context.watching) {
      return
    }
    context.watching = true
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      )
    }
  }
  const stopWatch = async () => {
    if (!context.watching) {
      return
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]()
    }
    context.unwatch = {}
    context.watching = false
  }
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map()
    const getBatch = (mount) => {
      let batch = batches.get(mount.base)
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        }
        batches.set(mount.base, batch)
      }
      return batch
    }
    for (const item of items) {
      const isStringItem = typeof item === 'string'
      const key = normalizeKey$1(isStringItem ? item : item.key)
      const value = isStringItem ? void 0 : item.value
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options }
      const mount = getMount(key)
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      })
    }
    return Promise.all([...batches.values()].map(batch => cb(batch))).then(
      r => r.flat()
    )
  }
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key)
      const { relativeKey, driver } = getMount(key)
      return asyncCall(driver.hasItem, relativeKey, opts)
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key)
      const { relativeKey, driver } = getMount(key)
      return asyncCall(driver.getItem, relativeKey, opts).then(
        value => destr(value)
      )
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map(item => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            r => r.map(item => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          )
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then(value => ({
              key: item.key,
              value: destr(value)
            }))
          })
        )
      })
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key)
      const { relativeKey, driver } = getMount(key)
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts)
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        value => deserializeRaw(value)
      )
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key)
      }
      key = normalizeKey$1(key)
      const { relativeKey, driver } = getMount(key)
      if (!driver.setItem) {
        return
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts)
      if (!driver.watch) {
        onChange('update', key)
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map(item => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          )
        }
        if (!batch.driver.setItem) {
          return
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            )
          })
        )
      })
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts)
      }
      key = normalizeKey$1(key)
      const { relativeKey, driver } = getMount(key)
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts)
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts)
      } else {
        return
      }
      if (!driver.watch) {
        onChange('update', key)
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === 'boolean') {
        opts = { removeMeta: opts }
      }
      key = normalizeKey$1(key)
      const { relativeKey, driver } = getMount(key)
      if (!driver.removeItem) {
        return
      }
      await asyncCall(driver.removeItem, relativeKey, opts)
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + '$', opts)
      }
      if (!driver.watch) {
        onChange('remove', key)
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === 'boolean') {
        opts = { nativeOnly: opts }
      }
      key = normalizeKey$1(key)
      const { relativeKey, driver } = getMount(key)
      const meta = /* @__PURE__ */ Object.create(null)
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts))
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + '$',
          opts
        ).then(value_ => destr(value_))
        if (value && typeof value === 'object') {
          if (typeof value.atime === 'string') {
            value.atime = new Date(value.atime)
          }
          if (typeof value.mtime === 'string') {
            value.mtime = new Date(value.mtime)
          }
          Object.assign(meta, value)
        }
      }
      return meta
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + '$', value, opts)
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + '$', opts)
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base)
      const mounts = getMounts(base, true)
      let maskedMounts = []
      const allKeys = []
      let allMountsSupportMaxDepth = true
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        )
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key)
          if (!maskedMounts.some(p => fullKey.startsWith(p))) {
            allKeys.push(fullKey)
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter(p => !p.startsWith(mount.mountpoint))
        ]
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth
      return allKeys.filter(
        key => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      )
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base)
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts)
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || '', opts)
            return Promise.all(
              keys.map(key => m.driver.removeItem(key, opts))
            )
          }
        })
      )
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map(driver => dispose(driver))
      )
    },
    async watch(callback) {
      await startWatch()
      context.watchListeners.push(callback)
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          listener => listener !== callback
        )
        if (context.watchListeners.length === 0) {
          await stopWatch()
        }
      }
    },
    async unwatch() {
      context.watchListeners = []
      await stopWatch()
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base)
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`)
      }
      if (base) {
        context.mountpoints.push(base)
        context.mountpoints.sort((a, b) => b.length - a.length)
      }
      context.mounts[base] = driver
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher
        }).catch(console.error)
      }
      return storage
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base)
      if (!base || !context.mounts[base]) {
        return
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.()
        delete context.unwatch[base]
      }
      if (_dispose) {
        await dispose(context.mounts[base])
      }
      context.mountpoints = context.mountpoints.filter(key => key !== base)
      delete context.mounts[base]
    },
    getMount(key = '') {
      key = normalizeKey$1(key) + ':'
      const m = getMount(key)
      return {
        driver: m.driver,
        base: m.base
      }
    },
    getMounts(base = '', opts = {}) {
      base = normalizeKey$1(base)
      const mounts = getMounts(base, opts.parents)
      return mounts.map(m => ({
        driver: m.driver,
        base: m.mountpoint
      }))
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  }
  return storage
}
function watch(driver, onChange, base) {
  return driver.watch
    ? driver.watch((event, key) => onChange(event, base + key))
    : () => {
      }
}
async function dispose(driver) {
  if (typeof driver.dispose === 'function') {
    await asyncCall(driver.dispose)
  }
}

const _assets = {

}

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return ''
  }
  return key.split('?')[0]?.replace(/[/\\]/g, ':').replace(/:+/g, ':').replace(/^:|:$/g, '') || ''
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem(id) {
    id = normalizeKey(id)
    return Promise.resolve(id in _assets)
  },
  getItem(id) {
    id = normalizeKey(id)
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta(id) {
    id = normalizeKey(id)
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
}

function defineDriver(factory) {
  return factory
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts)
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError)
  }
  return err
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map(n => '`' + n + '`').join(', ')}`
    )
  }
  return createError(driver, `Missing required option \`${name}\`.`)
}

const DRIVER_NAME$1 = 'lru-cache'
const unstorage_47drivers_47lru_45cache = defineDriver((opts = {}) => {
  const cache = new LRUCache({
    max: 1e3,
    sizeCalculation: opts.maxSize || opts.maxEntrySize
      ? (value, key) => {
          return key.length + byteLength(value)
        }
      : void 0,
    ...opts
  })
  return {
    name: DRIVER_NAME$1,
    options: opts,
    getInstance: () => cache,
    hasItem(key) {
      return cache.has(key)
    },
    getItem(key) {
      return cache.get(key) ?? null
    },
    getItemRaw(key) {
      return cache.get(key) ?? null
    },
    setItem(key, value) {
      cache.set(key, value)
    },
    setItemRaw(key, value) {
      cache.set(key, value)
    },
    removeItem(key) {
      cache.delete(key)
    },
    getKeys() {
      return [...cache.keys()]
    },
    clear() {
      cache.clear()
    },
    dispose() {
      cache.clear()
    }
  }
})
function byteLength(value) {
  if (typeof Buffer !== 'undefined') {
    try {
      return Buffer.byteLength(value)
    } catch {
    }
  }
  try {
    return typeof value === 'string' ? value.length : JSON.stringify(value).length
  } catch {
  }
  return 0
}

function ignoreNotfound(err) {
  return err.code === 'ENOENT' || err.code === 'EISDIR' ? null : err
}
function ignoreExists(err) {
  return err.code === 'EEXIST' ? null : err
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path))
  return promises.writeFile(path, data, encoding)
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound)
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound)
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then(r => r || [])
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists)
  await promises.mkdir(dir).catch(ignoreExists)
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return []
  }
  const entries = await readdir(dir)
  const files = []
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$2(dir, entry.name)
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          )
          files.push(...dirFiles.map(f => entry.name + '/' + f))
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name)
        }
      }
    })
  )
  return files
}
async function rmRecursive(dir) {
  const entries = await readdir(dir)
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$2(dir, entry.name)
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath))
      } else {
        return promises.unlink(entryPath)
      }
    })
  )
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/
const DRIVER_NAME = 'fs-lite'
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, 'base')
  }
  opts.base = resolve$2(opts.base)
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      )
    }
    const resolved = join(opts.base, key.replace(/:/g, '/'))
    return resolved
  }
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key))
    },
    getItem(key) {
      return readFile(r(key), 'utf8')
    },
    getItemRaw(key) {
      return readFile(r(key))
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}))
      return { atime, mtime, size, birthtime, ctime }
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return
      }
      return writeFile(r(key), value, 'utf8')
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return
      }
      return writeFile(r(key), value)
    },
    removeItem(key) {
      if (opts.readOnly) {
        return
      }
      return unlink(r(key))
    },
    getKeys(_base, topts) {
      return readdirRecursive(r('.'), opts.ignore, topts?.maxDepth)
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return
      }
      await rmRecursive(r('.'))
    }
  }
})

const storage$2 = createStorage({})

storage$2.mount('/assets', assets$1)

storage$2.mount('#rate-limiter-storage', unstorage_47drivers_47lru_45cache({ driver: 'lruCache' }))
storage$2.mount('data', unstorage_47drivers_47fs_45lite({ driver: 'fsLite', base: './.data/kv' }))

function useStorage(base = '') {
  return base ? prefixStorage(storage$2, base) : storage$2
}

function serialize$1(o) { return typeof o == 'string' ? `'${o}'` : new c$1().serialize(o) } const c$1 =/* @__PURE__ */(function () { class o {#t = new Map(); compare(t, r) { const e = typeof t, n = typeof r; return e === 'string' && n === 'string' ? t.localeCompare(r) : e === 'number' && n === 'number' ? t - r : String.prototype.localeCompare.call(this.serialize(t, true), this.serialize(r, true)) }serialize(t, r) { if (t === null) return 'null'; switch (typeof t) { case 'string':return r ? t : `'${t}'`; case 'bigint':return `${t}n`; case 'object':return this.$object(t); case 'function':return this.$function(t) } return String(t) }serializeObject(t) { const r = Object.prototype.toString.call(t); if (r !== '[object Object]') return this.serializeBuiltInType(r.length < 10 ? `unknown:${r}` : r.slice(8, -1), t); const e = t.constructor, n = e === Object || e === void 0 ? '' : e.name; if (n !== '' && globalThis[n] === e) return this.serializeBuiltInType(n, t); if (typeof t.toJSON == 'function') { const i = t.toJSON(); return n + (i !== null && typeof i == 'object' ? this.$object(i) : `(${this.serialize(i)})`) } return this.serializeObjectEntries(n, Object.entries(t)) }serializeBuiltInType(t, r) { const e = this['$' + t]; if (e) return e.call(this, r); if (typeof r?.entries == 'function') return this.serializeObjectEntries(t, r.entries()); throw new Error(`Cannot serialize ${t}`) }serializeObjectEntries(t, r) { const e = Array.from(r).sort((i, a) => this.compare(i[0], a[0])); let n = `${t}{`; for (let i = 0; i < e.length; i++) { const [a, l] = e[i]; n += `${this.serialize(a, true)}:${this.serialize(l)}`, i < e.length - 1 && (n += ',') } return n + '}' }$object(t) { let r = this.#t.get(t); return r === void 0 && (this.#t.set(t, `#${this.#t.size}`), r = this.serializeObject(t), this.#t.set(t, r)), r }$function(t) { const r = Function.prototype.toString.call(t); return r.slice(-15) === '[native code] }' ? `${t.name || ''}()[native]` : `${t.name}(${t.length})${r.replace(/\s*\n\s*/g, '')}` }$Array(t) { let r = '['; for (let e = 0; e < t.length; e++)r += this.serialize(t[e]), e < t.length - 1 && (r += ','); return r + ']' }$Date(t) { try { return `Date(${t.toISOString()})` } catch { return 'Date(null)' } }$ArrayBuffer(t) { return `ArrayBuffer[${new Uint8Array(t).join(',')}]` }$Set(t) { return `Set${this.$Array(Array.from(t).sort((r, e) => this.compare(r, e)))}` }$Map(t) { return this.serializeObjectEntries('Map', t.entries()) }} for (const s of ['Error', 'RegExp', 'URL'])o.prototype['$' + s] = function (t) { return `${s}(${t})` }; for (const s of ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'])o.prototype['$' + s] = function (t) { return `${s}[${t.join(',')}]` }; for (const s of ['BigInt64Array', 'BigUint64Array'])o.prototype['$' + s] = function (t) { return `${s}[${t.join('n,')}${t.length > 0 ? 'n' : ''}]` }; return o }())

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true
  }
  return false
}

const e = globalThis.process?.getBuiltinModule?.('crypto')?.hash, r$1 = 'sha256', s = 'base64url'; function digest(t) { if (e) return e(r$1, t, s); const o = createHash(r$1).update(t); return globalThis.process?.versions?.webcontainer ? o.digest().toString(s) : o.digest(s) }

function hash$1(input) {
  return digest(serialize$1(input))
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = ''
    #context = /* @__PURE__ */ new Map()
    write(str) {
      this.buff += str
    }

    dispatch(value) {
      const type = value === null ? 'null' : typeof value
      return this[type](value)
    }

    object(object) {
      if (object && typeof object.toJSON === 'function') {
        return this.object(object.toJSON())
      }
      const objString = Object.prototype.toString.call(object)
      let objType = ''
      const objectLength = objString.length
      objType = objectLength < 10 ? 'unknown:[' + objString + ']' : objString.slice(8, objectLength - 1)
      objType = objType.toLowerCase()
      let objectNumber = null
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size)
      } else {
        return this.dispatch('[CIRCULAR:' + objectNumber + ']')
      }
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write('buffer:')
        return this.write(object.toString('utf8'))
      }
      if (objType !== 'object' && objType !== 'function' && objType !== 'asyncfunction') {
        if (this[objType]) {
          this[objType](object)
        } else {
          this.unknown(object, objType)
        }
      } else {
        const keys = Object.keys(object).sort()
        const extraKeys = []
        this.write('object:' + (keys.length + extraKeys.length) + ':')
        const dispatchForKey = (key) => {
          this.dispatch(key)
          this.write(':')
          this.dispatch(object[key])
          this.write(',')
        }
        for (const key of keys) {
          dispatchForKey(key)
        }
        for (const key of extraKeys) {
          dispatchForKey(key)
        }
      }
    }

    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered
      this.write('array:' + arr.length + ':')
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry)
        }
        return
      }
      const contextAdditions = /* @__PURE__ */ new Map()
      const entries = arr.map((entry) => {
        const hasher = new Hasher2()
        hasher.dispatch(entry)
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value)
        }
        return hasher.toString()
      })
      this.#context = contextAdditions
      entries.sort()
      return this.array(entries, false)
    }

    date(date) {
      return this.write('date:' + date.toJSON())
    }

    symbol(sym) {
      return this.write('symbol:' + sym.toString())
    }

    unknown(value, type) {
      this.write(type)
      if (!value) {
        return
      }
      this.write(':')
      if (value && typeof value.entries === 'function') {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        )
      }
    }

    error(err) {
      return this.write('error:' + err.toString())
    }

    boolean(bool) {
      return this.write('bool:' + bool)
    }

    string(string) {
      this.write('string:' + string.length + ':')
      this.write(string)
    }

    function(fn) {
      this.write('fn:')
      if (isNativeFunction(fn)) {
        this.dispatch('[native]')
      } else {
        this.dispatch(fn.toString())
      }
    }

    number(number) {
      return this.write('number:' + number)
    }

    null() {
      return this.write('Null')
    }

    undefined() {
      return this.write('Undefined')
    }

    regexp(regex) {
      return this.write('regex:' + regex.toString())
    }

    arraybuffer(arr) {
      this.write('arraybuffer:')
      return this.dispatch(new Uint8Array(arr))
    }

    url(url) {
      return this.write('url:' + url.toString())
    }

    map(map) {
      this.write('map:')
      const arr = [...map]
      return this.array(arr, false)
    }

    set(set) {
      this.write('set:')
      const arr = [...set]
      return this.array(arr, false)
    }

    bigint(number) {
      return this.write('bigint:' + number.toString())
    }
  }
  for (const type of [
    'uint8array',
    'uint8clampedarray',
    'unt8array',
    'uint16array',
    'unt16array',
    'uint32array',
    'unt32array',
    'float32array',
    'float64array'
  ]) {
    Hasher2.prototype[type] = function (arr) {
      this.write(type + ':')
      return this.array([...arr], false)
    }
  }
  function isNativeFunction(f) {
    if (typeof f !== 'function') {
      return false
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === '[native code] }'
  }
  return Hasher2
})()
function serialize(object) {
  const hasher = new Hasher()
  hasher.dispatch(object)
  return hasher.buff
}
function hash(value) {
  return digest(typeof value === 'string' ? value : serialize(value)).replace(/[-_]/g, '').slice(0, 10)
}

function defaultCacheOptions() {
  return {
    name: '_',
    base: '/cache',
    swr: true,
    maxAge: 1
  }
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts }
  const pending = {}
  const group = opts.group || 'nitro/functions'
  const name = opts.name || fn.name || '_'
  const integrity = opts.integrity || hash([fn, opts])
  const validate = opts.validate || (entry => entry.value !== void 0)
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + '.json'].filter(Boolean).join(':').replace(/:\/$/, ':index')
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error)
      useNitroApp().captureError(error, { event, tags: ['cache'] })
    }) || {}
    if (typeof entry !== 'object') {
      entry = {}
      const error = new Error('Malformed data read from cache.')
      console.error('[cache]', error)
      useNitroApp().captureError(error, { event, tags: ['cache'] })
    }
    const ttl = (opts.maxAge ?? 0) * 1e3
    if (ttl) {
      entry.expires = Date.now() + ttl
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false
    const _resolve = async () => {
      const isPending = pending[key]
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0
          entry.integrity = void 0
          entry.mtime = void 0
          entry.expires = void 0
        }
        pending[key] = Promise.resolve(resolver())
      }
      try {
        entry.value = await pending[key]
      } catch (error) {
        if (!isPending) {
          delete pending[key]
        }
        throw error
      }
      if (!isPending) {
        entry.mtime = Date.now()
        entry.integrity = integrity
        delete pending[key]
        if (validate(entry) !== false) {
          let setOpts
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge }
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error)
            useNitroApp().captureError(error, { event, tags: ['cache'] })
          })
          if (event?.waitUntil) {
            event.waitUntil(promise)
          }
        }
      }
    }
    const _resolvePromise = expired ? _resolve() : Promise.resolve()
    if (entry.value === void 0) {
      await _resolvePromise
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise)
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error)
        useNitroApp().captureError(error, { event, tags: ['cache'] })
      })
      return entry
    }
    return _resolvePromise.then(() => entry)
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args)
    if (shouldBypassCache) {
      return fn(...args)
    }
    const key = await (opts.getKey || getKey)(...args)
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args)
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    )
    let value = entry.value
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value
    }
    return value
  }
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts)
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : ''
}
function escapeKey(key) {
  return String(key).replace(/\W/g, '')
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map(h => h.toLowerCase()).sort()
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event)
      if (customKey) {
        return escapeKey(customKey)
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path
      let _pathname
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || 'index'
      } catch {
        _pathname = '-'
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`
      const _headers = variableHeaderNames.map(header => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`)
      return [_hashedPath, ..._headers].join(':')
    },
    validate: (entry) => {
      if (!entry.value) {
        return false
      }
      if (entry.value.code >= 400) {
        return false
      }
      if (entry.value.body === void 0) {
        return false
      }
      if (entry.value.headers.etag === 'undefined' || entry.value.headers['last-modified'] === 'undefined') {
        return false
      }
      return true
    },
    group: opts.group || 'nitro/handlers',
    integrity: opts.integrity || hash([handler, opts])
  }
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {}
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header]
        if (value !== void 0) {
          variableHeaders[header] = value
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      })
      const resHeaders = {}
      let _resSendBody
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name]
        },
        setHeader(name, value) {
          resHeaders[name] = value
          return this
        },
        getHeaderNames() {
          return Object.keys(resHeaders)
        },
        hasHeader(name) {
          return name in resHeaders
        },
        removeHeader(name) {
          delete resHeaders[name]
        },
        getHeaders() {
          return resHeaders
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === 'string') {
            _resSendBody = chunk
          }
          if (typeof arg2 === 'function') {
            arg2()
          }
          if (typeof arg3 === 'function') {
            arg3()
          }
          return this
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === 'string') {
            _resSendBody = chunk
          }
          if (typeof arg2 === 'function') {
            arg2(void 0)
          }
          if (typeof arg3 === 'function') {
            arg3()
          }
          return true
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === 'string') {
              throw new TypeError('Raw headers  is not supported.')
            }
            for (const header in headers2) {
              const value = headers2[header]
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                )
              }
            }
          }
          return this
        }
      })
      const event = createEvent(reqProxy, resProxy)
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      })
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      })
      event.waitUntil = incomingEvent.waitUntil
      event.context = incomingEvent.context
      event.context.cache = {
        options: _opts
      }
      const body = await handler(event) || _resSendBody
      const headers = event.node.res.getHeaders()
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      )
      headers['last-modified'] = String(
        headers['Last-Modified'] || headers['last-modified'] || (/* @__PURE__ */ new Date()).toUTCString()
      )
      const cacheControl = []
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`)
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`)
        } else {
          cacheControl.push('stale-while-revalidate')
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`)
      }
      if (cacheControl.length > 0) {
        headers['cache-control'] = cacheControl.join(', ')
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      }
      return cacheEntry
    },
    _opts
  )
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return
      }
      return handler(event)
    }
    const response = await _cachedHandler(
      event
    )
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers['last-modified']),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return
    }
    event.node.res.statusCode = response.code
    for (const name in response.headers) {
      const value = response.headers[name]
      if (name === 'set-cookie') {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        )
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value)
        }
      }
    }
    return response.body
  })
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property]
      }
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value
        return true
      }
      return Reflect.set(target, property, value, receiver)
    }
  })
}
const cachedEventHandler = defineCachedEventHandler

function klona(x) {
  if (typeof x !== 'object') return x

  var k, tmp, str = Object.prototype.toString.call(x)

  if (str === '[object Object]') {
    if (x.constructor !== Object && typeof x.constructor === 'function') {
      tmp = new x.constructor()
      for (k in x) {
        if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
          tmp[k] = klona(x[k])
        }
      }
    } else {
      tmp = {} // null
      for (k in x) {
        if (k === '__proto__') {
          Object.defineProperty(tmp, k, {
            value: klona(x[k]),
            configurable: true,
            enumerable: true,
            writable: true
          })
        } else {
          tmp[k] = klona(x[k])
        }
      }
    }
    return tmp
  }

  if (str === '[object Array]') {
    k = x.length
    for (tmp = Array(k); k--;) {
      tmp[k] = klona(x[k])
    }
    return tmp
  }

  if (str === '[object Set]') {
    tmp = new Set()
    x.forEach(function (val) {
      tmp.add(klona(val))
    })
    return tmp
  }

  if (str === '[object Map]') {
    tmp = new Map()
    x.forEach(function (val, key) {
      tmp.set(klona(key), klona(val))
    })
    return tmp
  }

  if (str === '[object Date]') {
    return new Date(+x)
  }

  if (str === '[object RegExp]') {
    tmp = new RegExp(x.source, x.flags)
    tmp.lastIndex = x.lastIndex
    return tmp
  }

  if (str === '[object DataView]') {
    return new x.constructor(klona(x.buffer))
  }

  if (str === '[object ArrayBuffer]') {
    return x.slice(0)
  }

  // ArrayBuffer.isView(x)
  // ~> `new` bcuz `Buffer.slice` => ref
  if (str.slice(-6) === 'Array]') {
    return new x.constructor(x)
  }

  return x
}

const defineAppConfig = config => config

const appConfig0 = defineAppConfig({
  esperion: {
    name: 'Esperion',
    tagline: 'Digital Agency',
    colors: {
      primary: '#2B9EDB'
    }
  },
  ui: {
    colors: {
      primary: 'esperion',
      neutral: 'gray'
    }
  }
})

const inlineAppConfig = {
  nuxt: {},
  ui: {
    colors: {
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate'
    },
    icons: {
      arrowDown: 'i-lucide-arrow-down',
      arrowLeft: 'i-lucide-arrow-left',
      arrowRight: 'i-lucide-arrow-right',
      arrowUp: 'i-lucide-arrow-up',
      caution: 'i-lucide-circle-alert',
      check: 'i-lucide-check',
      chevronDoubleLeft: 'i-lucide-chevrons-left',
      chevronDoubleRight: 'i-lucide-chevrons-right',
      chevronDown: 'i-lucide-chevron-down',
      chevronLeft: 'i-lucide-chevron-left',
      chevronRight: 'i-lucide-chevron-right',
      chevronUp: 'i-lucide-chevron-up',
      close: 'i-lucide-x',
      copy: 'i-lucide-copy',
      copyCheck: 'i-lucide-copy-check',
      dark: 'i-lucide-moon',
      drag: 'i-lucide-grip-vertical',
      ellipsis: 'i-lucide-ellipsis',
      error: 'i-lucide-circle-x',
      external: 'i-lucide-arrow-up-right',
      eye: 'i-lucide-eye',
      eyeOff: 'i-lucide-eye-off',
      file: 'i-lucide-file',
      folder: 'i-lucide-folder',
      folderOpen: 'i-lucide-folder-open',
      hash: 'i-lucide-hash',
      info: 'i-lucide-info',
      light: 'i-lucide-sun',
      loading: 'i-lucide-loader-circle',
      menu: 'i-lucide-menu',
      minus: 'i-lucide-minus',
      panelClose: 'i-lucide-panel-left-close',
      panelOpen: 'i-lucide-panel-left-open',
      plus: 'i-lucide-plus',
      reload: 'i-lucide-rotate-ccw',
      search: 'i-lucide-search',
      stop: 'i-lucide-square',
      success: 'i-lucide-circle-check',
      system: 'i-lucide-monitor',
      tip: 'i-lucide-lightbulb',
      upload: 'i-lucide-upload',
      warning: 'i-lucide-triangle-alert'
    },
    tv: {
      twMergeConfig: {}
    }
  },
  icon: {
    provider: 'server',
    class: '',
    aliases: {},
    iconifyApiEndpoint: 'https://api.iconify.design',
    localApiEndpoint: '/api/_nuxt_icon',
    fallbackToApi: true,
    cssSelectorPrefix: 'i-',
    cssWherePseudo: true,
    cssLayer: 'base',
    mode: 'css',
    attrs: {
      'aria-hidden': true
    },
    collections: [
      'academicons',
      'akar-icons',
      'ant-design',
      'arcticons',
      'basil',
      'bi',
      'bitcoin-icons',
      'bpmn',
      'brandico',
      'bx',
      'bxl',
      'bxs',
      'bytesize',
      'carbon',
      'catppuccin',
      'cbi',
      'charm',
      'ci',
      'cib',
      'cif',
      'cil',
      'circle-flags',
      'circum',
      'clarity',
      'codex',
      'codicon',
      'covid',
      'cryptocurrency',
      'cryptocurrency-color',
      'cuida',
      'dashicons',
      'devicon',
      'devicon-plain',
      'dinkie-icons',
      'duo-icons',
      'ei',
      'el',
      'emojione',
      'emojione-monotone',
      'emojione-v1',
      'entypo',
      'entypo-social',
      'eos-icons',
      'ep',
      'et',
      'eva',
      'f7',
      'fa',
      'fa-brands',
      'fa-regular',
      'fa-solid',
      'fa6-brands',
      'fa6-regular',
      'fa6-solid',
      'fa7-brands',
      'fa7-regular',
      'fa7-solid',
      'fad',
      'famicons',
      'fe',
      'feather',
      'file-icons',
      'flag',
      'flagpack',
      'flat-color-icons',
      'flat-ui',
      'flowbite',
      'fluent',
      'fluent-color',
      'fluent-emoji',
      'fluent-emoji-flat',
      'fluent-emoji-high-contrast',
      'fluent-mdl2',
      'fontelico',
      'fontisto',
      'formkit',
      'foundation',
      'fxemoji',
      'gala',
      'game-icons',
      'garden',
      'geo',
      'gg',
      'gis',
      'gravity-ui',
      'gridicons',
      'grommet-icons',
      'guidance',
      'healthicons',
      'heroicons',
      'heroicons-outline',
      'heroicons-solid',
      'hugeicons',
      'humbleicons',
      'ic',
      'icomoon-free',
      'icon-park',
      'icon-park-outline',
      'icon-park-solid',
      'icon-park-twotone',
      'iconamoon',
      'iconoir',
      'icons8',
      'il',
      'ion',
      'iwwa',
      'ix',
      'jam',
      'la',
      'lets-icons',
      'line-md',
      'lineicons',
      'logos',
      'ls',
      'lsicon',
      'lucide',
      'lucide-lab',
      'mage',
      'majesticons',
      'maki',
      'map',
      'marketeq',
      'material-icon-theme',
      'material-symbols',
      'material-symbols-light',
      'mdi',
      'mdi-light',
      'medical-icon',
      'memory',
      'meteocons',
      'meteor-icons',
      'mi',
      'mingcute',
      'mono-icons',
      'mynaui',
      'nimbus',
      'nonicons',
      'noto',
      'noto-v1',
      'nrk',
      'octicon',
      'oi',
      'ooui',
      'openmoji',
      'oui',
      'pajamas',
      'pepicons',
      'pepicons-pencil',
      'pepicons-pop',
      'pepicons-print',
      'ph',
      'picon',
      'pixel',
      'pixelarticons',
      'prime',
      'proicons',
      'ps',
      'qlementine-icons',
      'quill',
      'radix-icons',
      'raphael',
      'ri',
      'rivet-icons',
      'roentgen',
      'si',
      'si-glyph',
      'sidekickicons',
      'simple-icons',
      'simple-line-icons',
      'skill-icons',
      'solar',
      'stash',
      'streamline',
      'streamline-block',
      'streamline-color',
      'streamline-cyber',
      'streamline-cyber-color',
      'streamline-emojis',
      'streamline-flex',
      'streamline-flex-color',
      'streamline-freehand',
      'streamline-freehand-color',
      'streamline-kameleon-color',
      'streamline-logos',
      'streamline-pixel',
      'streamline-plump',
      'streamline-plump-color',
      'streamline-sharp',
      'streamline-sharp-color',
      'streamline-stickies-color',
      'streamline-ultimate',
      'streamline-ultimate-color',
      'subway',
      'svg-spinners',
      'system-uicons',
      'tabler',
      'tdesign',
      'teenyicons',
      'temaki',
      'token',
      'token-branded',
      'topcoat',
      'twemoji',
      'typcn',
      'uil',
      'uim',
      'uis',
      'uit',
      'uiw',
      'unjs',
      'vaadin',
      'vs',
      'vscode-icons',
      'websymbol',
      'weui',
      'whh',
      'wi',
      'wpf',
      'zmdi',
      'zondicons'
    ],
    fetchTimeout: 1500
  }
}

const appConfig = defuFn(appConfig0, inlineAppConfig)

const NUMBER_CHAR_RE = /\d/
const STR_SPLITTERS = ['-', '_', '/', '.']
function isUppercase(char = '') {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0
  }
  return char !== char.toLowerCase()
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS
  const parts = []
  if (!str || typeof str !== 'string') {
    return parts
  }
  let buff = ''
  let previousUpper
  let previousSplitter
  for (const char of str) {
    const isSplitter = splitters.includes(char)
    if (isSplitter === true) {
      parts.push(buff)
      buff = ''
      previousUpper = void 0
      continue
    }
    const isUpper = isUppercase(char)
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff)
        buff = char
        previousUpper = isUpper
        continue
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1)
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)))
        buff = lastChar + char
        previousUpper = isUpper
        continue
      }
    }
    buff += char
    previousUpper = isUpper
    previousSplitter = isSplitter
  }
  parts.push(buff)
  return parts
}
function upperFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : ''
}
function lowerFirst(str) {
  return str ? str[0].toLowerCase() + str.slice(1) : ''
}
function pascalCase(str, opts) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map(p => upperFirst(p)).join('') : ''
}
function camelCase(str, opts) {
  return lowerFirst(pascalCase(str || ''))
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map(p => p.toLowerCase()).join(joiner ?? '-') : ''
}
function snakeCase(str) {
  return kebabCase(str || '', '_')
}
const titleCaseExceptions = /^(a|an|and|as|at|but|by|for|if|in|is|nor|of|on|or|the|to|with)$/i
function titleCase(str, opts) {
  return (Array.isArray(str) ? str : splitByCase(str)).filter(Boolean).map(
    p => titleCaseExceptions.test(p) ? p.toLowerCase() : upperFirst(p)
  ).join(' ')
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase()
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  )
}
function _isObject(input) {
  return typeof input === 'object' && !Array.isArray(input)
}
function applyEnv(obj, opts, parentKey = '') {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key
    const envValue = getEnv(subKey, opts)
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue }
        applyEnv(obj[key], opts, subKey)
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey)
      } else {
        obj[key] = envValue ?? obj[key]
      }
    } else {
      obj[key] = envValue ?? obj[key]
    }
    if (opts.envExpansion && typeof obj[key] === 'string') {
      obj[key] = _expandFromEnv(obj[key])
    }
  }
  return obj
}
const envExpandRx = /\{\{([^{}]*)\}\}/g
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match
  })
}

const _inlineRuntimeConfig = {
  'app': {
    baseURL: '/',
    buildId: '10855563-40ed-437e-9323-a60b35e973df',
    buildAssetsDir: '/_nuxt/',
    cdnURL: ''
  },
  'nitro': {
    envPrefix: 'NUXT_',
    routeRules: {
      '/__nuxt_error': {
        cache: false
      },
      '/dashboard/**': {
        ssr: false
      },
      '/id/dashboard/**': {
        ssr: false
      },
      '/en/dashboard/**': {
        ssr: false
      },
      '/capital/**': {
        ssr: false
      },
      '/id/capital/**': {
        ssr: false
      },
      '/en/capital/**': {
        ssr: false
      },
      '/': {
        swr: 60,
        cache: {
          swr: true,
          maxAge: 60
        }
      },
      '/id/**': {
        swr: 60,
        cache: {
          swr: true,
          maxAge: 60
        }
      },
      '/en/**': {
        swr: 60,
        cache: {
          swr: true,
          maxAge: 60
        }
      },
      '/id/our-works/**': {
        swr: 300,
        cache: {
          swr: true,
          maxAge: 300
        }
      },
      '/en/our-works/**': {
        swr: 300,
        cache: {
          swr: true,
          maxAge: 300
        }
      },
      '/id/our-services/**': {
        swr: 300,
        cache: {
          swr: true,
          maxAge: 300
        }
      },
      '/en/our-services/**': {
        swr: 300,
        cache: {
          swr: true,
          maxAge: 300
        }
      },
      '/id/articles/**': {
        swr: 300,
        cache: {
          swr: true,
          maxAge: 300
        }
      },
      '/en/articles/**': {
        swr: 300,
        cache: {
          swr: true,
          maxAge: 300
        }
      },
      '/id/about': {
        swr: 600,
        cache: {
          swr: true,
          maxAge: 600
        }
      },
      '/en/about': {
        swr: 600,
        cache: {
          swr: true,
          maxAge: 600
        }
      },
      '/id/contact-us': {
        swr: 600,
        cache: {
          swr: true,
          maxAge: 600
        }
      },
      '/en/contact-us': {
        swr: 600,
        cache: {
          swr: true,
          maxAge: 600
        }
      },
      '/id/privacy-policy': {
        swr: 86400,
        cache: {
          swr: true,
          maxAge: 86400
        }
      },
      '/en/privacy-policy': {
        swr: 86400,
        cache: {
          swr: true,
          maxAge: 86400
        }
      },
      '/id/terms-of-service': {
        swr: 86400,
        cache: {
          swr: true,
          maxAge: 86400
        }
      },
      '/en/terms-of-service': {
        swr: 86400,
        cache: {
          swr: true,
          maxAge: 86400
        }
      },
      '/api/**': {
        cors: true,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': '*',
          'access-control-allow-headers': '*',
          'access-control-max-age': '0'
        }
      },
      '/mcp/**': {
        cors: true,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': '*',
          'access-control-allow-headers': '*',
          'access-control-max-age': '0'
        }
      },
      '/__sitemap__/style.xsl': {
        headers: {
          'Content-Type': 'application/xslt+xml'
        }
      },
      '/sitemap.xml': {
        redirect: {
          to: '/sitemap_index.xml',
          statusCode: 307
        }
      },
      '/sitemap_index.xml': {},
      '/__sitemap__/id-ID.xml': {},
      '/__sitemap__/en-US.xml': {},
      '/**': {
        headers: {
          'Referrer-Policy': 'no-referrer',
          'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
          'X-Content-Type-Options': 'nosniff',
          'X-Download-Options': 'noopen',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Permitted-Cross-Domain-Policies': 'none',
          'X-XSS-Protection': '0'
        }
      },
      '/_nuxt': {
        robots: 'noindex',
        headers: {
          'X-Robots-Tag': 'noindex'
        }
      },
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
          'X-Robots-Tag': 'noindex'
        },
        robots: 'noindex'
      },
      '/_fonts/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '//_payload.json': {
        cache: {
          swr: true,
          maxAge: 60
        }
      },
      '/id/about/_payload.json': {
        cache: {
          swr: true,
          maxAge: 600
        }
      },
      '/en/about/_payload.json': {
        cache: {
          swr: true,
          maxAge: 600
        }
      },
      '/id/contact-us/_payload.json': {
        cache: {
          swr: true,
          maxAge: 600
        }
      },
      '/en/contact-us/_payload.json': {
        cache: {
          swr: true,
          maxAge: 600
        }
      },
      '/id/privacy-policy/_payload.json': {
        cache: {
          swr: true,
          maxAge: 86400
        }
      },
      '/en/privacy-policy/_payload.json': {
        cache: {
          swr: true,
          maxAge: 86400
        }
      },
      '/id/terms-of-service/_payload.json': {
        cache: {
          swr: true,
          maxAge: 86400
        }
      },
      '/en/terms-of-service/_payload.json': {
        cache: {
          swr: true,
          maxAge: 86400
        }
      }
    }
  },
  'public': {
    'apiBase': 'http://localhost:8080',
    'recaptchaSiteKey': '',
    'ga4MeasurementId': '',
    'clarityProjectId': '',
    'metaPixelId': '',
    'tiktokPixelId': '',
    'linkedinPixelId': '',
    'alibabaApiKey': '',
    'piniaPluginPersistedstate': {},
    'csurf': {
      headerName: 'csrf-token'
    },
    'nuxt-robots': {
      version: '5.7.1',
      isNuxtContentV2: false,
      debug: false,
      credits: true,
      groups: [
        {
          comment: [],
          disallow: [],
          allow: [
            '/',
            '/id/',
            '/en/'
          ],
          userAgent: [
            '*'
          ],
          contentUsage: [],
          contentSignal: [],
          host: 'https://esperion.id',
          _indexable: true,
          _rules: [
            {
              pattern: '/',
              allow: true
            },
            {
              pattern: '/id/',
              allow: true
            },
            {
              pattern: '/en/',
              allow: true
            }
          ],
          _normalized: true
        },
        {
          comment: [],
          disallow: [
            ''
          ],
          allow: [],
          userAgent: [
            'AdsBot-Google-Mobile'
          ],
          contentUsage: [],
          contentSignal: [],
          _indexable: true,
          _rules: [],
          _normalized: true
        },
        {
          comment: [],
          disallow: [
            ''
          ],
          allow: [],
          userAgent: [
            'Googlebot-Mobile'
          ],
          contentUsage: [],
          contentSignal: [],
          _indexable: true,
          _rules: [],
          _normalized: true
        }
      ],
      sitemap: [
        '/sitemap.xml',
        'https://esperion.id/sitemap.xml',
        '/sitemap_index.xml'
      ],
      header: true,
      robotsEnabledValue: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      robotsDisabledValue: 'noindex, nofollow',
      cacheControl: 'max-age=14400, must-revalidate',
      botDetection: true,
      pageMetaRobots: {}
    },
    'i18n': {
      baseUrl: '',
      defaultLocale: 'id',
      rootRedirect: '',
      redirectStatusCode: 302,
      skipSettingLocaleOnNavigate: false,
      locales: [
        {
          code: 'id',
          iso: 'id-ID',
          name: 'Bahasa Indonesia',
          language: 'id-ID'
        },
        {
          code: 'en',
          iso: 'en-US',
          name: 'English',
          language: 'en-US'
        }
      ],
      detectBrowserLanguage: {
        alwaysRedirect: true,
        cookieCrossOrigin: false,
        cookieDomain: '',
        cookieKey: 'i18n_redirected',
        cookieSecure: false,
        fallbackLocale: 'id',
        redirectOn: 'root',
        useCookie: true
      },
      experimental: {
        localeDetector: '',
        typedPages: true,
        typedOptionsAndMessages: false,
        alternateLinkCanonicalQueries: true,
        devCache: false,
        cacheLifetime: '',
        stripMessagesPayload: false,
        preload: false,
        strictSeo: false,
        nitroContextDetection: true,
        httpCacheDuration: 10
      },
      domainLocales: {
        id: {
          domain: ''
        },
        en: {
          domain: ''
        }
      }
    }
  },
  'icon': {
    serverKnownCssClasses: []
  },
  'sitemap': {
    isI18nMapped: true,
    sitemapName: 'sitemap.xml',
    isMultiSitemap: true,
    excludeAppSources: [],
    cacheMaxAgeSeconds: 600,
    autoLastmod: false,
    defaultSitemapsChunkSize: 1000,
    minify: false,
    sortEntries: true,
    debug: false,
    discoverImages: true,
    discoverVideos: true,
    sitemapsPathPrefix: '/__sitemap__/',
    isNuxtContentDocumentDriven: false,
    xsl: '/__sitemap__/style.xsl',
    xslTips: true,
    xslColumns: [
      {
        label: 'URL',
        width: '50%'
      },
      {
        label: 'Images',
        width: '25%',
        select: 'count(image:image)'
      },
      {
        label: 'Last Updated',
        width: '25%',
        select: 'concat(substring(sitemap:lastmod,0,11),concat(\' \', substring(sitemap:lastmod,12,5)),concat(\' \', substring(sitemap:lastmod,20,6)))'
      }
    ],
    credits: true,
    version: '7.6.0',
    sitemaps: {
      'index': {
        sitemapName: 'index',
        _route: 'sitemap_index.xml',
        sitemaps: [],
        include: [],
        exclude: []
      },
      'id-ID': {
        include: [],
        exclude: [
          '/dashboard/**',
          '/id/dashboard/**',
          '/en/dashboard/**',
          '/capital/**',
          '/id/capital/**',
          '/en/capital/**',
          '/api/**',
          '/id/api/**',
          '/en/api/**',
          '/admin/**',
          '/id/admin/**',
          '/en/admin/**',
          '/_**',
          '/_nuxt/**'
        ],
        includeAppSources: true,
        sitemapName: 'id-ID',
        _route: '/__sitemap__/id-ID.xml'
      },
      'en-US': {
        include: [],
        exclude: [
          '/dashboard/**',
          '/id/dashboard/**',
          '/en/dashboard/**',
          '/capital/**',
          '/id/capital/**',
          '/en/capital/**',
          '/api/**',
          '/id/api/**',
          '/en/api/**',
          '/admin/**',
          '/id/admin/**',
          '/en/admin/**',
          '/_**',
          '/_nuxt/**'
        ],
        includeAppSources: true,
        sitemapName: 'en-US',
        _route: '/__sitemap__/en-US.xml'
      }
    },
    autoI18n: {
      differentDomains: false,
      defaultLocale: 'id',
      locales: [
        {
          code: 'id',
          iso: 'id-ID',
          name: 'Bahasa Indonesia',
          file: 'id.json',
          language: 'id-ID',
          _hreflang: 'id-ID',
          _sitemap: 'id-ID'
        },
        {
          code: 'en',
          iso: 'en-US',
          name: 'English',
          file: 'en.json',
          language: 'en-US',
          _hreflang: 'en-US',
          _sitemap: 'en-US'
        }
      ],
      strategy: 'prefix',
      pages: {}
    }
  },
  'nuxt-schema-org': {
    reactive: false,
    minify: true,
    scriptAttributes: {
      'data-nuxt-schema-org': true
    },
    identity: '',
    version: '5.0.10'
  },
  'private': {
    basicAuth: false
  },
  'security': {
    strict: false,
    headers: {
      crossOriginResourcePolicy: 'cross-origin',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginEmbedderPolicy: 'require-corp',
      contentSecurityPolicy: {
        'base-uri': [
          '\'self\''
        ],
        'font-src': [
          '\'self\'',
          'https:',
          'data:'
        ],
        'form-action': [
          '\'self\''
        ],
        'frame-ancestors': [
          '\'self\''
        ],
        'img-src': [
          '\'self\'',
          'data:',
          'blob:',
          'https:',
          '*'
        ],
        'object-src': [
          '\'none\''
        ],
        'script-src-attr': [
          '\'none\''
        ],
        'style-src': [
          '\'self\'',
          '\'unsafe-inline\'',
          'https://fonts.googleapis.com'
        ],
        'script-src': [
          '\'self\'',
          '\'unsafe-inline\'',
          '\'unsafe-eval\'',
          'https://www.google.com/recaptcha/',
          'https://www.gstatic.com/recaptcha/',
          'https://www.googletagmanager.com',
          'https://connect.facebook.net',
          'https://analytics.tiktok.com',
          'https://snap.licdn.com',
          'https://www.clarity.ms',
          'https://*.googlesyndication.com',
          'https://*.google-analytics.com',
          'https://*.doubleclick.net'
        ],
        'upgrade-insecure-requests': true,
        'default-src': [
          '\'self\''
        ],
        'connect-src': [
          '\'self\'',
          'http://localhost:8080',
          'http://localhost:8081',
          'https://*.google.com',
          'https://*.google-analytics.com',
          'https://*.facebook.com',
          'https://*.tiktok.com',
          'https://*.linkedin.com',
          'https://*.clarity.ms',
          'https://*.googlesyndication.com',
          'https://*.doubleclick.net',
          'https://translation.aliyuncs.com'
        ],
        'frame-src': [
          '\'self\'',
          'https://www.google.com/recaptcha/',
          'https://www.gstatic.com/recaptcha/',
          'https://*.google.com'
        ]
      },
      originAgentCluster: '?1',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true
      },
      xContentTypeOptions: 'nosniff',
      xDNSPrefetchControl: 'off',
      xDownloadOptions: 'noopen',
      xFrameOptions: 'SAMEORIGIN',
      xPermittedCrossDomainPolicies: 'none',
      xXSSProtection: '0',
      permissionsPolicy: {
        'camera': [],
        'display-capture': [],
        'fullscreen': [],
        'geolocation': [],
        'microphone': [],
        'payment': []
      }
    },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 8000000,
      throwError: true
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
      headers: false,
      driver: {
        name: 'lruCache'
      },
      whiteList: '',
      ipHeader: '',
      throwError: true
    },
    xssValidator: {
      methods: [
        'GET',
        'POST'
      ],
      throwError: true
    },
    corsHandler: {
      origin: 'http://localhost:3000',
      methods: [
        'GET',
        'HEAD',
        'PUT',
        'PATCH',
        'POST',
        'DELETE'
      ],
      preflight: {
        statusCode: 204
      },
      enabled: false
    },
    allowedMethodsRestricter: {
      methods: '*',
      throwError: true
    },
    hidePoweredBy: true,
    enabled: true,
    csrf: {
      enabled: true
    },
    nonce: true,
    removeLoggers: true,
    ssg: {
      meta: true,
      hashScripts: true,
      hashStyles: false,
      nitroHeaders: true,
      exportToPresets: true
    },
    sri: true
  },
  'csurf': {
    https: true,
    cookieKey: '__Host-csrf',
    cookie: {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    },
    headerName: 'csrf-token',
    methodsToProtect: [
      'POST',
      'PUT',
      'PATCH'
    ],
    enabled: true,
    encryptSecret: 'xBnOiFW1cY1z0eW9qIROHM4tlVUpWA=='
  },
  'nuxt-site-config': {
    stack: [
      {
        _context: 'system',
        _priority: -15,
        name: 'frontend',
        env: 'production'
      },
      {
        _context: '@nuxtjs/i18n',
        defaultLocale: 'id-ID'
      },
      {
        _context: 'D:/Bisnis/esperion/esperion openspec/frontend/public/_robots.txt',
        url: 'https://esperion.id'
      }
    ],
    version: '3.2.21',
    debug: false,
    multiTenancy: []
  },
  'nuxt-robots': {
    version: '5.7.1',
    isNuxtContentV2: false,
    debug: false,
    credits: true,
    groups: [
      {
        comment: [],
        disallow: [],
        allow: [
          '/',
          '/id/',
          '/en/'
        ],
        userAgent: [
          '*'
        ],
        contentUsage: [],
        contentSignal: [],
        host: 'https://esperion.id',
        _indexable: true,
        _rules: [
          {
            pattern: '/',
            allow: true
          },
          {
            pattern: '/id/',
            allow: true
          },
          {
            pattern: '/en/',
            allow: true
          }
        ],
        _normalized: true
      },
      {
        comment: [],
        disallow: [
          ''
        ],
        allow: [],
        userAgent: [
          'AdsBot-Google-Mobile'
        ],
        contentUsage: [],
        contentSignal: [],
        _indexable: true,
        _rules: [],
        _normalized: true
      },
      {
        comment: [],
        disallow: [
          ''
        ],
        allow: [],
        userAgent: [
          'Googlebot-Mobile'
        ],
        contentUsage: [],
        contentSignal: [],
        _indexable: true,
        _rules: [],
        _normalized: true
      }
    ],
    sitemap: [
      '/sitemap.xml',
      'https://esperion.id/sitemap.xml',
      '/sitemap_index.xml'
    ],
    header: true,
    robotsEnabledValue: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    robotsDisabledValue: 'noindex, nofollow',
    cacheControl: 'max-age=14400, must-revalidate',
    botDetection: true,
    pageMetaRobots: {}
  },
  'ipx': {
    sharp: {
      webp: {
        quality: 80,
        effort: 6
      },
      avif: {
        quality: 70,
        effort: 4
      }
    },
    baseURL: '/_ipx',
    alias: {},
    fs: {
      dir: '../public'
    },
    http: {
      domains: []
    }
  }
}
const envOptions = {
  prefix: 'NITRO_',
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? '_',
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
}
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
)
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig
  }
  const runtimeConfig = klona(_inlineRuntimeConfig)
  applyEnv(runtimeConfig, envOptions)
  event.context.nitro.runtimeConfig = runtimeConfig
  return runtimeConfig
}
const _sharedAppConfig = _deepFreeze(klona(appConfig))
function useAppConfig(event) {
  {
    return _sharedAppConfig
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object)
  for (const name of propNames) {
    const value = object[name]
    if (value && typeof value === 'object') {
      _deepFreeze(value)
    }
  }
  return Object.freeze(object)
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      'Please use `useRuntimeConfig()` instead of accessing config directly.'
    )
    const runtimeConfig = useRuntimeConfig()
    if (prop in runtimeConfig) {
      return runtimeConfig[prop]
    }
    return void 0
  }
})

function createContext(opts = {}) {
  let currentInstance
  let isSingleton = false
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error('Context conflict')
    }
  }
  let als
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage()
    } else {
      console.warn('[unctx] `AsyncLocalStorage` is not provided.')
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore()
      if (instance !== void 0) {
        return instance
      }
    }
    return currentInstance
  }
  return {
    use: () => {
      const _instance = _getCurrentInstance()
      if (_instance === void 0) {
        throw new Error('Context is not available')
      }
      return _instance
    },
    tryUse: () => {
      return _getCurrentInstance()
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance)
      }
      currentInstance = instance
      isSingleton = true
    },
    unset: () => {
      currentInstance = void 0
      isSingleton = false
    },
    call: (instance, callback) => {
      checkConflict(instance)
      currentInstance = instance
      try {
        return als ? als.run(instance, callback) : callback()
      } finally {
        if (!isSingleton) {
          currentInstance = void 0
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance
      const onRestore = () => {
        currentInstance = instance
      }
      const onLeave = () => currentInstance === instance ? onRestore : void 0
      asyncHandlers.add(onLeave)
      try {
        const r = als ? als.run(instance, callback) : callback()
        if (!isSingleton) {
          currentInstance = void 0
        }
        return await r
      } finally {
        asyncHandlers.delete(onLeave)
      }
    }
  }
}
function createNamespace(defaultOpts = {}) {
  const contexts = {}
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts })
      }
      return contexts[key]
    }
  }
}
const _globalThis = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : {}
const globalKey = '__unctx__'
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace())
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts)
const asyncHandlersKey = '__unctx_async_handlers__'
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set())
function executeAsync(function_) {
  const restores = []
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler()
    if (restore2) {
      restores.push(restore2)
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2()
    }
  }
  let awaitable = function_()
  if (awaitable && typeof awaitable === 'object' && 'catch' in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore()
      throw error
    })
  }
  return [awaitable, restore]
}

const config = useRuntimeConfig()
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
)
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event)
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers)
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to
      if (target.endsWith('/**')) {
        let targetPath = event.path
        const strpBase = routeRules.redirect._redirectStripBase
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase)
        }
        target = joinURL(target.slice(0, -3), targetPath)
      } else if (event.path.includes('?')) {
        const query = getQuery$1(event.path)
        target = withQuery(target, query)
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode)
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to
      if (target.endsWith('/**')) {
        let targetPath = event.path
        const strpBase = routeRules.proxy._proxyStripBase
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase)
        }
        target = joinURL(target.slice(0, -3), targetPath)
      } else if (event.path.includes('?')) {
        const query = getQuery$1(event.path)
        target = withQuery(target, query)
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      })
    }
  })
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {}
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split('?')[0], useRuntimeConfig().app.baseURL)
    )
  }
  return event.context._nitro.routeRules
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse())
}

function _captureError(error, type) {
  console.error(`[${type}]`, error)
  useNitroApp().captureError(error, { tags: [type] })
}
function trapUnhandledNodeErrors() {
  process.on(
    'unhandledRejection',
    error => _captureError(error, 'unhandledRejection')
  )
  process.on(
    'uncaughtException',
    error => _captureError(error, 'uncaughtException')
  )
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(', ') : String(value)
}
function normalizeFetchResponse(response) {
  if (!response.headers.has('set-cookie')) {
    return response
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  })
}
function normalizeCookieHeader(header = '') {
  return splitCookiesString(joinHeaders(header))
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers()
  for (const [name, header] of headers) {
    if (name === 'set-cookie') {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append('set-cookie', cookie)
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header))
    }
  }
  return outgoingHeaders
}

/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
  // If the client specifically requests HTML, then avoid classifying as JSON.
  if (hasReqHeader(event, 'accept', 'text/html')) {
    return false
  }
  return hasReqHeader(event, 'accept', 'application/json') || hasReqHeader(event, 'user-agent', 'curl/') || hasReqHeader(event, 'user-agent', 'httpie/') || hasReqHeader(event, 'sec-fetch-mode', 'cors') || event.path.startsWith('/api/') || event.path.endsWith('.json')
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name)
  return !!(value && typeof value === 'string' && value.toLowerCase().includes(includes))
}

const errorHandler$0 = async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    // let Nitro handle JSON errors
    return
  }
  // invoke default Nitro error handler (which will log appropriately if required)
  const defaultRes = await defaultHandler(error, event, { json: true })
  // let Nitro handle redirect if appropriate
  const status = error.status || error.statusCode || 500
  if (status === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers)
    setResponseStatus(event, defaultRes.status, defaultRes.statusText)
    return send(event, JSON.stringify(defaultRes.body, null, 2))
  }
  const errorObject = defaultRes.body
  // remove proto/hostname/port from URL
  const url = new URL(errorObject.url)
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash
  // add default server message (keep sanitized for unhandled errors)
  errorObject.message = error.unhandled ? errorObject.message || 'Server Error' : error.message || errorObject.message || 'Server Error'
  // we will be rendering this error internally so we can pass along the error.data safely
  errorObject.data ||= error.data
  errorObject.statusText ||= error.statusText || error.statusMessage
  delete defaultRes.headers['content-type']
  delete defaultRes.headers['content-security-policy']
  setResponseHeaders(event, defaultRes.headers)
  // Access request headers
  const reqHeaders = getRequestHeaders(event)
  // Detect to avoid recursion in SSR rendering of errors
  const isRenderingError = event.path.startsWith('/__nuxt_error') || !!reqHeaders['x-nuxt-error']
  // HTML response (via SSR)
  const res = isRenderingError
    ? null
    : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, '/__nuxt_error'), errorObject), {
        headers: {
          ...reqHeaders,
          'x-nuxt-error': 'true'
        },
        redirect: 'manual'
      }).catch(() => null)
  if (event.handled) {
    return
  }
  // Fallback to static rendered error page
  if (!res) {
    const { template } = await import('./error-500.mjs')
    setResponseHeader(event, 'Content-Type', 'text/html;charset=UTF-8')
    return send(event, template(errorObject))
  }
  const html = await res.text()
  for (const [header, value] of res.headers.entries()) {
    if (header === 'set-cookie') {
      appendResponseHeader(event, header, value)
      continue
    }
    setResponseHeader(event, header, value)
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText)
  return send(event, html)
}

function defineNitroErrorHandler(handler) {
  return handler
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event)
    setResponseHeaders(event, res.headers)
    setResponseStatus(event, res.status, res.statusText)
    return send(event, JSON.stringify(res.body, null, 2))
  }
)
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal
  const statusCode = error.statusCode || 500
  const statusMessage = error.statusMessage || 'Server Error'
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true })
  if (statusCode === 404) {
    const baseURL = '/'
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`
      return {
        status: 302,
        statusText: 'Found',
        headers: { location: redirectTo },
        body: `Redirecting...`
      }
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && '[unhandled]', error.fatal && '[fatal]'].filter(Boolean).join(' ')
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error)
  }
  const headers = {
    'content-type': 'application/json',
    // Prevent browser from guessing the MIME types of resources.
    'x-content-type-options': 'nosniff',
    // Prevent error page from being embedded in an iframe
    'x-frame-options': 'DENY',
    // Prevent browsers from sending the Referer header
    'referrer-policy': 'no-referrer',
    // Disable the execution of any js
    'content-security-policy': 'script-src \'none\'; frame-ancestors \'none\';'
  }
  setResponseStatus(event, statusCode, statusMessage)
  if (statusCode === 404 || !getResponseHeader(event, 'cache-control')) {
    headers['cache-control'] = 'no-cache'
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? 'Server Error' : error.message,
    data: isSensitive ? void 0 : error.data
  }
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  }
}

const errorHandlers = [errorHandler$0, errorHandler$1]

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler })
      if (event.handled) {
        return // Response handled
      }
    } catch (error) {
      // Handler itself thrown, log and continue
      console.error(error)
    }
  }
  // H3 will handle fallback
}

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$'
const unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g
const reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/
const escaped = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '	': '\\t',
  '\0': '\\0',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
}
const objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0')
function devalue(value) {
  const counts = /* @__PURE__ */ new Map()
  let logNum = 0
  function log(message) {
    if (logNum < 100) {
      console.warn(message)
      logNum += 1
    }
  }
  function walk(thing) {
    if (typeof thing === 'function') {
      log(`Cannot stringify a function ${thing.name}`)
      return
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1)
      return
    }
    counts.set(thing, 1)
    if (!isPrimitive(thing)) {
      const type = getType(thing)
      switch (type) {
        case 'Number':
        case 'String':
        case 'Boolean':
        case 'Date':
        case 'RegExp':
          return
        case 'Array':
          thing.forEach(walk)
          break
        case 'Set':
        case 'Map':
          Array.from(thing).forEach(walk)
          break
        default:
          const proto = Object.getPrototypeOf(thing)
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
            if (typeof thing.toJSON !== 'function') {
              log(`Cannot stringify arbitrary non-POJOs ${thing.constructor.name}`)
            }
          } else if (Object.getOwnPropertySymbols(thing).length > 0) {
            log(`Cannot stringify POJOs with symbolic keys ${Object.getOwnPropertySymbols(thing).map(symbol => symbol.toString())}`)
          } else {
            Object.keys(thing).forEach(key => walk(thing[key]))
          }
      }
    }
  }
  walk(value)
  const names = /* @__PURE__ */ new Map()
  Array.from(counts).filter(entry => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], getName(i))
  })
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing)
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing)
    }
    const type = getType(thing)
    switch (type) {
      case 'Number':
      case 'String':
      case 'Boolean':
        return `Object(${stringify(thing.valueOf())})`
      case 'RegExp':
        return thing.toString()
      case 'Date':
        return `new Date(${thing.getTime()})`
      case 'Array':
        const members = thing.map((v, i) => i in thing ? stringify(v) : '')
        const tail = thing.length === 0 || thing.length - 1 in thing ? '' : ','
        return `[${members.join(',')}${tail}]`
      case 'Set':
      case 'Map':
        return `new ${type}([${Array.from(thing).map(stringify).join(',')}])`
      default:
        if (thing.toJSON) {
          let json = thing.toJSON()
          if (getType(json) === 'String') {
            try {
              json = JSON.parse(json)
            } catch (e) {
            }
          }
          return stringify(json)
        }
        if (Object.getPrototypeOf(thing) === null) {
          if (Object.keys(thing).length === 0) {
            return 'Object.create(null)'
          }
          return `Object.create(null,{${Object.keys(thing).map(key => `${safeKey(key)}:{writable:true,enumerable:true,value:${stringify(thing[key])}}`).join(',')}})`
        }
        return `{${Object.keys(thing).map(key => `${safeKey(key)}:${stringify(thing[key])}`).join(',')}}`
    }
  }
  const str = stringify(value)
  if (names.size) {
    const params = []
    const statements = []
    const values = []
    names.forEach((name, thing) => {
      params.push(name)
      if (isPrimitive(thing)) {
        values.push(stringifyPrimitive(thing))
        return
      }
      const type = getType(thing)
      switch (type) {
        case 'Number':
        case 'String':
        case 'Boolean':
          values.push(`Object(${stringify(thing.valueOf())})`)
          break
        case 'RegExp':
          values.push(thing.toString())
          break
        case 'Date':
          values.push(`new Date(${thing.getTime()})`)
          break
        case 'Array':
          values.push(`Array(${thing.length})`)
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify(v)}`)
          })
          break
        case 'Set':
          values.push('new Set')
          statements.push(`${name}.${Array.from(thing).map(v => `add(${stringify(v)})`).join('.')}`)
          break
        case 'Map':
          values.push('new Map')
          statements.push(`${name}.${Array.from(thing).map(([k, v]) => `set(${stringify(k)}, ${stringify(v)})`).join('.')}`)
          break
        default:
          values.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}')
          Object.keys(thing).forEach((key) => {
            statements.push(`${name}${safeProp(key)}=${stringify(thing[key])}`)
          })
      }
    })
    statements.push(`return ${str}`)
    return `(function(${params.join(',')}){${statements.join(';')}}(${values.join(',')}))`
  } else {
    return str
  }
}
function getName(num) {
  let name = ''
  do {
    name = chars[num % chars.length] + name
    num = ~~(num / chars.length) - 1
  } while (num >= 0)
  return reserved.test(name) ? `${name}0` : name
}
function isPrimitive(thing) {
  return Object(thing) !== thing
}
function stringifyPrimitive(thing) {
  if (typeof thing === 'string') {
    return stringifyString(thing)
  }
  if (thing === void 0) {
    return 'void 0'
  }
  if (thing === 0 && 1 / thing < 0) {
    return '-0'
  }
  const str = String(thing)
  if (typeof thing === 'number') {
    return str.replace(/^(-)?0\./, '$1.')
  }
  return str
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1)
}
function escapeUnsafeChar(c) {
  return escaped[c] || c
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar)
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key))
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? `.${key}` : `[${escapeUnsafeChars(JSON.stringify(key))}]`
}
function stringifyString(str) {
  let result = '"'
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i)
    const code = char.charCodeAt(0)
    if (char === '"') {
      result += '\\"'
    } else if (char in escaped) {
      result += escaped[char]
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1)
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i]
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`
      }
    } else {
      result += char
    }
  }
  result += '"'
  return result
}

function normalizeSiteConfig(config) {
  if (typeof config.indexable !== 'undefined')
    config.indexable = String(config.indexable) !== 'false'
  if (typeof config.trailingSlash !== 'undefined' && !config.trailingSlash)
    config.trailingSlash = String(config.trailingSlash) !== 'false'
  if (config.url && !hasProtocol(String(config.url), { acceptRelative: true, strict: false }))
    config.url = withHttps(String(config.url))
  const keys = Object.keys(config).sort((a, b) => a.localeCompare(b))
  const newConfig = {}
  for (const k of keys)
    newConfig[k] = config[k]
  return newConfig
}
function createSiteConfigStack(options) {
  const debug = options?.debug || false
  const stack = []
  function push(input) {
    if (!input || typeof input !== 'object' || Object.keys(input).length === 0) {
      return () => {
      }
    }
    if (!input._context && debug) {
      let lastFunctionName = new Error('tmp').stack?.split('\n')[2]?.split(' ')[5]
      if (lastFunctionName?.includes('/'))
        lastFunctionName = 'anonymous'
      input._context = lastFunctionName
    }
    const entry = {}
    for (const k in input) {
      const val = input[k]
      if (typeof val !== 'undefined' && val !== '')
        entry[k] = val
    }
    if (Object.keys(entry).filter(k => !k.startsWith('_')).length === 0) {
      return () => {
      }
    }
    stack.push(entry)
    return () => {
      const idx = stack.indexOf(entry)
      if (idx !== -1)
        stack.splice(idx, 1)
    }
  }
  function get(options2) {
    const siteConfig = {}
    if (options2?.debug)
      siteConfig._context = {}
    siteConfig._priority = {}
    for (const o in stack.sort((a, b) => (a._priority || 0) - (b._priority || 0))) {
      for (const k in stack[o]) {
        const key = k
        const val = options2?.resolveRefs ? toValue(stack[o][k]) : stack[o][k]
        if (!k.startsWith('_') && typeof val !== 'undefined' && val !== '') {
          siteConfig[k] = val
          if (typeof stack[o]._priority !== 'undefined' && stack[o]._priority !== -1) {
            siteConfig._priority[key] = stack[o]._priority
          }
          if (options2?.debug)
            siteConfig._context[key] = stack[o]._context?.[key] || stack[o]._context || 'anonymous'
        }
      }
    }
    return options2?.skipNormalize ? siteConfig : normalizeSiteConfig(siteConfig)
  }
  return {
    stack,
    push,
    get
  }
}

function envSiteConfig(env = {}) {
  return Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith('NUXT_SITE_') || k.startsWith('NUXT_PUBLIC_SITE_')).map(([k, v]) => [
    k.replace(/^NUXT_(PUBLIC_)?SITE_/, '').split('_').map((s, i) => i === 0 ? s.toLowerCase() : s[0]?.toUpperCase() + s.slice(1).toLowerCase()).join(''),
    v
  ]))
}

function getSiteConfig(e, _options) {
  e.context.siteConfig = e.context.siteConfig || createSiteConfigStack()
  const options = defu(_options, useRuntimeConfig(e)['nuxt-site-config'], { debug: false })
  return e.context.siteConfig.get(options)
}

const _XdQ6elMg06w3xqvE3I63ovOXpDiPEyb5Cbg68suVI = defineNitroPlugin$1(async (nitroApp) => {
  nitroApp.hooks.hook('render:html', async (ctx, { event }) => {
    const routeOptions = getRouteRules(event)
    const isIsland = process.env.NUXT_COMPONENT_ISLANDS && event.path.startsWith('/__nuxt_island')
    event.path
    const noSSR = !!process.env.NUXT_NO_SSR || event.context.nuxt?.noSSR || routeOptions.ssr === false && !isIsland || (false)
    if (noSSR) {
      const siteConfig = Object.fromEntries(
        Object.entries(getSiteConfig(event)).map(([k, v]) => [k, toValue(v)])
      )
      ctx.body.push(`<script>window.__NUXT_SITE_CONFIG__=${devalue(siteConfig)}<\/script>`)
    }
  })
})

const KNOWN_SEARCH_BOTS = [
  {
    pattern: 'googlebot',
    name: 'googlebot',
    secondaryPatterns: ['google.com/bot.html']
  },
  {
    pattern: 'bingbot',
    name: 'bingbot',
    secondaryPatterns: ['msnbot']
  },
  {
    pattern: 'yandexbot',
    name: 'yandexbot'
  },
  {
    pattern: 'baiduspider',
    name: 'baiduspider',
    secondaryPatterns: ['baidu.com']
  },
  {
    pattern: 'duckduckbot',
    name: 'duckduckbot',
    secondaryPatterns: ['duckduckgo.com']
  },
  {
    pattern: 'slurp',
    name: 'yahoo'
  },
  {
    pattern: 'applebot',
    name: 'applebot',
    secondaryPatterns: ['apple.com/go/applebot']
  }
]
const SOCIAL_BOTS = [
  {
    pattern: 'twitterbot',
    name: 'twitter',
    secondaryPatterns: ['twitter']
  },
  {
    pattern: 'facebookexternalhit',
    name: 'facebook',
    secondaryPatterns: ['facebook.com']
  },
  {
    pattern: 'linkedinbot',
    name: 'linkedin',
    secondaryPatterns: ['linkedin']
  },
  {
    pattern: 'pinterestbot',
    name: 'pinterest',
    secondaryPatterns: ['pinterest']
  },
  {
    pattern: 'discordbot',
    name: 'discord',
    secondaryPatterns: ['discordapp']
  }
]
const SEO_BOTS = [
  {
    pattern: 'mj12bot',
    name: 'majestic12',
    secondaryPatterns: ['majestic12.co.uk/bot']
  },
  {
    pattern: 'ahrefsbot',
    name: 'ahrefs',
    secondaryPatterns: ['ahrefs.com']
  },
  {
    pattern: 'semrushbot',
    name: 'semrush',
    secondaryPatterns: ['semrush.com/bot']
  },
  {
    pattern: 'screaming frog',
    name: 'screaming-frog',
    secondaryPatterns: ['screamingfrog.co.uk']
  },
  {
    pattern: 'rogerbot',
    name: 'moz'
  }
]
const AI_BOTS = [
  {
    pattern: 'anthropic',
    name: 'anthropic'
  },
  {
    pattern: 'claude',
    name: 'claude'
  },
  {
    pattern: 'gptbot',
    name: 'gpt',
    secondaryPatterns: ['openai.com']
  },
  {
    pattern: 'google-extended',
    name: 'google-extended'
  },
  {
    pattern: 'applebot-extended',
    name: 'applebot-extended'
  },
  {
    pattern: 'bytespider',
    name: 'bytespider'
  },
  {
    pattern: 'diffbot',
    name: 'diffbot'
  },
  {
    pattern: 'googlebot-news',
    name: 'google-news'
  },
  {
    pattern: 'cohere',
    name: 'cohere',
    secondaryPatterns: ['cohere.com']
  },
  {
    pattern: 'ccbot',
    name: 'commoncrawl',
    secondaryPatterns: ['commoncrawl.org']
  },
  {
    pattern: 'perplexitybot',
    name: 'perplexity',
    secondaryPatterns: ['perplexity.ai']
  }
]
const HTTP_TOOL_BOTS = [
  {
    pattern: 'python-requests',
    name: 'requests',
    secondaryPatterns: ['python']
  },
  {
    pattern: 'wget',
    name: 'wget'
  },
  {
    pattern: 'curl',
    name: 'curl',
    secondaryPatterns: ['curl']
  }
]
const SECURITY_SCANNING_BOTS = [
  {
    pattern: 'zgrab',
    name: 'zgrab'
  },
  {
    pattern: 'masscan',
    name: 'masscan'
  },
  {
    pattern: 'nmap',
    name: 'nmap',
    secondaryPatterns: ['insecure.org']
  },
  {
    pattern: 'nikto',
    name: 'nikto'
  },
  {
    pattern: 'wpscan',
    name: 'wpscan'
  }
]
const SCRAPING_BOTS = [
  {
    pattern: 'scrapy',
    name: 'scrapy',
    secondaryPatterns: ['scrapy.org']
  }
]
const AUTOMATION_BOTS = [
  {
    pattern: 'phantomjs',
    name: 'phantomjs'
  },
  {
    pattern: 'headless',
    name: 'headless-browser'
  },
  {
    pattern: 'playwright',
    name: 'playwright'
  },
  {
    pattern: 'selenium',
    name: 'selenium',
    secondaryPatterns: ['webdriver']
  },
  {
    pattern: 'puppeteer',
    name: 'puppeteer',
    secondaryPatterns: ['headless']
  }
]
const GENERIC_BOTS = [
  {
    pattern: 'bot',
    name: 'generic-bot'
  },
  {
    pattern: 'spider',
    name: 'generic-spider'
  },
  {
    pattern: 'crawler',
    name: 'generic-crawler'
  },
  {
    pattern: 'scraper',
    name: 'generic-scraper'
  }
]
const BOT_MAP = [
  {
    type: 'search-engine',
    bots: KNOWN_SEARCH_BOTS,
    trusted: true
  },
  {
    type: 'social',
    bots: SOCIAL_BOTS,
    trusted: true
  },
  {
    type: 'seo',
    bots: SEO_BOTS,
    trusted: true
  },
  {
    type: 'ai',
    bots: AI_BOTS,
    trusted: true
  },
  {
    type: 'generic',
    bots: GENERIC_BOTS,
    trusted: false
  },
  {
    type: 'automation',
    bots: AUTOMATION_BOTS,
    trusted: false
  },
  {
    type: 'http-tool',
    bots: HTTP_TOOL_BOTS,
    trusted: false
  },
  {
    type: 'security-scanner',
    bots: SECURITY_SCANNING_BOTS,
    trusted: false
  },
  {
    type: 'scraping',
    bots: SCRAPING_BOTS,
    trusted: false
  }
]

const ROBOT_DIRECTIVE_VALUES = {
  // Standard directives
  enabled: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  disabled: 'noindex, nofollow',
  index: 'index',
  noindex: 'noindex',
  follow: 'follow',
  nofollow: 'nofollow',
  none: 'none',
  all: 'all',
  // Non-standard directives (not part of official robots spec)
  noai: 'noai',
  noimageai: 'noimageai'
}
function formatMaxImagePreview(value) {
  return `max-image-preview:${value}`
}
function formatMaxSnippet(value) {
  return `max-snippet:${value}`
}
function formatMaxVideoPreview(value) {
  return `max-video-preview:${value}`
}
function matches(pattern, path) {
  const pathLength = path.length
  const patternLength = pattern.length
  const matchingLengths = Array.from({ length: pathLength + 1 }).fill(0)
  let numMatchingLengths = 1
  let p = 0
  while (p < patternLength) {
    if (pattern[p] === '$' && p + 1 === patternLength) {
      return matchingLengths[numMatchingLengths - 1] === pathLength
    }
    if (pattern[p] === '*') {
      numMatchingLengths = pathLength - matchingLengths[0] + 1
      for (let i = 1; i < numMatchingLengths; i++) {
        matchingLengths[i] = matchingLengths[i - 1] + 1
      }
    } else {
      let numMatches = 0
      for (let i = 0; i < numMatchingLengths; i++) {
        const matchLength = matchingLengths[i]
        if (matchLength < pathLength && path[matchLength] === pattern[p]) {
          matchingLengths[numMatches++] = matchLength + 1
        }
      }
      if (numMatches === 0) {
        return false
      }
      numMatchingLengths = numMatches
    }
    p++
  }
  return true
}
function matchPathToRule(path, _rules) {
  let matchedRule = null
  const rules = _rules.filter(Boolean)
  const rulesLength = rules.length
  let i = 0
  while (i < rulesLength) {
    const rule = rules[i]
    if (!rule || !matches(rule.pattern, path)) {
      i++
      continue
    }
    if (!matchedRule || rule.pattern.length > matchedRule.pattern.length) {
      matchedRule = rule
    } else if (rule.pattern.length === matchedRule.pattern.length && rule.allow && !matchedRule.allow) {
      matchedRule = rule
    }
    i++
  }
  return matchedRule
}
function asArray(v) {
  return typeof v === 'undefined' ? [] : Array.isArray(v) ? v : [v]
}
function contentUsageToString(prefs) {
  return Object.entries(prefs).filter(([_, value]) => value !== void 0).map(([key, value]) => `${key}=${value}`).join(', ')
}
function normalizeContentPreferences(value) {
  if (!value)
    return []
  if (Array.isArray(value))
    return value.filter(rule => Boolean(rule))
  if (typeof value === 'object' && !Array.isArray(value)) {
    const str = contentUsageToString(value)
    return str ? [str] : []
  }
  if (typeof value === 'string')
    return value ? [value] : []
  return []
}
function normalizeGroup(group) {
  if (group._normalized) {
    const resolvedGroup = group
    const disallow2 = asArray(resolvedGroup.disallow)
    resolvedGroup._indexable = !disallow2.includes('/')
    resolvedGroup._rules = [
      ...resolvedGroup.disallow.filter(Boolean).map(r => ({ pattern: r, allow: false })),
      ...resolvedGroup.allow.map(r => ({ pattern: r, allow: true }))
    ]
    return resolvedGroup
  }
  const disallow = asArray(group.disallow)
  const allow = asArray(group.allow).filter(rule => Boolean(rule))
  const contentUsage = normalizeContentPreferences(group.contentUsage)
  const contentSignal = normalizeContentPreferences(group.contentSignal)
  return {
    ...group,
    userAgent: group.userAgent ? asArray(group.userAgent) : ['*'],
    disallow,
    allow,
    contentUsage,
    contentSignal,
    _indexable: !disallow.includes('/'),
    _rules: [
      ...disallow.filter(Boolean).map(r => ({ pattern: r, allow: false })),
      ...allow.map(r => ({ pattern: r, allow: true }))
    ],
    _normalized: true
  }
}
function generateRobotsTxt({ groups, sitemaps }) {
  const lines = []
  for (const group of groups) {
    for (const comment of group.comment || [])
      lines.push(`# ${comment}`)
    for (const userAgent of group.userAgent || ['*'])
      lines.push(`User-agent: ${userAgent}`)
    for (const allow of group.allow || [])
      lines.push(`Allow: ${allow}`)
    for (const disallow of group.disallow || [])
      lines.push(`Disallow: ${disallow}`)
    for (const cleanParam of group.cleanParam || [])
      lines.push(`Clean-param: ${cleanParam}`)
    for (const contentUsage of group.contentUsage || [])
      lines.push(`Content-Usage: ${contentUsage}`)
    for (const contentSignal of group.contentSignal || [])
      lines.push(`Content-Signal: ${contentSignal}`)
    lines.push('')
  }
  for (const sitemap of sitemaps)
    lines.push(`Sitemap: ${sitemap}`)
  return lines.join('\n')
}
function createPatternMap() {
  const patternMap = /* @__PURE__ */ new Map()
  for (const def of BOT_MAP) {
    for (const bot of def.bots) {
      const patterns = [bot.pattern, ...bot.secondaryPatterns || []]
      for (const pattern of patterns) {
        patternMap.set(pattern.toLowerCase(), {
          botName: bot.name,
          botCategory: def.type,
          trusted: def.trusted
        })
      }
    }
  }
  return patternMap
}
function normaliseRobotsRouteRule(config) {
  let allow
  if (typeof config.robots === 'boolean')
    allow = config.robots
  else if (typeof config.robots === 'object' && 'indexable' in config.robots && typeof config.robots.indexable !== 'undefined')
    allow = config.robots.indexable
  let rule
  if (typeof config.robots === 'object' && config.robots !== null) {
    if ('rule' in config.robots && typeof config.robots.rule !== 'undefined') {
      rule = config.robots.rule
    } else if (!('indexable' in config.robots)) {
      const directives = []
      for (const [key, value] of Object.entries(config.robots)) {
        if (value === false || value === null || value === void 0)
          continue
        if (key in ROBOT_DIRECTIVE_VALUES && typeof value === 'boolean' && value) {
          directives.push(ROBOT_DIRECTIVE_VALUES[key])
        } else if (key === 'max-image-preview' && typeof value === 'string') {
          directives.push(formatMaxImagePreview(value))
        } else if (key === 'max-snippet' && typeof value === 'number') {
          directives.push(formatMaxSnippet(value))
        } else if (key === 'max-video-preview' && typeof value === 'number') {
          directives.push(formatMaxVideoPreview(value))
        }
      }
      if (directives.length > 0) {
        rule = directives.join(', ')
      }
    }
  } else if (typeof config.robots === 'string') {
    rule = config.robots
  }
  if (rule && typeof allow === 'undefined') {
    const disallowIndicators = ['none', 'noindex', 'noai', 'noimageai']
    allow = !disallowIndicators.some(
      indicator => rule === indicator || rule.split(',').some(part => part.trim() === indicator)
    )
  }
  if (typeof allow === 'undefined' && typeof rule === 'undefined')
    return
  return {
    allow,
    rule
  }
}

function useRuntimeConfigNuxtRobots(event) {
  return useRuntimeConfig(event)['nuxt-robots']
}

const logger$1 = createConsola({
  defaults: { tag: '@nuxtjs/robots' }
})

async function resolveRobotsTxtContext(e, nitro = useNitroApp()) {
  const { groups, sitemap: sitemaps } = useRuntimeConfigNuxtRobots(e)
  const generateRobotsTxtCtx = {
    event: e,
    context: e ? 'robots.txt' : 'init',
    ...JSON.parse(JSON.stringify({ groups, sitemaps }))
  }
  await nitro.hooks.callHook('robots:config', generateRobotsTxtCtx)
  generateRobotsTxtCtx.groups = generateRobotsTxtCtx.groups.map(normalizeGroup)
  nitro._robots.ctx = generateRobotsTxtCtx
  return generateRobotsTxtCtx
}

const _gymYSqHE5rEMHxSoa_mzNRvC8ZZLvdIK8rxveb2FwE = defineNitroPlugin$1(async (nitroApp) => {
  const { isNuxtContentV2, robotsDisabledValue, botDetection } = useRuntimeConfigNuxtRobots()
  if (botDetection !== false) {
    nitroApp._robotsPatternMap = createPatternMap()
  }
  nitroApp._robots = {}
  await resolveRobotsTxtContext(void 0, nitroApp)
  const nuxtContentUrls = /* @__PURE__ */ new Set()
  if (isNuxtContentV2) {
    let urls
    try {
      urls = await (await nitroApp.localFetch('/__robots__/nuxt-content.json', {})).json()
    } catch (e) {
      logger$1.error('Failed to read robot rules from content files.', e)
    }
    if (urls && Array.isArray(urls) && urls.length) {
      urls.forEach(url => nuxtContentUrls.add(withoutTrailingSlash(url)))
    }
  }
  if (nuxtContentUrls.size) {
    nitroApp._robots.nuxtContentUrls = nuxtContentUrls
  }
})

let secretKey
const useSecretKey = async options => secretKey ? secretKey : secretKey = await importEncryptSecret(options.encryptSecret, options.encryptAlgorithm)

function defineNitroPlugin$1(def) {
  return def
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig()
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp()
    const ctx = { event, render, response: void 0 }
    await nitroApp.hooks.callHook('render:before', ctx)
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, 'Content-Type', 'image/x-icon')
        return send(
          event,
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        )
      }
      ctx.response = await ctx.render(event)
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event)
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus)
        return send(
          event,
          'No response returned from render handler: ' + event.path
        )
      }
    }
    await nitroApp.hooks.callHook('render:response', ctx.response, ctx)
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers)
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      )
    }
    return ctx.response.body
  })
}

const r = Object.create(null), i = e => globalThis.process?.env || globalThis._importMeta_.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (e ? r : globalThis), o = new Proxy(r, { get(e, s) { return i()[s] ?? r[s] }, has(e, s) { const E = i(); return s in E || s in r }, set(e, s, E) { const B = i(true); return B[s] = E, true }, deleteProperty(e, s) { if (!s) return false; const E = i(true); return delete E[s], true }, ownKeys() { const e = i(true); return Object.keys(e) } }), t = typeof process < 'u' && process.env && 'production' || '', f = [['APPVEYOR'], ['AWS_AMPLIFY', 'AWS_APP_ID', { ci: true }], ['AZURE_PIPELINES', 'SYSTEM_TEAMFOUNDATIONCOLLECTIONURI'], ['AZURE_STATIC', 'INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN'], ['APPCIRCLE', 'AC_APPCIRCLE'], ['BAMBOO', 'bamboo_planKey'], ['BITBUCKET', 'BITBUCKET_COMMIT'], ['BITRISE', 'BITRISE_IO'], ['BUDDY', 'BUDDY_WORKSPACE_ID'], ['BUILDKITE'], ['CIRCLE', 'CIRCLECI'], ['CIRRUS', 'CIRRUS_CI'], ['CLOUDFLARE_PAGES', 'CF_PAGES', { ci: true }], ['CLOUDFLARE_WORKERS', 'WORKERS_CI', { ci: true }], ['CODEBUILD', 'CODEBUILD_BUILD_ARN'], ['CODEFRESH', 'CF_BUILD_ID'], ['DRONE'], ['DRONE', 'DRONE_BUILD_EVENT'], ['DSARI'], ['GITHUB_ACTIONS'], ['GITLAB', 'GITLAB_CI'], ['GITLAB', 'CI_MERGE_REQUEST_ID'], ['GOCD', 'GO_PIPELINE_LABEL'], ['LAYERCI'], ['HUDSON', 'HUDSON_URL'], ['JENKINS', 'JENKINS_URL'], ['MAGNUM'], ['NETLIFY'], ['NETLIFY', 'NETLIFY_LOCAL', { ci: false }], ['NEVERCODE'], ['RENDER'], ['SAIL', 'SAILCI'], ['SEMAPHORE'], ['SCREWDRIVER'], ['SHIPPABLE'], ['SOLANO', 'TDDIUM'], ['STRIDER'], ['TEAMCITY', 'TEAMCITY_VERSION'], ['TRAVIS'], ['VERCEL', 'NOW_BUILDER'], ['VERCEL', 'VERCEL', { ci: false }], ['VERCEL', 'VERCEL_ENV', { ci: false }], ['APPCENTER', 'APPCENTER_BUILD_ID'], ['CODESANDBOX', 'CODESANDBOX_SSE', { ci: false }], ['CODESANDBOX', 'CODESANDBOX_HOST', { ci: false }], ['STACKBLITZ'], ['STORMKIT'], ['CLEAVR'], ['ZEABUR'], ['CODESPHERE', 'CODESPHERE_APP_ID', { ci: true }], ['RAILWAY', 'RAILWAY_PROJECT_ID'], ['RAILWAY', 'RAILWAY_SERVICE_ID'], ['DENO-DEPLOY', 'DENO_DEPLOYMENT_ID'], ['FIREBASE_APP_HOSTING', 'FIREBASE_APP_HOSTING', { ci: true }]]; function b() { if (globalThis.process?.env) for (const e of f) { const s = e[1] || e[0]; if (globalThis.process?.env[s]) return { name: e[0].toLowerCase(), ...e[2] } } return globalThis.process?.env?.SHELL === '/bin/jsh' && globalThis.process?.versions?.webcontainer ? { name: 'stackblitz', ci: false } : { name: '', ci: false } } const l = b(); l.name; function n(e) { return e ? e !== 'false' : false } const I = globalThis.process?.platform || '', T = n(o.CI) || l.ci !== false, R = n(globalThis.process?.stdout && globalThis.process?.stdout.isTTY); n(o.DEBUG); const a = t === 'test' || n(o.TEST), h = t === 'dev' || t === 'development'; n(o.MINIMAL) || T || a || !R; const A = /^win/i.test(I); !n(o.NO_COLOR) && (n(o.FORCE_COLOR) || (R || A) && o.TERM !== 'dumb' || T); const C = (globalThis.process?.versions?.node || '').replace(/^v/, '') || null; Number(C?.split('.')[0]) || null; const W = globalThis.process || Object.create(null), _ = { versions: {} }; new Proxy(W, { get(e, s) { if (s === 'env') return o; if (s in e) return e[s]; if (s in _) return _[s] } }); const O = globalThis.process?.release?.name === 'node', c = !!globalThis.Bun || !!globalThis.process?.versions?.bun, D = !!globalThis.Deno, L = !!globalThis.fastly, S = !!globalThis.Netlify, u = !!globalThis.EdgeRuntime, N = globalThis.navigator?.userAgent === 'Cloudflare-Workers', F = [[S, 'netlify'], [u, 'edge-light'], [N, 'workerd'], [L, 'fastly'], [D, 'deno'], [c, 'bun'], [O, 'node']]; function G() { const e = F.find(s => s[0]); if (e) return { name: e[1] } } const P = G(); P?.name || ''

function baseURL() {
  // TODO: support passing event to `useRuntimeConfig`
  return useRuntimeConfig().app.baseURL
}
function buildAssetsDir() {
  // TODO: support passing event to `useRuntimeConfig`
  return useRuntimeConfig().app.buildAssetsDir
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path)
}
function publicAssetsURL(...path) {
  // TODO: support passing event to `useRuntimeConfig`
  const app = useRuntimeConfig().app
  const publicBase = app.cdnURL || app.baseURL
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase
}

const defuReplaceArray$1 = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) || Array.isArray(value)) {
    obj[key] = value
    return true
  }
})

function parseCacheDuration(duration) {
  if (typeof duration === 'number') {
    return duration
  }
  const parsed = ms(duration)
  if (parsed === void 0) {
    throw new Error(`Invalid cache duration: ${duration}`)
  }
  return Math.ceil(parsed / 1e3)
}
function createCacheOptions(cache, name, defaultGetKey) {
  if (typeof cache === 'object') {
    return {
      getKey: defaultGetKey,
      ...cache,
      maxAge: parseCacheDuration(cache.maxAge),
      name: cache.name ?? name,
      group: cache.group ?? 'mcp'
    }
  }
  return {
    maxAge: parseCacheDuration(cache),
    name,
    group: 'mcp',
    getKey: defaultGetKey
  }
}
function wrapWithCache(fn, cacheOptions) {
  return defineCachedFunction(
    fn,
    cacheOptions
  )
}

function enrichNameTitle(options) {
  const { name, title, _meta, type } = options
  const filename = _meta?.filename
  let enrichedName = name
  let enrichedTitle = title
  if (filename) {
    const nameWithoutExt = filename.replace(/\.(ts|js|mts|mjs)$/, '')
    if (!enrichedName) {
      enrichedName = kebabCase(nameWithoutExt)
    }
    if (!enrichedTitle) {
      enrichedTitle = titleCase(nameWithoutExt)
    }
  }
  if (!enrichedName) {
    throw new Error(`Failed to auto-generate ${type} name from filename. Please provide a name explicitly.`)
  }
  return {
    name: enrichedName,
    title: enrichedTitle
  }
}

function registerToolFromDefinition(server, tool) {
  const { name, title } = enrichNameTitle({
    name: tool.name,
    title: tool.title,
    _meta: tool._meta,
    type: 'tool'
  })
  let handler = tool.handler
  if (tool.cache !== void 0) {
    const defaultGetKey = tool.inputSchema
      ? (args) => {
          const values = Object.values(args)
          return values.map(v => String(v).replace(/\//g, '-').replace(/^-/, '')).join(':')
        }
      : void 0
    const cacheOptions = createCacheOptions(tool.cache, `mcp-tool:${name}`, defaultGetKey)
    handler = wrapWithCache(
      tool.handler,
      cacheOptions
    )
  }
  const options = {
    title,
    description: tool.description,
    inputSchema: tool.inputSchema,
    outputSchema: tool.outputSchema,
    annotations: tool.annotations,
    _meta: {
      ...tool._meta,
      ...tool.inputExamples && { inputExamples: tool.inputExamples }
    }
  }
  return server.registerTool(name, options, handler)
}
function defineMcpTool(definition) {
  return definition
}

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase()
  switch (ext) {
    case '.md':
      return 'text/markdown'
    case '.ts':
    case '.mts':
    case '.cts':
      return 'text/typescript'
    case '.js':
    case '.mjs':
    case '.cjs':
      return 'text/javascript'
    case '.json':
      return 'application/json'
    case '.html':
      return 'text/html'
    case '.css':
      return 'text/css'
    case '.xml':
      return 'text/xml'
    case '.csv':
      return 'text/csv'
    case '.yaml':
    case '.yml':
      return 'text/yaml'
    default:
      return 'text/plain'
  }
}
function registerResourceFromDefinition(server, resource) {
  const { name, title } = enrichNameTitle({
    name: resource.name,
    title: resource.title,
    _meta: resource._meta,
    type: 'resource'
  })
  let uri = resource.uri
  let handler = resource.handler
  const metadata = {
    ...resource.metadata,
    title: resource.title || resource.metadata?.title || title,
    description: resource.description || resource.metadata?.description
  }
  if ('file' in resource && resource.file) {
    const filePath = resolve$2(process.cwd(), resource.file)
    if (!uri) {
      uri = pathToFileURL(filePath).toString()
    }
    if (!handler) {
      handler = async (requestUri) => {
        try {
          const content = await readFile$1(filePath, 'utf-8')
          return {
            contents: [{
              uri: requestUri.toString(),
              mimeType: resource.metadata?.mimeType || getMimeType(filePath),
              text: content
            }]
          }
        } catch (error) {
          throw new Error(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    }
  }
  if (!uri) {
    throw new Error(`Resource ${name} is missing a URI`)
  }
  if (!handler) {
    throw new Error(`Resource ${name} is missing a handler`)
  }
  if (resource.cache !== void 0) {
    const defaultGetKey = requestUri => requestUri.pathname.replace(/\//g, '-').replace(/^-/, '')
    const cacheOptions = createCacheOptions(resource.cache, `mcp-resource:${name}`, defaultGetKey)
    handler = wrapWithCache(
      handler,
      cacheOptions
    )
  }
  if (typeof uri === 'string') {
    return server.registerResource(
      name,
      uri,
      metadata,
      handler
    )
  } else {
    return server.registerResource(
      name,
      uri,
      metadata,
      handler
    )
  }
}
function defineMcpResource(definition) {
  return definition
}

function registerPromptFromDefinition(server, prompt) {
  const { name, title } = enrichNameTitle({
    name: prompt.name,
    title: prompt.title,
    _meta: prompt._meta,
    type: 'prompt'
  })
  if (prompt.inputSchema) {
    return server.registerPrompt(
      name,
      {
        title,
        description: prompt.description,
        argsSchema: prompt.inputSchema
      },
      prompt.handler
    )
  } else {
    return server.registerPrompt(
      name,
      {
        title,
        description: prompt.description
      },
      prompt.handler
    )
  }
}
function defineMcpPrompt(definition) {
  return definition
}

function parseAcceptLanguage(value) {
  return value.split(',').map(tag => tag.split(';')[0]).filter(
    tag => !(tag === '*' || tag === '')
  )
}
function createPathIndexLanguageParser(index = 0) {
  return (path) => {
    const rawPath = typeof path === 'string' ? path : path.pathname
    const normalizedPath = rawPath.split('?')[0]
    const parts = normalizedPath.split('/')
    if (parts[0] === '') {
      parts.shift()
    }
    return parts.length > index ? parts[index] || '' : ''
  }
}

function isLocalhostHost(host) {
  if (!host || host.startsWith('localhost') || host.startsWith('127.') || host.startsWith('0.0.0.0'))
    return true
  const hostname = host.startsWith('[') ? host.slice(0, host.indexOf(']') + 1) : host
  return hostname === '[::1]' || hostname === '::1' || hostname === '[::]' || hostname === '::'
}
function extractHostname(host) {
  if (host.startsWith('[')) {
    const close = host.indexOf(']')
    return close !== -1 ? host.slice(0, close + 1) : host
  }
  const colonCount = host.split(':').length - 1
  return colonCount === 1 ? host.slice(0, host.indexOf(':')) : host
}
function splitHostPort(host) {
  if (host.startsWith('[')) {
    const close = host.indexOf(']')
    const hostname = close !== -1 ? host.slice(0, close + 1) : host
    const port = close !== -1 && host[close + 1] === ':' ? host.slice(close + 2) : ''
    const normalized = hostname === '[::1]' || hostname === '[::]' ? 'localhost' : hostname
    return { host: normalized, port }
  }
  if (host === '0.0.0.0' || host.startsWith('0.0.0.0:')) {
    const i = host.indexOf(':')
    return { host: 'localhost', port: i !== -1 ? host.slice(i + 1) : '' }
  }
  const colonCount = host.split(':').length - 1
  if (colonCount === 1) {
    const i = host.indexOf(':')
    return { host: host.slice(0, i), port: host.slice(i + 1) }
  }
  if (colonCount > 1) {
    const normalized = host === '::1' || host === '::' ? 'localhost' : `[${host}]`
    return { host: normalized, port: '' }
  }
  return { host, port: '' }
}
function getNitroOrigin$1(ctx = {}) {
  const isDev = ctx.isDev ?? h
  const isPrerender = ctx.isPrerender ?? !!o.prerender
  let host = ''
  let port = ''
  let protocol = o.NITRO_SSL_CERT && o.NITRO_SSL_KEY ? 'https' : 'http'
  if (isDev || isPrerender) {
    const devEnv = o.__NUXT_DEV__ || o.NUXT_VITE_NODE_OPTIONS
    if (devEnv) {
      const parsed = JSON.parse(devEnv)
      const origin = parsed.proxy?.url || parsed.baseURL?.replace('/__nuxt_vite_node__', '')
      host = origin.replace(/^https?:\/\//, '').replace(/\/$/, '')
      protocol = origin.startsWith('https') ? 'https' : 'http'
    }
  }
  if (isDev && isLocalhostHost(host) && ctx.requestHost) {
    const reqHost = extractHostname(ctx.requestHost)
    if (reqHost && !isLocalhostHost(reqHost)) {
      host = ctx.requestHost
      protocol = ctx.requestProtocol || protocol
    }
  }
  if (!host && ctx.requestHost) {
    host = ctx.requestHost
    protocol = ctx.requestProtocol || protocol
  }
  if (!host) {
    host = o.NITRO_HOST || o.HOST || ''
    if (isDev)
      port = o.NITRO_PORT || o.PORT || '3000'
  }
  const split = splitHostPort(host)
  host = split.host
  if (split.port)
    port = split.port
  host = o.NUXT_SITE_HOST_OVERRIDE || host
  port = o.NUXT_SITE_PORT_OVERRIDE || port
  if (host.startsWith('http://') || host.startsWith('https://')) {
    protocol = host.startsWith('https://') ? 'https' : 'http'
    host = host.replace(/^https?:\/\//, '')
  } else if (!isDev && (!host || !isLocalhostHost(host))) {
    protocol = 'https'
  }
  return `${protocol}://${host}${port ? `:${port}` : ''}/`
}

function getNitroOrigin(e) {
  return getNitroOrigin$1({
    isDev: false,
    isPrerender: false,
    requestHost: e ? getRequestHost(e, { xForwardedHost: true }) : void 0,
    requestProtocol: e ? getRequestProtocol(e, { xForwardedProto: true }) : void 0
  })
}

function getSiteIndexable(e) {
  const { env, indexable } = getSiteConfig(e)
  if (typeof indexable !== 'undefined')
    return String(indexable) === 'true'
  return env === 'production'
}

function useSiteConfig(e, _options) {
  return getSiteConfig(e, _options)
}

function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl)
    path = parsed.pathname
  }
  const base = withLeadingSlash(options.base || '/')
  if (base !== '/' && path.startsWith(base)) {
    path = path.slice(base.length)
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : '')
  if (base !== '/' && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base))
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || '/') : origin
  const resolvedUrl = withBase(path, baseWithOrigin)
  return path === '/' && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl)
}
const fileExtensions = [
  // Images
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'webp',
  'svg',
  'ico',
  // Documents
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'md',
  'markdown',
  // Archives
  'zip',
  'rar',
  '7z',
  'tar',
  'gz',
  // Audio
  'mp3',
  'wav',
  'flac',
  'ogg',
  'opus',
  'm4a',
  'aac',
  'midi',
  'mid',
  // Video
  'mp4',
  'avi',
  'mkv',
  'mov',
  'wmv',
  'flv',
  'webm',
  // Web
  'html',
  'css',
  'js',
  'json',
  'xml',
  'tsx',
  'jsx',
  'ts',
  'vue',
  'svelte',
  'xsl',
  'rss',
  'atom',
  // Programming
  'php',
  'py',
  'rb',
  'java',
  'c',
  'cpp',
  'h',
  'go',
  // Data formats
  'csv',
  'tsv',
  'sql',
  'yaml',
  'yml',
  // Fonts
  'woff',
  'woff2',
  'ttf',
  'otf',
  'eot',
  // Executables/Binaries
  'exe',
  'msi',
  'apk',
  'ipa',
  'dmg',
  'iso',
  'bin',
  // Scripts/Config
  'bat',
  'cmd',
  'sh',
  'env',
  'htaccess',
  'conf',
  'toml',
  'ini',
  // Package formats
  'deb',
  'rpm',
  'jar',
  'war',
  // E-books
  'epub',
  'mobi',
  // Common temporary/backup files
  'log',
  'tmp',
  'bak',
  'old',
  'sav'
]
function isPathFile(path) {
  const lastSegment = path.split('/').pop()
  const ext = (lastSegment || path).match(/\.[0-9a-z]+$/i)?.[0]
  return ext && fileExtensions.includes(ext.replace('.', ''))
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl)
  if (isPathFile($url.pathname))
    return pathOrUrl
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname)
  return `${$url.protocol ? `${$url.protocol}//` : ''}${$url.host || ''}${fixedPath}${$url.search || ''}${$url.hash || ''}`
}

function createSitePathResolver(e, options = {}) {
  const siteConfig = getSiteConfig(e)
  const nitroOrigin = getNitroOrigin(e)
  const nuxtBase = useRuntimeConfig(e).app.baseURL || '/'
  return (path) => {
    return resolveSitePath(path, {
      ...options,
      siteUrl: options.canonical !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    })
  }
}
function withSiteUrl(e, path, options = {}) {
  const siteConfig = e.context.siteConfig?.get()
  let siteUrl = e.context.siteConfigNitroOrigin
  if ((options.canonical !== false || false) && siteConfig.url)
    siteUrl = siteConfig.url
  return resolveSitePath(path, {
    absolute: true,
    siteUrl,
    trailingSlash: siteConfig.trailingSlash,
    base: e.context.nitro.baseURL,
    withBase: options.withBase
  })
}

function withoutQuery$1(path) {
  return path.split('?')[0]
}
function createNitroRouteRuleMatcher$1(e) {
  const { nitro, app } = useRuntimeConfig(e)
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [withoutTrailingSlash(path), rules])
      )
    })
  )
  return (path) => {
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(withoutTrailingSlash(withoutQuery$1(path)), app.baseURL)
    ).reverse())
  }
}

function getSiteRobotConfig(e) {
  const query = getQuery(e)
  const hints = []
  const { groups, debug } = useRuntimeConfigNuxtRobots(e)
  let indexable = getSiteIndexable(e)
  const queryIndexableEnabled = String(query.mockProductionEnv) === 'true' || query.mockProductionEnv === ''
  if (debug || false) {
    const { _context } = getSiteConfig(e, { debug: debug || false })
    if (queryIndexableEnabled) {
      indexable = true
      hints.push('You are mocking a production enviroment with ?mockProductionEnv query.')
    } else if (!indexable && _context.indexable === 'nuxt-robots:config') {
      hints.push('You are blocking indexing with your Nuxt Robots config.')
    } else if (!queryIndexableEnabled && !_context.indexable) {
      hints.push(`Indexing is blocked in development. You can mock a production environment with ?mockProductionEnv query.`)
    } else if (!indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is blocked by site config set by ${_context.indexable}.`)
    } else if (indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is enabled from ${_context.indexable}.`)
    }
  }
  if (groups.some(g => g.userAgent.includes('*') && g.disallow.includes('/'))) {
    indexable = false
    hints.push('You are blocking all user agents with a wildcard `Disallow /`.')
  } else if (groups.some(g => g.disallow.includes('/'))) {
    hints.push('You are blocking specific user agents with `Disallow /`.')
  }
  return { indexable, hints }
}

function getPathRobotConfig(e, options) {
  const runtimeConfig = useRuntimeConfig(e)
  const { robotsDisabledValue, robotsEnabledValue, isNuxtContentV2 } = useRuntimeConfigNuxtRobots(e)
  if (!options?.skipSiteIndexable) {
    if (!getSiteRobotConfig(e).indexable) {
      return {
        rule: robotsDisabledValue,
        indexable: false,
        debug: {
          source: 'Site Config'
        }
      }
    }
  }
  const path = options?.path || e.path
  let userAgent = options?.userAgent
  if (!userAgent) {
    try {
      userAgent = getRequestHeader(e, 'User-Agent')
    } catch {
    }
  }
  const nitroApp = useNitroApp()
  const groups = [
    // run explicit user agent matching first
    ...nitroApp._robots.ctx.groups.filter((g) => {
      if (userAgent) {
        return g.userAgent.some(ua => ua.toLowerCase().includes(userAgent.toLowerCase()))
      }
      return false
    }),
    // run wildcard matches second
    ...nitroApp._robots.ctx.groups.filter(g => g.userAgent.includes('*'))
  ]
  for (const group of groups) {
    if (group._indexable === false) {
      return {
        indexable: false,
        rule: robotsDisabledValue,
        debug: {
          source: '/robots.txt',
          line: JSON.stringify(group)
        }
      }
    }
    const robotsTxtRule = matchPathToRule(path, group._rules || [])
    if (robotsTxtRule) {
      if (!robotsTxtRule.allow) {
        return {
          indexable: false,
          rule: robotsDisabledValue,
          debug: {
            source: '/robots.txt',
            line: `Disallow: ${robotsTxtRule.pattern}`
          }
        }
      }
      break
    }
  }
  if (isNuxtContentV2 && nitroApp._robots?.nuxtContentUrls?.has(withoutTrailingSlash(path))) {
    return {
      indexable: false,
      rule: robotsDisabledValue,
      debug: {
        source: 'Nuxt Content'
      }
    }
  }
  const { pageMetaRobots } = useRuntimeConfigNuxtRobots(e)
  const pageMetaRule = pageMetaRobots?.[withoutTrailingSlash(path)]
  if (typeof pageMetaRule !== 'undefined') {
    const normalised = normaliseRobotsRouteRule({ robots: pageMetaRule })
    if (normalised && (typeof normalised.allow !== 'undefined' || typeof normalised.rule !== 'undefined')) {
      return {
        indexable: normalised.allow ?? false,
        rule: normalised.rule || (normalised.allow ? robotsEnabledValue : robotsDisabledValue),
        debug: {
          source: 'Page Meta'
        }
      }
    }
  }
  nitroApp._robotsRuleMatcher = nitroApp._robotsRuleMatcher || createNitroRouteRuleMatcher$1(e)
  let robotRouteRules = nitroApp._robotsRuleMatcher(path)
  let routeRulesPath = path
  if (runtimeConfig.public?.i18n?.locales && typeof robotRouteRules.robots === 'undefined') {
    const { locales } = runtimeConfig.public.i18n
    const locale = locales.find(l => routeRulesPath.startsWith(`/${l.code}`))
    if (locale) {
      routeRulesPath = routeRulesPath.replace(`/${locale.code}`, '')
      robotRouteRules = nitroApp._robotsRuleMatcher(routeRulesPath)
    }
  }
  const routeRules = normaliseRobotsRouteRule(robotRouteRules)
  if (routeRules && (typeof routeRules.allow !== 'undefined' || typeof routeRules.rule !== 'undefined')) {
    return {
      indexable: routeRules.allow ?? false,
      rule: routeRules.rule || (routeRules.allow ? robotsEnabledValue : robotsDisabledValue),
      debug: {
        source: 'Route Rules'
      }
    }
  }
  return {
    indexable: true,
    rule: robotsEnabledValue
  }
}

const defineNitroPlugin = def => def
const _RkwKuFVPWv_N160DI5iI3BPcXr27NdzZK7iNxrH4wgc = defineNitroPlugin((nitroApp) => {
  const csrfConfig = useRuntimeConfig().csurf
  const cookieKey = csrfConfig.cookieKey
  if (csrfConfig.addCsrfTokenToEventCtx) {
    nitroApp.hooks.hook('request', async (event) => {
      const { csurf } = getRouteRules(event)
      const needCookie = !(csurf === false || csurf?.enabled === false)
      let secret = getCookie(event, cookieKey)
      if (!secret) {
        secret = csrf.randomSecret()
        if (needCookie) {
          setCookie(event, cookieKey, secret, csrfConfig.cookie)
        }
      }
      event.context.csrfToken = await csrf.create(secret, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm)
    })
    nitroApp.hooks.hook('render:html', async (html, { event }) => {
      html.head.push(`<meta name="csrf-token" content="${event.context.csrfToken}">`)
    })
  } else {
    nitroApp.hooks.hook('render:html', async (html, { event }) => {
      let secret = getCookie(event, cookieKey)
      if (!secret) {
        secret = csrf.randomSecret()
        setCookie(event, cookieKey, secret, csrfConfig.cookie)
      }
      const csrfToken = await csrf.create(secret, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm)
      html.head.push(`<meta name="csrf-token" content="${csrfToken}">`)
    })
  }
})

/*!
  * shared v11.3.0
  * (c) 2026 kazuya kawaguchi
  * Released under the MIT License.
  */
const _create = Object.create
const create = (obj = null) => _create(obj)

/**
 * Useful Utilities By Evan you
 * Modified by kazuya kawaguchi
 * MIT License
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
 * https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
 */
const isArray = Array.isArray
const isFunction = val => typeof val === 'function'
const isString = val => typeof val === 'string'

const isObject = val => val !== null && typeof val === 'object'
const objectToString = Object.prototype.toString
const toTypeString = value => objectToString.call(value)

const isNotObjectOrIsArray = val => !isObject(val) || isArray(val)

function deepCopy(src, des) {
  // src and des should both be objects, and none of them can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error('Invalid value')
  }
  const stack = [{ src, des }]
  while (stack.length) {
    const { src, des } = stack.pop()
    // using `Object.keys` which skips prototype properties
    Object.keys(src).forEach((key) => {
      if (key === '__proto__') {
        return
      }
      // if src[key] is an object/array, set des[key]
      // to empty object/array to prevent setting by reference
      if (isObject(src[key]) && !isObject(des[key])) {
        des[key] = Array.isArray(src[key]) ? [] : create()
      }
      if (isNotObjectOrIsArray(des[key]) || isNotObjectOrIsArray(src[key])) {
        // replace with src[key] when:
        // src[key] or des[key] is not an object, or
        // src[key] or des[key] is an array
        des[key] = src[key]
      } else {
        // src[key] and des[key] are both objects, merge them
        stack.push({ src: src[key], des: des[key] })
      }
    })
  }
}

const __nuxtMock = { runWithContext: async fn => await fn() }
const merger$1 = createDefu((obj, key, value) => {
  if (key === 'messages' || key === 'datetimeFormats' || key === 'numberFormats') {
    obj[key] ??= create(null)
    deepCopy(value, obj[key])
    return true
  }
})
async function loadVueI18nOptions(vueI18nConfigs) {
  const nuxtApp = __nuxtMock
  let vueI18nOptions = { messages: create(null) }
  for (const configFile of vueI18nConfigs) {
    const resolver = await configFile().then(x => isModule(x) ? x.default : x)
    const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver
    vueI18nOptions = merger$1(create(null), resolved, vueI18nOptions)
  }
  vueI18nOptions.fallbackLocale ??= false
  return vueI18nOptions
}
const isModule = val => toTypeString(val) === '[object Module]'
async function getLocaleMessages(locale, loader) {
  const nuxtApp = __nuxtMock
  try {
    const getter = await nuxtApp.runWithContext(loader.load).then(x => isModule(x) ? x.default : x)
    return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter
  } catch (e) {
    throw new Error(`Failed loading locale (${locale}): ` + e.message)
  }
}
async function getLocaleMessagesMerged(locale, loaders = []) {
  const nuxtApp = __nuxtMock
  const messages = await Promise.all(
    loaders.map(loader => nuxtApp.runWithContext(() => getLocaleMessages(locale, loader)))
  )
  const merged = {}
  for (const message of messages) {
    deepCopy(message, merged)
  }
  return merged
}

var nav$1 = {
  home: 'Home',
  works: 'Portfolio',
  services: 'Services',
  articles: 'Articles',
  about: 'About',
  contact: 'Contact',
  appearance: 'Appearance',
  darkMode: 'Dark Mode',
  aria: {
    home: 'Beranda Esperion',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu'
  }
}
var language$1 = {
  indonesian: 'Bahasa Indonesia',
  english: 'Inggris'
}
var common$1 = {
  loading: 'Memuat...',
  error: 'Terjadi kesalahan',
  success: 'Berhasil',
  cancel: 'Batal',
  save: 'Simpan',
  delete: 'Delete',
  edit: 'Edit',
  view: 'View',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  reset: 'Reset',
  readMore: 'Read More',
  learnMore: 'Learn More',
  submit: 'Submit',
  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    results: 'results'
  },
  aria: {
    close: 'Tutup',
    menu: 'Menu',
    location: 'Lokasi',
    phone: 'Telepon',
    email: 'Email',
    businessHours: 'Jam operasional'
  }
}
var home$1 = {
  hero: {
    slide1Title: 'Bangun Kehadiran Digital Anda',
    slide1Sub: 'Solusi terpercaya untuk bisnis Indonesia',
    slide1Desc: 'Kami merancang website dan produk digital yang membantu bisnis tampil jelas, cepat, dan siap berkembang.',
    slide1Cta: 'Start Consultation',
    slide2Cta: 'View Portfolio',
    slide3Cta: 'Learn More',
    slide4Title: 'Comprehensive Digital Services',
    slide4Sub: 'Comprehensive Digital Services',
    slide4Desc: 'Dari web development hingga digital marketing, kami menyediakan solusi end-to-end untuk transformasi digital.',
    slide4Cta: 'Explore Services',
    slide5Title: 'Dipercaya oleh Bisnis yang Berkembang',
    slide5Sub: 'Dipercaya oleh Bisnis yang Berkembang',
    slide5Desc: 'Bergabung dengan bisnis yang telah tumbuh bersama Esperion melalui solusi digital yang terukur dan berdampak.',
    slide5Cta: 'View Testimonials'
  },
  whoAreWe: {
    title: 'About Esperion',
    description: 'Esperion adalah mitra digital untuk bisnis yang membutuhkan arah, eksekusi, dan pengalaman brand yang konsisten. Kami menggabungkan strategi, desain, dan pengembangan agar setiap peluncuran terasa lebih siap dan lebih relevan.',
    value1: 'Strategi yang jelas',
    value2: 'Eksekusi yang rapi',
    value3: 'Kolaborasi terbuka',
    value4: 'Fokus pada hasil'
  },
  ourServices: {
    title: 'Layanan Kami',
    subtitle: 'Solusi digital yang dirancang untuk target bisnis Anda',
    cta: 'View All Services'
  },
  stats: {
    projects: 'Projects Completed',
    clients: 'Client Collaborations',
    experience: 'Years of Experience',
    talent: 'Core Talent'
  },
  clientLogos: {
    placeholder: 'Dipercaya oleh pemimpin industri',
    namePlaceholder: 'Client Name'
  },
  featuredWorks: {
    title: 'Featured Works',
    subtitle: 'Sorotan proyek yang mewakili pendekatan kerja Esperion',
    cta: 'View All Portfolio →'
  },
  articles: {
    title: 'Latest Articles',
    subtitle: 'Insight singkat, pembelajaran, dan pembaruan dari tim Esperion',
    cta: 'View All Articles →',
    readMore: 'Read More →'
  },
  cta: {
    title: 'Ready for the Next Digital Step?',
    description: 'Ceritakan konteks bisnis Anda, lalu kami bantu memetakan solusi yang paling relevan untuk tahap pertumbuhan berikutnya.',
    button: 'Start Discussion Today'
  },
  aria: {
    slideNav: 'Go to slide {index}',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide'
  }
}
var services$1 = {
  banner: {
    title: 'Our Services',
    description: 'Solusi digital yang dirancang untuk membantu bisnis Anda bergerak lebih jelas dan lebih siap tumbuh'
  },
  cta: {
    learnMore: 'Learn More'
  },
  whyChooseUs: {
    title: 'Why Choose Esperion?',
    description: 'Kami menggabungkan strategi, eksekusi, dan kolaborasi yang rapi untuk hasil yang lebih terarah'
  },
  reasons: {
    trackRecord: {
      title: 'Track record teruji',
      description: 'Lebih dari 150 proyek digital telah kami rampungkan.'
    },
    team: {
      title: 'Tim lintas disiplin',
      description: 'Strategi, desain, dan pengembangan bergerak dalam satu alur kerja.'
    },
    execution: {
      title: 'Eksekusi bertahap',
      description: 'Pendekatan iteratif membantu keputusan bergerak cepat tanpa kehilangan arah.'
    },
    communication: {
      title: 'Komunikasi terbuka',
      description: 'Setiap tahap kerja dibangun dengan konteks, dokumentasi, dan ekspektasi yang jelas.'
    }
  },
  ctaSection: {
    title: 'Ready to Start Your Project?',
    description: 'Ceritakan konteks bisnis Anda, lalu kami bantu petakan solusi digital yang paling relevan.',
    button: 'Schedule Consultation'
  },
  detail: {
    serviceScope: 'Service Scope',
    workflow: 'Workflow',
    estimateStartingFrom: 'Estimate Starting From',
    estimateNote: 'Estimasi akhir disesuaikan berdasarkan ruang lingkup, kompleksitas, dan kebutuhan integrasi.',
    requestEstimate: 'Request Estimate',
    faq: 'FAQ',
    relatedServices: 'Related Services',
    ctaTitle: 'Ready for the Next Step?',
    ctaDescription: 'Kategorikan konteks bisnis Anda, lalu kami bantu menyusun pendekatan yang paling relevan.',
    ctaButton: 'Contact Esperion Team'
  }
}
var articles$1 = {
  banner: {
    title: 'Articles',
    description: 'Insight, pembelajaran, dan pembaruan dari tim Esperion'
  },
  filters: {
    allCategories: 'Semua Kategori',
    marketing: 'Pemasaran',
    design: 'Desain',
    development: 'Pengembangan',
    ecommerce: 'E-Commerce',
    business: 'Bisnis',
    reset: 'Reset'
  },
  search: {
    placeholder: 'Search articles...'
  },
  emptyState: {
    title: 'Artikel tidak ditemukan',
    description: 'Coba ubah kata kunci atau filter yang dipilih',
    resetButton: 'Reset Semua Filter'
  },
  loadMore: {
    button: 'Muat Artikel Lainnya'
  },
  results: {
    count: 'Menampilkan {visible} dari {total} artikel'
  },
  newsletter: {
    title: 'Follow Esperion Updates',
    description: 'Dapatkan artikel dan pembaruan terbaru langsung ke email Anda',
    placeholder: 'Masukkan email Anda',
    subscribeButton: 'Berlangganan',
    successMessage: 'Terima kasih, Anda sudah terdaftar untuk menerima pembaruan dari Esperion.'
  },
  seo: {
    title: 'Artikel - Insight Digital dari Esperion',
    description: 'Baca artikel, insight, dan pembelajaran seputar pengembangan web, desain, dan pemasaran digital dari tim Esperion.',
    ogTitle: 'Artikel Esperion',
    ogDescription: 'Insight dan pembaruan dari tim Esperion.'
  },
  detail: {
    readTime: 'menit baca',
    mainSummary: 'Ringkasan Utama',
    summaryParagraph1: 'Artikel ini merangkum pokok bahasan yang paling relevan untuk pengambilan keputusan digital, lalu menyoroti langkah awal yang bisa diprioritaskan oleh tim internal.',
    keyPoints: 'Poin Penting',
    keyPointIntro: 'Fokus utamanya adalah membantu tim melihat prioritas dengan lebih jelas sebelum masuk ke tahap implementasi yang lebih detail.',
    keyPoint1: 'Prioritaskan kejelasan tujuan bisnis sebelum memilih kanal atau teknologi.',
    keyPoint2: 'Pastikan pengalaman pengguna tetap konsisten dengan pesan brand di setiap touchpoint.',
    keyPoint3: 'Gunakan pengukuran yang sederhana dan relevan agar perbaikan berikutnya lebih terarah.',
    closing: 'Penutup',
    closingParagraph: 'Jika Anda ingin menurunkan pembahasan ini menjadi rencana kerja yang lebih konkret, tim Esperion dapat membantu menyusun prioritas yang sesuai dengan kondisi bisnis saat ini.',
    shareArticle: 'Bagikan artikel ini',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    copyLink: 'Salin Tautan',
    authorBio: 'Ditulis oleh tim editorial Esperion untuk merangkum insight praktis yang relevan bagi kebutuhan digital bisnis.',
    relatedArticles: 'Artikel Terkait',
    newsletterTitle: 'Ingin membaca insight lainnya?',
    newsletterDescription: 'Jelajahi artikel lain dari tim Esperion untuk memahami prioritas digital dengan lebih terarah.',
    viewAllArticles: 'View All Articles'
  }
}
var contact$1 = {
  banner: {
    title: 'Hubungi Kami',
    description: 'Ceritakan kebutuhan Anda, lalu kami bantu petakan langkah digital yang paling relevan'
  },
  form: {
    title: 'Send Your Brief',
    fullNameLabel: 'Nama Lengkap',
    companyNameLabel: 'Nama Perusahaan',
    emailLabel: 'Email',
    phoneLabel: 'Nomor Telepon',
    serviceLabel: 'Layanan yang Dibutuhkan',
    descriptionLabel: 'Ringkasan Proyek',
    servicePlaceholder: 'Pilih layanan',
    serviceOptions: {
      webDevelopment: 'Web Development',
      mobileApp: 'Mobile App Development',
      uiUxDesign: 'UI/UX Design',
      digitalMarketing: 'Digital Marketing',
      ecommerce: 'E-Commerce Solutions',
      consulting: 'Consulting',
      other: 'Other'
    },
    fullNamePlaceholder: 'Nama Anda',
    companyNamePlaceholder: 'Nama perusahaan atau brand',
    emailPlaceholder: '{\'anda@contoh.com\'}',
    phonePlaceholder: '+62 812 3456 7890',
    descriptionPlaceholder: 'Ceritakan tujuan, konteks, dan target waktu proyek Anda...',
    submitButton: 'Send Message',
    submittingButton: 'Sending...',
    successMessage: 'Terima kasih. Brief Anda sudah terkirim dan tim Esperion akan segera menghubungi Anda.',
    errorMessage: 'Terjadi kendala saat mengirim pesan. Silakan coba beberapa saat lagi.'
  },
  info: {
    title: 'Contact Information',
    location: 'Location',
    locationText: 'Sawangan Elok A1 No 5 RT 1 RW 10, Sawangan, Depok, Jawa Barat, Indonesia',
    phone: 'Phone / WhatsApp',
    phoneText: '+62 812 3456 7890',
    email: 'Email',
    emailText: '{\'hello@esperion.one\'}',
    businessHours: 'Business Hours',
    businessHoursText: 'Senin - Jumat: 09.00 - 18.00 WIB'
  },
  social: {
    title: 'Follow Esperion'
  },
  map: {
    title: 'Our Location',
    description: 'Kunjungi kantor Esperion di Sawangan, Depok, atau buka rute langsung ke lokasi resmi kami di Google Maps.',
    placeholder: 'Esperion office location in Sawangan, Depok'
  }
}
var footer$1 = {
  companyDescription: 'Esperion membantu bisnis bertumbuh lewat strategi, desain, dan pengembangan digital yang terarah.',
  quickLinks: 'Quick Links',
  ourServices: 'Our Services',
  contactUs: 'Contact Us',
  followUs: 'Follow Us',
  appearance: 'Appearance',
  contact: {
    city: 'Sawangan, Depok, Indonesia',
    addressPending: 'Sawangan Elok A1 No 5 RT 1 RW 10',
    businessHours: 'Senin-Jumat: 09.00-18.00 WIB'
  },
  services: {
    webDevelopment: 'Web Development',
    mobileAppDevelopment: 'Mobile App Development',
    uiUxDesign: 'UI/UX Design',
    digitalMarketing: 'Digital Marketing',
    ecommerceSolutions: 'E-Commerce Solutions',
    digitalConsulting: 'Digital Consulting'
  },
  copyright: '© {year} Esperion. Seluruh hak cipta dilindungi.',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service'
}
var social$1 = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  twitter: 'Twitter'
}
var aria$1 = {
  location: 'Location',
  phone: 'Phone',
  email: 'Email',
  businessHours: 'Business Hours',
  switchToLightMode: 'Switch to light mode',
  switchToDarkMode: 'Switch to dark mode',
  lightMode: 'Light mode',
  darkMode: 'Dark mode'
}
var offline$1 = {
  title: 'You\'re Offline',
  message: 'Sepertinya koneksi internet Anda terputus. Jangan khawatir, Anda masih dapat melihat beberapa konten yang tersimpan.',
  tryAgain: 'Try Again',
  goToHomepage: 'Go to Homepage',
  availablePages: 'Available pages:',
  cachedPages: {
    home: 'Home',
    works: 'Portfolio',
    services: 'Services',
    articles: 'Articles'
  },
  stillOffline: 'Still offline. Please check your internet connection.',
  seo: {
    title: 'Offline - Esperion',
    description: 'Anda saat ini sedang offline.'
  }
}
var breadcrumb$1 = {
  home: 'Home',
  services: 'Our Services',
  works: 'Portfolio',
  articles: 'Articles',
  contact: 'Contact Us',
  about: 'About Us'
}
var about$1 = {
  banner: {
    title: 'About Us',
    description: 'Mengenal cara Esperion membangun kerja sama, kualitas, dan arah digital yang konsisten'
  },
  aboutSection: {
    title: 'About Esperion',
    paragraph1: 'Esperion adalah mitra digital yang membantu bisnis menyiapkan pengalaman online yang lebih jelas, lebih cepat, dan lebih siap tumbuh. Kami bekerja dengan pendekatan strategis agar setiap keputusan desain dan pengembangan tetap terhubung dengan tujuan bisnis.',
    paragraph2: 'Tim kami menggabungkan riset, desain, pengembangan, dan validasi agar solusi yang dirilis tidak hanya terlihat baik, tetapi juga terasa relevan bagi pengguna dan mudah dikembangkan oleh bisnis Anda.',
    paragraph3: 'Fokus kami bukan sekadar meluncurkan halaman baru, tetapi membantu bisnis membangun fondasi digital yang bisa dipakai untuk tahap pertumbuhan berikutnya.'
  },
  visionMission: {
    title: 'Vision and Mission',
    visionTitle: 'Vision',
    visionDescription: 'Menjadi mitra digital yang membantu bisnis mengambil keputusan lebih percaya diri melalui pengalaman brand dan produk yang rapi, relevan, dan berkelanjutan.',
    missionTitle: 'Mission',
    missionItems: [
      'Menyusun solusi digital yang selaras dengan tujuan bisnis dan kebutuhan pengguna',
      'Membangun kerja sama jangka panjang lewat komunikasi yang terbuka dan hasil yang terukur',
      'Menjaga kualitas eksekusi sambil terus menyesuaikan diri dengan perubahan pasar',
      'Mendorong budaya belajar, dokumentasi, dan perbaikan berkelanjutan di setiap proyek'
    ]
  },
  stats: {
    projectsCompleted: 'Projects Completed',
    clientCollaborations: 'Client Collaborations',
    yearsExperience: 'Years of Experience',
    coreTalent: 'Core Talent'
  },
  founders: {
    title: 'Kepemimpinan Kami',
    description: 'Kenali tim di balik Esperion. Para founder kami membawa pengalaman gabungan puluhan tahun dalam strategi digital, desain, dan teknologi.'
  },
  values: {
    title: 'Nilai Kerja Kami',
    description: 'Prinsip yang menjaga cara kerja Esperion tetap konsisten di setiap kolaborasi',
    items: [
      {
        icon: '🎯',
        title: 'Kualitas yang disengaja',
        description: 'Kami menjaga detail, dokumentasi, dan konsistensi agar hasil akhir terasa rapi sejak hari pertama diluncurkan.'
      },
      {
        icon: '🤝',
        title: 'Kepercayaan yang jujur',
        description: 'Kami lebih memilih komunikasi yang jelas dan realistis dibanding janji yang terdengar besar tetapi tidak bisa diverifikasi.'
      },
      {
        icon: '💡',
        title: 'Eksplorasi yang terarah',
        description: 'Teknologi baru kami pakai ketika benar-benar membantu bisnis bergerak lebih cepat dan lebih efisien.'
      },
      {
        icon: '👥',
        title: 'Kolaborasi terbuka',
        description: 'Kami bekerja sebagai partner diskusi, bukan sekadar vendor, agar keputusan penting tetap punya konteks yang tepat.'
      }
    ]
  },
  cta: {
    title: 'Siap Bekerja Bersama Esperion?',
    description: 'Mari diskusikan prioritas bisnis Anda dan tentukan langkah digital yang paling relevan.',
    button: 'Hubungi Kami'
  },
  seo: {
    title: 'Tentang Esperion Digital Agency Jakarta - Solusi Digital Terbaik',
    description: 'Kenali Esperion Digital Agency di Jakarta. Tim ahli dalam pengembangan web, aplikasi mobile, digital marketing, dan layanan digital terlengkap untuk bisnis Anda di Indonesia.',
    ogTitle: 'Tentang Esperion - Digital Agency Jakarta',
    ogDescription: 'Esperion adalah agensi digital paling inovatif di Jakarta, memberikan solusi untuk pertumbuhan bisnis Anda.',
    schemaName: 'Tentang Esperion Digital Agency',
    schemaDescription: 'Beranda profil perusahaan dan tim yang membangun layanan digital di Jakarta'
  }
}
var auth$1 = {
  login: {
    title: 'Masuk',
    emailLabel: 'Email',
    emailPlaceholder: '{\'anda@contoh.com\'}',
    passwordLabel: 'Kata Sandi',
    rememberMe: 'Ingat saya',
    forgotPassword: 'Lupa kata sandi?',
    submitButton: 'Masuk',
    submittingButton: 'Memproses...',
    noAccount: 'Belum punya akun?',
    createAccount: 'Buat Akun',
    errors: {
      emailRequired: 'Email wajib diisi.',
      emailInvalid: 'Masukkan alamat email yang valid.',
      passwordRequired: 'Kata sandi wajib diisi.',
      fixFields: 'Perbaiki kolom yang ditandai.',
      invalidCredentials: 'Email atau kata sandi salah. Silakan coba lagi.'
    },
    seo: {
      title: 'Masuk - Dashboard Esperion',
      description: 'Masuk ke akun dashboard Esperion Anda.'
    }
  },
  register: {
    title: 'Buat Akun',
    fullNameLabel: 'Nama Lengkap',
    fullNamePlaceholder: 'John Doe',
    usernameLabel: 'Nama Pengguna',
    usernamePlaceholder: 'johndoe',
    emailLabel: 'Email',
    emailPlaceholder: '{\'anda@contoh.com\'}',
    phoneLabel: 'Nomor Telepon (Opsional)',
    phonePlaceholder: '+62 812 3456 7890',
    passwordLabel: 'Kata Sandi',
    acceptTerms: 'Saya menyetujui {terms} dan {privacy}',
    termsOfService: 'Syarat Layanan',
    privacyPolicy: 'Kebijakan Privasi',
    submitButton: 'Buat Akun',
    submittingButton: 'Membuat akun...',
    hasAccount: 'Sudah punya akun?',
    signIn: 'Masuk',
    errors: {
      fullNameRequired: 'Nama lengkap wajib diisi.',
      usernameRequired: 'Nama pengguna wajib diisi.',
      emailRequired: 'Email wajib diisi.',
      emailInvalid: 'Masukkan alamat email yang valid.',
      passwordRequired: 'Kata sandi wajib diisi.',
      passwordMinLength: 'Kata sandi minimal 8 karakter.',
      acceptTermsRequired: 'Anda harus menyetujui syarat untuk melanjutkan.',
      fixFields: 'Perbaiki kolom yang ditandai.',
      registrationFailed: 'Pendaftaran gagal. Silakan coba lagi.'
    },
    seo: {
      title: 'Buat Akun - Dashboard Esperion',
      description: 'Buat akun dashboard Esperion Anda.'
    }
  }
}
var works$1 = {
  detail: {
    featuredProject: 'Proyek Sorotan',
    client: 'Klien',
    projectSummary: 'Ringkasan Proyek',
    projectDescription: 'Halaman ini menampilkan gambaran singkat hasil kerja, ruang lingkup utama, dan indikator hasil yang paling relevan untuk memahami konteks proyek tanpa mengklaim detail rahasia yang belum dipublikasikan.',
    keyFeatures: 'Key Features',
    projectGallery: 'Project Gallery',
    startProjectDiscussion: 'Start Project Discussion',
    viewAllPortfolio: 'View All Portfolio',
    relatedWorks: 'Related Works',
    seo: {
      title: '{title} - Esperion Digital Agency',
      description: '{description}'
    }
  },
  banner: {
    title: 'Our Portfolio',
    description: 'Lihat contoh pendekatan kerja Esperion di berbagai kebutuhan digital'
  },
  services: {
    all: 'All Services',
    webDevelopment: 'Web Development',
    mobileApp: 'Mobile App Development',
    uiUxDesign: 'UI/UX Design',
    digitalMarketing: 'Digital Marketing',
    ecommerce: 'E-Commerce Solutions',
    consulting: 'Consulting'
  },
  platforms: {
    all: 'All Platforms',
    shopify: 'Shopify',
    reactNative: 'React Native',
    nextjs: 'Next.js',
    nuxt: 'Nuxt',
    flutter: 'Flutter',
    wordpress: 'WordPress',
    laravel: 'Laravel',
    vuejs: 'Vue.js'
  },
  filters: {
    reset: 'Reset Filter'
  },
  results: {
    count: 'Menampilkan {visible} dari {total} proyek'
  },
  emptyState: {
    title: 'Proyek tidak ditemukan',
    description: 'Coba ubah filter untuk melihat hasil lain',
    resetButton: 'Reset Semua Filter'
  },
  featuredBadge: 'Featured',
  loadMore: {
    button: 'View More Projects'
  }
}
var seo$1 = {
  home: {
    title: 'Jasa Digital Marketing Terbaik di Jakarta - Esperion',
    description: 'Temukan layanan digital terlengkap dari Esperion Agency. Web development, SEO, dan marketing digital profesional untuk bisnis Indonesia.',
    ogTitle: 'Digital Agency Jakarta - Esperion',
    ogDescription: 'Layanan digital marketing, pengembangan web dan aplikasi mobile profesional di Jakarta.'
  },
  services: {
    title: 'Layanan Digital Marketing Terbaik - Esperion Agency',
    description: 'Jasa digital marketing, web development, SEO, dan UI/UX design profesional untuk bisnis Indonesia.',
    ogTitle: 'Layanan Digital Agency Jakarta - Esperion',
    ogDescription: 'Layanan digital marketing, pengembangan web dan aplikasi mobile profesional di Jakarta.'
  },
  works: {
    title: 'Portofolio - Proyek Pilihan Esperion',
    description: 'Jelajahi portofolio proyek digital Esperion, mulai dari website, aplikasi mobile, hingga pengalaman produk yang lebih terarah.',
    ogTitle: 'Portofolio Esperion',
    ogDescription: 'Lihat beberapa proyek digital pilihan dari Esperion.'
  },
  articles: {
    title: 'Artikel - Insight Digital dari Esperion',
    description: 'Baca artikel, insight, dan pembelajaran seputar pengembangan web, desain, dan pemasaran digital dari tim Esperion.',
    ogTitle: 'Artikel Esperion',
    ogDescription: 'Insight dan pembaruan dari tim Esperion.'
  },
  contact: {
    title: 'Hubungi Kami - Esperion Digital Agency Jakarta',
    description: 'Kontak Esperion Digital Agency di Jakarta. Kami siap membantu transormasi digital bisnis Anda. Konsultasi GRATIS!',
    ogTitle: 'Kontak Esperion - Digital Agency Jakarta',
    ogDescription: 'Hubungi kami untuk konsultasi GRATIS tentang proyek digital Anda.',
    twitterTitle: 'Kontak Esperion - Digital Agency Jakarta',
    schemaName: 'Hubungi Kami - Esperion Digital Agency',
    schemaDescription: 'Halaman kontak untuk Esperion Digital Agency di Jakarta'
  }
}
var dashboard$1 = {
  index: {
    title: 'Ringkasan Dashboard',
    description: 'Fokus pada operasi agency yang retained sementara backlog platform wider terbagi menjadi change terpisah.',
    cards: {
      articles: {
        title: 'Artikel',
        description: 'Terjemahan, review editorial, dan publikasi tetap menjadi penghalang archive aktif.',
        cta: 'Buka artikel'
      },
      works: {
        title: 'Karya',
        description: 'Entri portofolio harus dimuat dari API backend retained bukan placeholder cards.',
        cta: 'Buka karya'
      },
      clients: {
        title: 'Klien',
        description: 'Administrasi showcase klien tetap ada dalam change ini dan membutuhkan manajemen data nyata.',
        cta: 'Buka klien'
      },
      contact: {
        title: 'Hubungi',
        description: 'Penanganan pertanyaan dan review admin retained harus mencerminkan API submit yang sebenarnya.',
        cta: 'Buka kontak'
      }
    },
    focus: {
      authTitle: 'Keaslian autentikasi',
      authDetail: 'Login, registrasi, logout, dan proteksi route harus mencerminkan store autentikasi dan API contract yang sebenarnya.',
      translationTitle: 'Alur kerja terjemahan',
      translationDetail: 'Terjemahan artikel tetap menjadi fitur retained paling lintas karena menyentuh API, editor, dan perilaku locale.',
      archiveTitle: 'Kesiapan archive',
      archiveDetail: 'Ringkasan ini sengaja menghindari grafik bertipe analytics agar dashboard tidak lagi membuat klaim kemampuan split-out.'
    },
    shortcuts: {
      articles: 'Artikel',
      works: 'Karya',
      services: 'Layanan',
      clients: 'Klien',
      contact: 'Hubungi',
      sessions: 'Sesi'
    },
    status: {
      needsWiring: 'Perlu dihubungkan',
      stubCleanup: 'Pembersihan stub',
      needsVerification: 'Perlu verifikasi'
    }
  },
  articles: {
    title: 'Artikel',
    description: 'Kelola konten editorial retained dan kesiapan terjemahan.',
    newButton: 'Artikel Baru',
    search: {
      placeholder: 'Cari berdasarkan judul atau slug...'
    },
    filters: {
      allCategories: 'Semua Kategori',
      allTranslationStatus: 'Semua Status Terjemahan'
    },
    columns: {
      title: 'Judul',
      category: 'Kategori',
      translation: 'Terjemahan',
      publish: 'Publikasi',
      actions: 'Aksi'
    },
    placeholders: {
      loading: 'Memuat artikel...',
      error: 'Gagal memuat artikel',
      noResults: 'Tidak ada artikel yang cocok dengan filter saat ini.'
    },
    status: {
      draft: 'Draft',
      id_only: 'ID saja',
      en_only: 'EN saja',
      complete: 'Lengkap'
    },
    buttons: {
      edit: 'Edit',
      delete: 'Hapus',
      deleteConfirm: 'Hapus artikel ini?'
    },
    seo: {
      title: 'Artikel - Dashboard',
      description: 'Kelola alur kerja artikel retained.'
    }
  },
  articles_edit: {
    title: 'Edit Artikel',
    description: 'Kelola konten artikel, draft terjemahan, dan status.',
    back: 'Kembali',
    saveButton: 'Simpan Artikel',
    saveInProgress: 'Menyimpan...',
    loading: 'Memuat artikel...',
    content: {
      indonesian: 'Konten Indonesia',
      indonesianPrimary: 'Sumber utama',
      english: 'Terjemahan Inggris',
      englishDescription: 'Gunakan terjemahan Alibaba untuk generasi draft, lalu review secara manual.',
      translateButton: 'Terjemahkan ke Inggris',
      translating: 'Menerjemahkan...',
      reviewButton: 'Setujui Draft Terjemahan',
      reviewing: 'Menyelidiki...'
    },
    publishing: {
      title: 'Publikasi',
      category: 'Kategori',
      published: 'Dipublikasikan'
    },
    translationStatus: {
      title: 'Status Terjemahan',
      current: 'Status saat ini:',
      available: 'Bahasa yang tersedia:',
      save: 'Simpan Status Terjemahan',
      saveInProgress: 'Menyimpan...'
    },
    seo: {
      title: 'Edit Artikel - Dashboard',
      description: 'Edit konten artikel retained dan alur kerja terjemahan.'
    }
  },
  articles_new: {
    title: 'Artikel Baru',
    description: 'Buat artikel sumber Indonesia terlebih dahulu, lalu lanjutkan review terjemahan dari halaman edit.',
    cancel: 'Batal',
    createButton: 'Buat Artikel',
    saveInProgress: 'Menyimpan...',
    content: {
      indonesian: 'Konten Indonesia',
      placeholder: 'Tulis konten sumber Indonesia di sini...'
    },
    excerpt: {
      title: 'Kutipan',
      placeholder: 'Ringkasan pendek dalam bahasa Indonesia untuk artikel'
    },
    publishing: {
      title: 'Publikasi',
      category: 'Kategori',
      publishImmediately: 'Publikasi segera'
    },
    translationWorkflow: {
      title: 'Alur Kerja Terjemahan',
      description: 'Setelah membuat artikel Indonesia, lanjutkan di halaman edit untuk membuat dan mereview draft bahasa Inggris.'
    },
    seo: {
      title: 'Artikel Baru - Dashboard',
      description: 'Buat artikel retained.'
    }
  },
  works: {
    title: 'Karya',
    description: 'Kelola proyek portofolio Anda',
    newButton: 'Karya Baru',
    loading: 'Memuat karya...',
    noResults: 'Tidak ada karya yang ditemukan.',
    featuredBadge: 'Sorotan',
    image: {
      label: 'Gambar',
      noImage: 'Tidak Ada Gambar'
    },
    buttons: {
      delete: 'Hapus',
      deleteConfirm: 'Hapus karya ini?'
    },
    seo: {
      title: 'Karya - Dashboard',
      description: 'Kelola portofolio Anda.'
    }
  },
  works_new: {
    title: 'Karya Baru',
    description: 'Tambahkan proyek portofolio baru',
    cancel: 'Batal',
    publishButton: 'Publikasikan Karya',
    saveInProgress: 'Menyimpan...',
    metrics: {
      title: 'Metrik',
      add: '+ Tambah Metrik',
      labelPlaceholder: 'Label (mis: Konversi)',
      valuePlaceholder: 'Nilai (mis: 45)',
      suffixPlaceholder: 'Suffix (mis: %)'
    },
    details: {
      title: 'Detail Karya',
      client: {
        label: 'Klien',
        placeholder: 'Nama klien'
      },
      service: {
        label: 'Layanan',
        options: {
          webDevelopment: 'Web Development',
          mobileAppDevelopment: 'Mobile App Development',
          uiUxDesign: 'UI/UX Design',
          digitalMarketing: 'Digital Marketing',
          ecommerceSolutions: 'E-Commerce Solutions',
          consulting: 'Consulting'
        }
      },
      platform: {
        label: 'Platform',
        placeholder: 'mis: Shopify, React Native'
      },
      slug: {
        label: 'Slug',
        placeholder: 'auto-generated-jika-kosong'
      },
      featured: 'Proyek Sorotan'
    },
    image: {
      title: 'Gambar Karya',
      label: 'URL Gambar',
      placeholder: '/images/portfolio/project.jpg'
    },
    seo: {
      title: 'Karya Baru - Dashboard',
      description: 'Tambahkan proyek portofolio baru.'
    }
  },
  media: {
    title: 'Perpustakaan Media',
    description: 'Kelola gambar, video, dan file Anda',
    uploadButton: 'Unggah Media',
    search: {
      placeholder: 'Cari media...'
    },
    filters: {
      allTypes: 'Semua Tipe',
      image: 'Gambar',
      video: 'Video',
      document: 'Dokumen'
    },
    buttons: {
      view: 'Lihat',
      edit: 'Edit',
      delete: 'Hapus'
    },
    seo: {
      title: 'Perpustakaan Media - Dashboard',
      description: 'Kelola file media Anda.'
    }
  },
  services: {
    title: 'Layanan',
    description: 'Kelola tawaran layanan Anda',
    newButton: 'Layanan Baru',
    create: {
      title: 'Buat Layanan',
      update: 'Perbarui Layanan',
      cancel: 'Batal',
      submitTitle: 'Judul',
      slugTitle: 'Slug',
      orderTitle: 'Urutan Tampilan',
      descTitle: 'Deskripsi',
      iconTitle: 'Ikon',
      featured: 'Layanan sorotan',
      saveButton: 'Simpan Perubahan',
      createButton: 'Buat Layanan',
      saveInProgress: 'Menyimpan...',
      loading: 'Memuat layanan...'
    },
    buttons: {
      edit: 'Edit',
      delete: 'Hapus',
      featured: 'Sorotan',
      noIcon: 'Tidak ada ikon'
    },
    noResults: 'Tidak ada layanan yang ditemukan.',
    seo: {
      title: 'Layanan - Dashboard',
      description: 'Kelola layanan.'
    }
  },
  clients: {
    title: 'Klien',
    description: 'Kelola hubungan klien Anda',
    newButton: 'Klien Baru',
    create: {
      title: 'Buat Klien',
      update: 'Perbarui Klien',
      cancel: 'Batal',
      nameTitle: 'Nama',
      logoTitle: 'URL Logo',
      logoPlaceholder: '/images/client-logo.svg',
      categoryTitle: 'Kategori',
      categoryPlaceholder: 'Teknologi',
      statusTitle: 'Status',
      statusOptions: {
        active: 'Aktif',
        prospect: 'Prospek',
        inactive: 'Tidak Aktif'
      },
      testimonialTitle: 'Testimoni',
      internalNotesTitle: 'Catatan Internal',
      featured: 'Klien sorotan',
      saveButton: 'Simpan Perubahan',
      createButton: 'Buat Klien',
      saveInProgress: 'Menyimpan...',
      loading: 'Memuat klien...'
    },
    table: {
      client: 'Klien',
      category: 'Kategori',
      status: 'Status',
      testimonial: 'Testimoni',
      actions: 'Aksi',
      noResults: 'Tidak ada klien yang ditemukan.'
    },
    buttons: {
      edit: 'Edit',
      delete: 'Hapus'
    },
    status: {
      active: 'Aktif',
      prospect: 'Prospek',
      inactive: 'Tidak Aktif',
      logo: 'Logo',
      n_a: 'N/A'
    },
    testimonialStatus: {
      available: 'Tersedia',
      none: '-'
    },
    seo: {
      title: 'Klien - Dashboard',
      description: 'Kelola klien.'
    }
  },
  contact: {
    title: 'Submissions Kontak',
    description: 'Kelola pertanyaan dari website Anda',
    export: {
      button: '📥 Ekspor CSV'
    },
    stats: {
      total: 'Total',
      new: 'Baru',
      qualified: 'Qualified'
    },
    filters: {
      service: 'Filter berdasarkan layanan',
      status: 'Filter berdasarkan status',
      allStatuses: 'Semua Status',
      statusOptions: {
        new: 'Baru',
        contacted: 'Dihubungi',
        qualified: 'Qualified',
        converted: 'Converted',
        lost: 'Lost'
      },
      refresh: 'Refresh'
    },
    table: {
      name: 'Nama',
      email: 'Email',
      service: 'Layanan',
      date: 'Tanggal',
      status: 'Status',
      actions: 'Aksi',
      noResults: 'Tidak ada submission kontak yang ditemukan.'
    },
    loading: 'Memuat submission kontak...',
    buttons: {
      edit: 'Edit',
      delete: 'Hapus'
    },
    status: {
      new: 'Baru',
      contacted: 'Dihubungi',
      qualified: 'Qualified',
      converted: 'Converted',
      lost: 'Lost'
    },
    seo: {
      title: 'Kontak - Dashboard',
      description: 'Kelola submission kontak.'
    }
  },
  users: {
    title: 'Pengguna',
    description: 'Kelola pengguna dashboard dan penugasan role tetap.',
    newButton: 'Pengguna Baru',
    create: {
      title: 'Buat Pengguna',
      update: 'Perbarui Pengguna',
      cancel: 'Batal',
      fullNameTitle: 'Nama Lengkap',
      usernameTitle: 'Username',
      emailTitle: 'Email',
      phoneTitle: 'Telepon',
      roleTitle: 'Role',
      roleOptions: {
        admin: 'Admin',
        editor: 'Editor',
        viewer: 'Viewer'
      },
      passwordTitle: 'Password Awal',
      saveButton: 'Simpan Perubahan',
      createButton: 'Buat Pengguna',
      saveInProgress: 'Menyimpan...',
      loading: 'Memuat pengguna...',
      denied: 'Hanya administrator yang dapat mengakses manajemen pengguna.'
    },
    table: {
      user: 'Pengguna',
      role: 'Role',
      phone: 'Telepon',
      joined: 'Bergabung',
      actions: 'Aksi',
      noResults: 'Tidak ada pengguna yang ditemukan.'
    },
    buttons: {
      edit: 'Edit',
      delete: 'Hapus',
      deleteConfirm: 'Hapus {name}? Ini menggunakan hard delete.'
    },
    status: {
      active: 'Aktif',
      prospect: 'Prospek',
      inactive: 'Tidak Aktif'
    },
    notifications: {
      userUpdated: {
        title: 'Pengguna diperbarui',
        message: 'Detail pengguna berhasil diperbarui.'
      },
      userCreated: {
        title: 'Pengguna dibuat',
        message: 'Pengguna dashboard baru berhasil dibuat.'
      },
      userDeleted: {
        title: 'Pengguna dihapus',
        message: '{name} berhasil dihapus.'
      },
      error: {
        title: 'Manajemen pengguna error',
        message: 'Gagal menyimpan pengguna'
      },
      deleteFailed: {
        title: 'Penghapusan gagal',
        message: 'Gagal menghapus pengguna'
      }
    },
    seo: {
      title: 'Pengguna - Dashboard',
      description: 'Kelola pengguna dashboard.'
    }
  },
  sessions: {
    title: 'Sesi',
    description: 'Review sesi aktif dan cabut perangkat yang tidak lagi Anda percayai.',
    refresh: {
      button: 'Refresh sesi',
      inProgress: 'Menyegarkan...',
      loading: 'Memuat sesi...'
    },
    noResults: 'Tidak ada sesi aktif yang dikembalikan oleh API.',
    columns: {
      device: 'Perangkat',
      deviceId: 'ID Perangkat',
      status: 'Status',
      ipAddress: 'Alamat IP',
      created: 'Dibuat',
      expires: 'Kedaluwarsa',
      currentSession: 'Sesi saat ini tidak dapat dicabut di sini',
      forceLogout: 'Paksa logout sesi'
    },
    status: {
      current: 'Saat Ini',
      active: 'Aktif',
      activeSession: 'Sesi Aktif'
    },
    notifications: {
      sessionRevoked: {
        title: 'Sesi dicabut',
        message: 'Sesi berhasil dicabut.'
      },
      error: {
        title: 'Gagal mencabut',
        message: 'Gagal mencabut sesi'
      }
    },
    seo: {
      title: 'Sesi - Dashboard',
      description: 'Review dan cabut sesi akun aktif.'
    }
  },
  settings: {
    title: 'Pengaturan',
    analytics: {
      title: 'Analytics & Pixels',
      openAnalytics: 'Buka dashboard analytics',
      ga4Id: 'ID GA4 Measurement',
      ga4Placeholder: 'G-XXXXXXXXXX',
      gtmId: 'ID GTM Container',
      gtmPlaceholder: 'GTM-XXXXXXX',
      clarityId: 'ID Proyek Clarity',
      clarityPlaceholder: 'clarity-project-id',
      metaPixelId: 'ID Meta Pixel',
      metaPixelPlaceholder: '1234567890',
      tiktokPixelId: 'ID TikTok Pixel',
      tiktokPlaceholder: 'tiktok-pixel-id',
      linkedinPartnerId: 'ID Rekan LinkedIn',
      linkedinPlaceholder: 'linkedin-partner-id',
      enableTracking: 'Aktifkan pelacakan frontend'
    },
    funnels: {
      title: 'Funnels',
      add: '+ Tambah Funnel',
      idPlaceholder: 'id-funnel',
      namePlaceholder: 'Nama funnel',
      active: 'Aktif',
      descriptionPlaceholder: 'Deskripsi opsional',
      steps: {
        title: 'Langkah',
        add: '+ Tambah Langkah',
        remove: 'Hapus',
        namePlaceholder: 'Nama langkah',
        eventNamePlaceholder: 'Nama event',
        pathPlaceholder: 'Filter path opsional',
        orderLabel: 'Urutan'
      },
      removeFunnel: 'Hapus Funnel'
    },
    analyticsSaveButton: 'Simpan Pengaturan Analytics',
    backup: {
      title: 'Backup & Restore',
      refreshButton: 'Refresh Riwayat Backup',
      schedule: {
        enabled: 'Aktifkan jadwal',
        cronTitle: 'Jadwal (cron)',
        retentionTitle: 'Jumlah retensi',
        filesDirTitle: 'Direktori file'
      },
      encryption: {
        enabled: 'Aktifkan enkripsi'
      },
      savePolicyButton: 'Simpan Kebijakan Backup',
      runNowButton: 'Jalankan Backup Sekarang',
      history: {
        title: 'Riwayat Backup',
        scopesLabel: 'Scopes:',
        createdLabel: 'dibuat',
        restoreScope: {
          label: 'Scope',
          options: {
            database: 'database',
            files: 'files',
            all: 'all'
          }
        },
        restoreButton: 'Restore',
        restoreInProgress: 'Mengrestore...',
        noHistory: 'Belum ada riwayat backup.'
      }
    },
    monitoring: {
      title: 'Monitoring & Alerting',
      refreshButton: 'Refresh Status',
      integrations: {
        title: 'Integrasi',
        uptime: {
          providerLabel: 'Provider',
          enabled: 'Aktif'
        },
        errors: {
          providerLabel: 'Provider',
          enabled: 'Aktif'
        },
        performance: {
          providerLabel: 'Provider',
          enabled: 'Aktif'
        }
      },
      services: {
        title: 'Layanan yang Dimonitor',
        add: '+ Tambah Layanan',
        idPlaceholder: 'id-layanan',
        namePlaceholder: 'Nama tampilan',
        urlPlaceholder: 'https://layanan/health',
        enabled: 'Aktif',
        remove: 'Hapus'
      },
      thresholds: {
        title: 'Ambang Batas',
        add: '+ Tambah Ambang Batas',
        idPlaceholder: 'id-ambang-batas',
        servicePlaceholder: 'id-layanan',
        signalType: {
          label: 'Tipe Sinyal',
          options: {
            uptime: 'uptime',
            error_rate: 'error_rate',
            latency_ms: 'latency_ms'
          }
        },
        operator: {
          label: 'Operator',
          options: {
            gt: 'gt',
            gte: 'gte',
            lt: 'lt',
            lte: 'lte',
            eq: 'eq',
            ne: 'ne'
          }
        },
        valueLabel: 'Nilai ambang batas',
        severityLabel: 'Severity',
        severityOptions: {
          info: 'info',
          warning: 'warning',
          critical: 'critical'
        },
        cooldownLabel: 'Cooldown (menit)',
        enabled: 'on',
        remove: 'Hapus'
      },
      destinations: {
        title: 'Tujuan Alert',
        add: '+ Tambah Tujuan',
        idPlaceholder: 'id-tujuan',
        namePlaceholder: 'Nama',
        channel: {
          label: 'Channel',
          options: {
            email: 'email',
            webhook: 'webhook'
          }
        },
        targetPlaceholderEmail: '{\'ops@example.com\'}',
        targetPlaceholderWebhook: 'https://hooks.example.com',
        enabled: 'on',
        remove: 'Hapus'
      },
      currentStatus: {
        title: 'Status Saat Ini',
        overall: 'Secara keseluruhan:'
      },
      servicesTable: {
        name: 'Nama',
        url: 'URL',
        status: 'Status:',
        latency: 'latency'
      },
      alerts: {
        title: 'Alert Baru Ini',
        refreshButton: 'Refresh Alert',
        serviceLabel: 'layanan',
        signalLabel: 'sinyal',
        severityLabel: 'severity',
        firedAtLabel: 'dipicu',
        noAlerts: 'Belum ada alert.'
      },
      test: {
        title: 'Test Alert',
        messagePlaceholder: 'Pesan test alert opsional',
        sendButton: 'Kirim Test Alert',
        sending: 'Mengirim...'
      },
      saveButton: 'Simpan Perubahan Monitoring',
      SavingInProgress: 'Menyimpan...',
      refreshingStatus: 'Menyegarkan status...',
      refreshingAlerts: 'Menyegarkan alert...',
      testSent: 'Test alert dikirim. Terkirim: {delivered}, Gagal: {failed}',
      failedToSendTest: 'Gagal mengirim test alert'
    },
    analyticsSaveSuccess: 'Pengaturan analytics disimpan',
    backupSaveSuccess: 'Kebijakan backup disimpan',
    backupRunning: 'Membuat backup...',
    backupCompleted: 'Backup selesai: {id}',
    backupFailed: 'Gagal membuat backup',
    restoringBackup: 'Mengrestore backup...',
    backupRestored: 'Backup berhasil direstore',
    backupRestoreFailed: 'Gagal merestore backup',
    monitoringSaved: 'Pengaturan monitoring disimpan',
    monitoringSaveFailed: 'Gagal menyimpan pengaturan monitoring'
  },
  analytics: {
    title: 'Dashboard Analytics',
    description: 'Laporan event dan funnel real dari backend analytics endpoints.',
    refresh: {
      button: 'Refresh Laporan',
      inProgress: 'Menyegarkan...'
    },
    overview: {
      totalEvents: 'Total events',
      totalSessions: 'Total sesi',
      pageViews: 'Page views',
      conversionEvents: 'Conversion events'
    },
    funnels: {
      title: 'Funnels',
      noActive: 'Belum ada funnel aktif. Konfigurasi funnel di pengaturan dashboard.',
      step: 'langkah',
      eventLabel: 'event'
    },
    empty: 'Tidak ada data analytics.'
  },
  apiDocs: {
    title: 'Dokumentasi API Esperion',
    description: 'Lihat referensi OpenAPI backend Esperion dari dashboard.',
    loading: 'Memuat dokumentasi API...',
    errorTitle: 'Dokumentasi API tidak tersedia',
    errorMessage: 'Spesifikasi OpenAPI backend sedang tidak tersedia. Pastikan server backend berjalan.',
    backendUrl: 'URL backend',
    retry: 'Coba Lagi',
    openDirect: 'Buka OpenAPI Langsung'
  }
}
var error$1 = {
  backToHome: 'Kembali ke Beranda',
  backToArticles: 'Kembali ke Daftar Artikel',
  backToServices: 'Kembali ke Daftar Layanan'
}
const locale_id_46json_38644f3f = {
  nav: nav$1,
  language: language$1,
  common: common$1,
  home: home$1,
  services: services$1,
  articles: articles$1,
  contact: contact$1,
  footer: footer$1,
  social: social$1,
  aria: aria$1,
  offline: offline$1,
  breadcrumb: breadcrumb$1,
  about: about$1,
  auth: auth$1,
  works: works$1,
  seo: seo$1,
  dashboard: dashboard$1,
  error: error$1
}

var nav = {
  home: 'Home',
  works: 'Portfolio',
  services: 'Services',
  articles: 'Articles',
  about: 'About',
  contact: 'Contact Us',
  appearance: 'Appearance',
  darkMode: 'Dark Mode',
  aria: {
    home: 'Esperion Home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu'
  }
}
var language = {
  indonesian: 'Indonesian',
  english: 'English'
}
var common = {
  loading: 'Loading...',
  error: 'An error occurred',
  success: 'Success',
  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  view: 'View',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  reset: 'Reset',
  readMore: 'Read More',
  learnMore: 'Learn More',
  submit: 'Submit',
  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    results: 'results'
  },
  aria: {
    close: 'Close',
    menu: 'Menu',
    location: 'Location',
    phone: 'Phone',
    email: 'Email',
    businessHours: 'Business hours'
  }
}
var home = {
  hero: {
    slide1Title: 'Build Your Digital Presence',
    slide1Sub: 'Build a Stronger Digital Presence',
    slide1Desc: 'We design websites and digital products that help businesses stand out clearly, quickly, and ready to grow.',
    slide1Cta: 'Start Consultation',
    slide2Title: 'Ready for Next Growth Phase?',
    slide2Sub: 'Digital Solutions for Your Next Growth Phase',
    slide2Desc: 'From planning to launch, Esperion helps your team release relevant and measurable digital experiences.',
    slide2Cta: 'View Portfolio',
    slide3Title: 'Small Team, Real Impact',
    slide3Sub: 'Small Team, Real Impact',
    slide3Desc: 'We combine strategy, design, and development to deliver digital experiences consistent with your brand.',
    slide3Cta: 'Learn More',
    slide4Title: 'Comprehensive Digital Services',
    slide4Sub: 'Comprehensive Digital Services',
    slide4Desc: 'From web development to digital marketing, we provide end-to-end solutions for digital transformation.',
    slide4Cta: 'Explore Services',
    slide5Title: 'Trusted by Growing Businesses',
    slide5Sub: 'Trusted by Growing Businesses',
    slide5Desc: 'Join businesses that have grown with Esperion through measurable and impactful digital solutions.',
    slide5Cta: 'View Testimonials'
  },
  whoAreWe: {
    title: 'About Esperion',
    description: 'Esperion is a digital partner for businesses that need direction, execution, and consistent brand experience.',
    value1: 'Clear Strategy',
    value2: 'Neat Execution',
    value3: 'Open Collaboration',
    value4: 'Results-Focused'
  },
  ourServices: {
    title: 'Our Services',
    subtitle: 'Digital solutions designed for your business targets',
    cta: 'View All Services'
  },
  stats: {
    projects: 'Projects Completed',
    clients: 'Client Collaborations',
    experience: 'Years of Experience',
    talent: 'Core Talent'
  },
  clientLogos: {
    placeholder: 'Trusted by industry leaders',
    namePlaceholder: 'Client Name'
  },
  featuredWorks: {
    title: 'Featured Works',
    subtitle: 'Project highlights representing Esperion\'s work approach',
    cta: 'View All Portfolio →'
  },
  articles: {
    title: 'Latest Articles',
    subtitle: 'Brief insights, learnings, and updates from the Esperion team',
    cta: 'View All Articles →',
    readMore: 'Read More →'
  },
  cta: {
    title: 'Ready for Your Next Digital Step?',
    description: 'Tell us about your business context, and we\'ll help map the most relevant solutions.',
    button: 'Start Discussion Today'
  },
  aria: {
    slideNav: 'Go to slide {index}',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide'
  }
}
var services = {
  banner: {
    title: 'Our Services',
    description: 'Digital solutions designed to help your business move more clearly and grow better'
  },
  cta: {
    learnMore: 'Learn More'
  },
  whyChooseUs: {
    title: 'Why Choose Esperion?',
    description: 'We combine strategy, execution, and neat collaboration for more focused results'
  },
  reasons: {
    trackRecord: {
      title: 'Proven Track Record',
      description: 'More than 150 digital projects completed.'
    },
    team: {
      title: 'Cross-disciplinary Team',
      description: 'Strategy, design, and development moving in one workflow.'
    },
    execution: {
      title: 'Step-by-step Execution',
      description: 'Iterative approach helps decisions move quickly without losing direction.'
    },
    communication: {
      title: 'Open Communication',
      description: 'Every work phase is built with context, documentation, and clear expectations.'
    }
  },
  ctaSection: {
    title: 'Ready to Start Your Project?',
    description: 'Tell us about your business context, and we\'ll help map the most relevant digital solutions.',
    button: 'Schedule Consultation'
  },
  detail: {
    serviceScope: 'Service Scope',
    workflow: 'Workflow',
    estimateStartingFrom: 'Estimate Starting From',
    estimateNote: 'Final estimate adjusted based on scope, complexity, and integration needs.',
    requestEstimate: 'Request Estimate',
    faq: 'Frequently Asked Questions',
    relatedServices: 'Related Services',
    ctaTitle: 'Ready to Move to the Next Step?',
    ctaDescription: 'Categorize your business context, then we\'ll help arrange the most relevant approach.',
    ctaButton: 'Contact Esperion Team'
  }
}
var articles = {
  banner: {
    title: 'Articles',
    description: 'Insights, learnings, and updates from the Esperion team'
  },
  filters: {
    allCategories: 'All Categories',
    marketing: 'Marketing',
    design: 'Design',
    development: 'Development',
    ecommerce: 'E-Commerce',
    business: 'Business',
    reset: 'Reset'
  },
  search: {
    placeholder: 'Search articles...'
  },
  results: {
    count: 'Showing of articles'
  },
  emptyState: {
    title: 'Articles not found',
    description: 'Try changing keywords or selected filters',
    resetButton: 'Reset All Filters'
  },
  loadMore: {
    button: 'Load More Articles'
  },
  newsletter: {
    title: 'Follow Updates from Esperion',
    description: 'Get the latest articles and updates delivered directly to your email',
    placeholder: 'Enter your email',
    subscribeButton: 'Subscribe',
    successMessage: 'Thank you, you\'re now registered to receive updates from Esperion.'
  },
  seo: {
    title: 'Articles - Digital Insights from Esperion',
    description: 'Read articles, insights, and learnings about web development, design, and digital marketing.',
    ogTitle: 'Esperion Articles',
    ogDescription: 'Insights and updates from the Esperion team.'
  },
  detail: {
    readTime: 'min read',
    mainSummary: 'Main Summary',
    summaryParagraph1: 'This article summarizes the most relevant points for digital decision-making, then highlights initial steps that can be prioritized by internal teams.',
    keyPoints: 'Key Points',
    keyPointIntro: 'The main focus is to help teams see priorities more clearly before moving to more detailed implementation phases.',
    keyPoint1: 'Prioritize clarity of business goals before choosing channels or technology.',
    keyPoint2: 'Ensure user experience remains consistent with brand message at every touchpoint.',
    keyPoint3: 'Use simple and relevant measurements so subsequent improvements are more focused.',
    closing: 'Closing',
    closingParagraph: 'If you want to turn this discussion into a more concrete work plan, the Esperion team can help arrange priorities that suit your current business conditions.',
    shareArticle: 'Share this article',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    copyLink: 'Copy Link',
    authorBio: 'Written by the Esperion editorial team to summarize practical insights relevant to business digital needs.',
    relatedArticles: 'Related Articles',
    newsletterTitle: 'Want to read other insights?',
    newsletterDescription: 'Explore other articles from the Esperion team to understand digital priorities more clearly.',
    viewAllArticles: 'View All Articles'
  }
}
var works = {
  banner: {
    title: 'Our Portfolio',
    description: 'See examples of Esperion\'s approach to various digital needs'
  },
  services: {
    all: 'All Services',
    webDevelopment: 'Web Development',
    mobileApp: 'Mobile App',
    uiUxDesign: 'UI/UX Design',
    digitalMarketing: 'Digital Marketing',
    ecommerce: 'E-Commerce',
    consulting: 'Consulting'
  },
  platforms: {
    all: 'All Platforms',
    shopify: 'Shopify',
    reactNative: 'React Native',
    nextjs: 'Next.js',
    nuxt: 'Nuxt',
    flutter: 'Flutter',
    wordpress: 'WordPress',
    laravel: 'Laravel',
    vuejs: 'Vue.js'
  },
  filters: {
    reset: 'Reset Filter'
  },
  results: {
    count: 'Showing {visible} of {total} projects'
  },
  emptyState: {
    title: 'No projects found',
    description: 'Try changing filters to see other results',
    resetButton: 'Reset All Filters'
  },
  featuredBadge: 'Featured',
  loadMore: {
    button: 'View More Projects'
  },
  detail: {
    featuredProject: 'Featured Project',
    client: 'Client',
    projectSummary: 'Project Summary',
    projectDescription: 'This page displays a brief overview of work results, main scope, and the most relevant outcome indicators to understand project context without claiming unpublished confidential details.',
    keyFeatures: 'Key Features',
    projectGallery: 'Project Gallery',
    startProjectDiscussion: 'Start Project Discussion',
    viewAllPortfolio: 'View All Portfolio',
    relatedWorks: 'Related Works',
    seo: {
      title: '{title} - Esperion Digital Agency',
      description: '{description}'
    }
  }
}
var contact = {
  banner: {
    title: 'Contact Us',
    description: 'Tell us your needs, and we\'ll help map out the most relevant digital path forward'
  },
  form: {
    title: 'Send Your Brief',
    fullNameLabel: 'Full Name',
    companyNameLabel: 'Company Name',
    emailLabel: 'Email',
    phoneLabel: 'Phone Number',
    serviceLabel: 'Required Services',
    descriptionLabel: 'Project Summary',
    servicePlaceholder: 'Select a service',
    serviceOptions: {
      webDevelopment: 'Web Development',
      mobileApp: 'Mobile App',
      uiUxDesign: 'UI/UX Design',
      digitalMarketing: 'Digital Marketing',
      ecommerce: 'E-Commerce Solutions',
      consulting: 'Digital Consulting',
      other: 'Other'
    },
    fullNamePlaceholder: 'Your Name',
    companyNamePlaceholder: 'Company or brand name',
    emailPlaceholder: '{\'john@example.com\'}',
    phonePlaceholder: '+62 812 3456 7890',
    descriptionPlaceholder: 'Tell us about your project goals, context, and timeline...',
    submitButton: 'Send Message',
    submittingButton: 'Sending...',
    successMessage: 'Thank you. Your brief has been submitted and the Esperion team will contact you shortly.',
    errorMessage: 'There was a problem sending your message. Please try again later.'
  },
  info: {
    title: 'Contact Information',
    location: 'Location',
    locationText: 'Jakarta, Indonesia',
    phone: 'Phone / WhatsApp',
    phoneText: '+62 812 3456 7890',
    email: 'Email',
    emailText: '{\'hello@esperion.one\'}',
    businessHours: 'Business Hours',
    businessHoursText: 'Monday - Friday: 09.00 - 18.00 WIB'
  },
  social: {
    title: 'Follow Esperion'
  },
  map: {
    title: 'Our Location',
    description: 'Visit the Esperion office in Sawangan, Depok, or open the official destination in Google Maps.',
    placeholder: 'Esperion office location in Sawangan, Depok'
  }
}
var footer = {
  companyDescription: 'Esperion helps businesses grow through strategy, design, and targeted digital development.',
  quickLinks: 'Quick Navigation',
  ourServices: 'Our Services',
  contactUs: 'Contact Us',
  followUs: 'Follow Us',
  appearance: 'Appearance',
  contact: {
    city: 'Sawangan, Depok, Indonesia',
    addressPending: 'Sawangan Elok A1 No 5 RT 1 RW 10',
    businessHours: 'Monday-Friday: 09:00-18:00 WIB'
  },
  services: {
    webDevelopment: 'Web Development',
    mobileAppDevelopment: 'Mobile App Development',
    uiUxDesign: 'UI/UX Design',
    digitalMarketing: 'Digital Marketing',
    ecommerceSolutions: 'E-Commerce Solutions',
    digitalConsulting: 'Digital Consulting'
  },
  copyright: '© {year} Esperion. All rights reserved.',
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service'
}
var social = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  twitter: 'Twitter'
}
var aria = {
  location: 'Location',
  phone: 'Phone',
  email: 'Email',
  businessHours: 'Business hours',
  switchToLightMode: 'Switch to light mode',
  switchToDarkMode: 'Switch to dark mode',
  lightMode: 'Light mode',
  darkMode: 'Dark mode'
}
var offline = {
  title: 'You\'re Offline',
  message: 'It looks like you\'ve lost your internet connection. Don\'t worry, you can still view some cached content.',
  tryAgain: 'Try Again',
  goToHomepage: 'Go to Homepage',
  availablePages: 'The following pages are available offline:',
  cachedPages: {
    home: 'Homepage',
    works: 'Portfolio',
    services: 'Services',
    articles: 'Articles'
  },
  stillOffline: 'Still offline. Please check your internet connection.',
  seo: {
    title: 'Offline - Esperion',
    description: 'You are currently offline.'
  }
}
var auth = {
  login: {
    title: 'Sign In',
    emailLabel: 'Email',
    emailPlaceholder: '{\'you@example.com\'}',
    passwordLabel: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    submitButton: 'Sign In',
    submittingButton: 'Signing in...',
    noAccount: 'Don\'t have an account?',
    createAccount: 'Create Account',
    errors: {
      emailRequired: 'Email is required.',
      emailInvalid: 'Please enter a valid email address.',
      passwordRequired: 'Password is required.',
      fixFields: 'Please fix the highlighted fields.',
      invalidCredentials: 'Invalid email or password. Please try again.'
    },
    seo: {
      title: 'Sign In - Esperion Dashboard',
      description: 'Sign in to your Esperion dashboard account.'
    }
  },
  register: {
    title: 'Create Account',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    usernameLabel: 'Username',
    usernamePlaceholder: 'johndoe',
    emailLabel: 'Email',
    emailPlaceholder: '{\'you@example.com\'}',
    phoneLabel: 'Phone (Optional)',
    phonePlaceholder: '+62 812 3456 7890',
    passwordLabel: 'Password',
    acceptTerms: 'I agree to the {terms} and {privacy}',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    submitButton: 'Create Account',
    submittingButton: 'Creating account...',
    hasAccount: 'Already have an account?',
    signIn: 'Sign In',
    errors: {
      fullNameRequired: 'Full Name is required.',
      usernameRequired: 'Username is required.',
      emailRequired: 'Email is required.',
      emailInvalid: 'Please enter a valid email address.',
      passwordRequired: 'Password is required.',
      passwordMinLength: 'Password must be at least 8 characters.',
      acceptTermsRequired: 'You must accept the terms to continue.',
      fixFields: 'Please fix the highlighted fields.',
      registrationFailed: 'Registration failed. Please try again.'
    },
    seo: {
      title: 'Create Account - Esperion Dashboard',
      description: 'Create your Esperion dashboard account.'
    }
  }
}
var breadcrumb = {
  home: 'Home',
  services: 'Our Services',
  works: 'Portfolio',
  articles: 'Articles',
  contact: 'Contact Us',
  about: 'About Us'
}
var about = {
  banner: {
    title: 'About Us',
    description: 'Learn how Esperion builds collaboration, quality, and consistent digital direction'
  },
  aboutSection: {
    title: 'About Esperion',
    paragraph1: 'Esperion is a digital partner that helps businesses prepare clearer, faster, and more growth-ready online experiences. We work with a strategic approach so that every design and development decision remains connected to business goals.',
    paragraph2: 'Our team combines research, design, development, and validation so that released solutions not only look good, but also feel relevant to users and are easy for your business to develop.',
    paragraph3: 'Our focus is not just launching new pages, but helping businesses build a digital foundation that can be used for the next growth phase.'
  },
  visionMission: {
    title: 'Vision and Mission',
    visionTitle: 'Vision',
    visionDescription: 'To become a digital partner that helps businesses make more confident decisions through neat, relevant, and sustainable brand and product experiences.',
    missionTitle: 'Mission',
    missionItems: [
      'Develop digital solutions that align with business goals and user needs',
      'Build long-term partnerships through open communication and measurable results',
      'Maintain execution quality while continuously adapting to market changes',
      'Promote a culture of learning, documentation, and continuous improvement in every project'
    ]
  },
  stats: {
    projectsCompleted: 'Projects Completed',
    clientCollaborations: 'Client Collaborations',
    yearsExperience: 'Years of Experience',
    coreTalent: 'Core Talent'
  },
  founders: {
    title: 'Our Leadership',
    description: 'Meet the team behind Esperion. Our founders bring decades of combined experience in digital strategy, design, and technology.'
  },
  values: {
    title: 'Our Work Values',
    description: 'Principles that keep Esperion\'s way of working consistent in every collaboration',
    items: [
      {
        icon: '🎯',
        title: 'Intentional Quality',
        description: 'We maintain details, documentation, and consistency so that the final result feels neat from the first day of launch.'
      },
      {
        icon: '🤝',
        title: 'Honest Trust',
        description: 'We prefer clear and realistic communication over promises that sound big but cannot be verified.'
      },
      {
        icon: '💡',
        title: 'Directed Exploration',
        description: 'We use new technology when it truly helps businesses move faster and more efficiently.'
      },
      {
        icon: '👥',
        title: 'Open Collaboration',
        description: 'We work as discussion partners, not just vendors, so important decisions have the right context.'
      }
    ]
  },
  cta: {
    title: 'Ready to Work with Esperion?',
    description: 'Let\'s discuss your business priorities and determine the most relevant digital steps.',
    button: 'Contact Us'
  },
  seo: {
    title: 'About Esperion Digital Agency Jakarta - Best Digital Solutions',
    description: 'Get to know Esperion Digital Agency in Jakarta. Expert team in web development, mobile applications, digital marketing, and comprehensive digital services for your business in Indonesia.',
    ogTitle: 'About Esperion - Digital Agency Jakarta',
    ogDescription: 'Esperion is the most innovative digital agency in Jakarta, providing solutions for your business growth.',
    schemaName: 'About Esperion Digital Agency',
    schemaDescription: 'Company profile and team page building digital services in Jakarta'
  }
}
var seo = {
  home: {
    title: 'Best Digital Marketing Services in Jakarta - Esperion',
    description: 'Discover the most comprehensive digital services from Esperion Agency.',
    ogTitle: 'Digital Agency Jakarta - Esperion',
    ogDescription: 'Professional digital marketing, web development and mobile app services in Jakarta.'
  },
  services: {
    title: 'Best Digital Marketing Services - Esperion Agency',
    description: 'Professional digital marketing, web development, SEO, and UI/UX design services.',
    ogTitle: 'Digital Agency Services Jakarta - Esperion',
    ogDescription: 'Professional digital marketing, web development and mobile app services.'
  },
  works: {
    title: 'Portfolio - Selected Projects from Esperion',
    description: 'Explore Esperion\'s digital project portfolio, from websites and mobile apps to more focused product experiences.',
    ogTitle: 'Esperion Portfolio',
    ogDescription: 'View selected digital projects from Esperion.'
  },
  articles: {
    title: 'Articles - Digital Insights from Esperion',
    description: 'Read articles, insights, and learnings about web development, design, and digital marketing.',
    ogTitle: 'Esperion Articles',
    ogDescription: 'Insights and updates from the Esperion team.'
  },
  contact: {
    title: 'Contact Us - Esperion Digital Agency Jakarta',
    description: 'Contact Esperion Digital Agency in Jakarta. We\'re ready to help with your business digital transformation. FREE consultation!',
    ogTitle: 'Contact Esperion - Digital Agency Jakarta',
    ogDescription: 'Contact us for FREE consultation about your digital project.',
    twitterTitle: 'Contact Esperion - Digital Agency Jakarta',
    schemaName: 'Contact Us - Esperion Digital Agency',
    schemaDescription: 'Contact page for Esperion Digital Agency in Jakarta'
  }
}
var dashboard = {
  index: {
    title: 'Dashboard Overview',
    description: 'Focus on retained agency operations while the wider platform backlog stays split into dedicated changes.',
    cards: {
      articles: {
        title: 'Articles',
        description: 'Translation, editorial review, and publishing remain active archive blockers.',
        cta: 'Open articles'
      },
      works: {
        title: 'Works',
        description: 'Portfolio entries should load from the retained backend API rather than placeholder cards.',
        cta: 'Open works'
      },
      clients: {
        title: 'Clients',
        description: 'Client showcase administration stays inside this change and needs real data-backed management.',
        cta: 'Open clients'
      },
      contact: {
        title: 'Contact',
        description: 'Inquiry handling and retained admin review should reflect the real submissions API.',
        cta: 'Open contact'
      }
    },
    focus: {
      authTitle: 'Auth truthfulness',
      authDetail: 'Login, registration, logout, and route protection should reflect the real auth store and API contract.',
      translationTitle: 'Translation workflow',
      translationDetail: 'Article translation remains the most cross-cutting retained feature because it touches API, editor, and locale behavior.',
      archiveTitle: 'Archive readiness',
      archiveDetail: 'This overview intentionally avoids analytics-style charts so the dashboard no longer overclaims split-out capabilities.'
    },
    shortcuts: {
      articles: 'Articles',
      works: 'Works',
      services: 'Services',
      clients: 'Clients',
      contact: 'Contact',
      sessions: 'Sessions'
    },
    status: {
      needsWiring: 'Needs wiring',
      stubCleanup: 'Stub cleanup',
      needsVerification: 'Needs verification'
    }
  },
  articles: {
    title: 'Articles',
    description: 'Manage retained editorial content and translation readiness.',
    newButton: 'New Article',
    search: {
      placeholder: 'Search by title or slug...'
    },
    filters: {
      allCategories: 'All Categories',
      allTranslationStatus: 'All Translation Status'
    },
    columns: {
      title: 'Title',
      category: 'Category',
      translation: 'Translation',
      publish: 'Publish',
      actions: 'Actions'
    },
    placeholders: {
      loading: 'Loading articles...',
      error: 'Failed to load articles',
      noResults: 'No articles match the current filters.'
    },
    status: {
      draft: 'Draft',
      id_only: 'ID only',
      en_only: 'EN only',
      complete: 'Complete'
    },
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      deleteConfirm: 'Delete this article?'
    },
    seo: {
      title: 'Articles - Dashboard',
      description: 'Manage retained article workflows.'
    }
  },
  articles_edit: {
    title: 'Edit Article',
    description: 'Manage article content, translation draft, and status.',
    back: 'Back',
    saveButton: 'Save Article',
    saveInProgress: 'Saving...',
    loading: 'Loading article...',
    content: {
      indonesian: 'Indonesian Content',
      indonesianPrimary: 'Primary source',
      english: 'English Translation',
      englishDescription: 'Use Alibaba translation for draft generation, then review manually.',
      translateButton: 'Translate to English',
      translating: 'Translating...',
      reviewButton: 'Approve Translation Draft',
      reviewing: 'Reviewing...'
    },
    publishing: {
      title: 'Publishing',
      category: 'Category',
      published: 'Published'
    },
    translationStatus: {
      title: 'Translation Status',
      current: 'Current status:',
      available: 'Available languages:',
      save: 'Save Translation Status',
      saveInProgress: 'Saving...'
    },
    seo: {
      title: 'Edit Article - Dashboard',
      description: 'Edit retained article content and translation workflow.'
    }
  },
  articles_new: {
    title: 'New Article',
    description: 'Create the Indonesian source article first, then continue translation review from the edit page.',
    cancel: 'Cancel',
    createButton: 'Create Article',
    saveInProgress: 'Saving...',
    content: {
      indonesian: 'Indonesian Content',
      placeholder: 'Write the Indonesian source content here...'
    },
    excerpt: {
      title: 'Excerpt',
      placeholder: 'Short Indonesian summary for the article'
    },
    publishing: {
      title: 'Publishing',
      category: 'Category',
      publishImmediately: 'Publish immediately'
    },
    translationWorkflow: {
      title: 'Translation Workflow',
      description: 'After creating the Indonesian article, continue in the edit page to generate and review the English draft.'
    },
    seo: {
      title: 'New Article - Dashboard',
      description: 'Create a retained article.'
    }
  },
  works: {
    title: 'Works',
    description: 'Manage your portfolio projects',
    newButton: 'New Work',
    loading: 'Loading works...',
    noResults: 'No works found.',
    featuredBadge: 'Featured',
    image: {
      label: 'Image',
      noImage: 'No Image'
    },
    buttons: {
      delete: 'Delete',
      deleteConfirm: 'Delete this work?'
    },
    seo: {
      title: 'Works - Dashboard',
      description: 'Manage your portfolio.'
    }
  },
  works_new: {
    title: 'New Work',
    description: 'Add a new portfolio project',
    cancel: 'Cancel',
    publishButton: 'Publish Work',
    saveInProgress: 'Saving...',
    metrics: {
      title: 'Metrics',
      add: '+ Add Metric',
      labelPlaceholder: 'Label (e.g., Conversion)',
      valuePlaceholder: 'Value (e.g., 45)',
      suffixPlaceholder: 'Suffix (e.g., %)'
    },
    details: {
      title: 'Project Details',
      client: {
        label: 'Client',
        placeholder: 'Client name'
      },
      service: {
        label: 'Service',
        options: {
          webDevelopment: 'Web Development',
          mobileAppDevelopment: 'Mobile App Development',
          uiUxDesign: 'UI/UX Design',
          digitalMarketing: 'Digital Marketing',
          ecommerceSolutions: 'E-Commerce Solutions',
          consulting: 'Consulting'
        }
      },
      platform: {
        label: 'Platform',
        placeholder: 'e.g., Shopify, React Native'
      },
      slug: {
        label: 'Slug',
        placeholder: 'auto-generated-if-empty'
      },
      featured: 'Featured Project'
    },
    image: {
      title: 'Project Image',
      label: 'Image URL',
      placeholder: '/images/portfolio/project.jpg'
    },
    seo: {
      title: 'New Work - Dashboard',
      description: 'Add a new portfolio project.'
    }
  },
  media: {
    title: 'Media Library',
    description: 'Manage your images, videos, and files',
    uploadButton: 'Upload Media',
    search: {
      placeholder: 'Search media...'
    },
    filters: {
      allTypes: 'All Types',
      image: 'Images',
      video: 'Videos',
      document: 'Documents'
    },
    buttons: {
      view: 'View',
      edit: 'Edit',
      delete: 'Delete'
    },
    seo: {
      title: 'Media Library - Dashboard',
      description: 'Manage your media files.'
    }
  },
  services: {
    title: 'Services',
    description: 'Manage your service offerings',
    newButton: 'New Service',
    create: {
      title: 'Create Service',
      update: 'Update Service',
      cancel: 'Cancel',
      submitTitle: 'Title',
      slugTitle: 'Slug',
      orderTitle: 'Display Order',
      descTitle: 'Description',
      iconTitle: 'Icon',
      featured: 'Featured service',
      saveButton: 'Save Changes',
      createButton: 'Create Service',
      saveInProgress: 'Saving...',
      loading: 'Loading services...'
    },
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      featured: 'Featured',
      noIcon: 'No icon'
    },
    noResults: 'No services found.',
    seo: {
      title: 'Services - Dashboard',
      description: 'Manage services.'
    }
  },
  clients: {
    title: 'Clients',
    description: 'Manage your client relationships',
    newButton: 'New Client',
    create: {
      title: 'Create Client',
      update: 'Update Client',
      cancel: 'Cancel',
      nameTitle: 'Name',
      logoTitle: 'Logo URL',
      logoPlaceholder: '/images/client-logo.svg',
      categoryTitle: 'Category',
      categoryPlaceholder: 'Technology',
      statusTitle: 'Status',
      statusOptions: {
        active: 'Active',
        prospect: 'Prospect',
        inactive: 'Inactive'
      },
      testimonialTitle: 'Testimonial',
      internalNotesTitle: 'Internal Notes',
      featured: 'Featured client',
      saveButton: 'Save Changes',
      createButton: 'Create Client',
      saveInProgress: 'Saving...',
      loading: 'Loading clients...'
    },
    table: {
      client: 'Client',
      category: 'Category',
      status: 'Status',
      testimonial: 'Testimonial',
      actions: 'Actions',
      noResults: 'No clients found.'
    },
    buttons: {
      edit: 'Edit',
      delete: 'Delete'
    },
    status: {
      active: 'Active',
      prospect: 'Prospect',
      inactive: 'Inactive',
      logo: 'Logo',
      n_a: 'N/A'
    },
    testimonialStatus: {
      available: 'Available',
      none: '-'
    },
    seo: {
      title: 'Clients - Dashboard',
      description: 'Manage clients.'
    }
  },
  contact: {
    title: 'Contact Submissions',
    description: 'Manage inquiries from your website',
    export: {
      button: '📥 Export CSV'
    },
    stats: {
      total: 'Total',
      new: 'New',
      qualified: 'Qualified'
    },
    filters: {
      service: 'Filter by service',
      status: 'Filter by status',
      allStatuses: 'All Statuses',
      statusOptions: {
        new: 'New',
        contacted: 'Contacted',
        qualified: 'Qualified',
        converted: 'Converted',
        lost: 'Lost'
      },
      refresh: 'Refresh'
    },
    table: {
      name: 'Name',
      email: 'Email',
      service: 'Service',
      date: 'Date',
      status: 'Status',
      actions: 'Actions',
      noResults: 'No contact submissions found.'
    },
    loading: 'Loading contact submissions...',
    buttons: {
      edit: 'Edit',
      delete: 'Delete'
    },
    status: {
      new: 'New',
      contacted: 'Contacted',
      qualified: 'Qualified',
      converted: 'Converted',
      lost: 'Lost'
    },
    seo: {
      title: 'Contact - Dashboard',
      description: 'Manage contact submissions.'
    }
  },
  users: {
    title: 'Users',
    description: 'Manage dashboard users and fixed role assignments.',
    newButton: 'New User',
    create: {
      title: 'Create User',
      update: 'Update User',
      cancel: 'Cancel',
      fullNameTitle: 'Full Name',
      usernameTitle: 'Username',
      emailTitle: 'Email',
      phoneTitle: 'Phone',
      roleTitle: 'Role',
      roleOptions: {
        admin: 'Admin',
        editor: 'Editor',
        viewer: 'Viewer'
      },
      passwordTitle: 'Initial Password',
      saveButton: 'Save Changes',
      createButton: 'Create User',
      saveInProgress: 'Saving...',
      loading: 'Loading users...',
      denied: 'Only administrators can access user management.'
    },
    table: {
      user: 'User',
      role: 'Role',
      phone: 'Phone',
      joined: 'Joined',
      actions: 'Actions',
      noResults: 'No users found.'
    },
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      deleteConfirm: 'Delete {name}? This uses hard delete.'
    },
    status: {
      active: 'Active',
      prospect: 'Prospect',
      inactive: 'Inactive'
    },
    notifications: {
      userUpdated: {
        title: 'User updated',
        message: 'User details were updated successfully.'
      },
      userCreated: {
        title: 'User created',
        message: 'The new dashboard user was created successfully.'
      },
      userDeleted: {
        title: 'User deleted',
        message: '{name} was deleted successfully.'
      },
      error: {
        title: 'User management error',
        message: 'Failed to save user'
      },
      deleteFailed: {
        title: 'Delete failed',
        message: 'Failed to delete user'
      }
    },
    seo: {
      title: 'Users - Dashboard',
      description: 'Manage dashboard users.'
    }
  },
  sessions: {
    title: 'Sessions',
    description: 'Review active sessions and revoke devices you no longer trust.',
    refresh: {
      button: 'Refresh sessions',
      inProgress: 'Refreshing...',
      loading: 'Loading sessions...'
    },
    noResults: 'No active sessions were returned by the API.',
    columns: {
      device: 'Device',
      deviceId: 'Device ID',
      status: 'Status',
      ipAddress: 'IP Address',
      created: 'Created',
      expires: 'Expires',
      currentSession: 'Current session cannot be revoked here',
      forceLogout: 'Force logout session'
    },
    status: {
      current: 'Current',
      active: 'Active',
      activeSession: 'Active Session'
    },
    notifications: {
      sessionRevoked: {
        title: 'Session revoked',
        message: 'Session was revoked successfully.'
      },
      error: {
        title: 'Failed to revoke',
        message: 'Failed to revoke session'
      }
    },
    seo: {
      title: 'Sessions - Dashboard',
      description: 'Review and revoke active account sessions.'
    }
  },
  settings: {
    title: 'Settings',
    analytics: {
      title: 'Analytics & Pixels',
      openAnalytics: 'Open analytics dashboard',
      ga4Id: 'GA4 Measurement ID',
      ga4Placeholder: 'G-XXXXXXXXXX',
      gtmId: 'GTM Container ID',
      gtmPlaceholder: 'GTM-XXXXXXX',
      clarityId: 'Clarity Project ID',
      clarityPlaceholder: 'clarity-project-id',
      metaPixelId: 'Meta Pixel ID',
      metaPixelPlaceholder: '1234567890',
      tiktokPixelId: 'TikTok Pixel ID',
      tiktokPlaceholder: 'tiktok-pixel-id',
      linkedinPartnerId: 'LinkedIn Partner ID',
      linkedinPlaceholder: 'linkedin-partner-id',
      enableTracking: 'Enable frontend tracking'
    },
    funnels: {
      title: 'Funnels',
      add: '+ Add Funnel',
      idPlaceholder: 'funnel-id',
      namePlaceholder: 'Funnel name',
      active: 'Active',
      descriptionPlaceholder: 'Optional description',
      steps: {
        title: 'Steps',
        add: '+ Add Step',
        remove: 'Remove',
        namePlaceholder: 'Step name',
        eventNamePlaceholder: 'Event name',
        pathPlaceholder: 'Optional path filter',
        orderLabel: 'Order'
      },
      removeFunnel: 'Remove Funnel'
    },
    analyticsSaveButton: 'Save Analytics Settings',
    backup: {
      title: 'Backup & Restore',
      refreshButton: 'Refresh Backup History',
      schedule: {
        enabled: 'Enable schedule',
        cronTitle: 'Schedule (cron)',
        retentionTitle: 'Retention count',
        filesDirTitle: 'Files directory'
      },
      encryption: {
        enabled: 'Enable encryption'
      },
      savePolicyButton: 'Save Backup Policy',
      runNowButton: 'Run Backup Now',
      history: {
        title: 'Backup History',
        scopesLabel: 'scopes:',
        createdLabel: 'created',
        restoreScope: {
          label: 'Scope',
          options: {
            database: 'database',
            files: 'files',
            all: 'all'
          }
        },
        restoreButton: 'Restore',
        restoreInProgress: 'Restoring...',
        noHistory: 'No backup history yet.'
      }
    },
    monitoring: {
      title: 'Monitoring & Alerting',
      refreshButton: 'Refresh Status',
      integrations: {
        title: 'Integrations',
        uptime: {
          providerLabel: 'Provider',
          enabled: 'Enabled'
        },
        errors: {
          providerLabel: 'Provider',
          enabled: 'Enabled'
        },
        performance: {
          providerLabel: 'Provider',
          enabled: 'Enabled'
        }
      },
      services: {
        title: 'Monitored Services',
        add: '+ Add Service',
        idPlaceholder: 'service-id',
        namePlaceholder: 'Display name',
        urlPlaceholder: 'https://service/health',
        enabled: 'Enabled',
        remove: 'Remove'
      },
      thresholds: {
        title: 'Thresholds',
        add: '+ Add Threshold',
        idPlaceholder: 'threshold-id',
        servicePlaceholder: 'service-id',
        signalType: {
          label: 'Signal Type',
          options: {
            uptime: 'uptime',
            error_rate: 'error_rate',
            latency_ms: 'latency_ms'
          }
        },
        operator: {
          label: 'Operator',
          options: {
            gt: 'gt',
            gte: 'gte',
            lt: 'lt',
            lte: 'lte',
            eq: 'eq',
            ne: 'ne'
          }
        },
        valueLabel: 'Threshold value',
        severityLabel: 'Severity',
        severityOptions: {
          info: 'info',
          warning: 'warning',
          critical: 'critical'
        },
        cooldownLabel: 'Cooldown (minutes)',
        enabled: 'on',
        remove: 'Remove'
      },
      destinations: {
        title: 'Alert Destinations',
        add: '+ Add Destination',
        idPlaceholder: 'destination-id',
        namePlaceholder: 'Name',
        channel: {
          label: 'Channel',
          options: {
            email: 'email',
            webhook: 'webhook'
          }
        },
        targetPlaceholderEmail: '{\'ops@example.com\'}',
        targetPlaceholderWebhook: 'https://hooks.example.com',
        enabled: 'on',
        remove: 'Remove'
      },
      currentStatus: {
        title: 'Current Status',
        overall: 'Overall:'
      },
      servicesTable: {
        name: 'Name',
        url: 'URL',
        status: 'status:',
        latency: 'latency'
      },
      alerts: {
        title: 'Recent Alerts',
        refreshButton: 'Refresh Alerts',
        serviceLabel: 'service',
        signalLabel: 'signal',
        severityLabel: 'severity',
        firedAtLabel: 'fired',
        noAlerts: 'No alerts yet.'
      },
      test: {
        title: 'Test Alert',
        messagePlaceholder: 'Optional test alert message',
        sendButton: 'Send Test Alert',
        sending: 'Sending...'
      },
      saveButton: 'Save Monitoring Changes',
      SavingInProgress: 'Saving...',
      refreshingStatus: 'Refreshing status...',
      refreshingAlerts: 'Refreshing alerts...',
      testSent: 'Test alert sent. Delivered: {delivered}, Failed: {failed}',
      failedToSendTest: 'Failed to send test alert'
    },
    analyticsSaveSuccess: 'Analytics settings saved',
    backupSaveSuccess: 'Backup policy saved',
    backupRunning: 'Running backup...',
    backupCompleted: 'Backup completed: {id}',
    backupFailed: 'Failed to run backup',
    restoringBackup: 'Restoring backup...',
    backupRestored: 'Backup restored successfully',
    backupRestoreFailed: 'Failed to restore backup',
    monitoringSaved: 'Monitoring settings saved',
    monitoringSaveFailed: 'Failed to save monitoring settings'
  },
  analytics: {
    title: 'Analytics Dashboard',
    description: 'Real event and funnel reporting from backend analytics endpoints.',
    refresh: {
      button: 'Refresh Report',
      inProgress: 'Refreshing...'
    },
    overview: {
      totalEvents: 'Total events',
      totalSessions: 'Total sessions',
      pageViews: 'Page views',
      conversionEvents: 'Conversion events'
    },
    funnels: {
      title: 'Funnels',
      noActive: 'No active funnels. Configure funnels in dashboard settings.',
      step: 'step',
      eventLabel: 'event'
    },
    empty: 'No analytics data.'
  },
  apiDocs: {
    title: 'Esperion API Documentation',
    description: 'Browse the Esperion backend OpenAPI reference from the dashboard.',
    loading: 'Loading API documentation...',
    errorTitle: 'API documentation unavailable',
    errorMessage: 'The backend OpenAPI specification is currently unavailable. Please ensure the backend server is running.',
    backendUrl: 'Backend URL',
    retry: 'Retry',
    openDirect: 'Open OpenAPI Directly'
  }
}
var error = {
  backToHome: 'Back to Home',
  backToArticles: 'Back to Articles',
  backToServices: 'Back to Services'
}
const locale_en_46json_a24018ab = {
  nav: nav,
  language: language,
  common: common,
  home: home,
  services: services,
  articles: articles,
  works: works,
  contact: contact,
  footer: footer,
  social: social,
  aria: aria,
  offline: offline,
  auth: auth,
  breadcrumb: breadcrumb,
  about: about,
  seo: seo,
  dashboard: dashboard,
  error: error
}

// @ts-nocheck
const localeCodes = [
  'id',
  'en'
]
const localeLoaders = {
  id: [
    {
      key: 'locale_id_46json_38644f3f',
      load: () => Promise.resolve(locale_id_46json_38644f3f),
      cache: true
    }
  ],
  en: [
    {
      key: 'locale_en_46json_a24018ab',
      load: () => Promise.resolve(locale_en_46json_a24018ab),
      cache: true
    }
  ]
}
const vueI18nConfigs = []
const normalizedLocales = [
  {
    code: 'id',
    iso: 'id-ID',
    name: 'Bahasa Indonesia',
    language: 'id-ID'
  },
  {
    code: 'en',
    iso: 'en-US',
    name: 'English',
    language: 'en-US'
  }
]

const setupVueI18nOptions = async (defaultLocale) => {
  const options = await loadVueI18nOptions(vueI18nConfigs)
  options.locale = defaultLocale || options.locale || 'en-US'
  options.defaultLocale = defaultLocale
  options.fallbackLocale ??= false
  options.messages ??= {}
  for (const locale of localeCodes) {
    options.messages[locale] ??= {}
  }
  return options
}

function useRuntimeI18n(nuxtApp, event) {
  {
    return useRuntimeConfig(event).public.i18n
  }
}
function useI18nDetection(nuxtApp) {
  const detectBrowserLanguage = useRuntimeI18n().detectBrowserLanguage
  const detect = detectBrowserLanguage || {}
  return {
    ...detect,
    enabled: !!detectBrowserLanguage,
    cookieKey: detect.cookieKey || 'i18n_redirected'
  }
}
function resolveRootRedirect(config) {
  if (!config) {
    return void 0
  }
  return {
    path: '/' + (isString(config) ? config : config.path).replace(/^\//, ''),
    code: !isString(config) && config.statusCode || 302
  }
}
function toArray(value) {
  return Array.isArray(value) ? value : [value]
}

function createLocaleConfigs(fallbackLocale) {
  const localeConfigs = {}
  for (const locale of localeCodes) {
    const fallbacks = getFallbackLocaleCodes(fallbackLocale, [locale])
    const cacheable = isLocaleWithFallbacksCacheable(locale, fallbacks)
    localeConfigs[locale] = { fallbacks, cacheable }
  }
  return localeConfigs
}
function getFallbackLocaleCodes(fallback, locales) {
  if (fallback === false) {
    return []
  }
  if (isArray(fallback)) {
    return fallback
  }
  let fallbackLocales = []
  if (isString(fallback)) {
    if (locales.every(locale => locale !== fallback)) {
      fallbackLocales.push(fallback)
    }
    return fallbackLocales
  }
  const targets = [...locales, 'default']
  for (const locale of targets) {
    if (locale in fallback == false) {
      continue
    }
    fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)]
  }
  return fallbackLocales
}
function isLocaleCacheable(locale) {
  return localeLoaders[locale] != null && localeLoaders[locale].every(loader => loader.cache !== false)
}
function isLocaleWithFallbacksCacheable(locale, fallbackLocales) {
  return isLocaleCacheable(locale) && fallbackLocales.every(fallbackLocale => isLocaleCacheable(fallbackLocale))
}
function getDefaultLocaleForDomain(host) {
  return normalizedLocales.find(l => !!l.defaultForDomains?.includes(host))?.code
}
const isSupportedLocale = locale => localeCodes.includes(locale || '')

function useI18nContext(event) {
  if (event.context.nuxtI18n == null) {
    throw new Error('Nuxt I18n server context has not been set up yet.')
  }
  return event.context.nuxtI18n
}
function tryUseI18nContext(event) {
  return event.context.nuxtI18n
}
const getHost = event => getRequestURL(event, { xForwardedHost: true }).host
async function initializeI18nContext(event) {
  const runtimeI18n = useRuntimeI18n(void 0, event)
  const defaultLocale = runtimeI18n.defaultLocale || ''
  const options = await setupVueI18nOptions(getDefaultLocaleForDomain(getHost(event)) || defaultLocale)
  const localeConfigs = createLocaleConfigs(options.fallbackLocale)
  const ctx = createI18nContext()
  ctx.vueI18nOptions = options
  ctx.localeConfigs = localeConfigs
  event.context.nuxtI18n = ctx
  return ctx
}
function createI18nContext() {
  return {
    messages: {},
    slp: {},
    localeConfigs: {},
    trackMap: {},
    vueI18nOptions: void 0,
    trackKey(key, locale) {
      this.trackMap[locale] ??= /* @__PURE__ */ new Set()
      this.trackMap[locale].add(key)
    }
  }
}

function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = []
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find(l => l.language?.toLowerCase() === browserCode.toLowerCase())
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length })
      break
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split('-')[0].toLowerCase()
    const matchedLocale = locales.find(l => l.language?.split('-')[0].toLowerCase() === languageCode)
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length })
      break
    }
  }
  return matchedLocales
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length
  }
  return b.score - a.score
}
function findBrowserLocale(locales, browserLocales) {
  const matchedLocales = matchBrowserLocale(
    locales.map(l => ({ code: l.code, language: l.language || l.code })),
    browserLocales
  )
  return matchedLocales.sort(compareBrowserLocale).at(0)?.code ?? ''
}

const appHead = { meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { name: 'description', content: 'Esperion Digital Agency - Data-Driven Digital Strategies' }, { name: 'color-scheme', content: 'light dark' }, { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#FAFCFF' }, { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0B1120' }], link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }], style: [], script: [], noscript: [], title: 'Esperion - Digital Agency' }

const appRootTag = 'div'

const appRootAttrs = { id: '__nuxt', class: 'isolate' }

const appTeleportTag = 'div'

const appTeleportAttrs = { id: 'teleports' }

const appSpaLoaderTag = 'div'

const appSpaLoaderAttrs = { id: '__nuxt-loader' }

const appId = 'nuxt-app'

const separator = '___'
const pathLanguageParser = createPathIndexLanguageParser(0)
const getLocaleFromRoutePath = path => pathLanguageParser(path)
const getLocaleFromRouteName = name => name.split(separator).at(1) ?? ''
function normalizeInput(input) {
  return typeof input !== 'object' ? String(input) : String(input?.name || input?.path || '')
}
function getLocaleFromRoute(route) {
  const input = normalizeInput(route)
  return input[0] === '/' ? getLocaleFromRoutePath(input) : getLocaleFromRouteName(input)
}

function matchDomainLocale(locales, host, pathLocale) {
  const normalizeDomain = (domain = '') => domain.replace(/https?:\/\//, '')
  const matches = locales.filter(
    locale => normalizeDomain(locale.domain) === host || toArray(locale.domains).includes(host)
  )
  if (matches.length <= 1) {
    return matches[0]?.code
  }
  return (
    // match by current path locale
    matches.find(l => l.code === pathLocale)?.code || matches.find(l => l.defaultForDomains?.includes(host) ?? l.domainDefault)?.code
  )
}

const getCookieLocale = (event, cookieName) => (getCookie(event, cookieName)) || void 0
const getRouteLocale = (event, route) => getLocaleFromRoute(route)
const getHeaderLocale = event => findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, 'accept-language') || ''))
const getHostLocale = (event, path, domainLocales) => {
  const host = getRequestURL(event, { xForwardedHost: true }).host
  const locales = normalizedLocales.map(l => ({
    ...l,
    domain: domainLocales[l.code]?.domain ?? l.domain
  }))
  return matchDomainLocale(locales, host, getLocaleFromRoutePath(path))
}
const useDetectors = (event, config, nuxtApp) => {
  if (!event) {
    throw new Error('H3Event is required for server-side locale detection')
  }
  const runtimeI18n = useRuntimeI18n()
  return {
    cookie: () => getCookieLocale(event, config.cookieKey),
    header: () => getHeaderLocale(event),
    navigator: () => void 0,
    host: path => getHostLocale(event, path, runtimeI18n.domainLocales),
    route: path => getRouteLocale(event, path)
  }
}

// Generated by @nuxtjs/i18n
const pathToI18nConfig = {
  '/dashboard/analytics': {
    id: '/dashboard/analytics',
    en: '/dashboard/analytics'
  },
  '/dashboard/api-docs': {
    id: '/dashboard/api-docs',
    en: '/dashboard/api-docs'
  },
  '/dashboard/articles': {
    id: '/dashboard/articles',
    en: '/dashboard/articles'
  },
  '/dashboard/articles/new': {
    id: '/dashboard/articles/new',
    en: '/dashboard/articles/new'
  },
  '/dashboard/articles/:id()': {
    id: '/dashboard/articles/:id()',
    en: '/dashboard/articles/:id()'
  },
  '/dashboard/clients': {
    id: '/dashboard/clients',
    en: '/dashboard/clients'
  },
  '/dashboard/contact': {
    id: '/dashboard/contact',
    en: '/dashboard/contact'
  },
  '/dashboard/media': {
    id: '/dashboard/media',
    en: '/dashboard/media'
  },
  '/dashboard/services': {
    id: '/dashboard/services',
    en: '/dashboard/services'
  },
  '/dashboard/sessions': {
    id: '/dashboard/sessions',
    en: '/dashboard/sessions'
  },
  '/dashboard/settings': {
    id: '/dashboard/settings',
    en: '/dashboard/settings'
  },
  '/dashboard/users': {
    id: '/dashboard/users',
    en: '/dashboard/users'
  },
  '/dashboard/works': {
    id: '/dashboard/works',
    en: '/dashboard/works'
  },
  '/dashboard/works/new': {
    id: '/dashboard/works/new',
    en: '/dashboard/works/new'
  },
  '/articles/:slug()': {
    id: '/articles/:slug()',
    en: '/articles/:slug()'
  },
  '/our-services/:slug()': {
    id: '/our-services/:slug()',
    en: '/our-services/:slug()'
  },
  '/our-works/:slug()': {
    id: '/our-works/:slug()',
    en: '/our-works/:slug()'
  },
  '/about': {
    id: '/about',
    en: '/about'
  },
  '/articles': {
    id: '/articles',
    en: '/articles'
  },
  '/contact-us': {
    id: '/contact-us',
    en: '/contact-us'
  },
  '/dashboard': {
    id: '/dashboard',
    en: '/dashboard'
  },
  '/login': {
    id: '/login',
    en: '/login'
  },
  '/offline': {
    id: '/offline',
    en: '/offline'
  },
  '/our-services': {
    id: '/our-services',
    en: '/our-services'
  },
  '/our-works': {
    id: '/our-works',
    en: '/our-works'
  },
  '/privacy-policy': {
    id: '/privacy-policy',
    en: '/privacy-policy'
  },
  '/register': {
    id: '/register',
    en: '/register'
  },
  '/terms-of-service': {
    id: '/terms-of-service',
    en: '/terms-of-service'
  },
  '/:all(.*)*': {
    id: '/:all(.*)*',
    en: '/:all(.*)*'
  },
  '/': {
    id: '/',
    en: '/'
  },
  '/ndefined': {
    id: '/ndefined',
    en: '/ndefined'
  }
}
const i18nPathToPath = {
  '/dashboard/analytics': '/dashboard/analytics',
  '/dashboard/api-docs': '/dashboard/api-docs',
  '/dashboard/articles': '/dashboard/articles',
  '/dashboard/articles/new': '/dashboard/articles/new',
  '/dashboard/articles/:id()': '/dashboard/articles/:id()',
  '/dashboard/clients': '/dashboard/clients',
  '/dashboard/contact': '/dashboard/contact',
  '/dashboard/media': '/dashboard/media',
  '/dashboard/services': '/dashboard/services',
  '/dashboard/sessions': '/dashboard/sessions',
  '/dashboard/settings': '/dashboard/settings',
  '/dashboard/users': '/dashboard/users',
  '/dashboard/works': '/dashboard/works',
  '/dashboard/works/new': '/dashboard/works/new',
  '/articles/:slug()': '/articles/:slug()',
  '/our-services/:slug()': '/our-services/:slug()',
  '/our-works/:slug()': '/our-works/:slug()',
  '/about': '/about',
  '/articles': '/articles',
  '/contact-us': '/contact-us',
  '/dashboard': '/dashboard',
  '/login': '/login',
  '/offline': '/offline',
  '/our-services': '/our-services',
  '/our-works': '/our-works',
  '/privacy-policy': '/privacy-policy',
  '/register': '/register',
  '/terms-of-service': '/terms-of-service',
  '/:all(.*)*': '/:all(.*)*',
  '/': '/',
  '/ndefined': '/ndefined'
}

const matcher = createRouterMatcher([], {})
for (const path of Object.keys(i18nPathToPath)) {
  matcher.addRoute({ path, component: () => '', meta: {} })
}
const getI18nPathToI18nPath = (path, locale) => {
  if (!path || !locale) {
    return
  }
  const plainPath = i18nPathToPath[path]
  const i18nConfig = pathToI18nConfig[plainPath]
  if (i18nConfig && i18nConfig[locale]) {
    return i18nConfig[locale] === true ? plainPath : i18nConfig[locale]
  }
}
function isExistingNuxtRoute(path) {
  if (path === '') {
    return
  }
  if (path.endsWith('/__nuxt_error')) {
    return
  }
  const resolvedMatch = matcher.resolve({ path }, { path: '/', name: '', matched: [], params: {}, meta: {} })
  return resolvedMatch.matched.length > 0 ? resolvedMatch : void 0
}
function matchLocalized(path, locale, defaultLocale) {
  if (path === '') {
    return
  }
  const parsed = parsePath(path)
  const resolvedMatch = matcher.resolve(
    { path: parsed.pathname || '/' },
    { path: '/', name: '', matched: [], params: {}, meta: {} }
  )
  if (resolvedMatch.matched.length > 0) {
    const alternate = getI18nPathToI18nPath(resolvedMatch.matched[0].path, locale)
    const match = matcher.resolve(
      { params: resolvedMatch.params },
      { path: alternate || '/', name: '', matched: [], params: {}, meta: {} }
    )
    return withLeadingSlash(joinURL(locale, match.path))
  }
}

function* detect(detectors, detection, path) {
  if (detection.enabled) {
    yield { locale: detectors.cookie(), source: 'cookie' }
    yield { locale: detectors.header(), source: 'header' }
  }
  {
    yield { locale: detectors.route(path), source: 'route' }
  }
  yield { locale: detection.fallbackLocale, source: 'fallback' }
}
function createRedirectResponse(event, dest, code) {
  event.node.res.setHeader('location', dest)
  event.node.res.statusCode = sanitizeStatusCode(code, event.node.res.statusCode)
  return {
    headers: event.node.res.getHeaders(),
    statusCode: event.node.res.statusCode,
    body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${dest.replace(/"/g, '%22')}"></head></html>`
  }
}
const _rkraQFkSKO0TlFRYL5pbCVpN3kvA3BySZDFsRrleg = defineNitroPlugin$1(async (nitro) => {
  const runtimeI18n = useRuntimeI18n()
  const rootRedirect = resolveRootRedirect(runtimeI18n.rootRedirect)
  runtimeI18n.defaultLocale || ''
  try {
    const cacheStorage = useStorage('cache')
    const cachedKeys = await cacheStorage.getKeys('nitro:handlers:i18n')
    await Promise.all(cachedKeys.map(key => cacheStorage.removeItem(key)))
  } catch {
  }
  const detection = useI18nDetection()
  const cookieOptions = {
    path: '/',
    domain: detection.cookieDomain || void 0,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: detection.cookieSecure
  }
  const createBaseUrlGetter = () => {
    isFunction(runtimeI18n.baseUrl) ? '' : runtimeI18n.baseUrl || ''
    if (isFunction(runtimeI18n.baseUrl)) {
      return () => ''
    }
    return (event, defaultLocale) => {
      return ''
    }
  }
  function resolveRedirectPath(event, path, pathLocale, defaultLocale, detector) {
    let locale = ''
    for (const detected of detect(detector, detection, event.path)) {
      if (detected.locale && isSupportedLocale(detected.locale)) {
        locale = detected.locale
        break
      }
    }
    locale ||= defaultLocale
    function getLocalizedMatch(locale2) {
      const res = matchLocalized(path || '/', locale2)
      if (res && res !== event.path) {
        return res
      }
    }
    let resolvedPath = void 0
    let redirectCode = 302
    const requestURL = getRequestURL(event)
    if (rootRedirect && requestURL.pathname === '/') {
      locale = detection.enabled && locale || defaultLocale
      resolvedPath = isSupportedLocale(detector.route(rootRedirect.path)) && rootRedirect.path || matchLocalized(rootRedirect.path, locale)
      redirectCode = rootRedirect.code
    } else if (runtimeI18n.redirectStatusCode) {
      redirectCode = runtimeI18n.redirectStatusCode
    }
    switch (detection.redirectOn) {
      case 'root':
        if (requestURL.pathname !== '/') {
          break
        }
      // fallthrough (root has no prefix)
      case 'no prefix':
        if (pathLocale) {
          break
        }
      // fallthrough to resolve
      case 'all':
        resolvedPath ??= getLocalizedMatch(locale)
        break
    }
    if (requestURL.pathname === '/' && 'prefix' === 'prefix') {
      resolvedPath ??= getLocalizedMatch(defaultLocale)
    }
    return { path: resolvedPath, code: redirectCode, locale }
  }
  const baseUrlGetter = createBaseUrlGetter()
  nitro.hooks.hook('request', async (event) => {
    await initializeI18nContext(event)
  })
  nitro.hooks.hook('render:before', async (context) => {
    const { event } = context
    const ctx = useI18nContext(event)
    const url = getRequestURL(event)
    const detector = useDetectors(event, detection)
    const localeSegment = detector.route(event.path)
    const pathLocale = isSupportedLocale(localeSegment) && localeSegment || void 0
    const path = (pathLocale && url.pathname.slice(pathLocale.length + 1)) ?? url.pathname
    if (!url.pathname.includes('/_i18n/4zsTHPbr') && !isExistingNuxtRoute(path)) {
      return
    }
    const resolved = resolveRedirectPath(event, path, pathLocale, ctx.vueI18nOptions.defaultLocale, detector)
    if (resolved.path && resolved.path !== url.pathname) {
      ctx.detectLocale = resolved.locale
      detection.useCookie && setCookie(event, detection.cookieKey, resolved.locale, cookieOptions)
      context.response = createRedirectResponse(
        event,
        joinURL(baseUrlGetter(event, ctx.vueI18nOptions.defaultLocale), resolved.path + url.search),
        resolved.code
      )
      return
    }
  })
  nitro.hooks.hook('render:html', (htmlContext, { event }) => {
    tryUseI18nContext(event)
  })
})

const script = '"use strict";(()=>{const t=window,e=document.documentElement,c=["dark","light"],n=getStorageValue("localStorage","nuxt-color-mode")||"system";let i=n==="system"?u():n;const r=e.getAttribute("data-color-mode-forced");r&&(i=r),l(i),t["__NUXT_COLOR_MODE__"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=""+o+"",a="theme";e.classList?e.classList.add(s):e.className+=" "+s,a&&e.setAttribute("data-"+a,o)}function d(o){const s=""+o+"",a="theme";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,"g"),""),a&&e.removeAttribute("data-"+a)}function f(o){return t.matchMedia("(prefers-color-scheme"+o+")")}function u(){if(t.matchMedia&&f("").media!=="not all"){for(const o of c)if(f(":"+o).matches)return o}return"light"}})();function getStorageValue(t,e){switch(t){case"localStorage":return window.localStorage.getItem(e);case"sessionStorage":return window.sessionStorage.getItem(e);case"cookie":return getCookie(e);default:return null}}function getCookie(t){const c=("; "+window.document.cookie).split("; "+t+"=");if(c.length===2)return c.pop()?.split(";").shift()}'

const _ayec7C60IPfv_vxat_9E8osGtCBj6fbOu9Uq97e4v8 = function (nitro) {
  nitro.hooks.hook('render:html', (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`)
  })
}

const nitroAppSecurityOptions = {}
function getAppSecurityOptions() {
  return nitroAppSecurityOptions
}
function resolveSecurityRules(event) {
  if (!event.context.security) {
    event.context.security = {}
  }
  if (!event.context.security.rules) {
    const router = createRouter$1({ routes: structuredClone(nitroAppSecurityOptions) })
    const matcher = toRouteMatcher(router)
    const eventPathNoQuery = event.path.split('?')[0]
    const matches = eventPathNoQuery ? matcher.matchAll(eventPathNoQuery) : []
    const rules = defuReplaceArray$1({}, ...matches.reverse())
    event.context.security.rules = rules
  }
  return event.context.security.rules
}
function resolveSecurityRoute(event) {
  if (!event.context.security) {
    event.context.security = {}
  }
  if (!event.context.security.route) {
    const routeNames = Object.fromEntries(Object.entries(nitroAppSecurityOptions).map(([name]) => [name, { name }]))
    const router = createRouter$1({ routes: routeNames })
    const eventPathNoQuery = event.path.split('?')[0]
    const match = eventPathNoQuery ? router.lookup(eventPathNoQuery) : void 0
    const route = match?.name ?? ''
    event.context.security.route = route
  }
  return event.context.security.route
}

const KEYS_TO_NAMES = {
  contentSecurityPolicy: 'Content-Security-Policy',
  crossOriginEmbedderPolicy: 'Cross-Origin-Embedder-Policy',
  crossOriginOpenerPolicy: 'Cross-Origin-Opener-Policy',
  crossOriginResourcePolicy: 'Cross-Origin-Resource-Policy',
  originAgentCluster: 'Origin-Agent-Cluster',
  referrerPolicy: 'Referrer-Policy',
  strictTransportSecurity: 'Strict-Transport-Security',
  xContentTypeOptions: 'X-Content-Type-Options',
  xDNSPrefetchControl: 'X-DNS-Prefetch-Control',
  xDownloadOptions: 'X-Download-Options',
  xFrameOptions: 'X-Frame-Options',
  xPermittedCrossDomainPolicies: 'X-Permitted-Cross-Domain-Policies',
  xXSSProtection: 'X-XSS-Protection',
  permissionsPolicy: 'Permissions-Policy'
}
const NAMES_TO_KEYS = Object.fromEntries(Object.entries(KEYS_TO_NAMES).map(([key, name]) => [name, key]))
function getNameFromKey(key) {
  return KEYS_TO_NAMES[key]
}
function getKeyFromName(headerName) {
  const [, key] = Object.entries(NAMES_TO_KEYS).find(([name]) => name.toLowerCase() === headerName.toLowerCase()) || []
  return key
}
function headerStringFromObject(optionKey, optionValue) {
  if (optionValue === false) {
    return ''
  }
  if (optionKey === 'contentSecurityPolicy') {
    const policies = optionValue
    return Object.entries(policies).filter(([, value]) => value !== false).map(([directive, sources]) => {
      if (directive === 'upgrade-insecure-requests') {
        return 'upgrade-insecure-requests;'
      } else {
        const stringifiedSources = typeof sources === 'string' ? sources : sources.map(source => source.trim()).join(' ')
        return `${directive} ${stringifiedSources};`
      }
    }).join(' ')
  } else if (optionKey === 'strictTransportSecurity') {
    const policies = optionValue
    return [
      `max-age=${policies.maxAge}`,
      policies.includeSubdomains && 'includeSubDomains',
      policies.preload && 'preload'
    ].filter(Boolean).join('; ')
  } else if (optionKey === 'permissionsPolicy') {
    const policies = optionValue
    return Object.entries(policies).filter(([, value]) => value !== false).map(([directive, sources]) => {
      if (typeof sources === 'string') {
        return `${directive}=${sources}`
      } else {
        return `${directive}=(${sources.join(' ')})`
      }
    }).join(', ')
  } else {
    return optionValue
  }
}
function headerObjectFromString(optionKey, headerValue) {
  if (!headerValue) {
    return false
  }
  if (optionKey === 'contentSecurityPolicy') {
    const directives = headerValue.split(';').map(directive => directive.trim()).filter(directive => directive)
    const objectForm = {}
    for (const directive of directives) {
      const [type, ...sources] = directive.split(' ').map(token => token.trim())
      if (type === 'upgrade-insecure-requests') {
        objectForm[type] = true
      } else {
        objectForm[type] = sources.join(' ')
      }
    }
    return objectForm
  } else if (optionKey === 'strictTransportSecurity') {
    const directives = headerValue.split(';').map(directive => directive.trim()).filter(directive => directive)
    const objectForm = {}
    for (const directive of directives) {
      const [type, value] = directive.split('=').map(token => token.trim())
      if (type === 'max-age') {
        objectForm.maxAge = Number(value)
      } else if (type === 'includeSubdomains' || type === 'preload') {
        objectForm[type] = true
      }
    }
    return objectForm
  } else if (optionKey === 'permissionsPolicy') {
    const directives = headerValue.split(',').map(directive => directive.trim()).filter(directive => directive)
    const objectForm = {}
    for (const directive of directives) {
      const [type, value] = directive.split('=').map(token => token.trim())
      objectForm[type] = value
    }
    return objectForm
  } else {
    return headerValue
  }
}
function standardToSecurity(standardHeaders) {
  if (!standardHeaders) {
    return void 0
  }
  const standardHeadersAsObject = {}
  Object.entries(standardHeaders).forEach(([headerName, headerValue]) => {
    const optionKey = getKeyFromName(headerName)
    if (optionKey) {
      if (typeof headerValue === 'string') {
        const objectValue = headerObjectFromString(optionKey, headerValue)
        standardHeadersAsObject[optionKey] = objectValue
      } else {
        standardHeadersAsObject[optionKey] = headerValue
      }
    }
  })
  if (Object.keys(standardHeadersAsObject).length === 0) {
    return void 0
  }
  return standardHeadersAsObject
}
function backwardsCompatibleSecurity(securityHeaders) {
  if (!securityHeaders) {
    return void 0
  }
  const securityHeadersAsObject = {}
  Object.entries(securityHeaders).forEach(([key, value]) => {
    const optionKey = key
    if ((optionKey === 'contentSecurityPolicy' || optionKey === 'permissionsPolicy' || optionKey === 'strictTransportSecurity') && typeof value === 'string') {
      const objectValue = headerObjectFromString(optionKey, value)
      securityHeadersAsObject[optionKey] = objectValue
    } else if (value === '') {
      securityHeadersAsObject[optionKey] = false
    } else {
      securityHeadersAsObject[optionKey] = value
    }
  })
  return securityHeadersAsObject
}

const _6k80YjlNkKj6LOagxnqGjsFqP6LykM4qV5AMtHdG1k = defineNitroPlugin$1(async (nitroApp) => {
  const appSecurityOptions = getAppSecurityOptions()
  const runtimeConfig = useRuntimeConfig()
  for (const route in runtimeConfig.nitro.routeRules) {
    const rule = runtimeConfig.nitro.routeRules[route]
    if (!rule) continue
    const { headers: headers2 } = rule
    const securityHeaders2 = standardToSecurity(headers2)
    if (securityHeaders2) {
      appSecurityOptions[route] = { headers: securityHeaders2 }
    }
  }
  const securityOptions = runtimeConfig.security
  const { headers } = securityOptions
  const securityHeaders = backwardsCompatibleSecurity(headers)
  appSecurityOptions['/**'] = defuReplaceArray$1(
    { headers: securityHeaders },
    securityOptions,
    appSecurityOptions['/**']
  )
  for (const route in runtimeConfig.nitro.routeRules) {
    const rule = runtimeConfig.nitro.routeRules[route]
    if (!rule) continue
    const { security } = rule
    if (security) {
      const { headers: headers2 } = security
      const securityHeaders2 = backwardsCompatibleSecurity(headers2)
      appSecurityOptions[route] = defuReplaceArray$1(
        { headers: securityHeaders2 },
        security,
        appSecurityOptions[route]
      )
    }
  }
  nitroApp.hooks.hook('nuxt-security:headers', ({ route, headers: headers2 }) => {
    appSecurityOptions[route] = defuReplaceArray$1(
      { headers: headers2 },
      appSecurityOptions[route]
    )
  })
  nitroApp.hooks.hook('nuxt-security:ready', async () => {
    await nitroApp.hooks.callHook('nuxt-security:routeRules', appSecurityOptions)
  })
  await nitroApp.hooks.callHook('nuxt-security:ready')
})

const sriHashes = { '/_fonts/HgJel4iAS5mDVqJaDUYKmxaMJg4zKHTGmyD1FQkOsTM-2hVuuQIZ4GSGMgNv6dvlqz7cfD6lr7xLohUph7OCgFg.woff2': 'sha384-OLBgp1GsljhM2TJ+sbHjaiH9txEUvgdDTAzHv2P24donTt6/529l+9Ua0vFImLlb', '/_nuxt/6H2fVB-B.js': 'sha384-7BydwZY86BYkDHmXxUwx194Rw6Yc79ObuWh2yXrT690MszO/Upj8E0krPwRNDzaH', '/_nuxt/91TuvHUr.js': 'sha384-6IWeU/oznlF94rfBaMDAniLgB5YbXDAJxAKWTnw8X0nIzV/ecTjGo/xQ4BiQi0Jr', '/_nuxt/api-docs.CY65FI5i.css': 'sha384-nsERgbPhglvb4x3OlGaEIe+7YUs9azWDemE1hRsQfSEysL2PgBYdalRCQGj2b925', '/_nuxt/B0AmdIHx.js': 'sha384-Ch615O86oeP0GvPrDfCdDaNmwOJifF+0PAuybl7rNWmDFxF+OLhNOBWlNvoP8za9', '/_nuxt/B0tD4BZD.js': 'sha384-+PTF/5BqXib4Dsohzf0fBcqfNb/2JVuU7MnbOyGUU+CSPrs0G1aPAKTisXPvhekg', '/_nuxt/Ba5BsZ23.js': 'sha384-3APs9FI9oQxpP8SCV9iJzha0+38I59LSVTi+L4KtGFaq2q4jPb76CcIwtdJPZGo3', '/_nuxt/Bc4ry8tx.js': 'sha384-JsrIGUTStE1aJmr5bPVEUU1jK6vxNQmNwJNLMGY2+xwuV4xSfXtB/p/ux9al5qcm', '/_nuxt/BdOvbLkT.js': 'sha384-4p6y+lh3k1jwxOW3jsUvC3W1rQwpzjnw4fvcYmTej5KuyIZ++oDdG9G79D/zKji8', '/_nuxt/BkXYJk4P.js': 'sha384-rAQuSP08pEI6w/ujAIM9g9zba1L22kNSL4+10BsOyL4PZ1XL3ciZRXukPSKNmyoh', '/_nuxt/BlpyAV-i.js': 'sha384-MeM6AdFAWY8RVvUzODgCx0eOz17pPb5XlVEjOSdJGbio+a1pT8LJx+zKOPtFEqXR', '/_nuxt/BmQ6fCnO.js': 'sha384-mzezom5CC5erSQ5u8eLKsYTZ2jHD1BWJAgSsHBpBHYyGrxOlrPp/9JhUC/ZBuKCR', '/_nuxt/BOLVlqB0.js': 'sha384-cActX44iiEmWoRM5odGmTcPKJ0V7cyc/JocTos8HMWkrDCpLnE4nEChCOUWEvxtm', '/_nuxt/BpIu0oc6.js': 'sha384-/BHkBIHxgXzjxUhQYW5MXVD60i2KbP28tED4LOX+4wCyMiPnsw1jdy7LCOE96Vu3', '/_nuxt/BulvQnEC.js': 'sha384-lG8QOZkXrETL8dZmGlfJyZ5vhrVIc4h5oXLI7NfLc7LOluZoUGnxF5xusZDNScEl', '/_nuxt/ByQl4N-A.js': 'sha384-BCEL1CkM5Co0or6Wg+hxS1ntM5ZbBl3t/yqOhFygkpe5LhpzWs1b6RJhmllaVkVR', '/_nuxt/Bz8hnBRm.js': 'sha384-KtmD2nD7nBu6oU33I2nauTWN8RxqUHFdE539S+1ISFrWAAHwOwXmRWs06IE4+ZGI', '/_nuxt/C2TmLSer.js': 'sha384-4ctiWbV3y6ECIv+JSRb48nANyyc++EYyUTnMFQjRmEHZV/5AjvEVCP0eiSkR782w', '/_nuxt/C2TwCkJ9.js': 'sha384-YAb/Ig2McxABDzQa5EtpwA1VZlZ1x6uFWMMpbWz8XDCVwXc1OGbLc2K+UwTTiJGd', '/_nuxt/C4h9RqW5.js': 'sha384-5dj43KOtQvf7Ivx+FdKllX7W9b0LHZCMc7qnyUaygFzwrGe/tyJtyw7jsob28k89', '/_nuxt/C4_aqYn1.js': 'sha384-9915PVhlSvwNZahJboACrRxdzJEB+fa+GlbiwDa974PNV7uK3ZXQodRQeHiPOdrj', '/_nuxt/CexaFgMM.js': 'sha384-aYtgleTbfsLS8ITg4bqlcxf4156uQwAsLDxl0pMemnl99ztX3AJSBy8RZqLyTSGr', '/_nuxt/Cgb3vGEt.js': 'sha384-fAjaRJCmTdybopCGw9VZSZygpHlLw67P6uCSMBBcJCdS5gf23vRrUAG8YQfZ8rkB', '/_nuxt/CGz63Dzi.js': 'sha384-As34UkgbGZE/9IDMpJokaG5Km/FuFpTyyw2N/gg64q7DdTAoK020UjxDvffF8a3W', '/_nuxt/ChlYsP-h.js': 'sha384-bNNIoNyDm9G6tQmVfN3iC1a76nVZxMLcktulxd5BwoDYCLnZB5iJVk4aS8rOVsG+', '/_nuxt/CjlCAcpa.js': 'sha384-9DqYWEHAK+XVYhX/kl6OEgqgWr34iPc823n8+U7NSFMpYFATEWbpl+AbEjk78oiy', '/_nuxt/ClFakRHP.js': 'sha384-+jizSraCL/CAB0M+kvQUqxFJmpAdjPwq8HWpsCZhv5Axhirf0RQb0HHDgjilNkiX', '/_nuxt/Crrl0UvD.js': 'sha384-DGVI+by9yIabJyHJSAplZN+/oxgj0cp4WZGiL8mg2oTH0uUIoh9942EOOOcquBHi', '/_nuxt/CRUxaIzk.js': 'sha384-MF5xRf29Wr3gT3mkuVoKW2lKA0n1GFo7BSc29bak5qzjdJdEknxY0VcBpJTelHvW', '/_nuxt/CSwofynP.js': 'sha384-0cjLUj7uFZcgNhmm7lLeFltcOqjDakCVb+0ugXUpi7LiV6yF2kuwzjM/HtWyG9kX', '/_nuxt/Cubr6RGO.js': 'sha384-GahAm6FbwkiJO5jr+H2ei3RWJ60sVIvGNDPoa8+zF7xvPs/qOw8ce5ow8Sn85Ggo', '/_nuxt/CX9s4EKi.js': 'sha384-QvWEXcno5xlcpPohn0xVW5EzJEqPITIRnay5F/hSqAJ4B3Kh5VIsKAZFyRFVVhiO', '/_nuxt/D58WXIjE.js': 'sha384-J8Dz8HjZ/TtEdB9SAc6Ae+ILJZ0RjZmLU2HEDC0fdOYGh3uHyoTdCVb5NbA3WQ3n', '/_nuxt/D8Fmm5Cq.js': 'sha384-b+kHMfrw2TA+drVwtMLraty+KYseEH/NqYMPQAApdF7l3ekXDp4tfK7c7JsUUqBN', '/_nuxt/Dc7X5Vr4.js': 'sha384-UGiULzSLNOgd0uyK6mVdzkUresdvxCID/i24BlW+i8s1BpytgnV3ZPKKsXYCF6jG', '/_nuxt/default.B7aBcNic.css': 'sha384-YL7VdwUeAj+WnC/txBQ7yrwl+PpOa6CH3Mrkf53faEvzBAgPeF/YtmibwnLV5lHS', '/_nuxt/DFTrQwB2.js': 'sha384-LyHnRon7msn22dJz1Z8Qn6/sn1lBhUVSP+igsgzxtlOOHIp9lU/r5BtvsKGUQGts', '/_nuxt/DHgoT4Pp.js': 'sha384-RUGM3xMu/9ju3mNx82V3KBXYY062fbdMwnQZaWHUIRNUXT9ShsZGiHsZgSEwRThW', '/_nuxt/DILQFhr4.js': 'sha384-AqeqjZ/R/QdDtWewPolrbKblzr5LXPJF+f1b72jFY9zCZXhCalUa+s8d/RcG3xI8', '/_nuxt/Dl2p8dXQ.js': 'sha384-NBe+7pFKEheQH/Y37KuDG0KWjTiUNInBet9q26rG9DGg86njbl42BUa87M4eeqp/', '/_nuxt/Dl7oGK1v.js': 'sha384-KpKL07z77dGIInhXYCJdDoEQsbi8051KyRVbbt/D0V99AyijP/IFMLj5wzSbUaZ8', '/_nuxt/DL_BKvGg.js': 'sha384-EF7VqZr3yFEUJGDu12eMeYgnkwwvsLeKf06h29dciQUIBaeAX9PBGaft+OWozm7l', '/_nuxt/DtRDODJh.js': 'sha384-1t6f+ICUsDK+b5FzDI9nHlTOkwuXNeQrjrm726eyYbX5r4h/SUbtKpaVlaHYztpm', '/_nuxt/DUwo50bv.js': 'sha384-hYmnCbsTsKV6k75k4PwW4ONDZlKAXSNgHCpJ1MiWHOT/DDz/GwVLJL3js7eyU6VM', '/_nuxt/Dw-giFrk.js': 'sha384-HBetSd0eOmGLH8GYsIgT1ADZ5Dq261aCIOXBbCdnpPJUn32kwSSD4eYKgbxX0yVx', '/_nuxt/DwS_3MMg.js': 'sha384-ubwoU+5X/VvJa5nmCEvjEoVLnDq3VJOptwZzd6gm0bStqK/dw7k5X3y4eg1dU0Py', '/_nuxt/DxxUXb9S.js': 'sha384-T2r3CeHgUBE46UfOJVMFZZKM+YZ8a48dYBqWqEd6sCtuCy9AAbNqq3xa0quPtt6X', '/_nuxt/D_A3vj_r.js': 'sha384-Qbz+VV5F3SeDOpGwY6GlqiMShR9gUte7xRGMIhDAThQsknM2IFG0ODMuRHqVCeSf', '/_nuxt/entry.sFYiLyHA.css': 'sha384-EISfdwNcBGUeLMR1eSEs3SVh+ssveJrhOdrEytnBgfEkf1YYu4X9pl0/TkVlgTat', '/_nuxt/error-404._yXoGkXB.css': 'sha384-AEb37HMVrtwgq93XFIUS3q9jhxBbOD4xylgAhsiAr4W9G9FbS7zrv0nIeF8HTjYf', '/_nuxt/error-500.BENb_mjk.css': 'sha384-l0ljHesFEw0zAAtxMsEvmyPdthcAd2cVYpRtsGR2VtDb1jTDA9Kbqe0FFgrYO6Xb', '/_nuxt/index.DbSGt4E0.css': 'sha384-hYWlCCd5tuEpNLjjlZ2Ro8VduFQTHAbL/mV/WPAY30bIxzR10d8HMkNCuT8Nugnc', '/_nuxt/privacy-policy.BUBg9sj-.css': 'sha384-sL5lPDHtDkk+D95I+w+UDzxI5yyy+4IUHpD71EbXH2+L3F8QCGkJDqgs6+JJdv1U', '/_nuxt/rueTLWdr.js': 'sha384-GpxQI6BoCwHQgo7x66I47IcmJEKLjJeIIs+A+nb0jbSZEPvgLpG/XkD+V+Cp1lX4', '/_nuxt/ScalarPage.BUkbDwmi.css': 'sha384-8PvlQ8MyuL6wbtQRGSI90jdcLohDzaAf0e+Ji8dYdsWqLw76ZuRcWztzOdWZygEi', '/_nuxt/SocialIcons.DSt0oXNN.css': 'sha384-99NMcWAOmucayZV6Im1L6ePkqPC9ZhAGm15SSRNBjGAqYARYobeR/j9EIPPhrmrp', '/_nuxt/terms-of-service.D_8hxZAf.css': 'sha384-xDgdpYQbc6At6U2FgGYwpDnBJTH+hxqk/DgnEjQ53kx9j30DjWRq4kCPWbyDmwl5', '/_nuxt/WeJ0jEfi.js': 'sha384-sSKLH3FpOetAxW5kbMEbE0pDDw55tcxyJsLaqBjNbo5gCztzZn9r5vaJ1mcMaS6B', '/_nuxt/YL5XlClk.js': 'sha384-hi1XxVCQxMu1d5sMLWIoBAO3jztRx3qmKA0qh4cR0gV+FKzpwXBAZTDxbsKHqbPL', '/_nuxt/zDtwTwZT.js': 'sha384-/iLKnjtSESe0UiHKoDItKw+AvIH4syGWN07VSuzDZsIokDJci70Uv61Tl+gH7Dhe', '/_nuxt/_...DDJPNQ-F.css': 'sha384-eRxuqrpgCKE4U9n9reWPhePEvZE6CoGnfKTQb/24oiHFVbE/I9w+j6DrYABPWPbm', '/_nuxt/_QeDyCiz.js': 'sha384-yhweFEsPhJBqzqOdeJIWFBbLFB549S6WK1EuqQnbKjyiaGhIaBR4XILBm3NzwdCY', '/google7d42e9d8c7e60b4e.html': 'sha384-OGhv0pI0hodCAIv2e+igdwsDQIwwlNtadh6pqgv5BwBxzf0PWJN8Lfaqr8z/sncR', '/sw.js': 'sha384-8osD7gannJAZ9gP7KgYC7YiG/PTHstmad08wI5ctOLLt+dW8W27LPd83X7IoBQyh', '/_robots.txt': 'sha384-nkd9RTtZ9Km3F9zIKVGOf/KI8oh/gc+HbMNtuqhzj7Tvy9cCzBqDOa/S0Jt2nGfC' }

const SCRIPT_RE$1 = /<script((?=[^>]+\bsrc="([^"]+)")(?![^>]+\bintegrity="[^"]+")[^>]+)(?:\/>|><\/script>)/g
const LINK_RE$1 = /<link((?=[^>]+\brel="(?:stylesheet|preload|modulepreload)")(?=[^>]+\bhref="([^"]+)")(?![^>]+\bintegrity="[\w\-+/=]+")[^>]+)>/g
const _TGMNJ_Vd2ugtrArh5jgLKuHfRyCB9vTJnpA9CpXRs = defineNitroPlugin$1((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const rules = resolveSecurityRules(event)
    if (!rules.enabled || !rules.sri) {
      return
    }
    const sections = ['body', 'bodyAppend', 'bodyPrepend', 'head']
    for (const section of sections) {
      html[section] = html[section].map((element) => {
        if (typeof element !== 'string') {
          return element
        }
        element = element.replace(SCRIPT_RE$1, (match, rest, src) => {
          const hash = sriHashes[src]
          if (hash) {
            const integrityScript = `<script integrity="${hash}"${rest}><\/script>`
            return integrityScript
          } else {
            return match
          }
        })
        element = element.replace(LINK_RE$1, (match, rest, href) => {
          const hash = sriHashes[href]
          if (hash) {
            const integrityLink = `<link integrity="${hash}"${rest}>`
            return integrityLink
          } else {
            return match
          }
        })
        return element
      })
    }
  })
})

function generateRandomNonce() {
  const array = new Uint8Array(18)
  crypto.getRandomValues(array)
  const nonce = btoa(String.fromCharCode(...array))
  return nonce
}

const _7Oxp1jNzxnMOdAulQ86WesLD_06kbGYmS4esRG1Fi4 = defineNitroPlugin$1((nitroApp) => {
  {
    return
  }
})

const LINK_RE = /<link\b([^>]*?>)/gi
const NONCE_RE = /nonce="[^"]+"/i
const SCRIPT_RE = /<script\b([^>]*?>)/gi
const STYLE_RE = /<style\b([^>]*?>)/gi
const QUOTE_MASK_RE = /"((?:[^"\\]|\\.)*)"/g
const QUOTE_RESTORE_RE = /__QUOTE_PLACEHOLDER_(\d+)__/g
function injectNonceToTags(element, nonce) {
  if (typeof element !== 'string') {
    return element
  }
  const quotes = []
  let maskedElement = element.replace(QUOTE_MASK_RE, (match) => {
    quotes.push(match)
    return `__QUOTE_PLACEHOLDER_${quotes.length - 1}__`
  })
  maskedElement = maskedElement.replace(LINK_RE, (match, rest) => {
    if (NONCE_RE.test(rest)) {
      return match.replace(NONCE_RE, `nonce="${nonce}"`)
    }
    return `<link nonce="${nonce}"` + rest
  })
  maskedElement = maskedElement.replace(SCRIPT_RE, (match, rest) => {
    return `<script nonce="${nonce}"` + rest
  })
  maskedElement = maskedElement.replace(STYLE_RE, (match, rest) => {
    return `<style nonce="${nonce}"` + rest
  })
  const restoredHtml = maskedElement.replace(QUOTE_RESTORE_RE, (match, index) => {
    return quotes[parseInt(index, 10)]
  })
  return restoredHtml
}
const _TXkSXVK7RtMknifYP3_81wZQ22Dhso1fECihiv0FF0 = defineNitroPlugin$1((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    if (event.context.security?.nonce) {
      return
    }
    const rules = resolveSecurityRules(event)
    if (rules.enabled && rules.nonce && true) {
      const nonce = generateRandomNonce()
      event.context.security.nonce = nonce
    }
  })
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const rules = resolveSecurityRules(event)
    if (!rules.enabled || !rules.headers || !rules.headers.contentSecurityPolicy || !rules.nonce) {
      return
    }
    const nonce = event.context.security.nonce
    const sections = ['body', 'bodyAppend', 'bodyPrepend', 'head']
    for (const section of sections) {
      html[section] = html[section].map(element => injectNonceToTags(element, nonce))
    }
  })
})

const _xhEXOD2eNgUSf4VF4elcX_KKHK90lvYHd1r2RlttW90 = defineNitroPlugin$1((nitroApp) => {
  nitroApp.hooks.hook('render:html', (response, { event }) => {
    if (response.island) {
      return
    }
    const rules = resolveSecurityRules(event)
    if (rules.enabled && rules.headers) {
      const headers = rules.headers
      if (headers.contentSecurityPolicy) {
        const csp = headers.contentSecurityPolicy
        const nonce = event.context.security?.nonce
        const scriptHashes = event.context.security?.hashes?.script
        const styleHashes = event.context.security?.hashes?.style
        headers.contentSecurityPolicy = updateCspVariables(csp, nonce, scriptHashes, styleHashes)
      }
    }
  })
})
function updateCspVariables(csp, nonce, scriptHashes, styleHashes) {
  const generatedCsp = Object.fromEntries(Object.entries(csp).map(([directive, value]) => {
    if (typeof value === 'boolean') {
      return [directive, value]
    }
    const sources = typeof value === 'string' ? value.split(' ').map(token => token.trim()).filter(token => token) : value
    const modifiedSources = sources.filter((source) => {
      if (source.startsWith('\'nonce-') && source !== '\'nonce-{{nonce}}\'') {
        console.warn('[nuxt-security] removing static nonce from CSP header')
        return false
      }
      return true
    }).map((source) => {
      if (source === '\'nonce-{{nonce}}\'') {
        return nonce ? `'nonce-${nonce}'` : ''
      } else {
        return source
      }
    }).filter(source => source)
    if (['script-src', 'script-src-elem'].includes(directive) && scriptHashes) {
      modifiedSources.push(...scriptHashes)
    }
    if (['style-src', 'style-src-elem'].includes(directive) && styleHashes) {
      modifiedSources.push(...styleHashes)
    }
    return [directive, modifiedSources]
  }))
  return generatedCsp
}

const _0rNPuFPn_1uJhD6iP3NtaGZDugTHs_Br1Rl0y0vBc = defineNitroPlugin$1((nitroApp) => {
  {
    return
  }
})

const _2qCxwVjjYdDY1jC6wTExiko05dUhuUSBrNRWwHsMiM = defineNitroPlugin$1((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    const rules = resolveSecurityRules(event)
    if (rules.enabled && rules.headers) {
      const headers = rules.headers
      Object.entries(headers).forEach(([header, value]) => {
        const headerName = getNameFromKey(header)
        if (value === false) {
          const { headers: standardHeaders } = getRouteRules(event)
          const standardHeaderValue = standardHeaders?.[headerName]
          const currentHeaderValue = getResponseHeader(event, headerName)
          if (standardHeaderValue === currentHeaderValue) {
            removeResponseHeader(event, headerName)
          }
        } else {
          const headerValue = headerStringFromObject(header, value)
          setResponseHeader(event, headerName, headerValue)
        }
      })
    }
  })
})

const _rnnBI5rcQ4XBd9y8r3GsihlPOzMl_sfPsag7fFOF78 = defineNitroPlugin$1((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    const rules = resolveSecurityRules(event)
    if (rules.enabled && rules.hidePoweredBy && !event.node.res.headersSent) {
      removeResponseHeader(event, 'x-powered-by')
    }
  })
})

const _IXdKZN0vYnu2Lo8cmLcJCvyVxNcsCAz0bE6pyPFF9yY = defineNitroPlugin$1(async (nitroApp) => {
  {
    const prerenderedHeaders = await useStorage('assets:nuxt-security').getItem('headers.json') || {}
    nitroApp.hooks.hook('beforeResponse', (event) => {
      const rules = resolveSecurityRules(event)
      if (rules.enabled && rules.ssg && rules.ssg.nitroHeaders) {
        const path = event.path.split('?')[0]
        if (path && prerenderedHeaders[path]) {
          setResponseHeaders(event, prerenderedHeaders[path])
        }
      }
    })
  }
})

const plugins = [
  _XdQ6elMg06w3xqvE3I63ovOXpDiPEyb5Cbg68suVI,
  _gymYSqHE5rEMHxSoa_mzNRvC8ZZLvdIK8rxveb2FwE,
  _RkwKuFVPWv_N160DI5iI3BPcXr27NdzZK7iNxrH4wgc,
  _rkraQFkSKO0TlFRYL5pbCVpN3kvA3BySZDFsRrleg,
  _ayec7C60IPfv_vxat_9E8osGtCBj6fbOu9Uq97e4v8,
  _6k80YjlNkKj6LOagxnqGjsFqP6LykM4qV5AMtHdG1k,
  _TGMNJ_Vd2ugtrArh5jgLKuHfRyCB9vTJnpA9CpXRs,
  _7Oxp1jNzxnMOdAulQ86WesLD_06kbGYmS4esRG1Fi4,
  _TXkSXVK7RtMknifYP3_81wZQ22Dhso1fECihiv0FF0,
  _xhEXOD2eNgUSf4VF4elcX_KKHK90lvYHd1r2RlttW90,
  _0rNPuFPn_1uJhD6iP3NtaGZDugTHs_Br1Rl0y0vBc,
  _2qCxwVjjYdDY1jC6wTExiko05dUhuUSBrNRWwHsMiM,
  _rnnBI5rcQ4XBd9y8r3GsihlPOzMl_sfPsag7fFOF78,
  _IXdKZN0vYnu2Lo8cmLcJCvyVxNcsCAz0bE6pyPFF9yY
]

const assets = {
  '/google7d42e9d8c7e60b4e.html': {
    type: 'text/html; charset=utf-8',
    etag: '"8a-7kzd0H3esjeLuftKaPhwtUYNqyU"',
    mtime: '2026-03-07T05:42:46.636Z',
    size: 138,
    path: '../public/google7d42e9d8c7e60b4e.html'
  },
  '/_robots.txt': {
    type: 'text/plain; charset=utf-8',
    etag: '"d9-Sz5QUyW5qrrdYpcc36Wh5I3VY+o"',
    mtime: '2026-03-07T05:43:09.457Z',
    size: 217,
    path: '../public/_robots.txt'
  },
  '/asset-governance/first-party-required.json': {
    type: 'application/json',
    etag: '"cec-bZUJgbfxBDVCxGtm3nSTny9Sh2E"',
    mtime: '2026-03-08T11:28:18.730Z',
    size: 3308,
    path: '../public/asset-governance/first-party-required.json'
  },
  '/sw.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"c26-qjqFHAbpAXn15ErokAAiz9AaTrE"',
    mtime: '2026-03-05T14:58:33.999Z',
    size: 3110,
    path: '../public/sw.js'
  },
  '/asset-governance/asset-inventory.json': {
    type: 'application/json',
    etag: '"21a5-f1Ug8Fe3a/ynwxOD5szo6HmTOTo"',
    mtime: '2026-03-10T16:08:55.728Z',
    size: 8613,
    path: '../public/asset-governance/asset-inventory.json'
  },
  '/asset-governance/stock-source-log.json': {
    type: 'application/json',
    etag: '"a1bb-Am9lOYYNJpPZoYpRz13xDlwvgJA"',
    mtime: '2026-03-10T16:22:08.335Z',
    size: 41403,
    path: '../public/asset-governance/stock-source-log.json'
  },
  '/asset-governance/README.md': {
    type: 'text/markdown; charset=utf-8',
    etag: '"5ef-Gq7TZCcRR0UymF5Senrf7uH6n9o"',
    mtime: '2026-03-08T11:28:18.730Z',
    size: 1519,
    path: '../public/asset-governance/README.md'
  },
  '/articles/article-11.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.700Z',
    size: 196294,
    path: '../public/articles/article-11.jpg'
  },
  '/articles/article-10.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.699Z',
    size: 196294,
    path: '../public/articles/article-10.jpg'
  },
  '/articles/article-12.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.702Z',
    size: 196294,
    path: '../public/articles/article-12.jpg'
  },
  '/articles/article-1.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.681Z',
    size: 196294,
    path: '../public/articles/article-1.jpg'
  },
  '/articles/article-2.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.682Z',
    size: 196294,
    path: '../public/articles/article-2.jpg'
  },
  '/articles/article-4.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.686Z',
    size: 196294,
    path: '../public/articles/article-4.jpg'
  },
  '/articles/article-3.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.684Z',
    size: 196294,
    path: '../public/articles/article-3.jpg'
  },
  '/articles/article-5.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.688Z',
    size: 196294,
    path: '../public/articles/article-5.jpg'
  },
  '/articles/article-7.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.692Z',
    size: 196294,
    path: '../public/articles/article-7.jpg'
  },
  '/articles/article-6.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.690Z',
    size: 196294,
    path: '../public/articles/article-6.jpg'
  },
  '/articles/article-8.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.694Z',
    size: 196294,
    path: '../public/articles/article-8.jpg'
  },
  '/images/about-esperion-agency.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.655Z',
    size: 196294,
    path: '../public/images/about-esperion-agency.jpg'
  },
  '/images/banner-2.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.659Z',
    size: 196294,
    path: '../public/images/banner-2.jpg'
  },
  '/articles/article-9.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.697Z',
    size: 196294,
    path: '../public/articles/article-9.jpg'
  },
  '/images/banner-1.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.658Z',
    size: 196294,
    path: '../public/images/banner-1.jpg'
  },
  '/images/banner-4.jpg': {
    type: 'image/jpeg',
    etag: '"4025e-Q5BCfIAdaZqczHBlXb7i1Bq0fdE"',
    mtime: '2026-03-10T16:20:36.555Z',
    size: 262750,
    path: '../public/images/banner-4.jpg'
  },
  '/images/banner-3.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.660Z',
    size: 196294,
    path: '../public/images/banner-3.jpg'
  },
  '/images/banner-5.jpg': {
    type: 'image/jpeg',
    etag: '"57602-rNvTQ1QrICog/p35rZPnpFYcILY"',
    mtime: '2026-03-10T16:20:37.282Z',
    size: 357890,
    path: '../public/images/banner-5.jpg'
  },
  '/images/esperion-agency-hero.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.653Z',
    size: 196294,
    path: '../public/images/esperion-agency-hero.jpg'
  },
  '/images/contact-banner.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.656Z',
    size: 196294,
    path: '../public/images/contact-banner.jpg'
  },
  '/images/office-exterior.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.668Z',
    size: 210100,
    path: '../public/images/office-exterior.jpg'
  },
  '/images/hero-service-development.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.670Z',
    size: 210100,
    path: '../public/images/hero-service-development.jpg'
  },
  '/images/service-consulting.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.675Z',
    size: 210100,
    path: '../public/images/service-consulting.jpg'
  },
  '/images/office-interior.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.669Z',
    size: 210100,
    path: '../public/images/office-interior.jpg'
  },
  '/images/service-digitalmarketing.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.673Z',
    size: 210100,
    path: '../public/images/service-digitalmarketing.jpg'
  },
  '/images/service-mobileappdevelopment.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.671Z',
    size: 210100,
    path: '../public/images/service-mobileappdevelopment.jpg'
  },
  '/images/service-uiuxdesign.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.672Z',
    size: 210100,
    path: '../public/images/service-uiuxdesign.jpg'
  },
  '/images/service-ecommercesolutions.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.674Z',
    size: 210100,
    path: '../public/images/service-ecommercesolutions.jpg'
  },
  '/_fonts/HgJel4iAS5mDVqJaDUYKmxaMJg4zKHTGmyD1FQkOsTM-2hVuuQIZ4GSGMgNv6dvlqz7cfD6lr7xLohUph7OCgFg.woff2': {
    type: 'font/woff2',
    etag: '"bd30-HcBE9IJP1a9r/tZ/7ki+cPoGnz8"',
    mtime: '2026-03-16T06:59:43.510Z',
    size: 48432,
    path: '../public/_fonts/HgJel4iAS5mDVqJaDUYKmxaMJg4zKHTGmyD1FQkOsTM-2hVuuQIZ4GSGMgNv6dvlqz7cfD6lr7xLohUph7OCgFg.woff2'
  },
  '/images/service-webdevelopment.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.670Z',
    size: 210100,
    path: '../public/images/service-webdevelopment.jpg'
  },
  '/images/services-banner.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.657Z',
    size: 196294,
    path: '../public/images/services-banner.jpg'
  },
  '/works/gallery-1.jpg': {
    type: 'image/jpeg',
    etag: '"496c0-dRMvJkDEp3IXZx7NOdl6PLYF9qk"',
    mtime: '2026-03-08T11:28:18.676Z',
    size: 300736,
    path: '../public/works/gallery-1.jpg'
  },
  '/images/team.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.667Z',
    size: 210100,
    path: '../public/images/team.jpg'
  },
  '/works/gallery-2.jpg': {
    type: 'image/jpeg',
    etag: '"496c0-dRMvJkDEp3IXZx7NOdl6PLYF9qk"',
    mtime: '2026-03-08T11:28:18.676Z',
    size: 300736,
    path: '../public/works/gallery-2.jpg'
  },
  '/works/gallery-3.jpg': {
    type: 'image/jpeg',
    etag: '"496c0-dRMvJkDEp3IXZx7NOdl6PLYF9qk"',
    mtime: '2026-03-08T11:28:18.678Z',
    size: 300736,
    path: '../public/works/gallery-3.jpg'
  },
  '/works/gallery-4.jpg': {
    type: 'image/jpeg',
    etag: '"496c0-dRMvJkDEp3IXZx7NOdl6PLYF9qk"',
    mtime: '2026-03-08T11:28:18.679Z',
    size: 300736,
    path: '../public/works/gallery-4.jpg'
  },
  '/works/work-1.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.681Z',
    size: 210100,
    path: '../public/works/work-1.jpg'
  },
  '/works/work-10.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.699Z',
    size: 210100,
    path: '../public/works/work-10.jpg'
  },
  '/works/work-11.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.702Z',
    size: 210100,
    path: '../public/works/work-11.jpg'
  },
  '/works/work-12.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.703Z',
    size: 210100,
    path: '../public/works/work-12.jpg'
  },
  '/works/work-2.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.683Z',
    size: 210100,
    path: '../public/works/work-2.jpg'
  },
  '/works/work-3.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.685Z',
    size: 210100,
    path: '../public/works/work-3.jpg'
  },
  '/works/work-4.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.687Z',
    size: 210100,
    path: '../public/works/work-4.jpg'
  },
  '/works/work-5.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.689Z',
    size: 210100,
    path: '../public/works/work-5.jpg'
  },
  '/works/work-8.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.696Z',
    size: 210100,
    path: '../public/works/work-8.jpg'
  },
  '/works/work-6.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.691Z',
    size: 210100,
    path: '../public/works/work-6.jpg'
  },
  '/_nuxt/6H2fVB-B.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"2832-kID/UdMAIe+0eIqt/1lnjX5Xfbg"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 10290,
    path: '../public/_nuxt/6H2fVB-B.js'
  },
  '/_nuxt/api-docs.CY65FI5i.css': {
    type: 'text/css; charset=utf-8',
    etag: '"24-1nHhlb/vyRWEaoDhSyg3dFPLKh0"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 36,
    path: '../public/_nuxt/api-docs.CY65FI5i.css'
  },
  '/_nuxt/B0AmdIHx.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"eb4-IipfEmxFe1gU4w8LndWZPvlbjNs"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 3764,
    path: '../public/_nuxt/B0AmdIHx.js'
  },
  '/_nuxt/91TuvHUr.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1de8-mwLO78hhd+WTrPE6pNvC9XTsyQA"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 7656,
    path: '../public/_nuxt/91TuvHUr.js'
  },
  '/works/work-7.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.693Z',
    size: 210100,
    path: '../public/works/work-7.jpg'
  },
  '/_nuxt/Ba5BsZ23.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"55-dAy0ETzMjrijVi1uQtC0esoyvuA"',
    mtime: '2026-03-16T06:59:30.755Z',
    size: 85,
    path: '../public/_nuxt/Ba5BsZ23.js'
  },
  '/_nuxt/Bc4ry8tx.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"3f11-pRjA8zwZ2otWwqWPEPWkd/R+H70"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 16145,
    path: '../public/_nuxt/Bc4ry8tx.js'
  },
  '/_nuxt/BdOvbLkT.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1d89-0BfvNFgz7rfrZkYewi4z7qvMsBk"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 7561,
    path: '../public/_nuxt/BdOvbLkT.js'
  },
  '/works/work-9.jpg': {
    type: 'image/jpeg',
    etag: '"334b4-gHJGgRW+/552JcezPsJJy/YAfY8"',
    mtime: '2026-03-08T11:28:18.698Z',
    size: 210100,
    path: '../public/works/work-9.jpg'
  },
  '/_nuxt/BkXYJk4P.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"3ebb-/pB4AQ9f9be8qaT+qgitcJxtmrQ"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 16059,
    path: '../public/_nuxt/BkXYJk4P.js'
  },
  '/_nuxt/B0tD4BZD.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1d438-lvtsxR8s8z2NVswrLFExaoRq5uU"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 119864,
    path: '../public/_nuxt/B0tD4BZD.js'
  },
  '/_nuxt/BmQ6fCnO.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1930-y0G7k502klNtEy/dpR4k4GMRLPM"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 6448,
    path: '../public/_nuxt/BmQ6fCnO.js'
  },
  '/_nuxt/BlpyAV-i.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1675-KTgYVNqWWSPrJ7BpunZjYTd7FDI"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 5749,
    path: '../public/_nuxt/BlpyAV-i.js'
  },
  '/_nuxt/BOLVlqB0.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"200a-ES4QUxyjCsvAK3cwSjtUEAdr3/I"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 8202,
    path: '../public/_nuxt/BOLVlqB0.js'
  },
  '/_nuxt/BpIu0oc6.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1203-ZeVq1+cMYC6Ei8LyetKpiw6Btns"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 4611,
    path: '../public/_nuxt/BpIu0oc6.js'
  },
  '/_nuxt/BulvQnEC.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1468-Tzc6zDXKCCn3tnojwhl8TQASYTQ"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 5224,
    path: '../public/_nuxt/BulvQnEC.js'
  },
  '/_nuxt/ByQl4N-A.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"23b6-IKkEzcJEnLx0Vl/1fBHNpDzwLpI"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 9142,
    path: '../public/_nuxt/ByQl4N-A.js'
  },
  '/_nuxt/Bz8hnBRm.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"5c88-dgAd9xJA57LvUOdwqHfg/JYJwxE"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 23688,
    path: '../public/_nuxt/Bz8hnBRm.js'
  },
  '/_nuxt/C2TmLSer.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"2813-oc2Dj4cNEaLG+s+nsQTUjlEziDI"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 10259,
    path: '../public/_nuxt/C2TmLSer.js'
  },
  '/_nuxt/C2TwCkJ9.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"4a3-+TCPvvJbJQAFYu9roDeuhMdjMqE"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 1187,
    path: '../public/_nuxt/C2TwCkJ9.js'
  },
  '/_nuxt/C4h9RqW5.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"503f3-taPgoZs0go3QippnUvNMdpt2vU8"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 328691,
    path: '../public/_nuxt/C4h9RqW5.js'
  },
  '/_nuxt/C4_aqYn1.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"200fc-gKMw51u8KY3mJ65VcEd53eWPRdM"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 131324,
    path: '../public/_nuxt/C4_aqYn1.js'
  },
  '/_nuxt/CjlCAcpa.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"d7b-z0t3tgAeM6XMok98JznCidY1KNc"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 3451,
    path: '../public/_nuxt/CjlCAcpa.js'
  },
  '/_nuxt/Cgb3vGEt.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"209e-8ufsML8IB77vV3Gt3123PjAvoRs"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 8350,
    path: '../public/_nuxt/Cgb3vGEt.js'
  },
  '/_nuxt/CexaFgMM.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"8df-tYOS1UKpRrVfRgFPhVEGEOhC+Fs"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 2271,
    path: '../public/_nuxt/CexaFgMM.js'
  },
  '/_nuxt/CGz63Dzi.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"102a-UHcdYHfOa30VPuHPKgTmwKIHgNQ"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 4138,
    path: '../public/_nuxt/CGz63Dzi.js'
  },
  '/_nuxt/Crrl0UvD.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"dcac-khDtPzEaqAHR4oHwGz/pGA7Mljg"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 56492,
    path: '../public/_nuxt/Crrl0UvD.js'
  },
  '/_nuxt/ClFakRHP.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"d808-3d/KCEQb8bPEJfSZeInBE2nY2Qw"',
    mtime: '2026-03-16T06:59:30.765Z',
    size: 55304,
    path: '../public/_nuxt/ClFakRHP.js'
  },
  '/_nuxt/CRUxaIzk.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1541-ILH5dJdCrSiKSYqiBiHdVywjN50"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 5441,
    path: '../public/_nuxt/CRUxaIzk.js'
  },
  '/_nuxt/CX9s4EKi.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"f2b-SgDtUcGgjW4hjBrr8G9YUc+PHjE"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 3883,
    path: '../public/_nuxt/CX9s4EKi.js'
  },
  '/_nuxt/CSwofynP.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1c1f-uuwSGoQezZUJmk3bShp84acKR+I"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 7199,
    path: '../public/_nuxt/CSwofynP.js'
  },
  '/_nuxt/D58WXIjE.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"2eb7-nyGvlS/AdKtMSlbjMJsnI4t8dww"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 11959,
    path: '../public/_nuxt/D58WXIjE.js'
  },
  '/_nuxt/Cubr6RGO.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"3770-a1+sGN/raWsyrV0FEDAUInER4NE"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 14192,
    path: '../public/_nuxt/Cubr6RGO.js'
  },
  '/_nuxt/D8Fmm5Cq.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"17a9-cNqnl2ldt/gM5YXAq8QRWywIqBA"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 6057,
    path: '../public/_nuxt/D8Fmm5Cq.js'
  },
  '/_nuxt/default.B7aBcNic.css': {
    type: 'text/css; charset=utf-8',
    etag: '"c43-+AomxBR1ZUKwReZtXxt2CYu1TlE"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 3139,
    path: '../public/_nuxt/default.B7aBcNic.css'
  },
  '/_nuxt/DFTrQwB2.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"8b1-Q4zyp5kX9v5nVCQ5v4L9mhm9ceI"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 2225,
    path: '../public/_nuxt/DFTrQwB2.js'
  },
  '/_nuxt/Dc7X5Vr4.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"270f-viiBAPu/5SviAyUxC8fbeiizU7U"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 9999,
    path: '../public/_nuxt/Dc7X5Vr4.js'
  },
  '/_nuxt/Dl2p8dXQ.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"f20-A/nOo35mM5kKMXnXMurkd7/KKfE"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 3872,
    path: '../public/_nuxt/Dl2p8dXQ.js'
  },
  '/_nuxt/DHgoT4Pp.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"23b7-299Kt+vV39R+NIPzlr5KRIOQrDw"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 9143,
    path: '../public/_nuxt/DHgoT4Pp.js'
  },
  '/_nuxt/DILQFhr4.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"2943-oZykPya364jNwu4PYWFp7n2DZmQ"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 10563,
    path: '../public/_nuxt/DILQFhr4.js'
  },
  '/_nuxt/Dl7oGK1v.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"dcba-pw6cVdi0XCqKY+yTet84J8BLhnQ"',
    mtime: '2026-03-16T06:59:30.774Z',
    size: 56506,
    path: '../public/_nuxt/Dl7oGK1v.js'
  },
  '/_nuxt/DL_BKvGg.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1de0-9uLwGlUuSxAJdp6ldx7jzrXxyBA"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 7648,
    path: '../public/_nuxt/DL_BKvGg.js'
  },
  '/_nuxt/DtRDODJh.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"9a5-aw9Ap7AU4JuYUqvUQbMu0oVqWKM"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 2469,
    path: '../public/_nuxt/DtRDODJh.js'
  },
  '/_nuxt/DUwo50bv.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"21c6-LIuKLmtLga+qaUEKacV/baLea1E"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 8646,
    path: '../public/_nuxt/DUwo50bv.js'
  },
  '/_nuxt/Dw-giFrk.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"2552-kMRdH13/F16l5FB028Ku1zqsWn0"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 9554,
    path: '../public/_nuxt/Dw-giFrk.js'
  },
  '/_nuxt/DwS_3MMg.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"26b-IriC/siWjHy77iFBV9umAu7MF0Y"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 619,
    path: '../public/_nuxt/DwS_3MMg.js'
  },
  '/_nuxt/error-404._yXoGkXB.css': {
    type: 'text/css; charset=utf-8',
    etag: '"97e-UvhxUpGzrIO+HDYB4qU9Txgu35A"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 2430,
    path: '../public/_nuxt/error-404._yXoGkXB.css'
  },
  '/_nuxt/error-500.BENb_mjk.css': {
    type: 'text/css; charset=utf-8',
    etag: '"773-BFLUend+w1t3SP3QDB+Z0A0V5pI"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 1907,
    path: '../public/_nuxt/error-500.BENb_mjk.css'
  },
  '/_nuxt/index.DbSGt4E0.css': {
    type: 'text/css; charset=utf-8',
    etag: '"eae-fY09lKovgK2xru8P+e26LLl5sxY"',
    mtime: '2026-03-16T06:59:30.693Z',
    size: 3758,
    path: '../public/_nuxt/index.DbSGt4E0.css'
  },
  '/_nuxt/DxxUXb9S.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"14ac-huQEEqDZWdlk5+Oo5lQVjEgxB40"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 5292,
    path: '../public/_nuxt/DxxUXb9S.js'
  },
  '/_nuxt/privacy-policy.BUBg9sj-.css': {
    type: 'text/css; charset=utf-8',
    etag: '"72-Am1J3JtR2P5zZjO/tBcc8rHIb5s"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 114,
    path: '../public/_nuxt/privacy-policy.BUBg9sj-.css'
  },
  '/_nuxt/entry.sFYiLyHA.css': {
    type: 'text/css; charset=utf-8',
    etag: '"2efb6-on+quUELkoX+yPdSR8kOWjY6M4Q"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 192438,
    path: '../public/_nuxt/entry.sFYiLyHA.css'
  },
  '/_nuxt/D_A3vj_r.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"24889-bh1uDL3iloUZ4MjkTZCVDiDmr+8"',
    mtime: '2026-03-16T06:59:30.755Z',
    size: 149641,
    path: '../public/_nuxt/D_A3vj_r.js'
  },
  '/_nuxt/SocialIcons.DSt0oXNN.css': {
    type: 'text/css; charset=utf-8',
    etag: '"40f-tatv3ejj/QKOQTHCGgYRTTQ9Jro"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 1039,
    path: '../public/_nuxt/SocialIcons.DSt0oXNN.css'
  },
  '/_nuxt/terms-of-service.D_8hxZAf.css': {
    type: 'text/css; charset=utf-8',
    etag: '"72-O3zzkAqnZOOtBp968pshahhc3gs"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 114,
    path: '../public/_nuxt/terms-of-service.D_8hxZAf.css'
  },
  '/_nuxt/zDtwTwZT.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"b8d-fQk+ajecgxIbcWRRyJYPoWKGqfo"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 2957,
    path: '../public/_nuxt/zDtwTwZT.js'
  },
  '/_nuxt/rueTLWdr.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"1181-vQqwy+2VfiJHpFaFcNVqhL9DlVg"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 4481,
    path: '../public/_nuxt/rueTLWdr.js'
  },
  '/_nuxt/YL5XlClk.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"3961-PdLSLxeRy6i/501vaHPoE8WaVIU"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 14689,
    path: '../public/_nuxt/YL5XlClk.js'
  },
  '/_nuxt/WeJ0jEfi.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"14f3-Hl9PK+oJ3rwsXkqB/BLuj2lry3Y"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 5363,
    path: '../public/_nuxt/WeJ0jEfi.js'
  },
  '/_nuxt/ScalarPage.BUkbDwmi.css': {
    type: 'text/css; charset=utf-8',
    etag: '"5a750-bUeqzDWhVAgMVzahkTGdAEWZ69Y"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 370512,
    path: '../public/_nuxt/ScalarPage.BUkbDwmi.css'
  },
  '/_nuxt/_...DDJPNQ-F.css': {
    type: 'text/css; charset=utf-8',
    etag: '"11b-VAgq/JQo8doIEF1X4phCq9L6qhM"',
    mtime: '2026-03-16T06:59:30.753Z',
    size: 283,
    path: '../public/_nuxt/_...DDJPNQ-F.css'
  },
  '/placeholders/first-party/brand-mark-required.svg': {
    type: 'image/svg+xml',
    etag: '"11b-xAaxcyQ7FROLE0QqQVS/E/bd2ZM"',
    mtime: '2026-03-08T11:28:18.705Z',
    size: 283,
    path: '../public/placeholders/first-party/brand-mark-required.svg'
  },
  '/_nuxt/_QeDyCiz.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"2ba1-YvZxAw4Yl3lbvPzus1vwlPW4OLc"',
    mtime: '2026-03-16T06:59:30.754Z',
    size: 11169,
    path: '../public/_nuxt/_QeDyCiz.js'
  },
  '/placeholders/first-party/client-logo-required.svg': {
    type: 'image/svg+xml',
    etag: '"19e-YRoQaJJZ6O5V/Xe95axMeL//eBk"',
    mtime: '2026-03-08T11:28:18.705Z',
    size: 414,
    path: '../public/placeholders/first-party/client-logo-required.svg'
  },
  '/placeholders/first-party/founder-identity-required.svg': {
    type: 'image/svg+xml',
    etag: '"19f-BnDyn0amIe6v6QOQnL6hlVgg1ec"',
    mtime: '2026-03-08T11:28:18.704Z',
    size: 415,
    path: '../public/placeholders/first-party/founder-identity-required.svg'
  },
  '/images/banners/hero-services.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.661Z',
    size: 196294,
    path: '../public/images/banners/hero-services.jpg'
  },
  '/images/banners/lead-gen.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.663Z',
    size: 196294,
    path: '../public/images/banners/lead-gen.jpg'
  },
  '/images/banners/portfolio.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.661Z',
    size: 196294,
    path: '../public/images/banners/portfolio.jpg'
  },
  '/_nuxt/ChlYsP-h.js': {
    type: 'text/javascript; charset=utf-8',
    etag: '"2eb865-w0puU395HnIhUF+0F3jH/5+x/J0"',
    mtime: '2026-03-16T06:59:30.780Z',
    size: 3061861,
    path: '../public/_nuxt/ChlYsP-h.js'
  },
  '/images/banners/promo.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.666Z',
    size: 196294,
    path: '../public/images/banners/promo.jpg'
  },
  '/images/banners/trust.jpg': {
    type: 'image/jpeg',
    etag: '"2fec6-R64k+2+0b2GfugBPuJOU2hp4rSs"',
    mtime: '2026-03-08T11:28:18.664Z',
    size: 196294,
    path: '../public/images/banners/trust.jpg'
  }
}

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//
function normalizeWindowsPath(input = '') {
  if (!input) {
    return input
  }
  return input.replace(/\\/g, '/').replace(_DRIVE_LETTER_START_RE, r => r.toUpperCase())
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/
function cwd() {
  if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
    return process.cwd().replace(/\\/g, '/')
  }
  return '/'
}
const resolve$1 = function (...arguments_) {
  arguments_ = arguments_.map(argument => normalizeWindowsPath(argument))
  let resolvedPath = ''
  let resolvedAbsolute = false
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd()
    if (!path || path.length === 0) {
      continue
    }
    resolvedPath = `${path}/${resolvedPath}`
    resolvedAbsolute = isAbsolute(path)
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute)
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`
  }
  return resolvedPath.length > 0 ? resolvedPath : '.'
}
function normalizeString(path, allowAboveRoot) {
  let res = ''
  let lastSegmentLength = 0
  let lastSlash = -1
  let dots = 0
  let char = null
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index]
    } else if (char === '/') {
      break
    } else {
      char = '/'
    }
    if (char === '/') {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== '.' || res[res.length - 2] !== '.') {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf('/')
            if (lastSlashIndex === -1) {
              res = ''
              lastSegmentLength = 0
            } else {
              res = res.slice(0, lastSlashIndex)
              lastSegmentLength = res.length - 1 - res.lastIndexOf('/')
            }
            lastSlash = index
            dots = 0
            continue
          } else if (res.length > 0) {
            res = ''
            lastSegmentLength = 0
            lastSlash = index
            dots = 0
            continue
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? '/..' : '..'
          lastSegmentLength = 2
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`
        } else {
          res = path.slice(lastSlash + 1, index)
        }
        lastSegmentLength = index - lastSlash - 1
      }
      lastSlash = index
      dots = 0
    } else if (char === '.' && dots !== -1) {
      ++dots
    } else {
      dots = -1
    }
  }
  return res
}
const isAbsolute = function (p) {
  return _IS_ABSOLUTE_RE.test(p)
}
const dirname = function (p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, '').split('/').slice(0, -1)
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += '/'
  }
  return segments.join('/') || (isAbsolute(p) ? '/' : '.')
}
const basename = function (p, extension) {
  const segments = normalizeWindowsPath(p).split('/')
  let lastSegment = ''
  for (let i = segments.length - 1; i >= 0; i--) {
    const val = segments[i]
    if (val) {
      lastSegment = val
      break
    }
  }
  return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment
}

function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url))
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = { '/_fonts/': { maxAge: 31536000 }, '/_nuxt/': { maxAge: 31536000 } }

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset(id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(['HEAD', 'GET'])
const EncodingMap = { gzip: '.gz', br: '.br' }
const _acA2FR = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  )
  let asset
  const encodingHeader = String(
    getRequestHeader(event, 'accept-encoding') || ''
  )
  const encodings = [
    ...encodingHeader.split(',').map(e => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ''
  ]
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, 'index.html' + encoding)]) {
      const _asset = getAsset(_id)
      if (_asset) {
        asset = _asset
        id = _id
        break
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, 'Cache-Control')
      throw createError$1({ statusCode: 404 })
    }
    return
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, 'Vary', 'Accept-Encoding')
  }
  const ifNotMatch = getRequestHeader(event, 'if-none-match') === asset.etag
  if (ifNotMatch) {
    setResponseStatus(event, 304, 'Not Modified')
    return ''
  }
  const ifModifiedSinceH = getRequestHeader(event, 'if-modified-since')
  const mtimeDate = new Date(asset.mtime)
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, 'Not Modified')
    return ''
  }
  if (asset.type && !getResponseHeader(event, 'Content-Type')) {
    setResponseHeader(event, 'Content-Type', asset.type)
  }
  if (asset.etag && !getResponseHeader(event, 'ETag')) {
    setResponseHeader(event, 'ETag', asset.etag)
  }
  if (asset.mtime && !getResponseHeader(event, 'Last-Modified')) {
    setResponseHeader(event, 'Last-Modified', mtimeDate.toUTCString())
  }
  if (asset.encoding && !getResponseHeader(event, 'Content-Encoding')) {
    setResponseHeader(event, 'Content-Encoding', asset.encoding)
  }
  if (asset.size > 0 && !getResponseHeader(event, 'Content-Length')) {
    setResponseHeader(event, 'Content-Length', asset.size)
  }
  return readAsset(id)
})

const _SxA8c9 = defineEventHandler(() => {})

const collections = {
}

const DEFAULT_ENDPOINT = 'https://api.iconify.design'
const _21tpCp = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event)
  if (!url)
    return createError$1({ status: 400, message: 'Invalid icon request' })
  const options = useAppConfig().icon
  const collectionName = event.context.params?.collection?.replace(/\.json$/, '')
  const collection = collectionName ? await collections[collectionName]?.() : null
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT
  const icons = url.searchParams.get('icons')?.split(',')
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      )
      consola.debug(`[Icon] serving ${(icons || []).map(i => '`' + collectionName + ':' + i + '`').join(',')} from bundled collection`)
      return data
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === 'server-only') {
    const apiUrl = new URL('./' + basename(url.pathname) + url.search, apiEndPoint)
    consola.debug(`[Icon] fetching ${(icons || []).map(i => '`' + collectionName + ':' + i + '`').join(',')} from iconify api`)
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError$1({ status: 400, message: 'Invalid icon request' })
    }
    try {
      const data = await $fetch(apiUrl.href)
      return data
    } catch (e) {
      consola.error(e)
      if (e.status === 404)
        return createError$1({ status: 404 })
      else
        return createError$1({ status: 500, message: 'Failed to fetch fallback icon' })
    }
  }
  return createError$1({ status: 404 })
}, {
  group: 'nuxt',
  name: 'icon',
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, '') || 'unknown'
    const icons = String(getQuery(event).icons || '')
    return `${collection}_${icons.split(',')[0]}_${icons.length}_${hash$1(icons)}`
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
})

const _9Qri9Q = eventHandler(async (e) => {
  if (e.context._initedSiteConfig)
    return
  const runtimeConfig = useRuntimeConfig(e)
  const config = runtimeConfig['nuxt-site-config']
  const nitroApp = useNitroApp()
  const siteConfig = e.context.siteConfig || createSiteConfigStack({
    debug: config.debug
  })
  const nitroOrigin = getNitroOrigin(e)
  e.context.siteConfigNitroOrigin = nitroOrigin
  {
    siteConfig.push({
      _context: 'nitro:init',
      _priority: -4,
      url: nitroOrigin
    })
  }
  siteConfig.push({
    _context: 'runtimeEnv',
    _priority: 0,
    ...runtimeConfig.site || {},
    ...runtimeConfig.public.site || {},
    ...envSiteConfig(globalThis._importMeta_.env || {})
    // just in-case, shouldn't be needed
  })
  const buildStack = config.stack || []
  buildStack.forEach(c => siteConfig.push(c))
  if (e.context._nitro.routeRules.site) {
    siteConfig.push({
      _context: 'route-rules',
      ...e.context._nitro.routeRules.site
    })
  }
  if (config.multiTenancy) {
    const host = parseURL(nitroOrigin).host?.replace(/:\d+$/, '') || ''
    const tenant = config.multiTenancy?.find(t => t.hosts.includes(host))
    if (tenant) {
      siteConfig.push({
        _context: `multi-tenancy:${host}`,
        _priority: 0,
        ...tenant.config
      })
    }
  }
  const ctx = { siteConfig, event: e }
  await nitroApp.hooks.callHook('site-config:init', ctx)
  e.context.siteConfig = ctx.siteConfig
  e.context._initedSiteConfig = true
})

const logger = createConsola({
  defaults: {
    tag: '@nuxt/sitemap'
  }
})
const merger = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value))
    obj[key] = Array.from(/* @__PURE__ */ new Set([...obj[key], ...value]))
  return obj[key]
})
function mergeOnKey(arr, key) {
  const seen = /* @__PURE__ */ new Map()
  let resultLength = 0
  const result = Array.from({ length: arr.length })
  for (const item of arr) {
    const k = item[key]
    if (seen.has(k)) {
      const existingIndex = seen.get(k)
      result[existingIndex] = merger(item, result[existingIndex])
    } else {
      seen.set(k, resultLength)
      result[resultLength++] = item
    }
  }
  result.length = resultLength
  return result
}
function splitForLocales(path, locales) {
  const prefix = withLeadingSlash(path).split('/')[1]
  if (prefix && locales.includes(prefix))
    return [prefix, path.replace(`/${prefix}`, '')]
  return [null, path]
}
const StringifiedRegExpPattern = /\/(.*?)\/([gimsuy]*)$/
function normalizeRuntimeFilters(input) {
  return (input || []).map((rule) => {
    if (rule instanceof RegExp || typeof rule === 'string')
      return rule
    const match = rule.regex.match(StringifiedRegExpPattern)
    if (match)
      return new RegExp(match[1], match[2])
    return false
  }).filter(Boolean)
}
function createPathFilter(options = {}) {
  const urlFilter = createFilter(options)
  return (loc) => {
    let path = loc
    try {
      path = parseURL(loc).pathname
    } catch {
      return false
    }
    return urlFilter(path)
  }
}
function findPageMapping(pathWithoutPrefix, pages) {
  const stripped = pathWithoutPrefix[0] === '/' ? pathWithoutPrefix.slice(1) : pathWithoutPrefix
  const pageKey = stripped.endsWith('/index') ? stripped.slice(0, -6) || 'index' : stripped || 'index'
  if (pages[pageKey])
    return { mappings: pages[pageKey], paramSegments: [] }
  const sortedKeys = Object.keys(pages).sort((a, b) => b.length - a.length)
  for (const key of sortedKeys) {
    if (pageKey.startsWith(key + '/')) {
      const paramPath = pageKey.slice(key.length + 1)
      return { mappings: pages[key], paramSegments: paramPath.split('/') }
    }
  }
  return null
}
function applyDynamicParams(customPath, paramSegments) {
  if (!paramSegments.length)
    return customPath
  let i = 0
  return customPath.replace(/\[[^\]]+\]/g, () => paramSegments[i++] || '')
}
function createFilter(options = {}) {
  const include = options.include || []
  const exclude = options.exclude || []
  if (include.length === 0 && exclude.length === 0)
    return () => true
  const excludeRegex = exclude.filter(r => r instanceof RegExp)
  const includeRegex = include.filter(r => r instanceof RegExp)
  const excludeStrings = exclude.filter(r => typeof r === 'string')
  const includeStrings = include.filter(r => typeof r === 'string')
  const excludeMatcher = excludeStrings.length > 0
    ? toRouteMatcher(createRouter$1({
        routes: Object.fromEntries(excludeStrings.map(r => [r, true])),
        strictTrailingSlash: false
      }))
    : null
  const includeMatcher = includeStrings.length > 0
    ? toRouteMatcher(createRouter$1({
        routes: Object.fromEntries(includeStrings.map(r => [r, true])),
        strictTrailingSlash: false
      }))
    : null
  const excludeExact = new Set(excludeStrings)
  const includeExact = new Set(includeStrings)
  return function (path) {
    if (excludeRegex.some(r => r.test(path)))
      return false
    if (excludeExact.has(path))
      return false
    if (excludeMatcher && excludeMatcher.matchAll(path).length > 0)
      return false
    if (includeRegex.some(r => r.test(path)))
      return true
    if (includeExact.has(path))
      return true
    if (includeMatcher && includeMatcher.matchAll(path).length > 0)
      return true
    return include.length === 0
  }
}

function xmlEscape(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
function useSitemapRuntimeConfig(e) {
  const clone = JSON.parse(JSON.stringify(useRuntimeConfig(e).sitemap))
  for (const k in clone.sitemaps) {
    const sitemap = clone.sitemaps[k]
    sitemap.include = normalizeRuntimeFilters(sitemap.include)
    sitemap.exclude = normalizeRuntimeFilters(sitemap.exclude)
    clone.sitemaps[k] = sitemap
  }
  return Object.freeze(clone)
}

const _ROPVcg = defineEventHandler(async (e) => {
  const fixPath = createSitePathResolver(e, { absolute: false, withBase: true })
  const { sitemapName: fallbackSitemapName, cacheMaxAgeSeconds, version, xslColumns, xslTips } = useSitemapRuntimeConfig()
  setHeader(e, 'Content-Type', 'application/xslt+xml')
  if (cacheMaxAgeSeconds)
    setHeader(e, 'Cache-Control', `public, max-age=${cacheMaxAgeSeconds}, must-revalidate`)
  else
    setHeader(e, 'Cache-Control', `no-cache, no-store`)
  const { name: siteName, url: siteUrl } = useSiteConfig(e)
  const referrer = getHeader(e, 'Referer') || '/'
  const referrerPath = parseURL(referrer).pathname
  const isNotIndexButHasIndex = referrerPath !== '/sitemap.xml' && referrerPath !== '/sitemap_index.xml' && referrerPath.endsWith('.xml')
  const sitemapName = parseURL(referrer).pathname.split('/').pop()?.split('-sitemap')[0] || fallbackSitemapName
  const title = `${siteName}${sitemapName !== 'sitemap.xml' ? ` - ${sitemapName === 'sitemap_index.xml' ? 'index' : sitemapName}` : ''}`.replace(/&/g, '&amp;')
  getQuery$1(referrer).canonical
  const debugUrl = xmlEscape(withQuery('/__sitemap__/debug.json', { sitemap: sitemapName }))
  xmlEscape(referrerPath)
  xmlEscape(withQuery(referrerPath, { canonical: '' }))
  const fetchErrors = []
  const xslQuery = getQuery(e)
  if (xslQuery.error_messages) {
    const errorMessages = xslQuery.error_messages
    const errorUrls = xslQuery.error_urls
    if (errorMessages) {
      const messages = Array.isArray(errorMessages) ? errorMessages : [errorMessages]
      const urls = Array.isArray(errorUrls) ? errorUrls : errorUrls ? [errorUrls] : []
      messages.forEach((msg, i) => {
        const errorParts = [xmlEscape(msg)]
        if (urls[i])
          errorParts.push(xmlEscape(urls[i]))
        fetchErrors.push(`<span class="error-item">${errorParts.join(' \u2014 ')}</span>`)
      })
    }
  }
  const hasRuntimeErrors = fetchErrors.length > 0
  let columns = [...xslColumns]
  if (!columns.length) {
    columns = [
      { label: 'URL', width: '50%' },
      { label: 'Images', width: '25%', select: 'count(image:image)' },
      { label: 'Last Updated', width: '25%', select: 'concat(substring(sitemap:lastmod,0,11),concat(\' \', substring(sitemap:lastmod,12,5)),concat(\' \', substring(sitemap:lastmod,20,6)))' }
    ]
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          :root {
            --accent: #00dc82;
            --accent-hover: #00b86b;
            --bg: #0a0a0a;
            --bg-elevated: #141414;
            --bg-subtle: #1a1a1a;
            --border: #262626;
            --border-subtle: #1f1f1f;
            --text: #e5e5e5;
            --text-muted: #737373;
            --text-faint: #525252;
            --error: #ef4444;
            --error-bg: rgba(239,68,68,0.1);
            --warning: #f59e0b;
          }
          * { box-sizing: border-box; }
          body {
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
            font-size: 13px;
            color: var(--text);
            background: var(--bg);
            margin: 0;
            padding: 0;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          a { color: inherit; transition: color 0.15s; }
          a:hover { color: var(--accent); }

          /* Debug bar (dev only) */
          .debug-bar {
            position: fixed;
            bottom: 0.75rem;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 0 1rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 100;
            font-size: 11px;
          }
          .debug-bar-brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-muted);
            text-decoration: none;
          }
          .debug-bar-brand:hover { color: var(--text); }
          .debug-bar-brand svg { flex-shrink: 0; }
          .debug-bar-hint {
            color: var(--text-faint);
            margin-right: auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .debug-bar-hint code {
            background: var(--bg-subtle);
            padding: 0.1rem 0.3rem;
            border-radius: 3px;
            font-size: 10px;
          }
          .mode-badge {
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
          }
          .mode-dev { background: rgba(245,158,11,0.15); color: var(--warning); }
          .mode-prod { background: rgba(0,220,130,0.12); color: var(--accent); }
          .mode-toggle {
            display: inline-flex;
            border-radius: 4px;
            overflow: hidden;
            background: var(--bg-subtle);
            padding: 2px;
            gap: 1px;
          }
          .mode-toggle a {
            padding: 0.2rem 0.4rem;
            font-size: 9px;
            font-weight: 500;
            text-decoration: none;
            color: var(--text-muted);
            border-radius: 2px;
            transition: all 0.15s;
          }
          .mode-toggle a:hover { color: var(--text); }
          .mode-toggle a.active {
            background: var(--accent);
            color: #0a0a0a;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-size: 10px;
            font-weight: 500;
            transition: all 0.15s;
          }
          .btn-primary {
            background: var(--accent);
            color: #0a0a0a;
          }
          .btn-primary:hover { background: var(--accent-hover); color: #0a0a0a; }
          .btn svg { width: 12px; height: 12px; }

          /* Error banner */
          .error-banner {
            background: var(--error-bg);
            border-bottom: 1px solid rgba(239,68,68,0.2);
            padding: 0.75rem 1.5rem;
            color: #fca5a5;
            font-size: 12px;
          }
          .error-banner strong { color: var(--error); }
          .error-item { display: block; margin-top: 0.375rem; color: #fca5a5; }
          .error-debug-link {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            margin-top: 0.625rem;
            padding: 0.25rem 0.5rem;
            background: var(--error);
            color: #fff;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            text-decoration: none;
            transition: background 0.15s;
          }
          .error-debug-link:hover { background: #dc2626; color: #fff; }

          /* Main content */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem;
          }
          .header {
            margin-bottom: 1.25rem;
          }
          .header h1 {
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.25rem 0;
            color: var(--text);
          }
          .header-meta {
            color: var(--text-muted);
            font-size: 12px;
          }
          .header-meta a {
            color: var(--text-muted);
            text-decoration: underline;
            text-decoration-color: var(--border);
            text-underline-offset: 2px;
          }
          .header-meta a:hover { color: var(--accent); text-decoration-color: var(--accent); }

          /* Table */
          .table-wrap {
            border: 1px solid var(--border);
            border-radius: 8px;
            overflow: hidden;
            background: var(--bg-elevated);
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            text-align: left;
            padding: 0.625rem 1rem;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            background: var(--bg-subtle);
            border-bottom: 1px solid var(--border);
          }
          td {
            padding: 0.5rem 1rem;
            border-bottom: 1px solid var(--border-subtle);
            font-size: 12px;
            color: var(--text);
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: rgba(255,255,255,0.02); }
          td a {
            text-decoration: none;
            word-break: break-all;
            color: var(--text);
          }
          td a:hover { color: var(--accent); }
          .inline-warning {
            font-size: 11px;
            color: var(--warning);
            margin-top: 0.25rem;
            line-height: 1.4;
          }
          .inline-warning::before {
            content: "\u26A0 ";
          }
          .count {
            display: inline-block;
            min-width: 1.25rem;
            padding: 0.125rem 0.375rem;
            background: var(--bg-subtle);
            border-radius: 4px;
            text-align: center;
            font-size: 11px;
            color: var(--text-muted);
            font-variant-numeric: tabular-nums;
          }
          .count:empty::before { content: "0"; }

          /* Light mode */
          @media (prefers-color-scheme: light) {
            :root {
              --accent: #00a963;
              --accent-hover: #008f54;
              --bg: #ffffff;
              --bg-elevated: #f5f5f5;
              --bg-subtle: #ebebeb;
              --border: #d4d4d4;
              --border-subtle: #e5e5e5;
              --text: #171717;
              --text-muted: #525252;
              --text-faint: #737373;
              --error: #dc2626;
              --error-bg: rgba(220,38,38,0.08);
              --warning: #b45309;
            }
            tr:hover td { background: rgba(0,0,0,0.02); }
            .btn-primary { color: #fff; }
            .btn-primary:hover { color: #fff; }
            .mode-toggle a.active { color: #fff; }
            .error-banner { color: #991b1b; }
            .error-item { color: #b91c1c; }
            .error-debug-link { color: #fff; }
            .error-debug-link:hover { color: #fff; }
          }

          .debug-bar-version {
            color: var(--text-faint);
            font-size: 10px;
          }

          /* Responsive */
          @media (max-width: 640px) {
            .debug-bar { padding: 0 0.75rem; gap: 0.5rem; width: 95%; }
            .debug-bar-brand span { display: none; }
            .debug-bar-hint { display: none; }
            .debug-bar-version { display: none; }
            .mode-badge { display: none; }
            .container { padding: 1rem; }
            th, td { padding: 0.5rem 0.75rem; }
          }
          ${''}
        </style>
      </head>
      <body>
        ${hasRuntimeErrors
          ? `<div class="error-banner">
            <strong>Sitemap Generation Errors</strong>
            ${fetchErrors.join('')}
            <a href="${debugUrl}" target="_blank" class="error-debug-link">View Debug Info \u2192</a>
          </div>`
          : ''}
        <div class="container">
          <div class="header">
            <h1>${xmlEscape(title)}</h1>
            <div class="header-meta">
              ${isNotIndexButHasIndex ? `Part of <a href="${xmlEscape(fixPath('/sitemap_index.xml'))}">${xmlEscape(fixPath('/sitemap_index.xml'))}</a> \xB7 ` : ''}
              <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
                <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps
              </xsl:if>
              <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
              </xsl:if>
            </div>
          </div>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style="width:70%">Sitemap</th>
                    <th style="width:30%">Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <xsl:variable name="sitemapURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <tr>
                      <td>
                        <a href="{$sitemapURL}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:value-of
                          select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    ${columns.map(c => `<th style="width:${c.width}">${c.label}</th>`).join('\n')}
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td>
                        <xsl:variable name="itemURL">
                          <xsl:value-of select="sitemap:loc"/>
                        </xsl:variable>
                        <a href="{$itemURL}">
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                        ${''}
                      </td>
                      ${columns.filter(c => c.label !== 'URL').map(c => `<td><span class="count"><xsl:value-of select="${c.select}"/></span></td>`).join('\n')}
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
        </div>
        ${''}
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`
})

function withoutQuery(path) {
  return path.split('?')[0]
}
function createNitroRouteRuleMatcher() {
  const { nitro, app } = useRuntimeConfig()
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [path === '/' ? path : withoutTrailingSlash(path), rules])
      )
    })
  )
  return (pathOrUrl) => {
    const path = pathOrUrl[0] === '/' ? pathOrUrl : parseURL(pathOrUrl, app.baseURL).pathname
    const pathWithoutQuery = withoutQuery(path)
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(pathWithoutQuery === '/' ? pathWithoutQuery : withoutTrailingSlash(pathWithoutQuery), app.baseURL)
    ).reverse())
  }
}

function resolve(s, resolvers) {
  if (typeof s === 'undefined')
    return void 0
  const str = typeof s === 'string' ? s : s.toString()
  if (!resolvers)
    return str
  if (hasProtocol(str, { acceptRelative: true, strict: false }))
    return resolvers.fixSlashes(str)
  return resolvers.canonicalUrlResolver(str)
}
function removeTrailingSlash(s) {
  return s.replace(/\/(\?|#|$)/, '$1')
}
function preNormalizeEntry(_e, resolvers) {
  const input = typeof _e === 'string' ? { loc: _e } : { ..._e }
  if (input.url && !input.loc) {
    input.loc = input.url
  }
  delete input.url
  if (typeof input.loc !== 'string') {
    input.loc = ''
  }
  const skipEncoding = input._encoded === true
  const e = input
  e.loc = removeTrailingSlash(e.loc)
  e._abs = hasProtocol(e.loc, { acceptRelative: false, strict: false })
  try {
    e._path = e._abs ? parseURL(e.loc) : parsePath(e.loc)
  } catch {
    e._path = null
  }
  if (e._path) {
    const search = e._path.search
    const qs = search && search.length > 1 ? stringifyQuery(parseQuery(search)) : ''
    const pathname = skipEncoding ? e._path.pathname : encodePath(e._path.pathname)
    e._relativeLoc = `${pathname}${qs.length ? `?${qs}` : ''}`
    if (e._path.host) {
      e.loc = stringifyParsedURL(e._path)
    } else {
      e.loc = e._relativeLoc
    }
  } else if (!skipEncoding && !isEncoded(e.loc)) {
    e.loc = encodeURI(e.loc)
  }
  if (e.loc === '')
    e.loc = `/`
  e.loc = resolve(e.loc, resolvers)
  e._key = `${e._sitemap || ''}${withoutTrailingSlash(e.loc)}`
  return e
}
function isEncoded(url) {
  try {
    return url !== decodeURIComponent(url)
  } catch {
    return false
  }
}
function normaliseEntry(_e, defaults, resolvers) {
  const e = defu(_e, defaults)
  if (e.lastmod) {
    const date = normaliseDate(e.lastmod)
    if (date)
      e.lastmod = date
    else
      delete e.lastmod
  }
  if (!e.lastmod)
    delete e.lastmod
  e.loc = resolve(e.loc, resolvers)
  if (e.alternatives) {
    const alternatives = e.alternatives.map(a => ({ ...a }))
    for (const alt of alternatives) {
      if (typeof alt.href === 'string') {
        alt.href = resolve(alt.href, resolvers)
      } else if (typeof alt.href === 'object' && alt.href) {
        alt.href = resolve(alt.href.href, resolvers)
      }
    }
    e.alternatives = mergeOnKey(alternatives, 'hreflang')
  }
  if (e.images) {
    const images = e.images.map(i => ({ ...i }))
    for (const img of images) {
      img.loc = resolve(img.loc, resolvers)
    }
    e.images = mergeOnKey(images, 'loc')
  }
  if (e.videos) {
    const videos = e.videos.map(v => ({ ...v }))
    for (const video of videos) {
      if (video.content_loc) {
        video.content_loc = resolve(video.content_loc, resolvers)
      }
    }
    e.videos = mergeOnKey(videos, 'content_loc')
  }
  return e
}
const IS_VALID_W3C_DATE = [
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  /^\d{4}-[01]\d-[0-3]\d$/,
  /^\d{4}-[01]\d$/,
  /^\d{4}$/
]
function isValidW3CDate(d) {
  return IS_VALID_W3C_DATE.some(r => r.test(d))
}
function normaliseDate(d) {
  if (typeof d === 'string') {
    const tIdx = d.indexOf('T')
    if (tIdx !== -1) {
      const t = d.slice(tIdx + 1)
      if (!t.includes('+') && !t.includes('-') && !t.includes('Z')) {
        d += 'Z'
      }
    }
    if (!isValidW3CDate(d))
      return false
    d = new Date(d)
    d.setMilliseconds(0)
    if (Number.isNaN(d.getTime()))
      return false
  }
  const z = n => `0${n}`.slice(-2)
  const date = `${d.getUTCFullYear()}-${z(d.getUTCMonth() + 1)}-${z(d.getUTCDate())}`
  if (d.getUTCHours() > 0 || d.getUTCMinutes() > 0 || d.getUTCSeconds() > 0) {
    return `${date}T${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}Z`
  }
  return date
}

function isValidString(value) {
  return typeof value === 'string' && value.trim().length > 0
}
function parseNumber(value) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim()) {
    const num = Number.parseFloat(value.trim())
    return Number.isNaN(num) ? void 0 : num
  }
  return void 0
}
function parseInteger(value) {
  if (typeof value === 'number') return Math.floor(value)
  if (typeof value === 'string' && value.trim()) {
    const num = Number.parseInt(value.trim(), 10)
    return Number.isNaN(num) ? void 0 : num
  }
  return void 0
}
function extractUrlFromParsedElement(urlElement, warnings) {
  if (!isValidString(urlElement.loc)) {
    warnings.push({
      type: 'validation',
      message: 'URL entry missing required loc element',
      context: { url: String(urlElement.loc || 'undefined') }
    })
    return null
  }
  const urlObj = { loc: urlElement.loc }
  if (isValidString(urlElement.lastmod)) {
    urlObj.lastmod = urlElement.lastmod
  }
  if (isValidString(urlElement.changefreq)) {
    const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
    if (validFreqs.includes(urlElement.changefreq)) {
      urlObj.changefreq = urlElement.changefreq
    } else {
      warnings.push({
        type: 'validation',
        message: 'Invalid changefreq value',
        context: { url: urlElement.loc, field: 'changefreq', value: urlElement.changefreq }
      })
    }
  }
  const priority = parseNumber(urlElement.priority)
  if (priority !== void 0 && !Number.isNaN(priority)) {
    if (priority < 0 || priority > 1) {
      warnings.push({
        type: 'validation',
        message: 'Priority value should be between 0.0 and 1.0, clamping to valid range',
        context: { url: urlElement.loc, field: 'priority', value: priority }
      })
    }
    urlObj.priority = Math.max(0, Math.min(1, priority))
  } else if (urlElement.priority !== void 0) {
    warnings.push({
      type: 'validation',
      message: 'Invalid priority value',
      context: { url: urlElement.loc, field: 'priority', value: urlElement.priority }
    })
  }
  if (urlElement.image) {
    const images = Array.isArray(urlElement.image) ? urlElement.image : [urlElement.image]
    const validImages = images.map((img) => {
      if (isValidString(img.loc)) {
        return { loc: img.loc }
      } else {
        warnings.push({
          type: 'validation',
          message: 'Image missing required loc element',
          context: { url: urlElement.loc, field: 'image.loc' }
        })
        return null
      }
    }).filter(img => img !== null)
    if (validImages.length > 0) {
      urlObj.images = validImages
    }
  }
  if (urlElement.video) {
    const videos = Array.isArray(urlElement.video) ? urlElement.video : [urlElement.video]
    const validVideos = videos.map((video) => {
      const missingFields = []
      if (!isValidString(video.title)) missingFields.push('title')
      if (!isValidString(video.thumbnail_loc)) missingFields.push('thumbnail_loc')
      if (!isValidString(video.description)) missingFields.push('description')
      if (!isValidString(video.content_loc)) missingFields.push('content_loc')
      if (missingFields.length > 0) {
        warnings.push({
          type: 'validation',
          message: `Video missing required fields: ${missingFields.join(', ')}`,
          context: { url: urlElement.loc, field: 'video' }
        })
        return null
      }
      const videoObj = {
        title: video.title,
        thumbnail_loc: video.thumbnail_loc,
        description: video.description,
        content_loc: video.content_loc
      }
      if (isValidString(video.player_loc)) {
        videoObj.player_loc = video.player_loc
      }
      const duration = parseInteger(video.duration)
      if (duration !== void 0) {
        videoObj.duration = duration
      } else if (video.duration !== void 0) {
        warnings.push({
          type: 'validation',
          message: 'Invalid video duration value',
          context: { url: urlElement.loc, field: 'video.duration', value: video.duration }
        })
      }
      if (isValidString(video.expiration_date)) {
        videoObj.expiration_date = video.expiration_date
      }
      const rating = parseNumber(video.rating)
      if (rating !== void 0) {
        if (rating < 0 || rating > 5) {
          warnings.push({
            type: 'validation',
            message: 'Video rating should be between 0.0 and 5.0',
            context: { url: urlElement.loc, field: 'video.rating', value: rating }
          })
        }
        videoObj.rating = rating
      } else if (video.rating !== void 0) {
        warnings.push({
          type: 'validation',
          message: 'Invalid video rating value',
          context: { url: urlElement.loc, field: 'video.rating', value: video.rating }
        })
      }
      const viewCount = parseInteger(video.view_count)
      if (viewCount !== void 0) {
        videoObj.view_count = viewCount
      } else if (video.view_count !== void 0) {
        warnings.push({
          type: 'validation',
          message: 'Invalid video view_count value',
          context: { url: urlElement.loc, field: 'video.view_count', value: video.view_count }
        })
      }
      if (isValidString(video.publication_date)) {
        videoObj.publication_date = video.publication_date
      }
      if (isValidString(video.family_friendly)) {
        const validValues = ['yes', 'no']
        if (validValues.includes(video.family_friendly)) {
          videoObj.family_friendly = video.family_friendly
        } else {
          warnings.push({
            type: 'validation',
            message: 'Invalid video family_friendly value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: 'video.family_friendly', value: video.family_friendly }
          })
        }
      }
      if (isValidString(video.requires_subscription)) {
        const validValues = ['yes', 'no']
        if (validValues.includes(video.requires_subscription)) {
          videoObj.requires_subscription = video.requires_subscription
        } else {
          warnings.push({
            type: 'validation',
            message: 'Invalid video requires_subscription value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: 'video.requires_subscription', value: video.requires_subscription }
          })
        }
      }
      if (isValidString(video.live)) {
        const validValues = ['yes', 'no']
        if (validValues.includes(video.live)) {
          videoObj.live = video.live
        } else {
          warnings.push({
            type: 'validation',
            message: 'Invalid video live value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: 'video.live', value: video.live }
          })
        }
      }
      if (video.restriction && typeof video.restriction === 'object') {
        const restriction = video.restriction
        if (isValidString(restriction.relationship) && isValidString(restriction['#text'])) {
          const validRelationships = ['allow', 'deny']
          if (validRelationships.includes(restriction.relationship)) {
            videoObj.restriction = {
              relationship: restriction.relationship,
              restriction: restriction['#text']
            }
          } else {
            warnings.push({
              type: 'validation',
              message: 'Invalid video restriction relationship, should be "allow" or "deny"',
              context: { url: urlElement.loc, field: 'video.restriction.relationship', value: restriction.relationship }
            })
          }
        }
      }
      if (video.platform && typeof video.platform === 'object') {
        const platform = video.platform
        if (isValidString(platform.relationship) && isValidString(platform['#text'])) {
          const validRelationships = ['allow', 'deny']
          if (validRelationships.includes(platform.relationship)) {
            videoObj.platform = {
              relationship: platform.relationship,
              platform: platform['#text']
            }
          } else {
            warnings.push({
              type: 'validation',
              message: 'Invalid video platform relationship, should be "allow" or "deny"',
              context: { url: urlElement.loc, field: 'video.platform.relationship', value: platform.relationship }
            })
          }
        }
      }
      if (video.price) {
        const prices = Array.isArray(video.price) ? video.price : [video.price]
        const validPrices = prices.map((price) => {
          const priceValue = price['#text']
          if (priceValue == null || typeof priceValue !== 'string' && typeof priceValue !== 'number') {
            warnings.push({
              type: 'validation',
              message: 'Video price missing value',
              context: { url: urlElement.loc, field: 'video.price' }
            })
            return null
          }
          const validTypes = ['rent', 'purchase', 'package', 'subscription']
          if (price.type && !validTypes.includes(price.type)) {
            warnings.push({
              type: 'validation',
              message: `Invalid video price type "${price.type}", should be one of: ${validTypes.join(', ')}`,
              context: { url: urlElement.loc, field: 'video.price.type', value: price.type }
            })
          }
          return {
            price: String(priceValue),
            currency: price.currency,
            type: price.type
          }
        }).filter(p => p !== null)
        if (validPrices.length > 0) {
          videoObj.price = validPrices
        }
      }
      if (video.uploader && typeof video.uploader === 'object') {
        const uploader = video.uploader
        if (isValidString(uploader.info) && isValidString(uploader['#text'])) {
          videoObj.uploader = {
            uploader: uploader['#text'],
            info: uploader.info
          }
        } else {
          warnings.push({
            type: 'validation',
            message: 'Video uploader missing required info or name',
            context: { url: urlElement.loc, field: 'video.uploader' }
          })
        }
      }
      if (video.tag) {
        const tags = Array.isArray(video.tag) ? video.tag : [video.tag]
        const validTags = tags.filter(isValidString)
        if (validTags.length > 0) {
          videoObj.tag = validTags
        }
      }
      return videoObj
    }).filter(video => video !== null)
    if (validVideos.length > 0) {
      urlObj.videos = validVideos
    }
  }
  if (urlElement.link) {
    const links = Array.isArray(urlElement.link) ? urlElement.link : [urlElement.link]
    const alternatives = links.map((link) => {
      if (link.rel === 'alternate' && isValidString(link.hreflang) && isValidString(link.href)) {
        return {
          hreflang: link.hreflang,
          href: link.href
        }
      } else {
        warnings.push({
          type: 'validation',
          message: 'Alternative link missing required rel="alternate", hreflang, or href',
          context: { url: urlElement.loc, field: 'link' }
        })
        return null
      }
    }).filter(alt => alt !== null)
    if (alternatives.length > 0) {
      urlObj.alternatives = alternatives
    }
  }
  if (urlElement.news && typeof urlElement.news === 'object') {
    const news = urlElement.news
    if (isValidString(news.title) && isValidString(news.publication_date) && news.publication && isValidString(news.publication.name) && isValidString(news.publication.language)) {
      urlObj.news = {
        title: news.title,
        publication_date: news.publication_date,
        publication: {
          name: news.publication.name,
          language: news.publication.language
        }
      }
    } else {
      warnings.push({
        type: 'validation',
        message: 'News entry missing required fields (title, publication_date, publication.name, publication.language)',
        context: { url: urlElement.loc, field: 'news' }
      })
    }
  }
  return Object.fromEntries(
    Object.entries(urlObj).filter(
      ([_, value]) => value != null && (!Array.isArray(value) || value.length > 0)
    )
  )
}
async function parseSitemapXml(xml) {
  const warnings = []
  if (!xml) {
    throw new Error('Empty XML input provided')
  }
  const { XMLParser } = await import('fast-xml-parser')
  const parser = new XMLParser({
    isArray: tagName => ['url', 'image', 'video', 'link', 'tag', 'price'].includes(tagName),
    removeNSPrefix: true,
    parseAttributeValue: false,
    ignoreAttributes: false,
    attributeNamePrefix: '',
    trimValues: true
  })
  try {
    const parsed = parser.parse(xml)
    if (!parsed?.urlset) {
      throw new Error('XML does not contain a valid urlset element')
    }
    if (!parsed.urlset.url) {
      throw new Error('Sitemap contains no URL entries')
    }
    const urls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url]
    const validUrls = urls.map(url => extractUrlFromParsedElement(url, warnings)).filter(url => url !== null)
    if (validUrls.length === 0 && urls.length > 0) {
      warnings.push({
        type: 'validation',
        message: 'No valid URLs found in sitemap after validation'
      })
    }
    return { urls: validUrls, warnings }
  } catch (error) {
    if (error instanceof Error && (error.message === 'Empty XML input provided' || error.message === 'XML does not contain a valid urlset element' || error.message === 'Sitemap contains no URL entries')) {
      throw error
    }
    throw new Error(`Failed to parse XML: ${error instanceof Error ? error.message : String(error)}`)
  }
}

new XMLParser({
  isArray: tagName => tagName === 'sitemap',
  removeNSPrefix: true,
  trimValues: true
})

function normalizeSourceInput(source) {
  if (typeof source === 'string') {
    return { context: { name: 'hook' }, fetch: source }
  }
  if (Array.isArray(source)) {
    return { context: { name: 'hook' }, fetch: source }
  }
  return source
}
async function tryFetchWithFallback(url, options, event) {
  const isExternalUrl = !url.startsWith('/')
  if (isExternalUrl) {
    const strategies = [
      // Strategy 1: Use globalThis.$fetch (original approach)
      () => globalThis.$fetch(url, options),
      // Strategy 2: If event is available, try using event context even for external URLs
      event ? () => event.$fetch(url, options) : null,
      // Strategy 3: Use native fetch as last resort
      () => $fetch(url, options)
    ].filter(Boolean)
    let lastError = null
    for (const strategy of strategies) {
      try {
        return await strategy()
      } catch (error) {
        lastError = error
        continue
      }
    }
    throw lastError
  }
  const fetchContainer = url.startsWith('/') && event ? event : globalThis
  return await fetchContainer.$fetch(url, options)
}
async function fetchDataSource(input, event) {
  const context = typeof input.context === 'string' ? { name: input.context } : input.context || { name: 'fetch' }
  const url = typeof input.fetch === 'string' ? input.fetch : input.fetch[0]
  const options = typeof input.fetch === 'string' ? {} : input.fetch[1]
  const start = Date.now()
  const isExternalUrl = !url.startsWith('/')
  const timeout = isExternalUrl ? 1e4 : options.timeout || 5e3
  const timeoutController = new AbortController()
  const abortRequestTimeout = setTimeout(() => timeoutController.abort(), timeout)
  try {
    let isMaybeErrorResponse = false
    const isXmlRequest = parseURL(url).pathname.endsWith('.xml')
    const mergedHeaders = defu(
      options?.headers,
      {
        Accept: isXmlRequest ? 'text/xml' : 'application/json'
      },
      event && !isExternalUrl ? { host: getRequestHost(event, { xForwardedHost: true }) } : {}
    )
    const fetchOptions = {
      ...options,
      responseType: isXmlRequest ? 'text' : 'json',
      signal: timeoutController.signal,
      headers: mergedHeaders,
      // Use ofetch's built-in retry for external sources
      ...isExternalUrl && {
        retry: 2,
        retryDelay: 200
      },
      // @ts-expect-error untyped
      onResponse({ response }) {
        if (typeof response._data === 'string' && response._data.startsWith('<!DOCTYPE html>'))
          isMaybeErrorResponse = true
      }
    }
    const res = await tryFetchWithFallback(url, fetchOptions, event)
    const timeTakenMs = Date.now() - start
    if (isMaybeErrorResponse) {
      return {
        ...input,
        context,
        urls: [],
        timeTakenMs,
        error: 'Received HTML response instead of JSON'
      }
    }
    let urls = []
    if (typeof res === 'object') {
      urls = res.urls || res
    } else if (typeof res === 'string' && parseURL(url).pathname.endsWith('.xml')) {
      const result = await parseSitemapXml(res)
      urls = result.urls
    }
    return {
      ...input,
      context,
      timeTakenMs,
      urls
    }
  } catch (_err) {
    const error = _err
    if (isExternalUrl) {
      const errorInfo = {
        url,
        timeout,
        error: error.message,
        statusCode: error.response?.status,
        statusText: error.response?.statusText,
        method: options?.method || 'GET'
      }
      logger.error('Failed to fetch external source.', errorInfo)
    } else {
      logger.error('Failed to fetch source.', { url, error: error.message })
    }
    return {
      ...input,
      context,
      urls: [],
      error: error.message,
      _isFailure: true
      // Mark as failure to prevent caching
    }
  } finally {
    if (abortRequestTimeout) {
      clearTimeout(abortRequestTimeout)
    }
  }
}
async function globalSitemapSources() {
  const m = await import('../virtual/global-sources.mjs')
  return [...m.sources]
}
async function childSitemapSources(definition) {
  if (!definition?._hasSourceChunk)
    return []
  const m = await import('../virtual/child-sources.mjs')
  return [...m.sources[definition.sitemapName] || []]
}
async function resolveSitemapSources(sources, event) {
  return (await Promise.all(
    sources.map((source) => {
      const normalized = normalizeSourceInput(source)
      if ('urls' in normalized) {
        return {
          timeTakenMs: 0,
          ...normalized,
          urls: normalized.urls
        }
      }
      if (normalized.fetch)
        return fetchDataSource(normalized, event)
      return {
        ...normalized,
        error: 'Invalid source'
      }
    })
  )).flat()
}

function sortInPlace(urls) {
  urls.sort((a, b) => {
    const aLoc = typeof a === 'string' ? a : a.loc
    const bLoc = typeof b === 'string' ? b : b.loc
    const aSegments = aLoc.split('/').length
    const bSegments = bLoc.split('/').length
    if (aSegments !== bSegments) {
      return aSegments - bSegments
    }
    return aLoc.localeCompare(bLoc, void 0, { numeric: true })
  })
  return urls
}

function parseChunkInfo(sitemapName, sitemaps, defaultChunkSize) {
  defaultChunkSize = defaultChunkSize || 1e3
  if (typeof sitemaps.chunks !== 'undefined' && !Number.isNaN(Number(sitemapName))) {
    return {
      isChunked: true,
      baseSitemapName: 'sitemap',
      chunkIndex: Number(sitemapName),
      chunkSize: defaultChunkSize
    }
  }
  if (sitemapName.includes('-')) {
    const parts = sitemapName.split('-')
    const lastPart = parts.pop()
    if (!Number.isNaN(Number(lastPart))) {
      const baseSitemapName = parts.join('-')
      const baseSitemap = sitemaps[baseSitemapName]
      if (baseSitemap && (baseSitemap.chunks || baseSitemap._isChunking)) {
        const chunkSize = typeof baseSitemap.chunks === 'number' ? baseSitemap.chunks : baseSitemap.chunkSize || defaultChunkSize
        return {
          isChunked: true,
          baseSitemapName,
          chunkIndex: Number(lastPart),
          chunkSize
        }
      }
    }
  }
  return {
    isChunked: false,
    baseSitemapName: sitemapName,
    chunkIndex: void 0,
    chunkSize: defaultChunkSize
  }
}
function getSitemapConfig(sitemapName, sitemaps, defaultChunkSize = 1e3) {
  const chunkInfo = parseChunkInfo(sitemapName, sitemaps, defaultChunkSize)
  if (chunkInfo.isChunked) {
    if (chunkInfo.baseSitemapName === 'sitemap' && typeof sitemaps.chunks !== 'undefined') {
      return {
        ...sitemaps.chunks,
        sitemapName,
        _isChunking: true,
        _chunkSize: chunkInfo.chunkSize
      }
    }
    const baseSitemap = sitemaps[chunkInfo.baseSitemapName]
    if (baseSitemap) {
      return {
        ...baseSitemap,
        sitemapName,
        // Use the full name with chunk index
        _isChunking: true,
        _chunkSize: chunkInfo.chunkSize
      }
    }
  }
  return sitemaps[sitemapName]
}
function sliceUrlsForChunk(urls, sitemapName, sitemaps, defaultChunkSize = 1e3) {
  const chunkInfo = parseChunkInfo(sitemapName, sitemaps, defaultChunkSize)
  if (chunkInfo.isChunked && chunkInfo.chunkIndex !== void 0) {
    const startIndex = chunkInfo.chunkIndex * chunkInfo.chunkSize
    const endIndex = (chunkInfo.chunkIndex + 1) * chunkInfo.chunkSize
    return urls.slice(startIndex, endIndex)
  }
  return urls
}

function escapeValueForXml(value) {
  if (value === true || value === false)
    return value ? 'yes' : 'no'
  return xmlEscape(String(value))
}
const yesNo = v => v === 'yes' || v === true ? 'yes' : 'no'
const URLSET_OPENING_TAG = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
function buildUrlXml(url, NL, I1, I2, I3, I4) {
  let xml = `${I1}<url>${NL}`
  if (url.loc) xml += `${I2}<loc>${xmlEscape(url.loc)}</loc>${NL}`
  if (url.lastmod) xml += `${I2}<lastmod>${url.lastmod}</lastmod>${NL}`
  if (url.changefreq) xml += `${I2}<changefreq>${url.changefreq}</changefreq>${NL}`
  if (url.priority !== void 0) {
    const p = typeof url.priority === 'number' ? url.priority : Number.parseFloat(url.priority)
    xml += `${I2}<priority>${p.toFixed(1)}</priority>${NL}`
  }
  if (url.alternatives) {
    for (const alt of url.alternatives) {
      let attrs = ''
      for (const [k, v] of Object.entries(alt)) attrs += ` ${k}="${xmlEscape(String(v))}"`
      xml += `${I2}<xhtml:link rel="alternate"${attrs} />${NL}`
    }
  }
  if (url.images) {
    for (const img of url.images) {
      xml += `${I2}<image:image>${NL}${I3}<image:loc>${xmlEscape(img.loc)}</image:loc>${NL}`
      if (img.title) xml += `${I3}<image:title>${xmlEscape(img.title)}</image:title>${NL}`
      if (img.caption) xml += `${I3}<image:caption>${xmlEscape(img.caption)}</image:caption>${NL}`
      if (img.geo_location) xml += `${I3}<image:geo_location>${xmlEscape(img.geo_location)}</image:geo_location>${NL}`
      if (img.license) xml += `${I3}<image:license>${xmlEscape(img.license)}</image:license>${NL}`
      xml += `${I2}</image:image>${NL}`
    }
  }
  if (url.videos) {
    for (const video of url.videos) {
      xml += `${I2}<video:video>${NL}${I3}<video:title>${xmlEscape(video.title)}</video:title>${NL}`
      if (video.thumbnail_loc) xml += `${I3}<video:thumbnail_loc>${xmlEscape(video.thumbnail_loc)}</video:thumbnail_loc>${NL}`
      xml += `${I3}<video:description>${xmlEscape(video.description)}</video:description>${NL}`
      if (video.content_loc) xml += `${I3}<video:content_loc>${xmlEscape(video.content_loc)}</video:content_loc>${NL}`
      if (video.player_loc) xml += `${I3}<video:player_loc>${xmlEscape(video.player_loc)}</video:player_loc>${NL}`
      if (video.duration !== void 0) xml += `${I3}<video:duration>${video.duration}</video:duration>${NL}`
      if (video.expiration_date) xml += `${I3}<video:expiration_date>${video.expiration_date}</video:expiration_date>${NL}`
      if (video.rating !== void 0) xml += `${I3}<video:rating>${video.rating}</video:rating>${NL}`
      if (video.view_count !== void 0) xml += `${I3}<video:view_count>${video.view_count}</video:view_count>${NL}`
      if (video.publication_date) xml += `${I3}<video:publication_date>${video.publication_date}</video:publication_date>${NL}`
      if (video.family_friendly !== void 0) xml += `${I3}<video:family_friendly>${yesNo(video.family_friendly)}</video:family_friendly>${NL}`
      if (video.restriction) xml += `${I3}<video:restriction relationship="${video.restriction.relationship || 'allow'}">${xmlEscape(video.restriction.restriction)}</video:restriction>${NL}`
      if (video.platform) xml += `${I3}<video:platform relationship="${video.platform.relationship || 'allow'}">${xmlEscape(video.platform.platform)}</video:platform>${NL}`
      if (video.requires_subscription !== void 0) xml += `${I3}<video:requires_subscription>${yesNo(video.requires_subscription)}</video:requires_subscription>${NL}`
      if (video.price) {
        for (const price of video.price) {
          const c = price.currency ? ` currency="${price.currency}"` : ''
          const t = price.type ? ` type="${price.type}"` : ''
          xml += `${I3}<video:price${c}${t}>${xmlEscape(String(price.price ?? ''))}</video:price>${NL}`
        }
      }
      if (video.uploader) {
        const info = video.uploader.info ? ` info="${xmlEscape(video.uploader.info)}"` : ''
        xml += `${I3}<video:uploader${info}>${xmlEscape(video.uploader.uploader)}</video:uploader>${NL}`
      }
      if (video.live !== void 0) xml += `${I3}<video:live>${yesNo(video.live)}</video:live>${NL}`
      if (video.tag) {
        const tags = Array.isArray(video.tag) ? video.tag : [video.tag]
        for (const t of tags) xml += `${I3}<video:tag>${xmlEscape(t)}</video:tag>${NL}`
      }
      if (video.category) xml += `${I3}<video:category>${xmlEscape(video.category)}</video:category>${NL}`
      if (video.gallery_loc) xml += `${I3}<video:gallery_loc>${xmlEscape(video.gallery_loc)}</video:gallery_loc>${NL}`
      xml += `${I2}</video:video>${NL}`
    }
  }
  if (url.news) {
    xml += `${I2}<news:news>${NL}${I3}<news:publication>${NL}`
    xml += `${I4}<news:name>${xmlEscape(url.news.publication.name)}</news:name>${NL}`
    xml += `${I4}<news:language>${xmlEscape(url.news.publication.language)}</news:language>${NL}`
    xml += `${I3}</news:publication>${NL}`
    if (url.news.title) xml += `${I3}<news:title>${xmlEscape(url.news.title)}</news:title>${NL}`
    if (url.news.publication_date) xml += `${I3}<news:publication_date>${url.news.publication_date}</news:publication_date>${NL}`
    xml += `${I2}</news:news>${NL}`
  }
  xml += `${I1}</url>`
  return xml
}
function urlsToXml(urls, resolvers, { version, xsl, credits, minify }, errorInfo) {
  let xslHref = xsl ? resolvers.relativeBaseUrlResolver(xsl) : false
  if (xslHref && errorInfo?.messages.length) {
    xslHref = withQuery(xslHref, {
      errors: 'true',
      error_messages: errorInfo.messages,
      error_urls: errorInfo.urls
    })
  }
  const NL = minify ? '' : '\n'
  const I1 = minify ? '' : '    '
  const I2 = minify ? '' : '        '
  const I3 = minify ? '' : '            '
  const I4 = minify ? '' : '                '
  let xml = xslHref ? `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${escapeValueForXml(xslHref)}"?>${NL}` : `<?xml version="1.0" encoding="UTF-8"?>${NL}`
  xml += URLSET_OPENING_TAG + NL
  for (const url of urls) {
    xml += buildUrlXml(url, NL, I1, I2, I3, I4) + NL
  }
  xml += '</urlset>'
  if (credits) {
    xml += `${NL}<!-- XML Sitemap generated by @nuxtjs/sitemap v${version} at ${(/* @__PURE__ */ new Date()).toISOString()} -->`
  }
  return xml
}

function resolveSitemapEntries(sitemap, urls, runtimeConfig, resolvers) {
  const {
    autoI18n,
    isI18nMapped
  } = runtimeConfig
  const filterPath = createPathFilter({
    include: sitemap.include,
    exclude: sitemap.exclude
  })
  const _urls = urls.map((_e) => {
    const e = preNormalizeEntry(_e, resolvers)
    if (!e.loc || !filterPath(e.loc))
      return false
    return e
  }).filter(Boolean)
  let validI18nUrlsForTransform = []
  const withoutPrefixPaths = {}
  if (autoI18n && autoI18n.strategy !== 'no_prefix') {
    const localeCodes = autoI18n.locales.map(l => l.code)
    const localeByCode = new Map(autoI18n.locales.map(l => [l.code, l]))
    const isPrefixStrategy = autoI18n.strategy === 'prefix'
    const isPrefixExceptOrAndDefault = autoI18n.strategy === 'prefix_and_default' || autoI18n.strategy === 'prefix_except_default'
    const xDefaultAndLocales = [{ code: 'x-default', _hreflang: 'x-default' }, ...autoI18n.locales]
    const defaultLocale = autoI18n.defaultLocale
    const hasPages = !!autoI18n.pages
    const hasDifferentDomains = !!autoI18n.differentDomains
    validI18nUrlsForTransform = _urls.map((_e, i) => {
      if (_e._abs)
        return false
      const split = splitForLocales(_e._relativeLoc, localeCodes)
      let localeCode = split[0]
      const pathWithoutPrefix = split[1]
      if (!localeCode)
        localeCode = defaultLocale
      const e = _e
      e._pathWithoutPrefix = pathWithoutPrefix
      const locale = localeByCode.get(localeCode)
      if (!locale)
        return false
      e._locale = locale
      e._index = i
      e._key = `${e._sitemap || ''}${e._path?.pathname || '/'}${e._path?.search || ''}`
      withoutPrefixPaths[pathWithoutPrefix] = withoutPrefixPaths[pathWithoutPrefix] || []
      if (!withoutPrefixPaths[pathWithoutPrefix].some(e2 => e2._locale.code === locale.code))
        withoutPrefixPaths[pathWithoutPrefix].push(e)
      return e
    }).filter(Boolean)
    for (const e of validI18nUrlsForTransform) {
      if (!e._i18nTransform && !e.alternatives?.length) {
        const alternatives = (withoutPrefixPaths[e._pathWithoutPrefix] || []).map((u) => {
          const entries = []
          if (u._locale.code === defaultLocale) {
            entries.push({
              href: u.loc,
              hreflang: 'x-default'
            })
          }
          entries.push({
            href: u.loc,
            hreflang: u._locale._hreflang || defaultLocale
          })
          return entries
        }).flat().filter(Boolean)
        if (alternatives.length)
          e.alternatives = alternatives
      } else if (e._i18nTransform) {
        delete e._i18nTransform
        if (hasDifferentDomains) {
          const defLocale = localeByCode.get(defaultLocale)
          e.alternatives = [
            {
              ...defLocale,
              code: 'x-default'
            },
            ...autoI18n.locales.filter(l => !!l.domain)
          ].map((locale) => {
            return {
              hreflang: locale._hreflang,
              href: joinURL(withHttps(locale.domain), e._pathWithoutPrefix)
            }
          })
        } else {
          const pageMatch = hasPages ? findPageMapping(e._pathWithoutPrefix, autoI18n.pages) : null
          const pathSearch = e._path?.search || ''
          const pathWithoutPrefix = e._pathWithoutPrefix
          for (const l of autoI18n.locales) {
            let loc = pathWithoutPrefix
            if (pageMatch && pageMatch.mappings[l.code] !== void 0) {
              const customPath = pageMatch.mappings[l.code]
              if (customPath === false)
                continue
              if (typeof customPath === 'string') {
                loc = customPath[0] === '/' ? customPath : `/${customPath}`
                loc = applyDynamicParams(loc, pageMatch.paramSegments)
                if (isPrefixStrategy || isPrefixExceptOrAndDefault && l.code !== defaultLocale)
                  loc = joinURL(`/${l.code}`, loc)
              }
            } else if (!hasDifferentDomains && !(isPrefixExceptOrAndDefault && l.code === defaultLocale)) {
              loc = joinURL(`/${l.code}`, pathWithoutPrefix)
            }
            const _sitemap = isI18nMapped ? l._sitemap : void 0
            const alternatives = []
            for (const locale of xDefaultAndLocales) {
              const code = locale.code === 'x-default' ? defaultLocale : locale.code
              const isDefault = locale.code === 'x-default' || locale.code === defaultLocale
              let href = pathWithoutPrefix
              if (pageMatch && pageMatch.mappings[code] !== void 0) {
                const customPath = pageMatch.mappings[code]
                if (customPath === false)
                  continue
                if (typeof customPath === 'string') {
                  href = customPath[0] === '/' ? customPath : `/${customPath}`
                  href = applyDynamicParams(href, pageMatch.paramSegments)
                  if (isPrefixStrategy || isPrefixExceptOrAndDefault && !isDefault)
                    href = joinURL('/', code, href)
                }
              } else if (isPrefixStrategy) {
                href = joinURL('/', code, pathWithoutPrefix)
              } else if (isPrefixExceptOrAndDefault && !isDefault) {
                href = joinURL('/', code, pathWithoutPrefix)
              }
              if (!filterPath(href))
                continue
              alternatives.push({
                hreflang: locale._hreflang,
                href
              })
            }
            const { _index: _, ...rest } = e
            const newEntry = preNormalizeEntry({
              _sitemap,
              ...rest,
              _key: `${_sitemap || ''}${loc || '/'}${pathSearch}`,
              _locale: l,
              loc,
              alternatives
            }, resolvers)
            if (e._locale.code === newEntry._locale.code) {
              _urls[e._index] = newEntry
              e._index = void 0
            } else {
              _urls.push(newEntry)
            }
          }
        }
      }
      if (isI18nMapped) {
        e._sitemap = e._sitemap || e._locale._sitemap
        e._key = `${e._sitemap || ''}${e.loc || '/'}${e._path?.search || ''}`
      }
      if (e._index)
        _urls[e._index] = e
    }
  }
  return _urls
}
async function buildSitemapUrls(sitemap, resolvers, runtimeConfig, nitro) {
  const {
    sitemaps,
    // enhancing
    autoI18n,
    isI18nMapped,
    isMultiSitemap,
    // sorting
    sortEntries,
    // chunking
    defaultSitemapsChunkSize
  } = runtimeConfig
  const chunkSize = defaultSitemapsChunkSize || void 0
  const chunkInfo = parseChunkInfo(sitemap.sitemapName, sitemaps, chunkSize)
  function maybeSort(urls2) {
    return sortEntries ? sortInPlace(urls2) : urls2
  }
  function maybeSlice(urls2) {
    return sliceUrlsForChunk(urls2, sitemap.sitemapName, sitemaps, chunkSize)
  }
  if (autoI18n?.differentDomains) {
    const domain = autoI18n.locales.find(e => e.language === sitemap.sitemapName || e.code === sitemap.sitemapName)?.domain
    if (domain) {
      const _tester = resolvers.canonicalUrlResolver
      resolvers.canonicalUrlResolver = path => resolveSitePath(path, {
        absolute: true,
        withBase: false,
        siteUrl: withHttps(domain),
        trailingSlash: _tester('/test/').endsWith('/'),
        base: '/'
      })
    }
  }
  let effectiveSitemap = sitemap
  const baseSitemapName = chunkInfo.baseSitemapName
  if (chunkInfo.isChunked && baseSitemapName !== sitemap.sitemapName && sitemaps[baseSitemapName]) {
    effectiveSitemap = sitemaps[baseSitemapName]
  }
  let sourcesInput = effectiveSitemap.includeAppSources ? [...await globalSitemapSources(), ...await childSitemapSources(effectiveSitemap)] : await childSitemapSources(effectiveSitemap)
  if (nitro && resolvers.event) {
    const ctx = {
      event: resolvers.event,
      sitemapName: baseSitemapName,
      sources: sourcesInput
    }
    await nitro.hooks.callHook('sitemap:sources', ctx)
    sourcesInput = ctx.sources
  }
  const sources = await resolveSitemapSources(sourcesInput, resolvers.event)
  const failedSources = sources.filter(source => source.error && source._isFailure).map(source => ({
    url: typeof source.fetch === 'string' ? source.fetch : source.fetch?.[0] || 'unknown',
    error: source.error || 'Unknown error'
  }))
  const resolvedCtx = {
    urls: sources.flatMap(s => s.urls),
    sitemapName: sitemap.sitemapName,
    event: resolvers.event
  }
  await nitro?.hooks.callHook('sitemap:input', resolvedCtx)
  const enhancedUrls = resolveSitemapEntries(sitemap, resolvedCtx.urls, { autoI18n, isI18nMapped }, resolvers)
  if (isMultiSitemap) {
    const sitemapNames = Object.keys(sitemaps).filter(k => k !== 'index')
    const warnedSitemaps = nitro?._sitemapWarnedSitemaps || /* @__PURE__ */ new Set()
    for (const e of enhancedUrls) {
      if (typeof e._sitemap === 'string' && !sitemapNames.includes(e._sitemap)) {
        if (!warnedSitemaps.has(e._sitemap)) {
          warnedSitemaps.add(e._sitemap)
          logger.error(`Sitemap \`${e._sitemap}\` not found in sitemap config. Available sitemaps: ${sitemapNames.join(', ')}. Entry \`${e.loc}\` will be omitted.`)
        }
      }
    }
    if (nitro) {
      nitro._sitemapWarnedSitemaps = warnedSitemaps
    }
  }
  const filteredUrls = enhancedUrls.filter((e) => {
    if (e._sitemap === false)
      return false
    if (isMultiSitemap && e._sitemap && sitemap.sitemapName) {
      if (sitemap._isChunking)
        return sitemap.sitemapName.startsWith(e._sitemap + '-')
      return e._sitemap === sitemap.sitemapName
    }
    return true
  })
  const sortedUrls = maybeSort(filteredUrls)
  const urls = maybeSlice(sortedUrls)
  return { urls, failedSources }
}

function useNitroUrlResolvers(e) {
  const canonicalQuery = getQuery(e).canonical
  const isShowingCanonical = typeof canonicalQuery !== 'undefined' && canonicalQuery !== 'false'
  const siteConfig = getSiteConfig(e)
  return {
    event: e,
    fixSlashes: path => fixSlashes(siteConfig.trailingSlash, path),
    // we need these as they depend on the nitro event
    canonicalUrlResolver: createSitePathResolver(e, {
      canonical: isShowingCanonical || true,
      absolute: true,
      withBase: true
    }),
    relativeBaseUrlResolver: createSitePathResolver(e, { absolute: false, withBase: true })
  }
}
async function buildSitemapXml(event, definition, resolvers, runtimeConfig) {
  const { sitemapName } = definition
  const nitro = useNitroApp()
  const { urls: sitemapUrls, failedSources } = await buildSitemapUrls(definition, resolvers, runtimeConfig, nitro)
  const routeRuleMatcher = createNitroRouteRuleMatcher()
  const { autoI18n } = runtimeConfig
  let validCount = 0
  for (let i = 0; i < sitemapUrls.length; i++) {
    const u = sitemapUrls[i]
    const path = u._path?.pathname || u.loc
    if (!getPathRobotConfig(event, { path, skipSiteIndexable: true }).indexable)
      continue
    let routeRules = routeRuleMatcher(path)
    if (autoI18n?.locales && autoI18n?.strategy !== 'no_prefix') {
      const match = splitForLocales(path, autoI18n.locales.map(l => l.code))
      const pathWithoutPrefix = match[1]
      if (pathWithoutPrefix && pathWithoutPrefix !== path)
        routeRules = defu(routeRules, routeRuleMatcher(pathWithoutPrefix))
    }
    if (routeRules.sitemap === false)
      continue
    if (typeof routeRules.robots !== 'undefined' && !routeRules.robots)
      continue
    const hasRobotsDisabled = Object.entries(routeRules.headers || {}).some(([name, value]) => name.toLowerCase() === 'x-robots-tag' && value.toLowerCase().includes('noindex'))
    if (routeRules.redirect || hasRobotsDisabled)
      continue
    sitemapUrls[validCount++] = routeRules.sitemap ? defu(u, routeRules.sitemap) : u
  }
  sitemapUrls.length = validCount
  const locSize = sitemapUrls.length
  const resolvedCtx = {
    urls: sitemapUrls,
    sitemapName,
    event
  }
  await nitro.hooks.callHook('sitemap:resolved', resolvedCtx)
  if (resolvedCtx.urls.length !== locSize) {
    resolvedCtx.urls = resolvedCtx.urls.map(e => preNormalizeEntry(e, resolvers))
  }
  const maybeSort = urls2 => runtimeConfig.sortEntries ? sortInPlace(urls2) : urls2
  const defaults = definition.defaults || {}
  const normalizedPreDedupe = resolvedCtx.urls.map(e => normaliseEntry(e, defaults, resolvers))
  const urls = maybeSort(mergeOnKey(normalizedPreDedupe, '_key').map(e => normaliseEntry(e, defaults, resolvers)))
  if (definition._isChunking && definition.sitemapName.includes('-')) {
    const parts = definition.sitemapName.split('-')
    const lastPart = parts.pop()
    if (!Number.isNaN(Number(lastPart))) {
      const chunkIndex = Number(lastPart)
      const baseSitemapName = parts.join('-')
      if (urls.length === 0 && chunkIndex > 0) {
        throw createError$1({
          statusCode: 404,
          message: `Sitemap chunk ${chunkIndex} for "${baseSitemapName}" does not exist.`
        })
      }
    }
  }
  const errorInfo = failedSources.length > 0
    ? {
        messages: failedSources.map(f => f.error),
        urls: failedSources.map(f => f.url)
      }
    : void 0
  const sitemap = urlsToXml(urls, resolvers, runtimeConfig, errorInfo)
  const ctx = { sitemap, sitemapName, event }
  await nitro.hooks.callHook('sitemap:output', ctx)
  return ctx.sitemap
}
const buildSitemapXmlCached = defineCachedFunction(
  buildSitemapXml,
  {
    name: 'sitemap:xml',
    group: 'sitemap',
    maxAge: 60 * 10,
    // Default 10 minutes
    base: 'sitemap',
    // Use the sitemap storage
    getKey: (event, definition) => {
      const host = getHeader(event, 'host') || getHeader(event, 'x-forwarded-host') || ''
      const proto = getHeader(event, 'x-forwarded-proto') || 'https'
      const sitemapName = definition.sitemapName || 'default'
      return `${sitemapName}-${proto}-${host}`
    },
    swr: true
    // Enable stale-while-revalidate
  }
)
async function createSitemap(event, definition, runtimeConfig) {
  const resolvers = useNitroUrlResolvers(event)
  const shouldCache = typeof runtimeConfig.cacheMaxAgeSeconds === 'number' && runtimeConfig.cacheMaxAgeSeconds > 0
  const xml = shouldCache ? await buildSitemapXmlCached(event, definition, resolvers, runtimeConfig) : await buildSitemapXml(event, definition, resolvers, runtimeConfig)
  setHeader(event, 'Content-Type', 'text/xml; charset=UTF-8')
  if (runtimeConfig.cacheMaxAgeSeconds) {
    setHeader(event, 'Cache-Control', `public, max-age=${runtimeConfig.cacheMaxAgeSeconds}, s-maxage=${runtimeConfig.cacheMaxAgeSeconds}, stale-while-revalidate=3600`)
    const now = /* @__PURE__ */ new Date()
    setHeader(event, 'X-Sitemap-Generated', now.toISOString())
    setHeader(event, 'X-Sitemap-Cache-Duration', `${runtimeConfig.cacheMaxAgeSeconds}s`)
    const expiryTime = new Date(now.getTime() + runtimeConfig.cacheMaxAgeSeconds * 1e3)
    setHeader(event, 'X-Sitemap-Cache-Expires', expiryTime.toISOString())
    const remainingSeconds = Math.floor((expiryTime.getTime() - now.getTime()) / 1e3)
    setHeader(event, 'X-Sitemap-Cache-Remaining', `${remainingSeconds}s`)
  } else {
    setHeader(event, 'Cache-Control', `no-cache, no-store`)
  }
  event.context._isSitemap = true
  return xml
}

const buildSitemapIndexCached = defineCachedFunction(
  async (event, resolvers, runtimeConfig, nitro) => {
    return buildSitemapIndexInternal(resolvers, runtimeConfig, nitro)
  },
  {
    name: 'sitemap:index',
    group: 'sitemap',
    maxAge: 60 * 10,
    // 10 minutes default
    base: 'sitemap',
    // Use the sitemap storage
    getKey: (event) => {
      const host = getHeader(event, 'host') || getHeader(event, 'x-forwarded-host') || ''
      const proto = getHeader(event, 'x-forwarded-proto') || 'https'
      return `sitemap-index-${proto}-${host}`
    },
    swr: true
    // Enable stale-while-revalidate
  }
)
async function buildSitemapIndexInternal(resolvers, runtimeConfig, nitro) {
  const {
    sitemaps,
    // enhancing
    autoLastmod,
    // chunking
    defaultSitemapsChunkSize,
    autoI18n,
    isI18nMapped,
    sortEntries,
    sitemapsPathPrefix
  } = runtimeConfig
  if (!sitemaps)
    throw new Error('Attempting to build a sitemap index without required `sitemaps` configuration.')
  function maybeSort(urls) {
    return sortEntries ? sortInPlace(urls) : urls
  }
  const chunks = {}
  const allFailedSources = []
  for (const sitemapName in sitemaps) {
    if (sitemapName === 'index' || sitemapName === 'chunks') continue
    const sitemapConfig = sitemaps[sitemapName]
    if (sitemapConfig.chunks || sitemapConfig._isChunking) {
      sitemapConfig._isChunking = true
      sitemapConfig._chunkSize = typeof sitemapConfig.chunks === 'number' ? sitemapConfig.chunks : sitemapConfig.chunkSize || defaultSitemapsChunkSize || 1e3
    } else {
      chunks[sitemapName] = chunks[sitemapName] || { urls: [] }
    }
  }
  if (typeof sitemaps.chunks !== 'undefined') {
    const sitemap = sitemaps.chunks
    let sourcesInput = await globalSitemapSources()
    if (nitro && resolvers.event) {
      const ctx = {
        event: resolvers.event,
        sitemapName: sitemap.sitemapName,
        sources: sourcesInput
      }
      await nitro.hooks.callHook('sitemap:sources', ctx)
      sourcesInput = ctx.sources
    }
    const sources = await resolveSitemapSources(sourcesInput, resolvers.event)
    const failedSources = sources.filter(source => source.error && source._isFailure).map(source => ({
      url: typeof source.fetch === 'string' ? source.fetch : source.fetch?.[0] || 'unknown',
      error: source.error || 'Unknown error'
    }))
    allFailedSources.push(...failedSources)
    const resolvedCtx = {
      urls: sources.flatMap(s => s.urls),
      sitemapName: sitemap.sitemapName,
      event: resolvers.event
    }
    await nitro?.hooks.callHook('sitemap:input', resolvedCtx)
    const normalisedUrls = resolveSitemapEntries(sitemap, resolvedCtx.urls, { autoI18n, isI18nMapped }, resolvers)
    const enhancedUrls = normalisedUrls.map(e => defu(e, sitemap.defaults))
    const sortedUrls = maybeSort(enhancedUrls)
    sortedUrls.forEach((url, i) => {
      const chunkIndex = Math.floor(i / defaultSitemapsChunkSize)
      chunks[chunkIndex] = chunks[chunkIndex] || { urls: [] }
      chunks[chunkIndex].urls.push(url)
    })
  }
  const entries = []
  for (const name in chunks) {
    const sitemap = chunks[name]
    const entry = {
      _sitemapName: name,
      sitemap: resolvers.canonicalUrlResolver(joinURL(sitemapsPathPrefix || '', `/${name}.xml`))
    }
    let lastmod = sitemap.urls.filter(a => !!a?.lastmod).map(a => typeof a.lastmod === 'string' ? new Date(a.lastmod) : a.lastmod).sort((a, b) => (b?.getTime() || 0) - (a?.getTime() || 0))?.[0]
    if (!lastmod && autoLastmod)
      lastmod = /* @__PURE__ */ new Date()
    if (lastmod)
      entry.lastmod = normaliseDate(lastmod)
    entries.push(entry)
  }
  for (const sitemapName in sitemaps) {
    const sitemapConfig = sitemaps[sitemapName]
    if (sitemapName !== 'index' && sitemapConfig._isChunking) {
      const chunkSize = sitemapConfig._chunkSize || defaultSitemapsChunkSize || 1e3
      let sourcesInput = sitemapConfig.includeAppSources ? [...await globalSitemapSources(), ...await childSitemapSources(sitemapConfig)] : await childSitemapSources(sitemapConfig)
      if (nitro && resolvers.event) {
        const ctx = {
          event: resolvers.event,
          sitemapName: sitemapConfig.sitemapName,
          sources: sourcesInput
        }
        await nitro.hooks.callHook('sitemap:sources', ctx)
        sourcesInput = ctx.sources
      }
      const sources = await resolveSitemapSources(sourcesInput, resolvers.event)
      const failedSources = sources.filter(source => source.error && source._isFailure).map(source => ({
        url: typeof source.fetch === 'string' ? source.fetch : source.fetch?.[0] || 'unknown',
        error: source.error || 'Unknown error'
      }))
      allFailedSources.push(...failedSources)
      const resolvedCtx = {
        urls: sources.flatMap(s => s.urls),
        sitemapName: sitemapConfig.sitemapName,
        event: resolvers.event
      }
      await nitro?.hooks.callHook('sitemap:input', resolvedCtx)
      const normalisedUrls = resolveSitemapEntries(sitemapConfig, resolvedCtx.urls, { autoI18n, isI18nMapped }, resolvers)
      const totalUrls = normalisedUrls.length
      const chunkCount = Math.ceil(totalUrls / chunkSize)
      sitemapConfig._chunkCount = chunkCount
      for (let i = 0; i < chunkCount; i++) {
        const chunkName = `${sitemapName}-${i}`
        const entry = {
          _sitemapName: chunkName,
          sitemap: resolvers.canonicalUrlResolver(joinURL(sitemapsPathPrefix || '', `/${chunkName}.xml`))
        }
        const chunkUrls = normalisedUrls.slice(i * chunkSize, (i + 1) * chunkSize)
        let lastmod = chunkUrls.filter(a => !!a?.lastmod).map(a => typeof a.lastmod === 'string' ? new Date(a.lastmod) : a.lastmod).sort((a, b) => (b?.getTime() || 0) - (a?.getTime() || 0))?.[0]
        if (!lastmod && autoLastmod)
          lastmod = /* @__PURE__ */ new Date()
        if (lastmod)
          entry.lastmod = normaliseDate(lastmod)
        entries.push(entry)
      }
    }
  }
  if (sitemaps.index) {
    entries.push(...sitemaps.index.sitemaps.map((entry) => {
      return typeof entry === 'string' ? { sitemap: entry } : entry
    }))
  }
  return { entries, failedSources: allFailedSources }
}
function urlsToIndexXml(sitemaps, resolvers, { version, xsl, credits, minify }, errorInfo) {
  const sitemapXml = sitemaps.map(e => [
    '    <sitemap>',
    `        <loc>${escapeValueForXml(e.sitemap)}</loc>`,
    // lastmod is optional
    e.lastmod ? `        <lastmod>${escapeValueForXml(e.lastmod)}</lastmod>` : false,
    '    </sitemap>'
  ].filter(Boolean).join('\n')).join('\n')
  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>'
  ]
  if (xsl) {
    let relativeBaseUrl = resolvers.relativeBaseUrlResolver?.(xsl) ?? xsl
    if (errorInfo && errorInfo.messages.length > 0) {
      relativeBaseUrl = withQuery(relativeBaseUrl, {
        errors: 'true',
        error_messages: errorInfo.messages,
        error_urls: errorInfo.urls
      })
    }
    xmlParts.push(`<?xml-stylesheet type="text/xsl" href="${escapeValueForXml(relativeBaseUrl)}"?>`)
  }
  xmlParts.push(
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemapXml,
    '</sitemapindex>'
  )
  if (credits) {
    xmlParts.push(`<!-- XML Sitemap Index generated by @nuxtjs/sitemap v${version} at ${(/* @__PURE__ */ new Date()).toISOString()} -->`)
  }
  return minify ? xmlParts.join('').replace(/(?<!<[^>]*)\s(?![^<]*>)/g, '') : xmlParts.join('\n')
}
async function buildSitemapIndex(resolvers, runtimeConfig, nitro) {
  if (typeof runtimeConfig.cacheMaxAgeSeconds === 'number' && runtimeConfig.cacheMaxAgeSeconds > 0 && resolvers.event) {
    return buildSitemapIndexCached(resolvers.event, resolvers, runtimeConfig, nitro)
  }
  return buildSitemapIndexInternal(resolvers, runtimeConfig, nitro)
}

async function sitemapXmlEventHandler(e) {
  const runtimeConfig = useSitemapRuntimeConfig()
  const { sitemaps } = runtimeConfig
  if ('index' in sitemaps)
    return sendRedirect(e, withBase('/sitemap_index.xml', useRuntimeConfig().app.baseURL), 301)
  return createSitemap(e, Object.values(sitemaps)[0], runtimeConfig)
}
async function sitemapIndexXmlEventHandler(e) {
  const runtimeConfig = useSitemapRuntimeConfig()
  const nitro = useNitroApp()
  const resolvers = useNitroUrlResolvers(e)
  const { entries: sitemaps, failedSources } = await buildSitemapIndex(resolvers, runtimeConfig, nitro)
  const indexResolvedCtx = { sitemaps, event: e }
  await nitro.hooks.callHook('sitemap:index-resolved', indexResolvedCtx)
  const errorInfo = failedSources.length > 0 ? { messages: failedSources.map(f => f.error), urls: failedSources.map(f => f.url) } : void 0
  const output = urlsToIndexXml(indexResolvedCtx.sitemaps, resolvers, runtimeConfig, errorInfo)
  const ctx = { sitemap: output, sitemapName: 'sitemap', event: e }
  await nitro.hooks.callHook('sitemap:output', ctx)
  setHeader(e, 'Content-Type', 'text/xml; charset=UTF-8')
  if (runtimeConfig.cacheMaxAgeSeconds) {
    setHeader(e, 'Cache-Control', `public, max-age=${runtimeConfig.cacheMaxAgeSeconds}, s-maxage=${runtimeConfig.cacheMaxAgeSeconds}, stale-while-revalidate=3600`)
    const now = /* @__PURE__ */ new Date()
    setHeader(e, 'X-Sitemap-Generated', now.toISOString())
    setHeader(e, 'X-Sitemap-Cache-Duration', `${runtimeConfig.cacheMaxAgeSeconds}s`)
    const expiryTime = new Date(now.getTime() + runtimeConfig.cacheMaxAgeSeconds * 1e3)
    setHeader(e, 'X-Sitemap-Cache-Expires', expiryTime.toISOString())
    const remainingSeconds = Math.floor((expiryTime.getTime() - now.getTime()) / 1e3)
    setHeader(e, 'X-Sitemap-Cache-Remaining', `${remainingSeconds}s`)
  } else {
    setHeader(e, 'Cache-Control', `no-cache, no-store`)
  }
  return ctx.sitemap
}
async function sitemapChildXmlEventHandler(e) {
  if (!e.path.endsWith('.xml'))
    return
  const runtimeConfig = useSitemapRuntimeConfig(e)
  const { sitemaps } = runtimeConfig
  let sitemapName = getRouterParam(e, 'sitemap')
  if (!sitemapName) {
    const path = e.path
    const match = path.match(/(?:\/__sitemap__\/)?(.+)\.xml$/)
    if (match)
      sitemapName = match[1]
  }
  if (!sitemapName)
    throw createError$1({ statusCode: 400, message: 'Invalid sitemap request' })
  sitemapName = sitemapName.replace(/\.xml$/, '')
  sitemapName = withLeadingSlash(sitemapName)
  if (sitemapName.startsWith('/__sitemap__/'))
    sitemapName = sitemapName.replace('/__sitemap__/', '/')
  if (runtimeConfig.sitemapsPathPrefix) {
    const prefix = withLeadingSlash(runtimeConfig.sitemapsPathPrefix)
    if (sitemapName.startsWith(prefix))
      sitemapName = sitemapName.replace(prefix, '/')
  }
  sitemapName = withoutLeadingSlash(withoutTrailingSlash(sitemapName))
  const chunkInfo = parseChunkInfo(sitemapName, sitemaps, runtimeConfig.defaultSitemapsChunkSize)
  const isAutoChunked = typeof sitemaps.chunks !== 'undefined' && !Number.isNaN(Number(sitemapName))
  const sitemapExists = sitemapName in sitemaps || chunkInfo.baseSitemapName in sitemaps || isAutoChunked
  if (!sitemapExists)
    throw createError$1({ statusCode: 404, message: `Sitemap "${sitemapName}" not found.` })
  if (chunkInfo.isChunked && chunkInfo.chunkIndex !== void 0) {
    const baseSitemap = sitemaps[chunkInfo.baseSitemapName]
    if (baseSitemap && !baseSitemap.chunks && !baseSitemap._isChunking)
      throw createError$1({ statusCode: 404, message: `Sitemap "${chunkInfo.baseSitemapName}" does not support chunking.` })
    if (baseSitemap?._chunkCount !== void 0 && chunkInfo.chunkIndex >= baseSitemap._chunkCount)
      throw createError$1({ statusCode: 404, message: `Chunk ${chunkInfo.chunkIndex} does not exist for sitemap "${chunkInfo.baseSitemapName}".` })
  }
  const sitemapConfig = getSitemapConfig(sitemapName, sitemaps, runtimeConfig.defaultSitemapsChunkSize || void 0)
  return createSitemap(e, sitemapConfig, runtimeConfig)
}

const _JTFMim = defineEventHandler(sitemapXmlEventHandler)

const _wwb1X8 = defineEventHandler(async (e) => {
  const nitroApp = useNitroApp()
  const { indexable } = getSiteRobotConfig(e)
  const { credits, isNuxtContentV2, cacheControl } = useRuntimeConfigNuxtRobots(e)
  let robotsTxtCtx = {
    sitemaps: [],
    groups: [
      {
        allow: [],
        comment: [],
        userAgent: ['*'],
        disallow: ['/']
      }
    ]
  }
  if (indexable) {
    robotsTxtCtx = await resolveRobotsTxtContext(e)
    robotsTxtCtx.sitemaps = [...new Set(
      asArray(robotsTxtCtx.sitemaps).map(s => !s.startsWith('http') ? withSiteUrl(e, s, { withBase: true }) : s)
    )]
    if (isNuxtContentV2) {
      const contentWithRobotRules = await e.$fetch('/__robots__/nuxt-content.json', {
        headers: {
          Accept: 'application/json'
        }
      })
      if (String(contentWithRobotRules).trim().startsWith('<!DOCTYPE')) {
        logger$1.error('Invalid HTML returned from /__robots__/nuxt-content.json, skipping.')
      } else {
        for (const group of robotsTxtCtx.groups) {
          if (group.userAgent.includes('*')) {
            group.disallow.push(...contentWithRobotRules)
            group.disallow = group.disallow.filter(Boolean)
          }
        }
      }
    }
  }
  let robotsTxt = generateRobotsTxt(robotsTxtCtx)
  if (credits) {
    robotsTxt = [
      `# START nuxt-robots (${indexable ? 'indexable' : 'indexing disabled'})`,
      robotsTxt,
      '# END nuxt-robots'
    ].filter(Boolean).join('\n')
  }
  setHeader(e, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(e, 'Cache-Control', globalThis._importMeta_.test || !cacheControl ? 'no-store' : cacheControl)
  const hookCtx = { robotsTxt, e }
  await nitroApp.hooks.callHook('robots:robots-txt', hookCtx)
  return hookCtx.robotsTxt
})

const _JbPhbn = defineEventHandler(async (e) => {
  if (e.path === '/robots.txt' || e.path.startsWith('/__') || e.path.startsWith('/api') || e.path.startsWith('/_nuxt'))
    return
  const nuxtRobotsConfig = useRuntimeConfigNuxtRobots(e)
  if (nuxtRobotsConfig) {
    const { header } = nuxtRobotsConfig
    const robotConfig = getPathRobotConfig(e, { skipSiteIndexable: Boolean(getQuery(e)?.mockProductionEnv) })
    if (header) {
      setHeader(e, 'X-Robots-Tag', robotConfig.rule)
    }
    e.context.robots = robotConfig
  }
})

const defaultThrowErrorValue = { throwError: true }
const defaultSecurityConfig = (serverlUrl, strict) => {
  const defaultConfig = {
    strict,
    headers: {
      crossOriginResourcePolicy: 'same-origin',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginEmbedderPolicy: 'credentialless',
      contentSecurityPolicy: {
        'base-uri': ['\'none\''],
        'font-src': ['\'self\'', 'https:', 'data:'],
        'form-action': ['\'self\''],
        'frame-ancestors': ['\'self\''],
        'img-src': ['\'self\'', 'data:'],
        'object-src': ['\'none\''],
        'script-src-attr': ['\'none\''],
        'style-src': ['\'self\'', 'https:', '\'unsafe-inline\''],
        'script-src': ['\'self\'', 'https:', '\'unsafe-inline\'', '\'strict-dynamic\'', '\'nonce-{{nonce}}\''],
        'upgrade-insecure-requests': true
      },
      originAgentCluster: '?1',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: {
        maxAge: 15552e3,
        includeSubdomains: true
      },
      xContentTypeOptions: 'nosniff',
      xDNSPrefetchControl: 'off',
      xDownloadOptions: 'noopen',
      xFrameOptions: 'SAMEORIGIN',
      xPermittedCrossDomainPolicies: 'none',
      xXSSProtection: '0',
      permissionsPolicy: {
        'camera': [],
        'display-capture': [],
        'fullscreen': [],
        'geolocation': [],
        'microphone': []
      }
    },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2e6,
      maxUploadFileRequestInBytes: 8e6,
      ...defaultThrowErrorValue
    },
    rateLimiter: {
      // Twitter search rate limiting
      tokensPerInterval: 150,
      interval: 3e5,
      headers: false,
      driver: {
        name: 'lruCache'
      },
      whiteList: void 0,
      ipHeader: void 0,
      ...defaultThrowErrorValue
    },
    xssValidator: {
      methods: ['GET', 'POST'],
      ...defaultThrowErrorValue
    },
    corsHandler: {
      // Options by CORS middleware for Express https://github.com/expressjs/cors#configuration-options
      origin: serverlUrl,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      preflight: {
        statusCode: 204
      }
    },
    allowedMethodsRestricter: {
      methods: '*',
      ...defaultThrowErrorValue
    },
    hidePoweredBy: true,
    basicAuth: false,
    enabled: true,
    csrf: false,
    nonce: true,
    removeLoggers: true,
    ssg: {
      meta: true,
      hashScripts: true,
      hashStyles: false,
      nitroHeaders: true,
      exportToPresets: true
    },
    sri: true
  }
  {
    defaultConfig.headers.crossOriginEmbedderPolicy = 'require-corp'
    defaultConfig.headers.contentSecurityPolicy = {
      'base-uri': ['\'none\''],
      'default-src': ['\'none\''],
      'connect-src': ['\'self\''],
      'font-src': ['\'self\''],
      'form-action': ['\'self\''],
      'frame-ancestors': ['\'self\''],
      'frame-src': ['\'self\''],
      'img-src': ['\'self\''],
      'manifest-src': ['\'self\''],
      'media-src': ['\'self\''],
      'object-src': ['\'none\''],
      'script-src-attr': ['\'none\''],
      'style-src': ['\'self\'', '\'nonce-{{nonce}}\''],
      'script-src': ['\'self\'', '\'strict-dynamic\'', '\'nonce-{{nonce}}\''],
      'upgrade-insecure-requests': true,
      'worker-src': ['\'self\'']
    }
    defaultConfig.ssg.hashStyles = true
    defaultConfig.headers.strictTransportSecurity = {
      maxAge: 31536e3,
      includeSubdomains: true,
      preload: true
    }, defaultConfig.headers.xFrameOptions = 'DENY'
    defaultConfig.headers.permissionsPolicy = {
      'accelerometer': [],
      /* Disable OWASP Experimental values
      'ambient-light-sensor':[],
      */
      'autoplay': [],
      /* Disable OWASP Experimental values
      battery:[],
      */
      'camera': [],
      'display-capture': [],
      /* Disable OWASP Experimental values
      'document-domain':[],
      */
      'encrypted-media': [],
      'fullscreen': [],
      /* Disable OWASP Experimental values
      gamepad:[],
      */
      'geolocation': [],
      'gyroscope': [],
      /* Disable OWASP Experimental values
      'layout-animations':['self'],
      */
      /* Disable OWASP Experimental values
      'legacy-image-formats':['self'],
      */
      'magnetometer': [],
      'microphone': [],
      'midi': [],
      /* Disable OWASP Experimental values
      'oversized-images':['self'],
      */
      'payment': [],
      'picture-in-picture': [],
      'publickey-credentials-get': [],
      'screen-wake-lock': [],
      /* Disable OWASP Experimental values
      'speaker-selection':[],
      */
      'sync-xhr': ['self'],
      /* Disable OWASP Experimental values
      'unoptimized-images':['self'],
      */
      /* Disable OWASP Experimental values
      'unsized-media':['self'],
      */
      'usb': [],
      'web-share': [],
      'xr-spatial-tracking': []
    }
  }
  return defaultConfig
}

const FILE_UPLOAD_HEADER = 'multipart/form-data'
const defaultSizeLimiter = defaultSecurityConfig('', true).requestSizeLimiter
const _BAVTsy = defineEventHandler((event) => {
  const rules = resolveSecurityRules(event)
  if (rules.enabled && rules.requestSizeLimiter) {
    const requestSizeLimiter = defu(
      rules.requestSizeLimiter,
      defaultSizeLimiter
    )
    if (['POST', 'PUT', 'DELETE'].includes(event.node.req.method)) {
      const contentLengthValue = getRequestHeader(event, 'content-length')
      const contentTypeValue = getRequestHeader(event, 'content-type')
      const isFileUpload = contentTypeValue?.includes(FILE_UPLOAD_HEADER)
      const requestLimit = isFileUpload ? requestSizeLimiter.maxUploadFileRequestInBytes : requestSizeLimiter.maxRequestSizeInBytes
      if (parseInt(contentLengthValue) >= requestLimit) {
        const payloadTooLargeError = {
          statusCode: 413,
          statusMessage: 'Payload Too Large'
        }
        if (requestSizeLimiter.throwError === false) {
          return payloadTooLargeError
        }
        throw createError$1(payloadTooLargeError)
      }
    }
  }
})

const _JZ8Fo9 = defineEventHandler((event) => {
  const rules = resolveSecurityRules(event)
  if (rules.enabled && rules.corsHandler) {
    const { corsHandler } = rules
    let origin
    if (typeof corsHandler.origin === 'string' && corsHandler.origin !== '*') {
      origin = [corsHandler.origin]
    } else {
      origin = corsHandler.origin
    }
    if (origin && origin !== '*' && corsHandler.useRegExp) {
      origin = origin.map(o => new RegExp(o, 'i'))
    }
    handleCors(event, {
      origin,
      methods: corsHandler.methods,
      allowHeaders: corsHandler.allowHeaders,
      exposeHeaders: corsHandler.exposeHeaders,
      credentials: corsHandler.credentials,
      maxAge: corsHandler.maxAge,
      preflight: corsHandler.preflight
    })
  }
})

const _Zso8s3 = defineEventHandler((event) => {
  const rules = resolveSecurityRules(event)
  if (rules.enabled && rules.allowedMethodsRestricter) {
    const { allowedMethodsRestricter } = rules
    const allowedMethods = allowedMethodsRestricter.methods
    if (allowedMethods !== '*' && !allowedMethods.includes(event.node.req.method)) {
      const methodNotAllowedError = {
        statusCode: 405,
        statusMessage: 'Method not allowed'
      }
      if (allowedMethodsRestricter.throwError === false) {
        return methodNotAllowedError
      }
      throw createError$1(methodNotAllowedError)
    }
  }
})

const storage$1 = useStorage('#rate-limiter-storage')
const defaultRateLimiter = defaultSecurityConfig('', true).rateLimiter
const _WMA8h3 = defineEventHandler(async (event) => {
  const rules = resolveSecurityRules(event)
  const route = resolveSecurityRoute(event)
  if (rules.enabled && rules.rateLimiter) {
    const rateLimiter = defu(
      rules.rateLimiter,
      defaultRateLimiter
    )
    const ip = getIP(event, rateLimiter.ipHeader)
    if (rateLimiter.whiteList && rateLimiter.whiteList.includes(ip)) {
      return
    }
    const url = ip + route
    let storageItem = await storage$1.getItem(url)
    if (!storageItem) {
      await setStorageItem(rateLimiter, url)
    } else {
      if (typeof storageItem !== 'object') {
        return
      }
      const timeSinceFirstRateLimit = storageItem.date
      const timeForInterval = storageItem.date + Number(rateLimiter.interval)
      if (Date.now() >= timeForInterval) {
        await setStorageItem(rateLimiter, url)
        storageItem = await storage$1.getItem(url)
      }
      const isLimited = timeSinceFirstRateLimit <= timeForInterval && storageItem.value === 0
      if (isLimited) {
        const tooManyRequestsError = {
          statusCode: 429,
          statusMessage: 'Too Many Requests'
        }
        if (rules.rateLimiter.headers) {
          setResponseHeader(event, 'x-ratelimit-remaining', 0)
          setResponseHeader(event, 'x-ratelimit-limit', rateLimiter.tokensPerInterval)
          setResponseHeader(event, 'x-ratelimit-reset', timeForInterval)
        }
        if (rateLimiter.throwError === false) {
          return tooManyRequestsError
        }
        throw createError$1(tooManyRequestsError)
      }
      const newItemDate = timeSinceFirstRateLimit > timeForInterval ? Date.now() : storageItem.date
      const newStorageItem = { value: storageItem.value - 1, date: newItemDate }
      await storage$1.setItem(url, newStorageItem)
      const currentItem = await storage$1.getItem(url)
      if (currentItem && rateLimiter.headers) {
        setResponseHeader(event, 'x-ratelimit-remaining', currentItem.value)
        setResponseHeader(event, 'x-ratelimit-limit', rateLimiter.tokensPerInterval)
        setResponseHeader(event, 'x-ratelimit-reset', timeForInterval)
      }
    }
  }
})
async function setStorageItem(rateLimiter, url) {
  const rateLimitedObject = { value: rateLimiter.tokensPerInterval, date: Date.now() }
  await storage$1.setItem(url, rateLimitedObject)
}
function getIP(event, customIpHeader) {
  const ip = customIpHeader ? getRequestHeader(event, customIpHeader) || '' : getRequestIP(event, { xForwardedFor: true }) || ''
  return ip
}

const _YtMS4N = defineEventHandler(async (event) => {
  const rules = resolveSecurityRules(event)
  if (rules.enabled && rules.xssValidator) {
    const filterOpt = {
      ...rules.xssValidator,
      escapeHtml: void 0
    }
    if (rules.xssValidator.escapeHtml === false) {
      filterOpt.escapeHtml = value => value
    }
    const xssValidator = new FilterXSS(filterOpt)
    if (event.node.req.socket.readyState !== 'readOnly') {
      if (rules.xssValidator.methods && rules.xssValidator.methods.includes(
        event.node.req.method
      )) {
        const valueToFilter = event.node.req.method === 'GET'
          ? getQuery(event)
          : event.node.req.headers['content-type']?.includes(
            'multipart/form-data'
          )
            ? await readMultipartFormData(event)
            : await readBody(event)
        if (valueToFilter && Object.keys(valueToFilter).length) {
          if (valueToFilter.statusMessage && valueToFilter.statusMessage !== 'Bad Request') {
            return
          }
          const stringifiedValue = JSON.stringify(valueToFilter)
          const processedValue = xssValidator.process(
            JSON.stringify(valueToFilter)
          )
          if (processedValue !== stringifiedValue) {
            const badRequestError = {
              statusCode: 400,
              statusMessage: 'Bad Request'
            }
            if (rules.xssValidator.throwError === false) {
              return badRequestError
            }
            throw createError$1(badRequestError)
          }
        }
      }
    }
  }
})

const defuReplaceArray = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) || Array.isArray(value)) {
    obj[key] = value
    return true
  }
})

const baseConfig = useRuntimeConfig().csurf
const _wy1gQl = defineEventHandler(async (event) => {
  const { csurf } = getRouteRules(event)
  if (csurf === false || csurf?.enabled === false)
    return
  const csrfConfig = defuReplaceArray(csurf, baseConfig)
  const method = event.node.req.method ?? ''
  const methodsToProtect = csrfConfig.methodsToProtect ?? []
  if (!methodsToProtect.includes(method))
    return
  const secret = getCookie(event, csrfConfig.cookieKey) ?? ''
  const token = getHeader(event, baseConfig.headerName) ?? ''
  const isValidToken = await csrf.verify(secret, token, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm)
  if (!isValidToken) {
    throw createError$1({
      statusCode: 403,
      name: 'EBADCSRFTOKEN',
      statusMessage: 'CSRF Token Mismatch',
      message: !secret ? 'CSRF Cookie not found' : !token ? 'CSRF Token not found' : 'CSRF Token invalid'
    })
  }
})

const mcpConfig = { route: '/mcp', browserRedirect: '/', name: 'Esperion MCP Server', version: '1.0.0' }

const getProjectInfo = defineMcpTool({
  name: 'getProjectInfo',
  description: 'Returns project metadata including name, version, and tech stack information for the Esperion project',
  inputSchema: {
    includeTechStack: z.boolean().optional().default(true).describe('Whether to include detailed tech stack information')
  },
  handler: async ({ includeTechStack }) => {
    const projectInfo = {
      name: 'esperion-frontend',
      version: '1.0.0',
      description: 'Esperion Digital Agency - Data-Driven Digital Strategies',
      techStack: includeTechStack
        ? {
            frontend: {
              framework: 'Nuxt 4.4.2',
              language: 'TypeScript',
              styling: 'Tailwind CSS',
              stateManagement: 'Pinia',
              i18n: '@nuxtjs/i18n',
              testing: ['Vitest', 'Playwright']
            },
            backend: {
              language: 'Rust',
              framework: 'Axum',
              database: 'SurrealDB 3.0.4',
              auth: 'JWT + Argon2'
            },
            infrastructure: {
              containerization: 'Docker',
              orchestration: 'Docker Compose, Kubernetes'
            }
          }
        : void 0,
      languages: ['Indonesian (id)', 'English (en)'],
      defaultLocale: 'id'
    }
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(projectInfo, null, 2)
      }]
    }
  }
})

const tools = [
  (function () {
    const def = getProjectInfo
    return {
      ...def,
      _meta: {
        ...def._meta,
        filename: 'getProjectInfo.ts'
      }
    }
  })()
]

const project_readme = defineMcpResource({
  name: 'project-readme',
  title: 'Project README',
  description: 'Returns the README content and project description for the Esperion frontend project',
  uri: 'project://readme',
  mimeType: 'text/markdown',
  handler: async () => {
    try {
      const readmePath = join(process.cwd(), 'README.md')
      const content = await readFile$1(readmePath, 'utf-8')
      return {
        contents: [{
          uri: 'project://readme',
          mimeType: 'text/markdown',
          text: content
        }]
      }
    } catch (error) {
      const projectInfo = {
        name: 'Esperion Frontend',
        version: '1.0.0',
        description: 'Nuxt 3 application with TypeScript, Tailwind CSS, and Pinia state management for Esperion Digital Agency',
        techStack: [
          'Nuxt 4.4.2',
          'TypeScript',
          'Tailwind CSS',
          'Pinia',
          '@nuxtjs/i18n',
          'Vitest',
          'Playwright'
        ],
        note: 'README.md file not found, returning basic project info'
      }
      return {
        contents: [{
          uri: 'project://readme',
          mimeType: 'application/json',
          text: JSON.stringify(projectInfo, null, 2)
        }]
      }
    }
  }
})

const resources = [
  (function () {
    const def = project_readme
    return {
      ...def,
      _meta: {
        ...def._meta,
        filename: 'project-readme.ts'
      }
    }
  })()
]

const code_review_guide = defineMcpPrompt({
  name: 'code-review-guide',
  title: 'Esperion Code Review Guide',
  description: 'Returns guidelines for reviewing Esperion code, including best practices and conventions',
  inputSchema: {
    fileType: z.enum(['vue', 'typescript', 'test', 'config']).optional().describe('Optional filter for specific file type guidelines')
  },
  handler: async ({ fileType }) => {
    const guidelines = {
      general: {
        title: 'General Code Review Guidelines',
        principles: [
          'Use TypeScript strict mode - avoid `any` types',
          'Follow semantic design tokens (e.g., `bg-esperion-light-bg`) instead of hex values',
          'Use `<script setup>` syntax with TypeScript for Vue components',
          'Keep components focused and single-purpose',
          'Add proper error handling for async operations',
          'Use composables for reusable logic'
        ],
        namingConventions: {
          components: 'PascalCase (e.g., `EsButton.vue`, `SeoScoreDisplay.vue`)',
          composables: 'camelCase with `use` prefix (e.g., `useApi.ts`, `useValidation.ts`)',
          stores: 'camelCase matching domain (e.g., `auth.ts`, `user.ts`, `ui.ts`)',
          testFiles: '`.test.ts` for Vitest, `.spec.ts` for Playwright'
        }
      },
      vue: {
        title: 'Vue Component Guidelines',
        rules: [
          'Use `<script setup lang="ts">` for all components',
          'Always use `t()` from useI18n for text - never hardcode strings',
          'Use `localePath()` for navigation links to ensure correct locale prefix',
          'Use semantic design tokens from Tailwind config',
          'Add proper TypeScript types for props and emits',
          'Use Pinia stores for state management instead of local state when sharing across components'
        ],
        example: `
<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

interface Props {
  title: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})
<\/script>

<template>
  <h1>{{ t(props.title) }}</h1>
  <NuxtLink :to="localePath('/contact-us')">
    {{ t('common.contact') }}
  </NuxtLink>
</template>
        `.trim()
      },
      typescript: {
        title: 'TypeScript Guidelines',
        rules: [
          'Enable strict mode in tsconfig.json',
          'Avoid `any` type - use proper interfaces or `unknown`',
          'Use Zod for runtime validation of external data',
          'Define interfaces for API responses and request bodies',
          'Use template literal types for route paths when appropriate',
          'Export types from dedicated types/ directory or co-locate with implementation'
        ],
        example: `
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

interface Article {
  id: string
  slug: string
  title: string
  content: string
  publishedAt: string
  authorId: string
}

type ArticleListResponse = ApiResponse<Article[]>
        `.trim()
      },
      test: {
        title: 'Testing Guidelines',
        vitest: [
          'Use `happy-dom` environment (not jsdom)',
          'Mock Pinia stores using `setup.ts` pattern or `vi.mock()`',
          'Aim for 70% code coverage threshold',
          'Test both unit logic and component rendering'
        ],
        playwright: [
          'Use `test.extend()` pattern for fixtures, not `extendPage()`',
          'Run tests with `npm run test:e2e` for all browsers',
          'Use `npm run test:e2e:ui` for interactive debugging',
          'Cover authentication, CRUD operations, and public pages'
        ],
        example: `
// Vitest unit test
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '~/app/stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates authentication state on login', async () => {
    const auth = useAuthStore()
    await auth.login('test@example.com', 'password123')
    expect(auth.isAuthenticated).toBe(true)
  })
})
        `.trim()
      },
      config: {
        title: 'Configuration Guidelines',
        rules: [
          'Keep `nuxt.config.ts` organized with comments for each section',
          'Use `isDev` constant for environment-specific configuration',
          'Configure ISR routeRules for public pages (60s-86400s revalidation)',
          'Use CSR (`ssr: false`) for dashboard pages',
          'Security headers disabled in development for DevTools compatibility'
        ]
      },
      antiPatterns: {
        title: 'Anti-Patterns to Avoid',
        items: [
          'Never assume README route descriptions match current code - verify in `nuxt.config.ts`',
          'Never rely on generated `.nuxt/` files for source understanding',
          'Never use `frontend/pages/` - use `frontend/app/pages/` (active tree with `srcDir: \'.\'`)',
          'Never layer `vi.mock()` on top of `setup.ts` mocks - pick one pattern',
          'Never hardcode strings in templates - always use i18n `t()` function',
          'Never use hex colors directly - use semantic design tokens'
        ]
      },
      projectStructure: {
        title: 'Project Structure',
        paths: {
          appPages: 'frontend/app/pages/ - Active page tree',
          appComponents: 'frontend/app/components/ - Vue components',
          stores: 'frontend/app/stores/ - Pinia stores (auth, user, ui)',
          composables: 'frontend/app/composables/ - Composable functions',
          unitTests: 'frontend/tests/ - Vitest tests',
          e2eTests: 'frontend/e2e/ - Playwright tests',
          i18n: 'frontend/i18n/locales/ - id.json (Indonesian), en.json (English)'
        }
      },
      i18n: {
        title: 'Multi-Language (i18n) Guidelines',
        strategy: 'Full localization per locale - /id/ prefix (default), /en/ prefix',
        rules: [
          'Every translation key in id.json must exist in en.json',
          'Use hierarchical key structure: `namespace.section.element`',
          'SEO meta tags must use `t()` for localization',
          'Navigation, CTAs, and service names often remain in English (Tier 1)',
          'Descriptions and form labels are in Indonesian (Tier 2)'
        ]
      }
    }
    const result = fileType ? { [fileType]: guidelines[fileType] } : guidelines
    const content = `# Esperion Code Review Guide

This guide provides code review guidelines for the Esperion project.

\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`

## Quick Reference

| Area | Location | Key Points |
|------|----------|------------|
| Pages | \`frontend/app/pages/\` | Use script setup, i18n, ISR |
| Components | \`frontend/app/components/\` | Semantic tokens, TypeScript |
| State | \`frontend/app/stores/\` | Pinia with persistence |
| Tests | \`frontend/tests/\`, \`frontend/e2e/\` | Vitest (happy-dom), Playwright |
| i18n | \`frontend/i18n/locales/\` | id.json default, en.json secondary |

## Commands

\`\`\`bash
# Development
npm run dev

# Unit tests
npm run test:unit
npm run test:coverage  # 70% threshold

# E2E tests
npm run test:e2e
npm run test:e2e:ui    # Interactive

# Type check
npm run type-check
\`\`\`
`
    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: content
        }
      }]
    }
  }
})

const prompts = [
  (function () {
    const def = code_review_guide
    return {
      ...def,
      _meta: {
        ...def._meta,
        filename: 'code-review-guide.ts'
      }
    }
  })()
]

const handlers$1 = []

const createMcpTransportHandler = handler => handler

const handleMcpRequest = createMcpTransportHandler(async (server, event) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: void 0 })
  event.node.res.on('close', () => {
    transport.close()
    server.close()
  })
  await server.connect(transport)
  const body = await readBody(event)
  await transport.handleRequest(event.node.req, event.node.res, body)
})

function resolveConfig(config, event) {
  return typeof config === 'function' ? config(event) : config
}
function createMcpServer(config) {
  const server = new McpServer({
    name: config.name,
    version: config.version
  })
  for (const tool of config.tools || []) {
    registerToolFromDefinition(server, tool)
  }
  for (const resource of config.resources || []) {
    registerResourceFromDefinition(server, resource)
  }
  for (const prompt of config.prompts || []) {
    registerPromptFromDefinition(server, prompt)
  }
  return server
}
function createMcpHandler(config) {
  return defineEventHandler(async (event) => {
    const resolvedConfig = resolveConfig(config, event)
    if (getHeader(event, 'accept')?.includes('text/html')) {
      return sendRedirect(event, resolvedConfig.browserRedirect)
    }
    const handler = async () => {
      const server = createMcpServer(resolvedConfig)
      return handleMcpRequest(server, event)
    }
    if (resolvedConfig.middleware) {
      let nextCalled = false
      let handlerResult
      const next = async () => {
        nextCalled = true
        handlerResult = await handler()
        return handlerResult
      }
      const middlewareResult = await resolvedConfig.middleware(event, next)
      if (middlewareResult !== void 0) {
        return middlewareResult
      }
      if (nextCalled) {
        return handlerResult
      }
      return handler()
    }
    return handler()
  })
}

const _LvqsVD = createMcpHandler((event) => {
  const handlerName = getRouterParam(event, 'handler')
  if (handlerName) {
    const handlerDef = handlers$1.find(
      h => h.name === handlerName
    )
    if (!handlerDef) {
      throw new Error(`Handler "${handlerName}" not found`)
    }
    return {
      name: handlerDef.name ?? handlerName,
      version: handlerDef.version ?? mcpConfig.version,
      browserRedirect: handlerDef.browserRedirect ?? mcpConfig.browserRedirect,
      tools: handlerDef.tools,
      resources: handlerDef.resources,
      prompts: handlerDef.prompts,
      middleware: handlerDef.middleware
    }
  }
  return {
    name: mcpConfig.name,
    version: mcpConfig.version,
    browserRedirect: mcpConfig.browserRedirect,
    tools,
    resources,
    prompts
  }
})

const IDE_CONFIGS = {
  cursor: {
    name: 'Cursor',
    generateDeeplink: (serverName, mcpUrl) => {
      const config = { type: 'http', url: mcpUrl }
      const configBase64 = Buffer.from(JSON.stringify(config)).toString('base64')
      return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(serverName)}&config=${encodeURIComponent(configBase64)}`
    }
  },
  vscode: {
    name: 'VS Code',
    generateDeeplink: (serverName, mcpUrl) => {
      const config = { name: serverName, type: 'http', url: mcpUrl }
      return `vscode:mcp/install?${encodeURIComponent(JSON.stringify(config))}`
    }
  }
}
function escapeHtmlAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function escapeJs(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, '\\\'').replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
}
const _ZxyMXO = defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const query = getQuery(event)
  const ide = query.ide || 'cursor'
  const ideConfig = IDE_CONFIGS[ide]
  if (!ideConfig) {
    setHeader(event, 'Location', '/')
    return new Response(null, { status: 302 })
  }
  const serverName = query.name || mcpConfig.name
  const mcpUrl = `${requestUrl.origin}${mcpConfig.route}`
  const deeplink = ideConfig.generateDeeplink(serverName, mcpUrl)
  const htmlDeeplink = escapeHtmlAttr(deeplink)
  const jsDeeplink = escapeJs(deeplink)
  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Opening ${ideConfig.name}...</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0a0a0a; color: #fff; }
    .container { text-align: center; padding: 2rem; }
    a { color: #3b82f6; }
  </style>
</head>
<body>
  <div class="container">
    <p>Opening ${ideConfig.name}...</p>
    <p>If nothing happens, <a href="${htmlDeeplink}">click here to install</a>.</p>
  </div>
  <script>window.location.href = "${jsDeeplink}";<\/script>
</body>
</html>`
})

const IDE_CONFIG = {
  cursor: {
    defaultLabel: 'Install MCP in Cursor'
  },
  vscode: {
    defaultLabel: 'Install MCP in VS Code'
  }
}
function CursorIcon() {
  return {
    type: 'svg',
    props: {
      width: 18,
      height: 18,
      viewBox: '0 0 24 24',
      style: { filter: 'invert(1)' },
      children: [
        {
          type: 'path',
          props: {
            fill: '#666',
            d: 'M11.925 24l10.425-6-10.425-6L1.5 18l10.425 6z'
          }
        },
        {
          type: 'path',
          props: {
            fill: '#888',
            d: 'M22.35 18V6L11.925 0v12l10.425 6z'
          }
        },
        {
          type: 'path',
          props: {
            fill: '#777',
            d: 'M11.925 0L1.5 6v12l10.425-6V0z'
          }
        },
        {
          type: 'path',
          props: {
            fill: '#555',
            d: 'M22.35 6L11.925 24V12L22.35 6z'
          }
        },
        {
          type: 'path',
          props: {
            fill: '#333',
            d: 'M22.35 6l-10.425 6L1.5 6h20.85z'
          }
        }
      ]
    }
  }
}
function VSCodeIconSimple() {
  return {
    type: 'svg',
    props: {
      width: 18,
      height: 18,
      viewBox: '0 0 24 24',
      children: [
        {
          type: 'path',
          props: {
            fill: '#007ACC',
            d: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63l-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12L.326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128l9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z'
          }
        }
      ]
    }
  }
}
function getIcon(ide) {
  return ide === 'vscode' ? VSCodeIconSimple() : CursorIcon()
}
async function generateBadgeSVG(options) {
  const { label, color, textColor, borderColor, showIcon, ide } = options
  const icon = getIcon(ide)
  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 8px',
        fontSize: '14px',
        fontWeight: 500,
        color: `#${textColor}`,
        backgroundColor: `#${color}`,
        border: `1px solid #${borderColor}`
      },
      children: showIcon ? [icon, { type: 'span', props: { children: label } }] : [{ type: 'span', props: { children: label } }]
    }
  }
  const iconWidth = showIcon ? 26 : 0
  const textWidth = label.length * 8
  const padding = 20
  const width = Math.max(Math.ceil(iconWidth + textWidth + padding), 140)
  const height = 32
  const svg = await satori(element, {
    width,
    height,
    fonts: [
      {
        name: 'Inter',
        data: await loadFont(),
        weight: 500,
        style: 'normal'
      }
    ]
  })
  return svg
}
async function loadFont() {
  const response = await fetch(
    'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff'
  )
  if (!response.ok) {
    throw new Error(`Failed to load font: ${response.status} ${response.statusText}`)
  }
  return response.arrayBuffer()
}
const _w6tW00 = defineEventHandler(async (event) => {
  const query = getQuery(event)
  const ide = query.ide || 'cursor'
  const ideConfig = IDE_CONFIG[ide] || IDE_CONFIG.cursor
  const options = {
    ide,
    label: query.label || ideConfig.defaultLabel,
    color: query.color || '171717',
    textColor: query.textColor || 'ffffff',
    borderColor: query.borderColor || '404040',
    showIcon: query.icon !== 'false'
  }
  try {
    const svg = await generateBadgeSVG(options)
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    return svg
  } catch {
    setHeader(event, 'Content-Type', 'image/svg+xml')
    setHeader(event, 'Cache-Control', 'no-cache')
    return `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="32">
      <rect width="140" height="32" fill="#171717" stroke="#404040"/>
      <text x="70" y="20" fill="#fff" font-size="12" text-anchor="middle">${options.label}</text>
    </svg>`
  }
})

const storage = prefixStorage(useStorage(), 'i18n')
function cachedFunctionI18n(fn, opts) {
  opts = { maxAge: 1, ...opts }
  const pending = {}
  async function get(key, resolver) {
    const isPending = pending[key]
    if (!isPending) {
      pending[key] = Promise.resolve(resolver())
    }
    try {
      return await pending[key]
    } finally {
      delete pending[key]
    }
  }
  return async (...args) => {
    const key = [opts.name, opts.getKey(...args)].join(':').replace(/:\/$/, ':index')
    const maxAge = opts.maxAge ?? 1
    const isCacheable = !opts.shouldBypassCache(...args) && maxAge >= 0
    const cache = isCacheable && await storage.getItemRaw(key)
    if (!cache || cache.ttl < Date.now()) {
      pending[key] = Promise.resolve(fn(...args))
      const value = await get(key, () => fn(...args))
      if (isCacheable) {
        await storage.setItemRaw(key, { ttl: Date.now() + maxAge * 1e3, value, mtime: Date.now() })
      }
      return value
    }
    return cache.value
  }
}

const _getMessages = async (locale) => {
  return { [locale]: await getLocaleMessagesMerged(locale, localeLoaders[locale]) }
}
const _getMessagesCached = cachedFunctionI18n(_getMessages, {
  name: 'messages',
  maxAge: 60 * 60 * 24,
  getKey: locale => locale,
  shouldBypassCache: locale => !isLocaleCacheable(locale)
})
const getMessages = _getMessagesCached
const _getMergedMessages = async (locale, fallbackLocales) => {
  const merged = {}
  try {
    if (fallbackLocales.length > 0) {
      const messages = await Promise.all(fallbackLocales.map(getMessages))
      for (const message2 of messages) {
        deepCopy(message2, merged)
      }
    }
    const message = await getMessages(locale)
    deepCopy(message, merged)
    return merged
  } catch (e) {
    throw new Error('Failed to merge messages: ' + e.message)
  }
}
const getMergedMessages = cachedFunctionI18n(_getMergedMessages, {
  name: 'merged-single',
  maxAge: 60 * 60 * 24,
  getKey: (locale, fallbackLocales) => `${locale}-[${[...new Set(fallbackLocales)].sort().join('-')}]`,
  shouldBypassCache: (locale, fallbackLocales) => !isLocaleWithFallbacksCacheable(locale, fallbackLocales)
})
const _getAllMergedMessages = async (locales) => {
  const merged = {}
  try {
    const messages = await Promise.all(locales.map(getMessages))
    for (const message of messages) {
      deepCopy(message, merged)
    }
    return merged
  } catch (e) {
    throw new Error('Failed to merge messages: ' + e.message)
  }
}
cachedFunctionI18n(_getAllMergedMessages, {
  name: 'merged-all',
  maxAge: 60 * 60 * 24,
  getKey: locales => locales.join('-'),
  shouldBypassCache: locales => !locales.every(locale => isLocaleCacheable(locale))
})

const _messagesHandler = defineEventHandler(async (event) => {
  const locale = getRouterParam(event, 'locale')
  if (!locale) {
    throw createError$1({ status: 400, message: 'Locale not specified.' })
  }
  const ctx = useI18nContext(event)
  if (ctx.localeConfigs && locale in ctx.localeConfigs === false) {
    throw createError$1({ status: 404, message: `Locale '${locale}' not found.` })
  }
  const messages = await getMergedMessages(locale, ctx.localeConfigs?.[locale]?.fallbacks ?? [])
  deepCopy(messages, ctx.messages)
  return ctx.messages
})
const _cachedMessageLoader = defineCachedFunction(_messagesHandler, {
  name: 'i18n:messages-internal',
  maxAge: 60 * 60 * 24,
  getKey: event => [getRouterParam(event, 'locale') ?? 'null', getRouterParam(event, 'hash') ?? 'null'].join('-'),
  async shouldBypassCache(event) {
    const locale = getRouterParam(event, 'locale')
    if (locale == null) {
      return false
    }
    const ctx = tryUseI18nContext(event) || await initializeI18nContext(event)
    return !ctx.localeConfigs?.[locale]?.cacheable
  }
})
const _messagesHandlerCached = defineCachedEventHandler(_cachedMessageLoader, {
  name: 'i18n:messages',
  maxAge: 10,
  swr: false,
  getKey: event => [getRouterParam(event, 'locale') ?? 'null', getRouterParam(event, 'hash') ?? 'null'].join('-')
})
const _lkHpDL = _messagesHandlerCached

const _gJSFiT = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {}
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map(dir => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, globalThis._importMeta_.url))) : void 0
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : void 0
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : void 0
  if (!fsStorage && !httpStorage) {
    throw new Error('IPX storage is not configured!')
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  }
  const ipx = createIPX(ipxOptions)
  const ipxHandler = createIPXH3Handler(ipx)
  return useBase(opts.baseURL, ipxHandler)
})

const _lazy_ngNPhZ = () => import('../routes/renderer.mjs').then(function (n) { return n.r })
const _lazy_jRNMn3 = () => import('../routes/sitemap_index.xml.mjs')
const _lazy_itbzSu = () => import('../routes/__sitemap__/_sitemap_.xml.mjs')

const handlers = [
  { route: '', handler: _acA2FR, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _21tpCp, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _9Qri9Q, lazy: false, middleware: true, method: undefined },
  { route: '/sitemap_index.xml', handler: _lazy_jRNMn3, lazy: true, middleware: false, method: undefined },
  { route: '/__sitemap__/**:sitemap', handler: _lazy_itbzSu, lazy: true, middleware: false, method: undefined },
  { route: '/__sitemap__/style.xsl', handler: _ROPVcg, lazy: false, middleware: false, method: undefined },
  { route: '/sitemap.xml', handler: _JTFMim, lazy: false, middleware: false, method: undefined },
  { route: '/robots.txt', handler: _wwb1X8, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _JbPhbn, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _BAVTsy, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _JZ8Fo9, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _Zso8s3, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _WMA8h3, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _YtMS4N, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _wy1gQl, lazy: false, middleware: false, method: undefined },
  { route: '/mcp', handler: _LvqsVD, lazy: false, middleware: false, method: undefined },
  { route: '/mcp/deeplink', handler: _ZxyMXO, lazy: false, middleware: false, method: undefined },
  { route: '/mcp/badge.svg', handler: _w6tW00, lazy: false, middleware: false, method: undefined },
  { route: '/_i18n/:hash/:locale/messages.json', handler: _lkHpDL, lazy: false, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _gJSFiT, lazy: false, middleware: false, method: undefined },
  { route: '/id/dashboard/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/dashboard/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/capital/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/capital/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/our-works/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/our-services/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/articles/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/about', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/contact-us', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/privacy-policy', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/terms-of-service', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/about/_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/contact-us/_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/privacy-policy/_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/terms-of-service/_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/id/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/our-works/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/our-services/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/articles/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/about', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/contact-us', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/privacy-policy', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/terms-of-service', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/about/_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/contact-us/_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/privacy-policy/_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/terms-of-service/_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/en/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '//_payload.json', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_ngNPhZ, lazy: true, middleware: false, method: undefined }
]

function createNitroApp() {
  const config = useRuntimeConfig()
  const hooks = createHooks()
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel('error', error, context).catch((error_) => {
      console.error('Error while capturing another error', error_)
    })
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors
      if (errors) {
        errors.push({ error, context })
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise)
      }
    }
  }
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ['request'] })
      return errorHandler(error, event)
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] }
      const fetchContext = event.node.req?.__unenv__
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        }
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch })
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      })
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = []
        }
        event.context.nitro._waitUntilPromises.push(promise)
        if (event.context.waitUntil) {
          event.context.waitUntil(promise)
        }
      }
      event.captureError = (error, context) => {
        captureError(error, { event, ...context })
      }
      await nitroApp.hooks.callHook('request', event).catch((error) => {
        captureError(error, { event, tags: ['request'] })
      })
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook('beforeResponse', event, response).catch((error) => {
        captureError(error, { event, tags: ['request', 'response'] })
      })
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook('afterResponse', event, response).catch((error) => {
        captureError(error, { event, tags: ['request', 'response'] })
      })
    }
  })
  const router = createRouter({
    preemptive: true
  })
  const nodeHandler = toNodeListener(h3App)
  const localCall = aRequest => b$1(
    nodeHandler,
    aRequest
  )
  const localFetch = (input, init) => {
    if (!input.toString().startsWith('/')) {
      return globalThis.fetch(input, init)
    }
    return C$1(
      nodeHandler,
      input,
      init
    ).then(response => normalizeFetchResponse(response))
  }
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  })
  globalThis.$fetch = $fetch
  h3App.use(createRouteRulesHandler({ localFetch }))
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || '/')).replace(
        /\/+/g,
        '/'
      )
      h3App.use(middlewareBase, handler)
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, '_')
      )
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: 'nitro/routes',
          ...routeRules.cache
        })
      }
      router.use(h.route, handler, h.method)
    }
  }
  h3App.use(config.app.baseURL, router.handler)
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  }
  return app
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2)
    } catch (error) {
      nitroApp2.captureError(error, { tags: ['plugin'] })
      throw error
    }
  }
}
const nitroApp = createNitroApp()
function useNitroApp() {
  return nitroApp
}
runNitroPlugins(nitroApp)

const debug = (...args) => {
}
function GracefulShutdown(server, opts) {
  opts = opts || {}
  const options = Object.assign(
    {
      signals: 'SIGINT SIGTERM',
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: signal => Promise.resolve(signal),
      preShutdown: signal => Promise.resolve(signal)
    },
    opts
  )
  let isShuttingDown = false
  const connections = {}
  let connectionCounter = 0
  const secureConnections = {}
  let secureConnectionCounter = 0
  let failed = false
  let finalRun = false
  function onceFactory() {
    let called = false
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true
          return Reflect.apply(callback, this, arguments)
        }
      }
      for (const e of events) {
        emitter.on(e, call)
      }
    }
  }
  const signals = options.signals.split(' ').map(s => s.trim()).filter(s => s.length > 0)
  const once = onceFactory()
  once(process, signals, (signal) => {
    debug('received shut down signal', signal)
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0)
      }
    }).catch((error) => {
      debug('server shut down error occurred', error)
      process.exit(1)
    })
  })
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck)
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType)
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy()
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId]
      } else {
        delete secureConnections[socket._connectionId]
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug('Destroy Connections : ' + (force ? 'forced close' : 'close'))
    let counter = 0
    let secureCounter = 0
    for (const key of Object.keys(connections)) {
      const socket = connections[key]
      const serverResponse = socket._httpMessage
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader('connection', 'close')
        }
      } else {
        counter++
        destroy(socket)
      }
    }
    debug('Connections destroyed : ' + counter)
    debug('Connection Counter    : ' + connectionCounter)
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key]
      const serverResponse = socket._httpMessage
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader('connection', 'close')
        }
      } else {
        secureCounter++
        destroy(socket)
      }
    }
    debug('Secure Connections destroyed : ' + secureCounter)
    debug('Secure Connection Counter    : ' + secureConnectionCounter)
  }
  server.on('request', (req, res) => {
    req.socket._isIdle = false
    if (isShuttingDown && !res.headersSent) {
      res.setHeader('connection', 'close')
    }
    res.on('finish', () => {
      req.socket._isIdle = true
      destroy(req.socket)
    })
  })
  server.on('connection', (socket) => {
    if (isShuttingDown) {
      socket.destroy()
    } else {
      const id = connectionCounter++
      socket._isIdle = true
      socket._connectionId = id
      connections[id] = socket
      socket.once('close', () => {
        delete connections[socket._connectionId]
      })
    }
  })
  server.on('secureConnection', (socket) => {
    if (isShuttingDown) {
      socket.destroy()
    } else {
      const id = secureConnectionCounter++
      socket._isIdle = true
      socket._connectionId = id
      secureConnections[id] = socket
      socket.once('close', () => {
        delete secureConnections[socket._connectionId]
      })
    }
  })
  process.on('close', () => {
    debug('closed')
  })
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections()
      debug('Close http server')
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err)
          }
          return resolve(true)
        })
      })
    }
    debug('shutdown signal - ' + sig)
    if (options.development) {
      debug('DEV-Mode - immediate forceful shutdown')
      return process.exit(0)
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true
        if (options.finally && isFunction(options.finally)) {
          debug('executing finally()')
          options.finally()
        }
      }
      return Promise.resolve()
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`)
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        )
        return Promise.resolve(true)
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0
      if (allConnectionsClosed) {
        debug('All connections closed. Continue to shutting down')
        return Promise.resolve(false)
      }
      debug('Schedule the next waitForReadyToShutdown')
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1))
        }, 250)
      })
    }
    if (isShuttingDown) {
      return Promise.resolve()
    }
    debug('shutting down')
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true
      cleanupHttp()
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0
      return waitForReadyToShutDown(pollIterations)
    }).then((force) => {
      debug('Do onShutdown now')
      if (force) {
        destroyAllConnections(force)
      }
      return options.onShutdown(sig)
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === 'string' ? error : JSON.stringify(error)
      debug(errString)
      failed = true
      throw errString
    })
  }
  function shutdownManual() {
    return shutdown('manual')
  }
  return shutdownManual
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || 'SIGTERM SIGINT').split(' ').map(s => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || '', 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  }
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig()
  if (shutdownConfig.disabled) {
    return
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(' '),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn('Graceful shutdown timeout, force exiting...')
          resolve()
        }, shutdownConfig.timeout)
        nitroApp.hooks.callHook('close').catch((error) => {
          console.error(error)
        }).finally(() => {
          clearTimeout(timeout)
          resolve()
        })
      })
    }
  })
}

export { $fetch$1 as $, sitemapChildXmlEventHandler as A, parseURL as B, encodePath as C, decodePath as D, klona as E, hasProtocol as F, isScriptProtocol as G, getRequestURL as H, withQuery as I, defu as J, getRequestHeader as K, isEqual as L, sanitizeStatusCode as M, defuFn as N, getContext as O, setCookie as P, getCookie as Q, deleteCookie as R, parsePath as S, parseQuery as T, baseURL as U, hash$1 as V, executeAsync as W, withHttps as X, camelCase as Y, withLeadingSlash as Z, withoutTrailingSlash as _, trapUnhandledNodeErrors as a, withBase as a0, withTrailingSlash as a1, createDefu as a2, isEqual$1 as a3, encodeParam as a4, useNitroApp as b, appRootTag as c, destr as d, appRootAttrs as e, buildAssetsURL as f, appSpaLoaderTag as g, appSpaLoaderAttrs as h, useStorage as i, getResponseStatusText as j, getResponseStatus as k, appId as l, defineRenderHandler as m, appTeleportTag as n, appTeleportAttrs as o, publicAssetsURL as p, getQuery as q, createError$1 as r, setupGracefulShutdown as s, toNodeListener as t, useRuntimeConfig as u, appHead as v, getRouteRules as w, joinURL as x, defineEventHandler as y, sitemapIndexXmlEventHandler as z }
// # sourceMappingURL=nitro.mjs.map
