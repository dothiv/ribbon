'use strict'

const $ = require('jquery')
import cc from './module/clickcounter'

$(() => {
  const $clickcounterOuter = $('#dothiv-clickcounter-outer')
  $clickcounterOuter.click(() => $clickcounterOuter.hide())
  cc($)
})
