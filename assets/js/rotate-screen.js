const rotateScreenButton = document.querySelector('.jsRotateScreen')
const rotationContainerElements = document.querySelectorAll('.rotation-container')
if (rotateScreenButton) {
  rotateScreenButton.addEventListener('click', (e) => {
    e.preventDefault;
    rotationContainerElements.forEach((rotationContainerElement)=>{
      rotationContainerElement.classList.toggle('screen-rotated')
    })
  })
}