module.exports = $ => {
  const $clickcounter = $('#dothiv-clickcounter')
  const $clickcounterOuter = $('#dothiv-clickcounter-outer')
  const shadowSize = 10

  $clickcounter.css({
    left: ($(window).width() - $clickcounter.width()) / 2,
    top: (-$clickcounter.height() - shadowSize) * 2
  })
  $clickcounter.animate({top: 0}, 500, 'swing', () => {
    window.setTimeout(() => {
      $clickcounter.animate({top: (-$clickcounter.height() - shadowSize) * 2}, 500, 'swing', () => {
        $clickcounterOuter.hide()
      })
    }, 3000)
  })
}
