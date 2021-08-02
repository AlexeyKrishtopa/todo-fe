import './style.scss'
import Component from '../../utils/Component'
import GooseJpg from '../../img/goose.jpg'
import callApi from '../../utils/callApi'
import store from '../../utils/Store'

export class ProfileModal extends Component {
  constructor(options) {
    super(options)
    this.firstName = options.firstName
    this.secondName = options.secondName
    this.age = options.age
    this.phone = options.phone
    this.mail = options.mail
  }

  render() {
    const modalContainerElement = document.createElement('div')
    modalContainerElement.classList.add('modal__profile-container')
    const modalBodyElement = document.createElement('div')
    modalBodyElement.classList.add('modal__profile-body')

    const imgContainerElement = document.createElement('div')
    imgContainerElement.classList.add('modal__img-container')
    const imgElement = document.createElement('img')
    imgElement.classList.add('modal__img')
    imgElement.src = GooseJpg
    const uploadImgButtonElement = document.createElement('button')
    uploadImgButtonElement.innerText = 'Upload image'
    uploadImgButtonElement.classList.add('modal__img-upload-button')

    imgContainerElement.append(imgElement)
    imgContainerElement.append(uploadImgButtonElement)

    const userProfileListElement = document.createElement('ul')
    userProfileListElement.classList.add('modal__user-profile-list')

    const userFirstNameItemElement = document.createElement('li')
    userFirstNameItemElement.id = 'firstName'
    userFirstNameItemElement.classList.add('modal__user-first-name-item')
    const userFirstNameLabelElement = document.createElement('div')
    userFirstNameLabelElement.innerText = 'First name:'
    userFirstNameLabelElement.classList.add('modal__user-first-name-label')
    const userFirstNameElement = document.createElement('div')
    userFirstNameElement.classList.add('modal__user-first-name')
    // this.profileFirstName =
    userFirstNameElement.innerText = this.firstName
    userFirstNameItemElement.append(userFirstNameLabelElement)
    userFirstNameItemElement.append(userFirstNameElement)

    const userSecondNameItemElement = document.createElement('li')
    userSecondNameItemElement.id = 'secondName'
    userSecondNameItemElement.classList.add('modal__user-second-name-item')
    const userSecondNameLabelElement = document.createElement('div')
    userSecondNameLabelElement.innerText = 'Second name:'
    userSecondNameLabelElement.classList.add('modal__user-second-name-label')
    const userSecondNameElement = document.createElement('div')
    userSecondNameElement.classList.add('modal__user-second-name')
    userSecondNameElement.innerText = this.secondName
    userSecondNameItemElement.append(userSecondNameLabelElement)
    userSecondNameItemElement.append(userSecondNameElement)

    const userAgeItemElement = document.createElement('li')
    userAgeItemElement.id = 'age'
    userAgeItemElement.classList.add('modal__user-age-item')
    const userAgeLabelElement = document.createElement('div')
    userAgeLabelElement.innerText = 'Age:'
    userAgeLabelElement.classList.add('modal__user-age-label')
    const userAgeElement = document.createElement('div')
    userAgeElement.classList.add('modal__user-age')
    userAgeElement.innerText = this.age
    userAgeItemElement.append(userAgeLabelElement)
    userAgeItemElement.append(userAgeElement)

    const userPhoneItemElement = document.createElement('li')
    userPhoneItemElement.id = 'phone'
    userPhoneItemElement.classList.add('modal__user-phone-item')
    const userPhoneLabelElement = document.createElement('div')
    userPhoneLabelElement.innerText = 'Phone:'
    userPhoneLabelElement.classList.add('modal__user-phone-label')
    const userPhoneElement = document.createElement('div')
    userPhoneElement.classList.add('modal__user-phone')
    userPhoneElement.innerText = this.phone
    userPhoneItemElement.append(userPhoneLabelElement)
    userPhoneItemElement.append(userPhoneElement)

    const userMailItemElement = document.createElement('li')
    userMailItemElement.id = 'mail'
    userMailItemElement.classList.add('modal__user-mail-item')
    const userMailLabelElement = document.createElement('div')
    userMailLabelElement.innerText = 'Mail:'
    userMailLabelElement.classList.add('modal__user-mail-label')
    const userMailElement = document.createElement('div')
    userMailElement.innerText = this.mail
    userMailElement.classList.add('modal__user-mail')
    userMailItemElement.append(userMailLabelElement)
    userMailItemElement.append(userMailElement)

    const userProfileList = [
      userFirstNameItemElement,
      userSecondNameItemElement,
      userAgeItemElement,
      userPhoneItemElement,
      userMailItemElement,
    ]

    let timerId = null
    let clicksCount = 0
    userProfileList.forEach((profileItemElement) => {
      profileItemElement.lastElementChild.addEventListener('click', (event) => {
        event.preventDefault()

        clicksCount++

        if (clicksCount === 1) {
          timerId = setTimeout(() => {
            // 1 click
            clicksCount = 0
            clearInterval(timerId)
          }, 300)
        }

        if (clicksCount === 2) {
          // 2 clicks
          const tempProfileInputElement = document.createElement('input')
          tempProfileInputElement.classList.add('profile__temp-input')
          const currentProfileItem = event.currentTarget

          tempProfileInputElement.value = currentProfileItem.innerText

          event.currentTarget.append(tempProfileInputElement)

          tempProfileInputElement.focus()

          tempProfileInputElement.addEventListener('blur', async (event) => {
            if (tempProfileInputElement.value) {
              currentProfileItem.innerText = tempProfileInputElement.value
            }

            const profileItem = currentProfileItem.parentElement.id
            const body = {}

            body[profileItem] = currentProfileItem.innerText

            await callApi('/user', {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${store.state.currentUser.accessToken}`,
              },
              body: JSON.stringify(body),
            })
            if (event.currentTarget) {
              event.currentTarget.remove()
            }
          })

          tempProfileInputElement.addEventListener(
            'keypress',
            async (event) => {
              if (event.key === 'Enter') {
                if (tempProfileInputElement.value) {
                  currentProfileItem.innerText = tempProfileInputElement.value
                }

                const profileItem = currentProfileItem.parentElement.id
                const body = {}

                body[profileItem] = currentProfileItem.innerText

                await callApi('/user', {
                  method: 'PUT',
                  headers: {
                    Authorization: `Bearer ${store.state.currentUser.accessToken}`,
                  },
                  body: JSON.stringify(body),
                })

                if (event.currentTarget) {
                  event.currentTarget.remove()
                }
              }
            }
          )

          clicksCount = 0
          clearInterval(timerId)
        }
      })
    })

    userProfileList.forEach((profileItemElement) => {
      userProfileListElement.append(profileItemElement)
    })

    modalBodyElement.append(imgContainerElement)
    modalBodyElement.append(userProfileListElement)

    modalContainerElement.append(modalBodyElement)

    modalContainerElement.addEventListener('click', (event) => {
      if (!event.target.closest('.modal__profile-body')) {
        event.currentTarget.remove()
        document.body.classList.remove('locked')
      }
    })
    window.addEventListener('keydown', (event) => {
      if (
        document.body.contains(
          document.querySelector('.modal__profile-container')
        )
      ) {
        event.preventDefault
        if (event.key === 'Escape') {
          modalContainerElement.remove()
          document.body.classList.remove('locked')
        }
      }
    })

    modalBodyElement.style.opacity = '0%'
    modalBodyElement.style.top = '-200%'
    modalContainerElement.style.background = 'transparent'

    setTimeout(() => {
      modalBodyElement.style.top = '0'
      modalBodyElement.style.opacity = '100%'
      modalContainerElement.style.background = 'rgba(0, 0, 0, 0.171)'
    })

    return modalContainerElement
  }
}
