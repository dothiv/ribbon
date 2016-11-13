'use strict'

const Podio = require('podio-js/lib/podio-js')
import config from './config'
const appId = config.get('podio:app_id')
import Promise from 'bluebird'

const podio = new Podio({
  authType: 'client',
  clientId: config.get('podio:client_id'),
  clientSecret: config.get('podio:client_secret')
})

podio.authenticateWithApp(config.get('podio:app_id'), config.get('podio:app_token'), (err, response) => {
  if (err) throw new Error(err)
  podio.request('POST', `/item/app/${appId}/filter/`, {limit: 500})
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
            console.log(domainConfig)
          })
      })
    )
    .catch(err => console.error(err))
})
