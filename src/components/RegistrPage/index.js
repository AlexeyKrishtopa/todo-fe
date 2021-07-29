import Component from '../../utils/Component'
import './style.scss'

export class RegistrPage extends Component {
  constructor(options) {
    super(options)
  }

  render() {
    const registrationContainer = document.createElement('div')

    const registrationFormElement = document.createElement('form')
    const loginInputElement = document.createElement('input')
    loginInputElement.placeholder = 'username'
    const passwordInputElement = document.createElement('input')
    passwordInputElement.placeholder = 'password'
    const registrationButtonElement = document.createElement('button')
    registrationButtonElement.innerText = 'SignUp'
    const registrationFormContainer = document.createElement('div')

    const registrationHeaderElement = document.createElement('div')
    const registrationHeaderTextElement = document.createElement('h2')
    registrationHeaderTextElement.innerText = 'Registration'

    registrationHeaderElement.append(registrationHeaderTextElement)

    registrationFormElement.append(loginInputElement)
    registrationFormElement.append(passwordInputElement)
    registrationFormElement.append(registrationButtonElement)
    registrationFormContainer.append(registrationFormElement)

    registrationContainer.append(registrationHeaderElement)
    registrationContainer.append(registrationFormContainer)

    loginInputElement.classList.add('registration__login')
    passwordInputElement.classList.add('registration__password')
    registrationButtonElement.classList.add('registration__button')
    registrationContainer.classList.add('registration__container')
    registrationFormElement.classList.add('registration__form')
    registrationFormContainer.classList.add('registration__form-container')
    registrationHeaderElement.classList.add('registration__header')
    registrationHeaderTextElement.classList.add('registration__header-title')

    return registrationContainer
  }
}
