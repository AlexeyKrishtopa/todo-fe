export class Button {
  constructor(options) {
    this.label = options.label
    this.className = options.className
    this.onClick = options.onClick
  }

  render() {
    const buttonElement = document.createElement('a')
    buttonElement.classList.add(this.className)
    buttonElement.innerText = this.label
    buttonElement.addEventListener('click', this.onClick)

    return buttonElement
  }
}
