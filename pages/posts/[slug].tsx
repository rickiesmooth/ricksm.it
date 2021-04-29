import hydrate from 'next-mdx-remote/hydrate'

import { getFileBySlug, getFiles } from '../../lib/mdx';

import { Link } from '../../components/Link'
import Layout from '../../components/Layout'
import { Heading } from '../../components/Heading'
import { mdxComponents } from '../../components/MDXComponents'
import { getTweets } from '../../lib/twitter';


export default function PostPage({ source, frontMatter, tweets = [] }) {
  const StaticTweet = ({ id }) => {
    const tweet = tweets.find((tweet) => tweet.id === id) || {}
    return <div {...tweet} />
  }

  const content = hydrate(source, {
    components: { ...mdxComponents, StaticTweet },
  })

  return (
    <Layout>
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
  // const mdxPath = path.join(POSTS_PATH, `${params.slug}.mdx`)
  // const isMdx = fs.existsSync(mdxPath)
  // const source = fs.readFileSync(
  //   isMdx ? mdxPath : mdxPath.replace('.mdx', '.md')
  // )

  // const {
  //   content,
  //   data: { title, date },
  // } = matter(source)

  // const data = {
  //   title,
  //   date: new Date(date).toLocaleDateString(),
  // }

  // const mdxSource = await renderToString(content, {
  //   components: mdxComponents,
  //   scope: data,
  // })

  // // const tweetMatches = content.match(/<StaticTweet\sid="[0-9]+"\s\/>/g)
  // // const tweetIDs = tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0])
  // const tweets = await getTweets(post.tweetIDs)

  // return {
  //   props: {
  //     source: mdxSource,
  //     frontMatter: data,
  //     // tweetIDs,
  //   },
  // }

    const post = await getFileBySlug(params.slug)
    const tweets = await getTweets(post.tweetIDs)

    return { props: { ...post, tweets } }
}

export const getStaticPaths = async () => {
  const postFilePaths = await getFiles()
  const paths = postFilePaths
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}
