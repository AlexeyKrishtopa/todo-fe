/* eslint-disable indent */
import { PAGE_TYPES } from '../constants/pageTypes'
import { TodosPage } from '../components/TodosPage'
import { RegistrPage } from '../components/RegistrPage'

class Redirector {
  constructor() {
    this.root = document.querySelector('.root')
  }

  redirect(pageType) {
    switch (pageType) {
      case PAGE_TYPES.TODOS_PAGE:
        this.root.innerHTML = ''
        this.root.append(new TodosPage().render())
        break
      case PAGE_TYPES.REGISTRATION_PAGE:
        this.root.innerHTML = ''
        this.root.append(new RegistrPage().render())
        break
      case PAGE_TYPES.SIGNIN_PAGE:
        this.root.innerHTML = ''
        break
    }
  }
}

export default new Redirector()