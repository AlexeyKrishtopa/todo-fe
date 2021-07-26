import { Todos } from '../Todos'
import Component from '../../utils/Component'
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

    return todosContainerElement
  }
}
