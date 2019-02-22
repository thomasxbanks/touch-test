let touchsurface = document.querySelector('.application'),
  startX,
  threshold = 150,
  touchobj,
  validSwipe

function handleswipe(distance) {
  var left = touchobj.pageX < startX
  var right = touchobj.pageX > startX
  var localDirection

  if (left && !right) {
    validSwipe = distance <= threshold
    localDirection = validSwipe ? 'left' : 'tap'
  } else if (!left && right) {
    validSwipe = distance >= threshold
    localDirection = validSwipe ? 'right' : 'tap'
  } else {
    localDirection = 'tap'
  }
  console.table({
    startX: startX,
    touchobjPageX: touchobj.pageX,
    validSwipe: validSwipe,
    localDirection: localDirection
  })
  if (localDirection !== 'tap') {
    direction = localDirection
  }
}

touchsurface.addEventListener('touchstart', function (e) {
  touchobj = e.changedTouches[0]
  startX = touchobj.pageX
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