// Define how long a period of inactivity before resetting the application.
// The value is in milliseconds: 1000 === 1 second
// @TODO: To disable for developer's sanity during development, replace `integer` with `429496729` (the longest time possible)
export let sessionCounter, sessionDuration = 240000
let direction
export const slides = document.querySelectorAll('article.slide') // Array of all of the pages
export const menuButtons = document.querySelectorAll('.jsSlideNavBtn') // Array of all menu buttons
export const nextButton = document.querySelector('.jsNextSlide') // The "next" button
export const prevButton = document.querySelector('.jsPrevSlide') // The "previous" button
export const referencesButton = document.querySelector('.jsNavRefs') // The "references" button
export const menuButton = document.querySelector('.jsNavSlides') // The "menu" button
export const homeButton = document.querySelector('.jsHome') // The "home" button
export const fullScreenButton = document.querySelector('.jsFullscreenBtn') // The "launch full screen" button
export const screenSaver = document.querySelector('.jsScreensaver') // The screenSaver element
export const screenSaverTrigger = document.querySelector('.jsScreensaverTrigger') // The screenSaver element
export const homepage = document.querySelector('article[data-name="homepage"]') // The homepage element

import {
  onSlideAnimation,
  showScreensaver,
  makeElementNotActive,
  moveSlideOffRight,
} from './navigation'
import { screenSaverTableCountdown } from './table-screensaver';

// require('./touch')
require('./modal')
require('./tabs')
require('./rotate-screen')
require('./table-screensaver')

export const restartSessionCountdown = () => {
  console.log('session countdown restarted')
  stopSessionCountdown()
  startSessionCountdown()
}

export const stopSessionCountdown = () => {
  console.log('session countdown stopped')
  clearInterval(sessionCounter)
  sessionCounter = null
}

export const startSessionCountdown = () => {
  console.log('session countdown started')
  sessionCounter = setInterval(launchScreensaver, sessionDuration)
}

/**
 * Fullscreen events
 */
const launchIntoFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }

  setTimeout(startApplication, 1000);
  document.querySelector('.fullscreen-btn').style.display = 'none'
}

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

fullScreenButton.addEventListener('click', function () {
  launchIntoFullscreen(document.documentElement);
});

/**
 * Screensaver
 */
export const launchScreensaver = () => {
  // What happens when the screensaver launches?
  // Log for debug
  console.log('SHOW SCREENSAVER');

  // 1. Remove the `--hide` class from the screensaver element
  showScreensaver(screenSaver)

  // 2. Reset the slides: Remove all `actives` and move them offscreen
  slides.forEach((slide) => {
    makeElementNotActive(slide)
    moveSlideOffRight(slide)
  })

  // 3. Stop the countdown to the next screensaver
  stopSessionCountdown()

  // 4. Log the sessionClose
  if (currentSessionId) {
    fetch(`http://localhost:8080/sessionClose/${currentSessionId}`, {
        method: "POST"
      })
      .catch(err => {
        console.log('launchScreensaver error', err)
      });
  }

  // @TODO: for development environment only, remove this prior to deployment to production
  exitFullscreen()
}

/*********************************************** */

// Log for debugging
// console.log('app.js',
//   nextButton,
//   prevButton,
//   referencesButton,
//   menuButton,
//   homeButton
// )

// slides.forEach((slide, index) => {
//   console.log('slide (id/index)', slide.dataset.id, index)
// })

// menuButtons.forEach((menuButton, index) => {
//   console.log('menuButton (id/index)', menuButton.dataset.id, index)
// })

/**
 * Start Application
 */
const startApplication = () => {
  console.log('START APPLICATION')
  document.querySelector('.application').classList.add('moveToLeft');
  launchScreensaver();
};

let currentSessionId = null

fetch('http://localhost:8080/sessionstart', {
    method: "POST"
  })
  .then(res => res.json())
  .then(response => {
    currentSessionId = response.data.sessionId
    console.log('currentSessionId', currentSessionId)
  })
  .catch(err => {
    console.log('session start error', err)
  });

window.addEventListener('beforeunload', function (e) {
  // Cancel the event as stated by the standard.
  e.preventDefault();


  fetch(`http://localhost:8080/sessionClose/${currentSessionId}`, {
      method: "POST"
    })
    .catch(err => {
      console.log('before unload error', err)
    });

  // Chrome requires returnValue to be set.
  e.returnValue = '';
});

// Trigger actions for navigation
let touchsurfaces = document.querySelectorAll('.application'),
  startX = 0,
  endX = 0,
  threshold = 10,
  validSwipe = false

