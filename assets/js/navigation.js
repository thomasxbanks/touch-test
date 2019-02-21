import {
  slides,
  nextButton,
  prevButton,
  referencesButton,
  menuButton,
  homeButton,
  screenSaver,
  restartSessionCountdown
} from './app'

import {
  screenSaverTableElement
} from './table-screensaver';

export const moveSlideOffLeft = (element) => {
  // console.log('moveSlideOffLeft', element)
  element.classList.remove("moveOnScreenLeft", "moveOnScreenRight");
  element.classList.add('moveOffScreenLeft');
};

export const moveSlideOnLeft = (element) => {
  // console.log('moveSlideOnLeft', element)
  element.classList.remove("moveOffScreenLeft", "moveOffScreenRight");
  element.classList.add('moveOnScreenRight');
};

export const moveSlideOnRight = (element) => {
  // console.log('moveSlideOnRight', element)
  element.classList.remove("moveOffScreenRight");
  element.classList.add('moveOnScreenLeft');
};

export const moveSlideOffRight = (element) => {
  // console.log('moveSlideOffRight', element)
  element.classList.remove("moveOnScreenLeft", "moveOnScreenRight");
  element.classList.add('moveOffScreenRight');
};

export const makeElementIsActive = (element) => {
  // console.log('makeElementIsActive', element.dataset.name)
  element.dataset.active = true;
}

export const makeElementNotActive = (element) => {
  // console.log('makeElementNotActive', element.dataset.name)
  element.dataset.active = false;
}

export const revealContent = (element) => {
  let title = element.querySelector('.slide__title')
  let content = element.querySelector('.slide__graphic')
  let footer = element.querySelector('.slide__footer')
  // console.log('revealContent', title, content, footer)
  if (title) {
    title.classList.add('moveToLeft')
  }
  if (content) {
    content.classList.add('scaleUp')
  }
  if (footer) {
    footer.classList.add('moveToLeft')
  }
}

export const hideContent = (element) => {
  let title = element.querySelector('.slide__title')
  let content = element.querySelector('.slide__graphic')
  let footer = element.querySelector('.slide__footer')
  // console.log('revealContent', title, content, footer)
  if (title) {
    title.classList.remove('moveToLeft')
  }
  if (content) {
    content.classList.remove('scaleUp')
  }
  if (footer) {
    footer.classList.remove('moveToLeft')
  }
}

export const defineNavigationState = (slideName, slideID) => {
  // Define the variables for calculation
  let firstSlideID = 1
  let lastSlideID = slides.length

  // If the provided ID is a string value, convert to an integer
  slideID = isNaN(slideID) ? ~~(slideID) : slideID

  // Log for debugging
  // console.log('defineNavigationState', slideName, slideID, firstSlideID, lastSlideID)

  // 1. if this is the first page, hide the "prev" button
  if (slideID <= firstSlideID) {
    prevButton.style.background = 'white'
  } else {
    prevButton.style.background = 'none'
  }
  // 2. if this is the last page, hide the "next" button
  if (slideID >= lastSlideID) {
    nextButton.style.background = 'white'
  } else {
    nextButton.style.background = 'none'
  }
  // 3. If this is the homepage, hide the "home" button
  if (slideName === 'homepage') {
    homeButton.style.display = 'none'
  } else {
    homeButton.style.display = 'block'
  }
  // 4. If this is the "References", apply the selected class to the references button
  if (slideName === 'references') {
    referencesButton.classList.add('navigation__btn--refs-selected');
  } else {
    referencesButton.classList.remove('navigation__btn--refs-selected');
  }
  // 5. If this is the Menu page, apply the selected class to the menu button
  if (slideName === 'menu') {
    menuButton.classList.add('navigation__btn--navigation-selected');
  } else {
    menuButton.classList.remove('navigation__btn--navigation-selected');
  }

}

export const resetScreenRotation = () => {
  let rotatedScreens = document.querySelectorAll('.screen-rotated')
  if (rotatedScreens) {
    rotatedScreens.forEach((rotatedScreen) => {
      rotatedScreen.classList.remove('screen-rotated')
    })
  }
}

export const hideScreensaver = (element) => {
  console.log('hideScreensaver')
  element.classList.add('screensaver--hide')
  makeElementNotActive(element)
  if (document.body.dataset.environment === "table") {
    makeElementNotActive(screenSaverTableElement)
  }
}

export const showScreensaver = (element) => {
  console.log('showScreensaver')
  element.classList.remove('screensaver--hide')
  makeElementIsActive(element)
  if (document.body.dataset.environment === "table") {
    makeElementIsActive(screenSaverTableElement)
  }
  resetScreenRotation()
}

export const animateSlides = (currentElement, targetElement) => {
  // Log for debugging
  console.log('animateSlides', currentElement, targetElement)

  // Define variables for calculations
  let currentSlideID = ~~(currentElement.dataset.id)
  let targetSlideID = ~~(targetElement.dataset.id)

  // Control the animation direction
  if (targetSlideID > currentSlideID) {
    /* 
      If the target slide has a higher index than the current slide, 
      then we're going forwards through the slides from the
      first slide to the last slide
    */
    // animate out the current slide
    if (currentElement === screenSaver) {
      hideScreensaver(currentElement)
    } else {
      moveSlideOffLeft(currentElement)
    }


    // animate in the new slide
    if (targetElement === screenSaver) {
      showScreensaver(targetElement)
    } else {
      moveSlideOnRight(targetElement)
    }

  } else if (targetSlideID < currentSlideID) {
    /* 
      If the target slide has a lower index than the current slide, 
      then we're going backwards through the slides from the
      last slide to the first slide
    */
    // animate out the current slide
    if (currentElement === screenSaver) {
      hideScreensaver(currentElement)
    } else {
      moveSlideOffRight(currentElement)
    }


    // animate in the new slide
    if (targetElement === screenSaver) {
      showScreensaver(targetElement)
    } else {
      moveSlideOnLeft(targetElement)
    }
  } else {
    /* 
      In the unlikely event the target slide has the same index than the current slide, 
      then we're not moving at all!
    */
  }
}

export const onSlideAnimation = (currentElement, targetElement) => {
  // Things to do when the slide animates
  // Log for debugging
  console.log('onSlideAnimation/arguments', currentElement, targetElement)

  // Restart the screenSaver countdown
  restartSessionCountdown()

  // Disable old slide
  makeElementNotActive(currentElement)

  // Enable new slide
  makeElementIsActive(targetElement)

  // Animate out the old slide and animate in the new slide
  animateSlides(currentElement, targetElement)

  // reveal content on the new slide
  revealContent(targetElement)

  // Hide the content on the old slide to trigger the animation on page load
  hideContent(currentElement)

  // Show/hide navigation and selected items based on current state
  defineNavigationState(targetElement.dataset.name, targetElement.dataset.id)

}