import Component from "../../utils/Component"
import './style.scss'

export class Todo extends Component {
    constructor(options) {
        super(options)
        this._id = options._id
        this.description = options.description ?? ''
        this.completed = options.completed ?? false
    }

    render() {
        return `<div id="${this._id}" class="todos__todo">
                    <input class="todos__todo-checkbox" type="checkbox" checked="${this.completed.toString()}">
                    <div class="todos__todo-description">${this.description}</div>
                    <button class="todos__todo-remove">&#215;</button>
                </div>`
    }
}

