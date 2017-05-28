import nconf from 'nconf'

nconf.use('memory')

nconf
  .env({
    whitelist: [
      'environment',
      'dothiv__title',
      'dothiv__redirect',
      'dothiv__language',
      'dothiv__domain',
      'podio__client_secret',
      'podio__client_id',
      'podio__app_token',
      'podio__app_id',
      'content_host'
    ],
    lowerCase: true,
    separator: '__'
  })

nconf.defaults({
  'environment': 'development',
  'content_host': '',
  'dothiv': {
    'title': null,
    'redirect': null,
    'language': 'de',
    'domain': 'click4life.hiv'
  },
  'podio': {
    'client_id': 'ribbon-configurator',
    'client_secret': null,
    'app_id': '17197564',
    'app_token': null
  }
})

export default nconf
