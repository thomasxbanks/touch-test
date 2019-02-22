import { restartSessionCountdown} from './app'
const modalTriggerElements = document.querySelectorAll('button[data-modal]');
const modalContentElements = document.querySelectorAll('.slide__modal__content');

const openModal = (target) => {
  let targetContent = document.querySelector(`.slide__modal__content[data-target="${target}"]`);
  targetContent.dataset.active = true;
  restartSessionCountdown()
}

const closeModal = () => {
  modalContentElements.forEach((modalContentElement) => {
    modalContentElement.dataset.active = false
  })
  restartSessionCountdown()
}

if (modalTriggerElements) {
  modalTriggerElements.forEach((modalTriggerElement) => {
    modalTriggerElement.addEventListener('click', (e) => {
      e.preventDefault;
      closeModal()
      let target = e.currentTarget.dataset.modal
      openModal(target)
      console.log('clicked', target)
    })
  })
}

if (modalContentElements) {
  modalContentElements.forEach((modalContentElement) => {
    modalContentElement.querySelector('img').addEventListener('click', (e) => {
      e.preventDefault;
      closeModal();
    })
  })
}
