import Component from "../../utils/Component"
import store from "../../utils/Store"
import { Todo } from "../Todo"

export class Todos extends Component {
    constructor(options) {
        super(options)
    }

    render() {
        let todoElements = ''

        store.state.todos.forEach(todo => {
            const todosComponent = new Todo({ _id: todo._id, description: todo.description, completed: todo.completed })
            todoElements += todosComponent.render()
        })

        return `<ul class="todos__list">
                    ${todoElements}
                </ul>`
    }
}