let touchsurface = document.querySelector('.application'),
  displayElement = touchsurface.querySelector('#displayElement'),
  startX,
  startY,
  dist,
  threshold = 150, //required min distance traveled to be considered swipe
  allowedTime = 13370, // maximum time allowed to travel that distance
  elapsedTime,
  startTime

displayElement.querySelector('.response').innerHTML = `<span style="color:yellow">no</span> swipe!`

function handleswipe(direction) {
  displayElement.querySelector('.response').innerHTML = `<span style="color:yellow">${direction}</span> swipe!`
}

touchsurface.addEventListener('touchstart', function (e) {
  displayElement.querySelectorAll('div').forEach((divEl) => {
    divEl.innerHTML = ''
  })
  var touchobj = e.changedTouches[0]
  dist = 0
  startX = touchobj.pageX
  startY = touchobj.pageY
  startTime = new Date().getTime() // record time when finger first makes contact with surface
  displayElement.querySelector('.start').innerHTML = startX + '/' + startY
  e.preventDefault()
}, false)

touchsurface.addEventListener('touchmove', function (e) {
  var touchobj = e.changedTouches[0]
  displayElement.querySelector('.move').innerHTML = touchobj.pageX + '/' + touchobj.pageY
  e.preventDefault() // prevent scrolling when inside DIV
}, false)

touchsurface.addEventListener('touchend', function (e) {
  var touchobj = e.changedTouches[0]
  dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
  elapsedTime = new Date().getTime() - startTime // get time elapsed
  // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
  var validSwipe = (dist >= threshold)
  var left = touchobj.pageX < startX
  var right = touchobj.pageX > startX
  var direction = (left && !right) ? 'left' : 'right'
  console.log(touchobj.pageX, startX)
  console.log(touchobj.pageX < startX)
  console.log(touchobj.pageX > startX)
  console.table({
    left: left, 
    right: right, 
    condition: left && !right,
    direction: direction
  })
  if (validSwipe) {
    handleswipe(direction)
  }
  e.preventDefault()
}, false)