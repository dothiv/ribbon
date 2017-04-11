import cc from './module/clickcounter'
import $ from 'jquery'

$(() => {
  const $clickcounterOuter = $('#dothiv-clickcounter-outer')
  $clickcounterOuter.click(() => $clickcounterOuter.hide())
  cc($)
})
