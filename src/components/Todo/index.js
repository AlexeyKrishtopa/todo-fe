import './style.scss'
import { REMOVE_SVG } from '../../constants/removeSVG.js'
import Component from '../../utils/Component'
import Checkbox from '../Checkbox'

export default class Todo extends Component {
  constructor(options) {
    super(options)
    this.id = options.id ?? null
    this.description = options.description ?? ''
    this.completed = options.completed ?? false

    this.onClick = options.onClick ?? null
    this.onRemove = options.onRemove ?? null
    this.onChecked = options.onChecked ?? null
  }

  render() {
    const todoElement = document.createElement('li')
    todoElement.id = this.id
    todoElement.classList.add(this.className)

    const todoCheckboxElement = new Checkbox({
      className: 'todo-checkbox',
      onChecked: this.onChecked,
      isChecked: this.completed,
    }).render()

    const todoDescriptionElement = document.createElement('span')
    todoDescriptionElement.classList.add(`${this.className}-description`)
    todoDescriptionElement.innerText = this.description
    if (this.completed) {
      todoElement.classList.add('text-crossed')
    }

    const todoRemvoeButtonElement = document.createElement('button')
    todoRemvoeButtonElement.classList.add(`${this.className}-remove`)
    todoRemvoeButtonElement.innerHTML = REMOVE_SVG
    todoRemvoeButtonElement.addEventListener('click', this.onRemove)

    todoElement.append(todoCheckboxElement)
    todoElement.append(todoDescriptionElement)
    todoElement.append(todoRemvoeButtonElement)

    todoElement.addEventListener('click', this.onClick)
    todoElement.draggable = true

    return todoElement
  }
}
