'use strict'

import config from './config'
import pjson from './package.json'
import {merge} from 'lodash'

module.exports = merge(
  config.get('dothiv'),
  {environment: config.get('environment'), version: pjson.version, name: pjson.name}
)
