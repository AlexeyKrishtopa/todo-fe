import Component from '../../utils/Component'

export class RegisterPage extends Component {
  constructor(options) {
    super(options)
  }

  render() {
    const nameInputElement = document.createElement('input')
    const passwordInputElement = document.createElement('input')

    nameInputElement.classList.add('todos__reg-name')
  }
}
