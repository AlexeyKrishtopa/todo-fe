export default class Component {
  constructor(options) {
    this.className = `todos__${options.className}`
  }

  render() {
    return document.querySelector('.root')
  }
}
