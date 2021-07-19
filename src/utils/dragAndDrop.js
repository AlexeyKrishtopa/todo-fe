export const dragAndDrop = (todos) => {
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

  const handleDrag = (event) => {
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

    todos._updateTodos()
    localStorage.setItem('todos', JSON.stringify(todos.todos, null, 2))
  }

  todosElement.removeEventListener('dragover', handleDrag)
  todosElement.addEventListener('dragover', handleDrag)
}
