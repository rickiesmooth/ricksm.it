import dynamic from 'next/dynamic'
import Head from 'next/head'

import { Code } from './Code'
import { Heading } from './Heading'
import { Link } from './Link'
import { Callout } from './Callout'
import { CodeSandbox } from './CodeSandbox'
export const mdxComponents = {
  a: Link,
  p: ({ children }) => <p className="mb-4">{children}</p>,
  h1: ({ children }) => <Heading>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  video: (props) => <video className="mb-5 rounded-md" {...props} />,
  TestComponent: dynamic(() => import('./TestComponent')),
  code: Code,
  Head,
  Callout,
  CodeSandbox,
}
