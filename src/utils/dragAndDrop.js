import store from './Store'
import callApi from './callApi'
import { storeStateLogger } from './storeStateLogger'

export const dragAndDrop = () => {
  const todosElement = document.querySelector('.todos__list')

  todosElement.addEventListener('dragstart', (event) => {
    event.target.classList.add('selected')
  })

  todosElement.addEventListener('dragend', (event) => {
    event.target.classList.remove('selected')
  })

  const getNextElement = (cursorPosition, currentElement) => {
    const currentElementCoord = currentElement.getBoundingClientRect()

    const currentElementCenter =
      currentElementCoord.y + currentElementCoord.height / 2

    const nextElement =
      cursorPosition < currentElementCenter
        ? currentElement
        : currentElement.nextElementSibling

    return nextElement
  }

  const handleDrag = async (event) => {
    event.preventDefault()

    const todosElement = document.querySelector('.todos__list')

    const activeElement = todosElement.querySelector('.selected')

    const currentElement = event.target
    const isMoveable =
      activeElement !== currentElement &&
      currentElement.classList.contains('todos__todo')

    if (!isMoveable) {
      return
    }

    const nextElement = getNextElement(event.clientY, currentElement)

    if (
      (nextElement && activeElement === nextElement.previousElementSibling) ||
      activeElement === nextElement
    ) {
      return
    }

    todosElement.insertBefore(activeElement, nextElement)

    if (activeElement.nextElementSibling) {
      const previousTodoId = activeElement.previousElementSibling?.id
      const activeTodoId = activeElement.id
      const nextTodoId = activeElement.nextElementSibling.id

      let nextTodo = null
      let activeTodo = null
      let prevTodo = null

      store.state.todos.forEach((todo) => {
        if (todo._id === previousTodoId) {
          prevTodo = todo
        }
        if (todo._id === activeTodoId) {
          activeTodo = todo
        }
        if (todo._id === nextTodoId) {
          nextTodo = todo
        }
      })

      let prevTodoSort = null

      !prevTodo?.sort ? (prevTodoSort = 0) : (prevTodoSort = prevTodo.sort)

      activeTodo.sort = (+prevTodoSort + +nextTodo.sort) / 2

      await callApi(`/todos/${activeTodo._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          description: activeTodo.description,
          completed: activeTodo.completed,
          sort: activeTodo.sort,
        }),
      })
    } else {
      let activeTodo = null
      let prevTodo = null
      const activeTodoId = activeElement.id
      const previousTodoId = activeElement.previousElementSibling.id
      store.state.todos.forEach((todo) => {
        if (todo._id === activeTodoId) {
          activeTodo = todo
        }
        if (todo._id === previousTodoId) {
          prevTodo = todo
        }
      })

      activeTodo.sort = prevTodo.sort + 1

      await callApi(`/todos/${activeTodo._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          description: activeTodo.description,
          completed: activeTodo.completed,
          sort: activeTodo.sort,
        }),
      })
    }

    storeStateLogger('After drag')
    //
  }

  todosElement.removeEventListener('dragover', handleDrag)
  todosElement.addEventListener('dragover', handleDrag)
}
