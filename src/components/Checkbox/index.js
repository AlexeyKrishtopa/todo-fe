import './style.scss'
import Component from '../../utils/Component'

export default class Checkbox extends Component {
  constructor(options) {
    super(options)
    this.onChecked = options.onChecked
    this.isChecked = options.isChecked || false
  }

  render() {
    const checkboxElement = document.createElement('input')
    checkboxElement.type = 'checkbox'
    if(this.isChecked) {
      checkboxElement.checked = true
    }
    checkboxElement.classList.add(this.className)
    checkboxElement.classList.add('checkbox')
    checkboxElement.addEventListener('click', this.onChecked)

    return checkboxElement
  }
}
