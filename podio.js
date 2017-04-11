/* eslint camelcase: "off" */
import config from './config'
import fs from 'fs'
import Promise from 'bluebird'
import child_process from 'child_process'
import Podio from 'podio-js/lib/podio-js'

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
    return Promise.try(() => podio.request('POST', `/item/app/${appId}/filter/`, {limit: 500}))
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

const escapeShellArg = cmd => '\'' + cmd.replace(/'/g, "'\\''") + '\''

getConfig()
  .map(domainConfig => child_process
      .execAsync('rm -f build/*.html')
      .then(() => {
        const env = {
          'DOTHIV__TITLE': escapeShellArg(domainConfig.title),
          'DOTHIV__LANGUAGE': escapeShellArg(domainConfig.language),
          'DOTHIV__DOMAIN': escapeShellArg(domainConfig.domain)
        }
        if (domainConfig.type === 'iFrame') {
          env['DOTHIV__REDIRECT'] = escapeShellArg(domainConfig.redirectTo)
        }
        return child_process.execAsync('make build', {env})
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
      .then(() => {
        console.log('-', domainConfig.domain)
      }),
    {concurrency: 1}
  )
  .catch(err => console.error(err))
