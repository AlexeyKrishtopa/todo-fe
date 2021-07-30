export class Button {
  constructor(options) {
    this.label = options.label
    this.className = options.className
    this.onClick = options.onClick
    this.href = options.href
  }

  render() {
    const buttonElement = document.createElement('a')
    buttonElement.classList.add(this.className)
    buttonElement.innerText = this.label
    buttonElement.addEventListener('click', () => {
      if (this.href) {
        history.pushState(null, '', this.href)
      }
      this.onClick()
    })

    return buttonElement
  }
}
