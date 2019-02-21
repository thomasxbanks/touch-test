let touchsurface = document.querySelector('.application'),
  startX,
  startY,
  distance,
  threshold = {left: -150, right: 150},
  touchobj

function handleswipe(distance) {
  var left = touchobj.pageX < startX
  var right = touchobj.pageX > startX
  var direction = (left && !right) ? 'left' : 'right'
  var validSwipe = (distance >= threshold[direction])
  if (validSwipe) {
    console.log(`valid ${direction} swipe!`)
    console.log('handle page transitions here')
  }
}

touchsurface.addEventListener('touchstart', function (e) {
  touchobj = e.changedTouches[0]
  distance = 0
  startX = touchobj.pageX
  startY = touchobj.pageY
  e.preventDefault()
}, false)

touchsurface.addEventListener('touchmove', function (e) {
  e.preventDefault() // prevent scrolling when inside DIV
}, false)

touchsurface.addEventListener('touchend', function (e) {
  touchobj = e.changedTouches[0]
  handleswipe(touchobj.pageX - startX)
  e.preventDefault()
}, false)