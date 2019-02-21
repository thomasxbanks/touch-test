import {restartSessionCountdown} from './app'
import {makeElementIsActive, makeElementNotActive} from './navigation'

// @TODO: restrict action to current-slide only!
const tabControlElements = document.querySelectorAll('.tab-control-button')
let tabElements = document.querySelectorAll('[data-tab]')
console.log('tabElements/raw', [...tabElements].map((tabElement) => tabElement.dataset.tab))

if (tabControlElements) {
  tabControlElements.forEach((tabControlElement) => {
    tabControlElement.addEventListener('click', (e) => {
      e.preventDefault;
      let target = e.currentTarget.dataset.tab;
      let targetTabs = [...tabElements].filter((tabElement) => tabElement.dataset.tab === target)
      let targetTabParent = document.querySelector(`img[data-tab="${target}"]`).parentElement.parentElement
      targetTabParent.querySelectorAll(`[data-tab]`).forEach((tabElement) => {
        makeElementNotActive(tabElement)
      })
      targetTabs.forEach((targetTab) => {
        makeElementIsActive(targetTab)
      })
      console.log('clicked', target, targetTabs)
      restartSessionCountdown()
    })
  })
}