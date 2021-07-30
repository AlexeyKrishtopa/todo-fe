import { TodosPage } from '../../components/TodosPage'


const root = document.querySelector('.root')

const todosPageComponent = new TodosPage()

root.append(todosPageComponent.render())
