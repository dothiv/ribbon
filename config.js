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
    // 'heading': 'Diese Internetseite trägt die digitale Rote Schleife.',
    'heading': 'This website wears a digital Red Ribbon.',
    // 'info': 'Sie unterstützt das Ende von AIDS.',
    'info': 'It fights for the end of AIDS.',
    // 'more': 'Mehr zu .hiv &raquo;'
    'more': 'More about .hiv &raquo;'
  }
})

export default nconf
