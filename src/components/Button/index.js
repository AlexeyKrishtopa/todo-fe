import './style.scss'
import Component from '../../utils/Component'

let _selectedButton = null

export default class Button extends Component {
  constructor(options) {
    super(options)
    this.label = options.label ?? ''
    this.onClick = options.onClick ?? null
    this.isHighlight = options.isHighlight ?? false
    this.isHighlightDefault = options.isHighlightDefault ?? false
  }

  static makeActive(button) {
    Button._highlight(button)
  }

  static _highlight(newButtonElement) {
    if (_selectedButton) {
      _selectedButton.classList.remove('highlight')
    }
    _selectedButton = newButtonElement
    _selectedButton.classList.add('highlight')
  }

  render() {
    const buttonElement = document.createElement('a')
    buttonElement.classList.add(this.className)
    buttonElement.classList.add('button')
    buttonElement.addEventListener('click', this.onClick)

    if (this.isHighlight) {
      if (this.isHighlightDefault) {
        _selectedButton = buttonElement
        buttonElement.classList.add('highlight')
      }

      buttonElement.addEventListener('click', (event) => {
        const buttonElement = event.target

        if (!buttonElement.classList.contains('button')) return

        Button._highlight(buttonElement)
      })
    }

    buttonElement.innerText = this.label

    return buttonElement
  }
}
