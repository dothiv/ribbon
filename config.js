'use strict'

import nconf from 'nconf'

nconf.use('memory')

nconf
  .env({
    whitelist: [
      'environment',
      'dothiv__title',
      'dothiv__redirect',
      'dothiv__language',
      'podio__client_secret',
      'podio__client_id',
      'podio__app_token',
      'podio__app_id'
    ],
    lowerCase: true,
    separator: '__'
  })

nconf.defaults({
  'environment': 'development',
  'dothiv': {
    'title': null,
    'redirect': null,
    'language': 'en'
  },
  'podio': {
    'client_id': 'ribbon-configurator',
    'client_secret': null,
    'app_id': '17197564',
    'app_token': null
  }
})

export default nconf
