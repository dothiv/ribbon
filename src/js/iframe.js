'use strict'

const $ = require('jquery')

const close = () => {
  window.location.href = $('#clickcounter-target-iframe').attr('src')
}

$(() => {
  window.setTimeout(close, 4000)
  $('#dothiv-clickcounter-outer').click(() => close())
  const $clickcounter = $('#dothiv-clickcounter')
  const shadowSize = 10

  $clickcounter.css({
    left: ($(window).width() - $clickcounter.width()) / 2,
    top: (-$clickcounter.height() - shadowSize) * 2
  })
  $clickcounter.animate({top: 0}, 500, 'swing', () => {
    window.setTimeout(() => {
      $clickcounter.animate({top: (-$clickcounter.height() - shadowSize) * 2}, 500)
    }, 3000)
  })
})
