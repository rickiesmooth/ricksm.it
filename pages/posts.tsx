import { Link } from '../components/Link'
import { Heading } from '../components/Heading'
import Layout from '../components/Layout'

import { getAllFilesFrontMatter } from '../lib/mdx'

export default function Blog({ posts }) {
  return (
    <Layout>
      <header className="mb-5">
        <nav>
          <Link href="/">👈 Go back home</Link>
        </nav>
      </header>
      <Heading>Blog</Heading>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-4 font-medium">
            <Link
              as={`/posts/${post.slug}`}
              href={`/posts/[slug]`}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export function getStaticProps() {
  return { props: { posts: getAllFilesFrontMatter() } }
}
