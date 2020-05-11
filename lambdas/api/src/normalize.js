exports.normalizeGithubData = ({ errors, data }) => {
  if (errors) return { errors }

  const {
    viewer: {
      itemShowcase: { items },
    },
  } = data
  return {
    data: {
      showcaseItems: items.edges.map(
        ({
          node: {
            repositoryTopics: { edges },
            ...rest
          },
        }) => ({ ...rest, topics: edges.map((edge) => edge.node.topic.name) })
      ),
    },
  }
}