function handleswipe(distance) {
  var left = endX < startX
  var right = endX > startX

  if (left && !right) {
    validSwipe = distance <= threshold
    direction = validSwipe ? 'left' : 'tap'
  } else if (!left && right) {
    validSwipe = distance >= threshold
    direction = validSwipe ? 'right' : 'tap'
  } else {
    direction = 'tap'
  }
  // console.table({
  //   startX: startX,
  //   endX: endX,
  //   validSwipe: validSwipe,
  //   direction: direction
  // })
  if (direction !== 'tap') {
    console.log(`valid ${direction} swipe!`)
    console.log('handle page transitions here')
    let currentElement = document.querySelector('.slide[data-active="true"]')
    let currentID = ~~(currentElement.dataset.id)
    let id
    if (direction === 'left') {
      id = (currentID + 1)
      console.log('swiped nextSlide', currentElement, targetElement)
    }
    if (direction === 'right') {
      id = (currentID - 1)
      console.log('swiped prevSlide', currentElement, targetElement)
    }
    let targetElement = document.querySelector(`.slide[data-id="${id}"]`)
    if (targetElement) {
      onSlideAnimation(currentElement, targetElement)
    }
  }
}
function getGesturePointFromEvent(evt) {
  var point = {};
  if(evt.targetTouches) {
    // Prefer Touch Events
    point.x = evt.targetTouches[0].clientX;
    point.y = evt.targetTouches[0].clientY;
  } else {
    // Either Mouse event or Pointer Event
    point.x = evt.clientX;
    point.y = evt.clientY;
  }
  return point.x;
}
touchsurfaces.forEach((touchsurface) => {
  touchsurface.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    startX = getGesturePointFromEvent(e)
    // e.target.setPointerCapture(e.pointerId);
    console.log('pointerdown', startX, endX)
  }, false)

  touchsurface.addEventListener('pointermove', (e) => {
    e.preventDefault()
    endX = getGesturePointFromEvent(e)
    console.log('pointermove', startX, endX)
  })
  touchsurface.addEventListener('pointercancel', (e) => {
    e.preventDefault()
    if (endX !== startX){
      handleswipe(endX - startX)
    }
    console.log('pointerup', startX, endX)
  })
})


if (menuButtons) {
  menuButtons.forEach((menuButton) => {
    menuButton.addEventListener('click', (e) => {
      e.preventDefault;
      let currentElement = document.querySelector('.slide[data-active="true"]')
      let targetElement = document.querySelector(`.slide[data-name="${e.currentTarget.dataset.name}"]`)
      console.log('clicked navigationButton', currentElement, targetElement)
      onSlideAnimation(currentElement, targetElement)
    })
  })
}

if (nextButton) {
  nextButton.addEventListener('click', (e) => {
    e.preventDefault;
    let currentElement = document.querySelector('.slide[data-active="true"]')
    let id = (~~(currentElement.dataset.id) + 1)
    let targetElement = document.querySelector(`.slide[data-id="${id}"]`)
    console.log('clicked nextButton', currentElement, targetElement, e.currentTarget)
    onSlideAnimation(currentElement, targetElement)
  })
}

if (prevButton) {
  prevButton.addEventListener('click', (e) => {
    e.preventDefault;
    let currentElement = document.querySelector('.slide[data-active="true"]')
    let id = (~~(currentElement.dataset.id) - 1)
    let targetElement = document.querySelector(`.slide[data-id="${id}"]`)
    console.log('clicked prevButton', currentElement, targetElement, e.currentTarget)
    onSlideAnimation(currentElement, targetElement)
  })
}

if (referencesButton) {
  referencesButton.addEventListener('click', (e) => {
    e.preventDefault;
    let currentElement = document.querySelector('.slide[data-active="true"]')
    let targetElement = document.querySelector(`[data-name="references"]`)
    console.log('clicked referencesButton', currentElement, targetElement)
    onSlideAnimation(currentElement, targetElement)
  })
}

if (menuButton) {
  menuButton.addEventListener('click', (e) => {
    e.preventDefault;
    let currentElement = document.querySelector('.slide[data-active="true"]')
    let targetElement = document.querySelector(`[data-name="menu"]`)
    console.log('clicked menuButton', currentElement, targetElement)
    onSlideAnimation(currentElement, targetElement)
  })
}

if (homeButton) {
  homeButton.addEventListener('click', (e) => {
    e.preventDefault;
    let currentElement = document.querySelector('.slide[data-active="true"]')
    let targetElement = homepage
    console.log('clicked homeButton', currentElement, targetElement)
    onSlideAnimation(currentElement, targetElement)
  })
}

if (screenSaverTrigger) {
  screenSaverTrigger.addEventListener('click', (e) => {
    let currentElement = screenSaver
    let targetElement = homepage
    fetch('http://localhost:8080/sessionstart', {
        method: "POST"
      })
      .then(res => res.json())
      .then(response => {
        currentSessionId = response.data.sessionId;

        fetch(`http://localhost:8080/log/${currentSessionId}/menu/screenSaver_close`, {
            method: "POST"
          })
          .catch(err => {
            console.log('screenSaver start click error', err)
          });
      })

      .catch(err => {
        console.log('screenSaver click error', err)
      });
    console.log('clicked screenSaverTrigger', currentElement, targetElement)
    clearInterval(screenSaverTableCountdown)
    onSlideAnimation(currentElement, targetElement)
  })
}

// @TODO: Remove development scirpts prior to deployment
const randomColor = () => {
  const colors = [
    'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'hotpink', 'dodgerblue', 'sienna', 'tomato', 'wheat'
  ]
  let d = new Date()
  let now = d.getSeconds()
  let index = ~~(now / 6)
  return colors[index - 1]
}
document.querySelector('.fullscreen-btn').style.background = randomColor()