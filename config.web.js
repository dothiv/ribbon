'use strict'

import config from './config'
import pjson from './package.json'
import {merge} from 'lodash'
const dothiv = config.get('dothiv')

module.exports = merge(
  dothiv,
  require('./strings.json')[dothiv.language],
  {
    environment: config.get('environment'),
    version: pjson.version,
    name: pjson.name
  }
)
