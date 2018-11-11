/* eslint camelcase: "off" */
const config = require('./config')
const fs = require('fs')
const Promise = require('bluebird')
const child_process = require('child_process')
const Podio = require('podio-js/lib/podio-js')

const appId = config.get('podio:app_id')
Promise.promisifyAll(fs)
Promise.promisifyAll(child_process)

const podio = new Podio({
  authType: 'client',
  clientId: config.get('podio:client_id'),
  clientSecret: config.get('podio:client_secret')
})

const getConfig = () => new Promise((resolve, reject) => podio
  .authenticateWithApp(config.get('podio:app_id'), config.get('podio:app_token'), err => {
    if (err) return reject(err)
    return Promise.try(() => podio.request('POST', `/item/app/${appId}/filter/`, { limit: 500 }))
      .then(responseData => Promise
        .map(responseData.items, configuration => {
          const domainConfig = {}
          return Promise
            .map(configuration.fields, field => {
              switch (field.field_id) {
                case 134265195:
                  domainConfig.domain = field.values[0].value
                  break
                case 134265755:
                  domainConfig.title = field.values[0].value
                  break
                case 134265756:
                  domainConfig.type = field.values[0].value.text
                  break
                case 134265754:
                  domainConfig.language = field.values[0].value.text
                  break
                case 134265797:
                  domainConfig.redirectTo = field.values[0].embed.url
                  break
              }
            })
            .then(() => {
              if (!domainConfig.title) domainConfig.title = domainConfig.domain
              return domainConfig
            })
        })
        .then(config => resolve(config))
      )
  })
)

getConfig()
  .map(domainConfig => child_process
    .execAsync('make clean')
    .then(() => {
      const env = {
        'CONTENT_HOST': 'https://static.clickcounter.hiv',
        'DOTHIV__TITLE': domainConfig.title,
        'DOTHIV__LANGUAGE': domainConfig.language === 'German' ? 'de' : 'en',
        'DOTHIV__DOMAIN': domainConfig.domain
      }
      if (domainConfig.type === 'iFrame') {
        env['DOTHIV__REDIRECT'] = domainConfig.redirectTo
        if (!/^https/.test(domainConfig.redirectTo.toLowerCase())) {
          env['CONTENT_HOST'] = 'http://static.clickcounter.hiv'
        }
      }
      return child_process.execAsync('make -B site', { env: Object.assign(process.env, env) })
    })
    .then(() => child_process.execAsync('mkdir -p ./sites/' + domainConfig.domain + '/'))
    .then(() => child_process.execAsync('cp -r build/{*.html,favicon.ico} ./sites/' + domainConfig.domain + '/'))
    .then(() => {
      if (domainConfig.type === 'iFrame') {
        return Promise.join(
          child_process.execAsync('mv ./sites/' + domainConfig.domain + '/iframe.html ./sites/' + domainConfig.domain + '/index.html'),
          child_process.execAsync('rm ./sites/' + domainConfig.domain + '/microsite.html')
        )
      } else {
        return Promise.join(
          child_process.execAsync('mv ./sites/' + domainConfig.domain + '/microsite.html ./sites/' + domainConfig.domain + '/index.html'),
          child_process.execAsync('rm ./sites/' + domainConfig.domain + '/iframe.html')
        )
      }
    })
    .then(() => fs.writeFileAsync('./sites/' + domainConfig.domain + '/CNAME', domainConfig.domain, 'utf-8'))
    .then(() => {
      console.log('-', domainConfig.domain)
    }),
  { concurrency: 1 }
  )
  .catch(err => console.error(err))
