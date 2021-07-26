import { emiter } from "./EventEmmiter"

const ADD_NEW_TODO = "ADD_NEW_TODO"

export class Store {
    constructor() {
        this.state = {
            todos: [{ _id: 1, description: 'some_todo 1', completed: false },
            { _id: 2, description: 'some_todo 2', completed: false },
            ]
        }
    }

    dispatch(action) {
        this.reducer(action)
    }

    reducer(action) {
        switch (action.type) {
            case ADD_NEW_TODO:
                this.state = {
                    todos: [...this.state.todos, action.payload]
                }
            case REMOVE_TODO:
                this.state = {
                    todos: this.todos.filter()
                }
            default:
                emiter.emit({ eventName: 'RerenderTodos', args: [this.state] })
        }
    }
}

const store = new Store()
export default store