import callApi from '../utils/callApi'

export const dragAndDrop = (todosComponent) => {
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

    //logic of todosComponent.todos sort

    todosElement.insertBefore(activeElement, nextElement)

    if (activeElement.nextElementSibling) {
      const previousTodoid = activeElement.previousElementSibling?.id || 0
      const activeTodoid = activeElement.id
      const nextTodoid = activeElement.nextElementSibling.id

      let nextTodo = null
      let activeTodo = null
      let prevTodo = null

      todosComponent.todos.forEach((todo) => {
        if (todo._id === previousTodoid) {
          prevTodo = todo
        }
        if (todo._id === activeTodoid) {
          activeTodo = todo
        }
        if (todo._id === nextTodoid) {
          nextTodo = todo
        }
      })

      activeTodo.sort = (+prevTodo?.sort || 0 + +nextTodo.sort) / 2

      await callApi(`/todos/${activeTodo._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          description: activeTodo.description,
          completed: activeTodo.completed,
          sort: activeTodo.sort,
        }),
      })

      console.log(todosComponent.todos)
    } else {
      let activeTodo = null
      let prevTodo = null
      const activeTodoid = activeElement.id
      const previousTodoid = activeElement.previousElementSibling.id
      todosComponent.todos.forEach((todo) => {
        if (todo._id === activeTodoid) {
          activeTodo = todo
        }
        if (todo._id === previousTodoid) {
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

      console.log(todosComponent.todos)
    }

    todosComponent._updateTodos()
    localStorage.setItem('todos', JSON.stringify(todosComponent.todos, null, 2))
  }

  todosElement.removeEventListener('dragover', handleDrag)
  todosElement.addEventListener('dragover', handleDrag)
}
