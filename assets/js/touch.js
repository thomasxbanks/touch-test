let touchsurface = document.querySelector('.application'),
  startX,
  startY,
  distance,
  threshold = 1337,
  touchobj

function handleswipe(distance) {
  var left = touchobj.pageX < startX
  var right = touchobj.pageX > startX
  var direction, validSwipe
  if (left && !right) {
    direction = 'left'
    validSwipe = distance <= threshold
  } else if (!left && right) {
    direction = 'right'
    validSwipe = distance >= threshold
  } else {
    direction = 'tap'
  }
  console.table({
    startX: startX,
    touchobjPageX: touchobj.pageX,
    condition: right,
    direction: direction
  })
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