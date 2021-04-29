import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Link } from '../components/Link'

import { Heading } from '../components/Heading'
import Layout from '../components/Layout'

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
          <li key={post.filePath} className="mb-4 font-medium">
            <Link
              as={`/posts/${post.filePath.replace(/\.mdx?$/, '')}`}
              href={`/posts/[slug]`}
            >
              {post.data.title}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export function getStaticProps() {
  // const posts = postFilePaths.map((filePath) => {
  //   const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
  //   const {
  //     content,
  //     data: { title },
  //   } = matter(source)

  //   return {
  //     content,
  //     data: { title },
  //     filePath,
  //   }
  // })

  return { props: { posts: [] } }
}
