import './style.scss'
import Component from '../../utils/Component'
import store from '../../utils/Store'
import { ACTION_TYPES } from '../../constants/actionTypes'
import callApi from '../../utils/callApi'

const register = async (login, password) => {
  const res = await callApi('/users/register', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${store.state.currentUser.accessToken}`,
    },
    body: JSON.stringify({
      login,
      password,
    }),
  })

  return res
}

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
    passwordInputElement.type = 'password'
    const registrationButtonElement = document.createElement('button')
    registrationButtonElement.innerText = 'Signup'
    const registrationFormContainer = document.createElement('div')

    const errorMessageElement = document.createElement('div')
    errorMessageElement.classList.add('registration__error-message')

    loginInputElement.addEventListener('input', () => {
      errorMessageElement.innerHTML = ''
    })
    registrationButtonElement.addEventListener('click', async (event) => {
      event.preventDefault()

      const res = await register(
        loginInputElement.value,
        passwordInputElement.value
      )
      if (!res.message) {
        store.dispatch({ type: ACTION_TYPES.REDIRECT_SIGN_IN, payload: {} })
      } else {
        const errorMessage = res.message.split(':')[1].trim()
        errorMessageElement.innerText = errorMessage
      }
    })

    const registrationHeaderElement = document.createElement('div')
    const registrationHeaderTextElement = document.createElement('h2')
    registrationHeaderTextElement.innerText = 'Registration'

    registrationHeaderElement.append(registrationHeaderTextElement)

    registrationFormElement.append(loginInputElement)
    registrationFormElement.append(passwordInputElement)
    registrationFormElement.append(registrationButtonElement)
    registrationFormContainer.append(registrationFormElement)
    registrationFormContainer.append(errorMessageElement)

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

    const signUpElement = document.createElement('button')
    signUpElement.innerText = 'signin'
    signUpElement.classList.add('todos__sign-out')
    const userOptionsContainer = document.createElement('div')
    userOptionsContainer.classList.add('todos__user-options-container')
    signUpElement.addEventListener('click', (event) => {
      event.preventDefault()
      // В пейлоду передать юзернейм и пароль
      store.dispatch({ type: ACTION_TYPES.REDIRECT_SIGN_IN, payload: {} })
    })

    userOptionsContainer.append(signUpElement)
    registrationContainer.append(userOptionsContainer)

    return registrationContainer
  }
}
