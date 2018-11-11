const config = require('./config')
const pjson = require('./package.json')
const { merge, template, forIn } = require('lodash')
const strings = require('./strings.json')

const dothiv = config.get('dothiv')

let webConfig = merge(
  dothiv,
  strings.en,
  strings[dothiv.language],
  {
    environment: config.get('environment'),
    contentHost: config.get('content_host'),
    version: pjson.version,
    name: pjson.name,
    domain: dothiv.domain
  }
)

const replace = data => {
  forIn(data, (v, k) => {
    if (typeof v === 'string') {
      data[k] = template(v)(webConfig)
    } else {
      data[k] = replace(v)
    }
  })
  return data
}

webConfig = replace(webConfig)

process.stdout.write(JSON.stringify(webConfig))
