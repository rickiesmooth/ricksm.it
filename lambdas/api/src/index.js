const { fetchGithubData } = require('./retrieve')
const { normalizeGithubData } = require('./normalize')

const compose = (...fns) => (x) => fns.reduceRight((y, f) => f(y), x)

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.handler = (_event, _context, callback) => {
  try {
    const sendResponse = ({ data, errors }) =>
      callback(null, {
        statusCode: data ? 200 : 501,
        body: JSON.stringify(data || errors),
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    const sendNormalizedResponse = compose(sendResponse, normalizeGithubData)
    fetchGithubData(sendNormalizedResponse)
  } catch (err) {
    return err
  }
}
