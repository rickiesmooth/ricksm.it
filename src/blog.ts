/// <reference path="../node_modules/highlight.js/types/index.d.ts" />

import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'

import 'highlight.js/styles/github-gist.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)

hljs.initHighlightingOnLoad()
