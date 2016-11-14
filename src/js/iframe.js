'use strict'

const $ = require('jquery')
import cc from './module/clickcounter'

const close = () => {
  window.location.href = $('#clickcounter-target-iframe').attr('src')
}

$(() => {
  $('#dothiv-clickcounter-outer').click(() => close())
  window.setTimeout(close, 4000)
  cc($)
})
