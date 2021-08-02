import { Todos } from '../Todos'
import Component from '../../utils/Component'
import { handleDOMContentLoaded } from '../../utils/handleDOMContentLoaded'
import { ACTION_TYPES } from '../../constants/actionTypes'
import store from '../../utils/Store'
import { ProfileModal } from '../ProfileModal'
import './style.scss'

export class TodosPage extends Component {
  constructor(options) {
    super(options)
  }

  render() {
    const todosBodyComponent = new Todos()

    const todosContainerElement = document.createElement('div')
    todosContainerElement.classList.add('todos__container')

    const todosHeaderElement = document.createElement('div')
    todosHeaderElement.classList.add('todos__header')
    const todosHeaderTitleElement = document.createElement('h1')
    todosHeaderTitleElement.innerText = 'todos'
    todosHeaderElement.append(todosHeaderTitleElement)

    todosContainerElement.append(todosHeaderElement)
    todosContainerElement.append(todosBodyComponent.render())

    const signOutElement = document.createElement('button')
    signOutElement.innerText = 'signout'
    signOutElement.classList.add('todos__sign-out')
    const userOptionsContainer = document.createElement('div')
    userOptionsContainer.classList.add('todos__user-options-container')
    signOutElement.addEventListener('click', (event) => {
      event.preventDefault()
      store.dispatch({ type: ACTION_TYPES.REDIRECT_SIGN_IN, payload: {} })
    })

    const profileButtonElement = document.createElement('button')
    profileButtonElement.classList.add('todos__profile-button')
    profileButtonElement.innerText = 'profile'

    profileButtonElement.addEventListener('click', (event) => {
      event.preventDefault()

      document.body.append(new ProfileModal().render())
      document.body.classList.add('locked')

      event.currentTarget.blur()
    })

    userOptionsContainer.append(profileButtonElement)
    userOptionsContainer.append(signOutElement)
    todosContainerElement.append(userOptionsContainer)

    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)

    return todosContainerElement
  }
}
