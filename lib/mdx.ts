import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import { mdxComponents } from '../components/MDXComponents'

const root = process.cwd()

export function getFiles() {
  return fs.readdirSync(path.join(root, 'posts'))
}

export async function getFileBySlug(slug: string) {
  const mdxPath = path.join(root, 'posts', `${slug}.mdx`)
  const isMdx = fs.existsSync(mdxPath)
  const source = fs.readFileSync(
    isMdx ? mdxPath : mdxPath.replace('.mdx', '.md')
  )
  const { data, content } = matter(source)
  const mdxSource = await serialize(content)

  const tweetMatches = content.match(/<StaticTweet\sid="[0-9]+"\s\/>/g)
  const tweetIDs = tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0])

  return {
    mdxSource,
    tweetIDs: tweetIDs || [],
    frontMatter: {
      slug: slug || null,
      ...data,
      date: new Date(data.date).toLocaleDateString(),
    },
  }
}

export function getAllFilesFrontMatter() {
  const files = fs.readdirSync(path.join(root, 'posts'))

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(
      path.join(root, 'posts', postSlug),
      'utf8'
    )
    const { data } = matter(source)

    return [
      {
        ...data,
        date: data.date.toLocaleDateString(),
        slug: postSlug.replace('.md', ''),
      },
      ...allPosts,
    ]
  }, [])
}
