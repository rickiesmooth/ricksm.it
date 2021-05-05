import hydrate from 'next-mdx-remote/hydrate'

import { getFileBySlug, getFiles } from '../../lib/mdx'

import { Link } from '../../components/Link'
import Layout from '../../components/Layout'
import { Heading } from '../../components/Heading'
import { mdxComponents } from '../../components/MDXComponents'
import { getTweets } from '../../lib/twitter'
import Tweet from '../../components/Tweet'

export default function PostPage({ mdxSource, frontMatter, tweets = [] }) {
  const StaticTweet = ({ id }) => {
    const tweet = tweets.find((tweet) => tweet.id === id) || {}
    return <Tweet {...tweet} />
  }

  const content = hydrate(mdxSource, {
    components: { ...mdxComponents, StaticTweet },
  })

  return (
    <Layout pageTitle={frontMatter.title} description={frontMatter.description}>
      <header className="mb-5">
        <nav>
          <Link href="/posts">👈 Go back to posts</Link>
        </nav>
      </header>
      <Heading>{frontMatter.title}</Heading>
      <p className="mb-8 text-sm text-gray-400">{`published: ${frontMatter.date}`}</p>
      {frontMatter.description && <p>{frontMatter.description}</p>}
      <main>{content}</main>
    </Layout>
  )
}

export const getStaticProps = async ({ params }) => {
  const post = await getFileBySlug(params.slug)
  const tweets = await getTweets(post.tweetIDs)

  return { props: { ...post, tweets } }
}

export const getStaticPaths = async () => {
  const postFilePaths = getFiles()
  const paths = postFilePaths
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}
