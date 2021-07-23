import './style.scss'
import Todo from '../Todo'
import Button from '../Button'
import Input from '../Input'
import { emiter } from '../../utils/EventEmmiter'
import { checkAllSVG } from '../../constants/checkAllSVG'
import { TODOS_STATES } from '../../constants/todosStates'
import { CHEACK_ALL_BUTTON_STATES } from '../../constants/checkAllButtonState'
import { dragAndDrop } from '../../utils/dragAndDrop'
import callApi from '../../utils/callApi'
import { ACTIONS } from '../../constants/actions'

export default class Todos {
  constructor() {
    this.state = {
      todos: [],
      todosState: TODOS_STATES.ALL,
      checalAllButtonState: CHEACK_ALL_BUTTON_STATES.NOT_ACTIVE,
    }
  }

  _appendTodo(todo) {
    this.state.todos.push(todo)
  }

  _removeTodo(todoId) {
    this.state.todos = this.state.todos.filter((todo) => todo._id !== todoId)
  }

  _toggleCrossedTodo(todoId) {
    this.state.todos.forEach((todo) => {
      if (+todo.id === +todoId) {
        todo.isCrossed = !todo.isCrossed
      }
    })
  }

  _clearComplited() {
    this.state.todos = this.state.todos.filter((todo) => !todo.completed)
  }

  _isCheckedAll() {
    for (const todo of this.state.todos) {
      if (!todo.completed) {
        return false
      }
    }

    return true
  }

  _updateTodos() {
    const updatedTodos = []

    const todoElements = document.querySelectorAll('.todos__todo')
    todoElements.forEach((todoElement) => {
      updatedTodos.push(
        this.state.todos.find((todo) => todo._id === todoElement.id)
      )
    })

    this.state.todos = updatedTodos
  }

  _updateTodosState() {
    if (window.location.hash === '#') {
      this.state.todosState = TODOS_STATES.ALL
      emiter.emit({ eventName: ACTIONS.SHOW_ALL_TODOS, args: [] })
    }
    if (window.location.hash === '#/active') {
      this.state.todosState = TODOS_STATES.ACTIVE
      emiter.emit({ eventName: ACTIONS.SHOW_ACTIVE_TODOS, args: [] })
    }
    if (window.location.hash === '#/completed') {
      this.state.todosState = TODOS_STATES.completed
      emiter.emit({ eventName: ACTIONS.SHOW_COMPLETED_TODOS, args: [] })
    }
  }

  _getActiveTodosCount() {
    return this.state.todos.reduce(
      (count, todo) => (todo.completed ? (count += 0) : (count += 1)),
      0
    )
  }

  _updateCheckAllButtonState() {
    this._isCheckedAll()
      ? (this.state.checalAllButtonState = CHEACK_ALL_BUTTON_STATES.ACTIVE)
      : (this.state.checalAllButtonState = CHEACK_ALL_BUTTON_STATES.NOT_ACTIVE)
  }

  _updateTodosListElement() {
    if (this.state.todosState === TODOS_STATES.ALL) {
      emiter.emit({ eventName: ACTIONS.SHOW_ALL_TODOS, args: [] })
    }
    if (this.state.todosState === TODOS_STATES.ACTIVE) {
      emiter.emit({ eventName: ACTIONS.SHOW_ACTIVE_TODOS, args: [] })
    }
    if (this.state.todosState === TODOS_STATES.COMPLETED) {
      emiter.emit({ eventName: 'showCompletedTodos', args: [] })
    }
  }

  _updateTodosCounterElement() {
    const todosCounterElement = document.querySelector('.todos__count')
    todosCounterElement.innerText = `${this._getActiveTodosCount()} items left`
  }

  _updateTodosCheckAllButtonElement() {
    const checkAllButtonElement = document.querySelector('.todos__check-all')
    this.state.checalAllButtonState
      ? checkAllButtonElement.classList.add('active')
      : checkAllButtonElement.classList.remove('active')
  }

