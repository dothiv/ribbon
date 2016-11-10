'use strict'

import nconf from 'nconf'

nconf.use('memory')

nconf
  .env({
    whitelist: [
      'environment',
      'dothiv__title',
      'dothiv__redirect'
    ],
    lowerCase: true,
    separator: '__'
  })

nconf.defaults({
  'environment': 'development',
  'dothiv': {
    'title': null,
    'redirect': null,
    'heading': 'Diese Internetseite trägt die digitale Rote Schleife.',
    'info': 'Sie unterstützt das Ende von AIDS.',
    'more': 'Mehr zu .hiv &raquo;'
  }
})

export default nconf
