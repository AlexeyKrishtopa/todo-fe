import './style.scss'
import Component from '../../utils/Component'
import store from '../../utils/Store'
import { ACTION_TYPES } from '../../constants/actionTypes'
import callApi from '../../utils/callApi'

const signin = async (login, password) => {
  const res = await callApi('/user/signin', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
  })

  if (res.status === 404) {
    return res
  }

  store.dispatch({ type: ACTION_TYPES.REFRESH_TOKEN, payload: res.payload })

  return res
}

export class SignInPage extends Component {
  constructor(options) {
    super(options)
  }

  render() {
    const signInContainer = document.createElement('div')

    const signInFormElement = document.createElement('form')
    const loginInputElement = document.createElement('input')
    loginInputElement.placeholder = 'username'
    const passwordInputElement = document.createElement('input')
    passwordInputElement.placeholder = 'password'
    passwordInputElement.type = 'password'
    const signInButtonElement = document.createElement('button')
    signInButtonElement.innerText = 'SignIn'
    const signInFormContainer = document.createElement('div')


    const errorMessageElement = document.createElement('div')
    errorMessageElement.classList.add('signin__error-message')

    signInButtonElement.addEventListener('click', async (event) => {
      event.preventDefault()

      const res = await signin(
        loginInputElement.value,
        passwordInputElement.value
      )

      if (res.status === 200) {
        store.dispatch({ type: ACTION_TYPES.REDIRECT_TODOS, payload: {} })
      } else {
        const errorMessage = res.message
        errorMessageElement.innerText = errorMessage
      }
    })
    loginInputElement.addEventListener('input', () => {
      errorMessageElement.innerText = ''
    })
    passwordInputElement.addEventListener('input', () => {
      errorMessageElement.innerText = ''
    })

    const signInHeaderElement = document.createElement('div')
    const signInHeaderTextElement = document.createElement('h2')
    signInHeaderTextElement.innerText = 'Login'

    signInHeaderElement.append(signInHeaderTextElement)

    signInFormElement.append(loginInputElement)
    signInFormElement.append(passwordInputElement)
    signInFormElement.append(signInButtonElement)
    signInFormContainer.append(signInFormElement)
    signInFormContainer.append(errorMessageElement)

    signInContainer.append(signInHeaderElement)
    signInContainer.append(signInFormContainer)

    loginInputElement.classList.add('signin__login')
    passwordInputElement.classList.add('signin__password')
    signInButtonElement.classList.add('signin__button')
    signInContainer.classList.add('signin__container')
    signInFormElement.classList.add('signin__form')
    signInFormContainer.classList.add('signin__form-container')
    signInHeaderElement.classList.add('signin__header')
    signInHeaderTextElement.classList.add('signin__header-title')

    const signUpElement = document.createElement('button')
    signUpElement.innerText = 'signup'
    signUpElement.classList.add('todos__sign-out')
    const userOptionsContainer = document.createElement('div')
    userOptionsContainer.classList.add('todos__user-options-container')
    signUpElement.addEventListener('click', (event) => {
      event.preventDefault()
      store.dispatch({ type: ACTION_TYPES.REDIRECT_SIGN_UP, payload: {} })
    })

    userOptionsContainer.append(signUpElement)
    signInContainer.append(userOptionsContainer)

    return signInContainer
  }
}