  _updateElements() {
    this._updateTodosListElement()
    this._updateTodosCounterElement()
    this._updateTodosCheckAllButtonElement()
  }

  _updateState() {
    this._updateTodosState()
    this._updateCheckAllButtonState()
    emiter.emit({ eventName: ACTIONS.UPDATE_TODOS_OPTIONS, args: [] })

    this._updateElements()
  }

  render() {
    let timerId = null
    let clicksCount = 0

    emiter.subscribe(ACTIONS.LOAD_OLD_TODOS, (event, oldTodos) => {
      oldTodos.forEach((oldTodo) => {
        this._appendTodo(oldTodo)
        const oldTodoComponent = new Todo({
          id: oldTodo._id,
          description: oldTodo.description,
          completed: oldTodo.completed,
          className: 'todo',
          onRemove: (event) => {
            emiter.emit({ eventName: ACTIONS.REMOVE_TODO, args: [event] })
          },
          onChecked: (event) => {
            emiter.emit({ eventName: ACTIONS.CHECK_TODO, args: [event] })
          },
          onClick: (event) => {
            emiter.emit({ eventName: ACTIONS.CLICK_ON_TODO, args: [event] })
          },
        })
        todosListElement.append(oldTodoComponent.render())
      })

      this._updateState()

      emiter.emit({ eventName: ACTIONS.UPDATE_SUBLINE, args: [true] })
    })
    emiter.subscribe(ACTIONS.RENDER_TODOS, (todos) => {
      const todosListElement = document.querySelector('.todos__list')

      todosListElement.innerHTML = ''

      todos.forEach((todo) => {
        const newTodoComponent = new Todo({
          id: todo._id,
          description: todo.description,
          completed: todo.completed,
          className: 'todo',
          onRemove: (event) => {
            emiter.emit({ eventName: ACTIONS.REMOVE_TODO, args: [event] })
          },
          onChecked: (event) => {
            emiter.emit({ eventName: ACTIONS.CHECK_TODO, args: [event] })
          },
          onClick: (event) => {
            emiter.emit({ eventName: ACTIONS.CLICK_ON_TODO, args: [event] })
          },
        })
        const newTodoElement = newTodoComponent.render()
        todosListElement.append(newTodoElement)
      })

      emiter.emit({ eventName: ACTIONS.DRAG_AND_DROP, args: [this] })
    })
    emiter.subscribe(ACTIONS.NEW_TODO, async (event) => {
      event.preventDefault()

      let newSort = 0
      if (this.state.todos.length) {
        const prevTodoSort = this.state.todos[this.state.todos.length - 1].sort
        newSort = prevTodoSort + 1
      } else {
        newSort = 1
      }

      const res = await callApi('/todos', {
        method: 'POST',
        body: JSON.stringify({
          description: inputElement.value,
          completed: false,
          sort: newSort,
        }),
      })

      const newTodo = res.payload.dto

      const newTodoComponent = new Todo({
        id: newTodo._id,
        description: newTodo.description,
        completed: newTodo.completed,
        className: 'todo',
        onRemove: (event) => {
          emiter.emit({ eventName: ACTIONS.REMOVE_TODO, args: [event] })
        },
        onChecked: (event) => {
          emiter.emit({ eventName: ACTIONS.CHECK_TODO, args: [event] })
        },
        onClick: (event) => {
          emiter.emit({ eventName: ACTIONS.CLICK_ON_TODO, args: [event] })
        },
      })

      this._appendTodo(newTodo)

      const newTodoElement = newTodoComponent.render()

      todosListElement.append(newTodoElement)

      emiter.emit({ eventName: ACTIONS.UPDATE_SUBLINE, args: [true] })
      this._updateState()
    })
    emiter.subscribe(ACTIONS.REMOVE_TODO, async (event) => {
      event.preventDefault()

      const id = event.target.closest('.todos__todo')?.id

      if (!id) return

      const res = await callApi(`/todos/${id}`, {
        method: 'DELETE',
      })
      const deletedTodo = res.payload.dto

      this._removeTodo(deletedTodo._id)

      emiter.emit({ eventName: ACTIONS.UPDATE_TODOS_OPTIONS, args: [] })
      emiter.emit({ eventName: ACTIONS.DRAG_AND_DROP, args: [this] })

      this._updateState()
    })
    emiter.subscribe(ACTIONS.CHECK_TODO, async (event) => {
      const todoElementId = event.target.closest('.todos__todo').id
      const todoElement = event.target.closest('.todos__todo')

      let updatedTodo = null

      this.state.todos.forEach((todo) => {
        if (todo._id === todoElementId) {
          todo.completed = !todo.completed
          updatedTodo = todo
          this._toggleCrossedTodo(todoElement.id)
          todoElement.classList.toggle('text-crossed')
        }
      })

      await callApi(`/todos/${updatedTodo._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          description: updatedTodo.description,
          completed: updatedTodo.completed,
          sort: updatedTodo.sort,
        }),
      })

      this._updateState()
    })
    emiter.subscribe(ACTIONS.CLICK_ON_TODO, (event) => {
      clicksCount++
      timerId = setTimeout(() => {
        if (clicksCount === 1) {
          clearInterval(timerId)
          timerId = null
          clicksCount = 0
        }
      }, 200)

      if (clicksCount === 2) {
        clearInterval(timerId)
        timerId = null
        clicksCount = 0
        ///
        /* Two clicks */
        if (event.target.classList.contains('todos__todo-checkbox')) {
          return
        }
        const tempTodoInputElement = document.createElement('input')
        tempTodoInputElement.classList.add('todos__temp-description-input')
        const currentTodoElement = event.target.closest('.todos__todo')
        const currentTodoDescriptionElement = currentTodoElement.querySelector(
          '.todos__todo-description'
        )

        tempTodoInputElement.value = currentTodoDescriptionElement.innerText

        event.target
          .querySelector('.todos__todo-checkbox')
          .classList.add('hidden')

        currentTodoDescriptionElement.append(tempTodoInputElement)
        tempTodoInputElement.focus()

        tempTodoInputElement.addEventListener('keypress', async (event) => {
          if (event.key === 'Enter') {
            let updatedTodo = null
            await this.state.todos.forEach((todo) => {
              if (todo._id === currentTodoElement.id) {
                const newDescription = tempTodoInputElement.value
                todo.description = newDescription
                currentTodoDescriptionElement.innerText = newDescription
                updatedTodo = todo
              }
            })

            await callApi(`/todos/${updatedTodo._id}`, {
              method: 'PUT',
              body: JSON.stringify({
                description: updatedTodo.description,
                completed: updatedTodo.completed,
                sort: updatedTodo.sort,
              }),
            })

            tempTodoInputElement.remove()
          }
        })
        tempTodoInputElement.addEventListener('blur', async () => {
          let updatedTodo = null

          await this.state.todos.forEach((todo) => {
            if (todo._id === currentTodoElement.id) {
              const newDescription = tempTodoInputElement.value
              todo.description = newDescription
              currentTodoDescriptionElement.innerText = newDescription
              updatedTodo = todo
            }
          })

          event.target
            .querySelector('.todos__todo-checkbox')
            .classList.remove('hidden')

          await callApi(`/todos/${updatedTodo._id}`, {
            method: 'PUT',
            body: JSON.stringify({
              description: updatedTodo.description,
              completed: updatedTodo.completed,
              sort: updatedTodo.sort,
            }),
          })

          tempTodoInputElement.remove()
        })

        localStorage.setItem('todos', JSON.stringify(this.state.todos, null, 2))
        ///
      }

      this._updateState()
    })

    emiter.subscribe(ACTIONS.CLEAR_COMPLETED_TODOS, async () => {
      let deletedTodos = []

      this.state.todos.forEach((todo) => {
        if (todo.completed) {
          const todoElement = document.getElementById(todo._id)
          deletedTodos.push(todo)
          todoElement.remove()
        }
      })

      deletedTodos.forEach(async (deletedTodo) => {
        await callApi(`/todos/${deletedTodo._id}`, {
          method: 'DELETE',
        })
      })

      this._clearComplited()
      emiter.emit({ eventName: ACTIONS.UPDATE_TODOS_OPTIONS, args: [] })

      this._updateState()
    })

    emiter.subscribe(ACTIONS.SHOW_ACTIVE_TODOS, () => {
      emiter.emit({
        eventName: ACTIONS.RENDER_TODOS,
        args: [
          this.state.todos
            .filter((todo) => !todo.completed)
            .sort((a, b) => a.sort - b.sort),
        ],
      })

      Button.makeActive(activeButton)
    })
    emiter.subscribe(ACTIONS.SHOW_COMPLETED_TODOS, () => {
      emiter.emit({
        eventName: ACTIONS.RENDER_TODOS,
        args: [
          this.state.todos
            .filter((todo) => todo.completed)
            .sort((a, b) => a.sort - b.sort),
        ],
      })

      Button.makeActive(completedButton)
    })
    emiter.subscribe(ACTIONS.SHOW_ALL_TODOS, () => {
      emiter.emit({
        eventName: ACTIONS.RENDER_TODOS,
        args: [this.state.todos.sort((a, b) => a.sort - b.sort)],
      })

      Button.makeActive(allButton)
    })

    emiter.subscribe(ACTIONS.TOGGLE_CHECKED_ALL_TODOS, () => {
      if (this._isCheckedAll()) {
        this.state.todos.forEach(async (todo) => {
          todo.completed = !todo.completed

          await callApi(`/todos/${todo._id}`, {
            method: 'PUT',
            body: JSON.stringify({
              description: todo.description,
              completed: todo.completed,
              sort: todo.sort,
            }),
          })
        })

        this._updateState()
      } else {
        this.state.todos.forEach(async (todo) => {
          todo.completed = true

          await callApi(`/todos/${todo._id}`, {
            method: 'PUT',
            body: JSON.stringify({
              description: todo.description,
              completed: todo.completed,
              sort: todo.sort,
            }),
          })
        })

        this._updateState()
      }
    })

    emiter.subscribe(ACTIONS.HIDE_TODOS_OPTIONS, () => {
      checkAllButtonElement.classList.add('hidden')
      todosFooterElement.classList.add('hidden')
    })
    emiter.subscribe(ACTIONS.SHOW_TODOS_OPRIONS, () => {
      checkAllButtonElement.classList.remove('hidden')
      todosFooterElement.classList.remove('hidden')
    })
    emiter.subscribe(ACTIONS.UPDATE_TODOS_OPTIONS, () => {
      this.state.todos.length === 0
        ? emiter.emit({ eventName: ACTIONS.HIDE_TODOS_OPTIONS, args: [] })
        : emiter.emit({ eventName: ACTIONS.SHOW_TODOS_OPRIONS, args: [] })
    })

    emiter.subscribe(ACTIONS.DRAG_AND_DROP, (todos) => {
      dragAndDrop(todos)
    })
    emiter.subscribe(ACTIONS.UPDATE_SUBLINE, (event, isAppend) => {
      if (isAppend) {
        if (this.state.todos.length <= 3 && this.state.todos.length > 1) {
          const sublineElement = document.createElement('div')
          sublineElement.classList.add('todos__subline')
          todosSublinesListElement.append(sublineElement)
        }
      } else if (this.state.todos.length < 3) {
        todosSublinesListElement.lastElementChild?.remove()
      }
    })

    const inputElement = new Input({
      className: 'input',
      placeholder: 'Whats need to be done?',
      onEnter: (event) => {
        if (event.key === 'Enter') {
          if (event.target.value) {
            emiter.emit({ eventName: ACTIONS.NEW_TODO, args: [event] })
            event.target.value = ''
          } else {
            event.preventDefault()
          }
        }
      },
    }).render()

    const todosCreateFormElement = document.createElement('form')
    todosCreateFormElement.classList.add('todos__create-form')

    const todosListElement = document.createElement('ul')
    todosListElement.classList.add('todos__list')

    const todosContainerElement = document.createElement('div')
    todosContainerElement.classList.add('todos__container')

    const todosTitleElement = document.createElement('h1')
    todosTitleElement.innerText = 'todos'
    todosTitleElement.classList.add('todos__title')

    const todosBodyElement = document.createElement('div')
    todosBodyElement.classList.add('todos__body')
    todosBodyElement.append(todosCreateFormElement)
    todosBodyElement.append(todosListElement)

    const todosFooterElement = document.createElement('div')
    todosFooterElement.classList.add('todos__footer')

    const todosOptionsContainerElement = document.createElement('div')
    todosOptionsContainerElement.classList.add('todos__options-container')

    const todosCountElement = document.createElement('div')
    todosCountElement.classList.add('todos__count')
    todosCountElement.innerText = `${this.state.todos.length} item left`

    const checkAllButtonElement = document.createElement('a')
    checkAllButtonElement.innerHTML = checkAllSVG
    checkAllButtonElement.classList.add('todos__check-all')

    const todosSublinesListElement = document.createElement('ul')
    todosSublinesListElement.classList.add('todos__sublines')

    checkAllButtonElement.addEventListener('click', (event) => {
      emiter.emit({
        eventName: ACTIONS.TOGGLE_CHECKED_ALL_TODOS,
        args: [event],
      })
    })

    const allButton = new Button({
      label: 'All',
      className: 'footer-button',
      isHighlight: true,
      isHighlightDefault: false,
      href: '#',
      onClick: (event) => {
        emiter.emit({ eventName: ACTIONS.SHOW_ALL_TODOS, args: [event] })
      },
    }).render()
    const activeButton = new Button({
      label: 'Active',
      className: 'footer-button',
      isHighlight: true,
      isHighlightDefault: false,
      href: '#/active',
      onClick: (event) => {
        emiter.emit({ eventName: ACTIONS.SHOW_ACTIVE_TODOS, args: [event] })
      },
    }).render()
    const completedButton = new Button({
      label: 'Completed',
      className: 'footer-button',
      isHighlight: true,
      isHighlightDefault: false,
      href: '#/completed',
      onClick: (event) => {
        emiter.emit({ eventName: ACTIONS.SHOW_COMPLETED_TODOS, args: [event] })
      },
    }).render()
    const clearCompletedButton = new Button({
      label: 'Clear completed',
      className: 'clear-completed',
      onClick: (event) => {
        emiter.emit({ eventName: ACTIONS.CLEAR_COMPLETED_TODOS, args: [event] })
      },
    }).render()

    todosOptionsContainerElement.append(allButton)
    todosOptionsContainerElement.append(activeButton)
    todosOptionsContainerElement.append(completedButton)

    todosFooterElement.append(todosCountElement)
    todosFooterElement.append(todosOptionsContainerElement)
    todosFooterElement.append(clearCompletedButton)

    todosBodyElement.append(todosFooterElement)

    todosCreateFormElement.append(checkAllButtonElement)
    todosCreateFormElement.append(inputElement)

    todosContainerElement.append(todosTitleElement)
    todosContainerElement.append(todosBodyElement)
    todosContainerElement.append(todosSublinesListElement)

    document.addEventListener('DOMContentLoaded', async (event) => {
      const res = await callApi('/todos', {
        method: 'GET',
      })
      const oldTodos = res.payload.list

      emiter.emit({
        eventName: ACTIONS.LOAD_OLD_TODOS,
        args: [event, oldTodos.sort((a, b) => a.sort - b.sort)],
      })

      this._updateState()
    })


    return todosContainerElement
  }
}
