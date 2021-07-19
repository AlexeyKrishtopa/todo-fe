import './style.scss'
import Component from '../../utils/Component'

export default class Input extends Component {
  constructor(options) {
    super(options)
    this.placeholder = options.placeholder
    this.onEnter = options.onEnter
  }

  render() {
    const inputElement = document.createElement('input')
    inputElement.classList.add(this.className)
    inputElement.classList.add('input')
    inputElement.addEventListener('keypress', this.onEnter)
    inputElement.placeholder = this.placeholder

    return inputElement
  }
}
