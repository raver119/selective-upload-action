const util = require('util')

global.XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;

global.TextDecoder = util.TextDecoder
global.TextEncoder = util.TextEncoder