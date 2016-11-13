'use strict'

import nconf from 'nconf'

nconf.use('memory')

nconf
  .env({
    whitelist: [
      'environment',
      'dothiv__title',
      'dothiv__redirect',
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
    // 'heading': 'Diese Internetseite trägt die digitale Rote Schleife.',
    'heading': 'This website wears a digital Red Ribbon.',
    // 'info': 'Sie unterstützt das Ende von AIDS.',
    'info': 'It fights for the end of AIDS.',
    // 'more': 'Mehr zu .hiv &raquo;'
    'more': 'More about .hiv &raquo;'
  },
  'podio': {
    'client_id': 'ribbon-configurator',
    'client_secret': null,
    'app_id': '17197564',
    'app_token': null
  }
})

export default nconf
