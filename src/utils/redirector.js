/* eslint-disable indent */
import { PAGE_TYPES } from '../constants/pageTypes'
import { TodosPage } from '../components/TodosPage'
import { RegistrPage } from '../components/RegistrPage'
import { handleHistory } from '../utils/handleDOMContentLoaded'
import { SignInPage } from '../components/SigninPage'

class Redirector {
  constructor() {
    this.root = document.querySelector('.root')
    handleHistory()
  }

  redirect(pageType) {
    switch (pageType) {
      case PAGE_TYPES.TODOS_PAGE:
        this.root.innerHTML = ''
        this.root.append(new TodosPage().render())
        console.log(location.hash)
        if(location.hash === '#/signin') {
          history.pushState(null, '', '#')
        }
        break
      case PAGE_TYPES.REGISTRATION_PAGE:
        this.root.innerHTML = ''
        this.root.append(new RegistrPage().render())
        history.pushState(null, '', '#/signup')
        break
      case PAGE_TYPES.SIGNIN_PAGE:
        this.root.innerHTML = ''
        this.root.append(new SignInPage().render())
        history.pushState(null, '', '#/signin')
        break
    }
  }
}

export default new Redirector()
