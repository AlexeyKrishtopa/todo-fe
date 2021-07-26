import { Todos } from "../../components/Todos";

const root = document.querySelector('.root')

const todosComponent = new Todos()

root.innerHTML = todosComponent.render()