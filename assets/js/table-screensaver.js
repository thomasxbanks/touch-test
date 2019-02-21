export const screenSaverTableElement = document.querySelector('.jsScreenSaverTable')
export const screenSaverTableTriggerElement = document.querySelector('.jsScreenSaverTableTrigger')
export let screenSaverTableCountdown

import {launchScreensaver, sessionDuration} from './app'

for (let i = 0; i < 4; i++) {
  screenSaverTableTriggerElement.innerHTML += `<img src="assets/img/screensaver/tap-icon_${i + 1}.png" alt="Tap to start" />`
}

if (document.body.dataset.environment === "table") {
  screenSaverTableElement.dataset.active = true
} else {
  screenSaverTableElement.dataset.active = false
}


if (screenSaverTableTriggerElement) {
  screenSaverTableTriggerElement.addEventListener('click', (e) => {
    console.log('clicked screenSaverTableTriggerElement', screenSaverTableCountdown)
    e.preventDefault;
    screenSaverTableElement.dataset.active = false;
    screenSaverTableCountdown = setTimeout(launchScreensaver, sessionDuration)
  })
}