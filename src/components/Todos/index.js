import './style.scss'
import Todo from '../Todo'
import Button from '../Button'
import Input from '../Input'
import { emiter } from '../../utils/EventEmmiter'
import { checkAllSVG } from '../../constants/checkAllSVG'
import { TODOS_STATES } from '../../constants/todosStates'
import { CHEACK_ALL_STATE } from '../../constants/checkAllButtonState'
import { dragAndDrop } from '../../utils/dragAndDrop'
import callApi from '../../utils/callApi'

export default class Todos {
  constructor() {
    this.todos = []
    this.state = TODOS_STATES.ALL
    this._todosCount = 0
  }

  _appendTodo(todo) {
    this.todos.push(todo)
  }

  _removeTodo(todoId) {
    this.todos = this.todos.filter((todo) => todo._id !== todoId)
  }

  _toggleCrossedTodo(todoId) {
    this.todos.forEach((todo) => {
      if (+todo.id === +todoId) {
        todo.isCrossed = !todo.isCrossed
      }
    })
  }

  _updateTodosCount() {
    const todosCountElement = document.querySelector('.todos__count')
    todosCountElement.innerText = `${
      this.todos.filter((todo) => !todo.isChecked).length
    } item left`
  }

  _clearComplited() {
    this.todos = this.todos.filter((todo) => !todo.isChecked)
  }

  _isCheckedAll() {
    for (const todo of this.todos) {
      if (!todo.completed) {
        return false
      }
    }

    return true
  }

  _updateTodos() {
    const tempTodos = []

    const todoElements = document.querySelectorAll('.todos__todo')
    todoElements.forEach((todoElement) => {
      tempTodos.push(this.todos.find((todo) => todo._id === todoElement.id))
    })

    this.todos = tempTodos
  }

  render() {
    let timerId = null
    let clicksCount = 0

    emiter.subscribe('loadOldTodos', (event, oldTodos) => {
      event.preventDefault()
      oldTodos.forEach((oldTodo) => {
        const newTodo = new Todo({
          id: oldTodo.id,
          description: oldTodo.description,
          isChecked: oldTodo.isChecked,
          isCrossed: oldTodo.isCrossed,
          className: 'todo',
          onRemove: (event) => {
            emiter.emit({ eventName: 'removeTodo', args: [event] })
          },
          onChecked: (event) => {
            emiter.emit({ eventName: 'checkTodo', args: [event] })
          },
          onClick: (event) => {
            emiter.emit({ eventName: 'clickOnTodo', args: [event] })
          },
        })
        this._appendTodo(newTodo)
        todosListElement.append(newTodo.render())
        this._todosCount++
        emiter.emit({ eventName: 'setSubline', args: [event, true] })
        console.log(this._todosCount)
      })

      emiter.emit({ eventName: 'showTodosOptions', args: [event] })
      this._updateTodosCount()
      emiter.emit({ eventName: 'dragAndDrop', args: [this] })

      // localStorage.setItem('todos', JSON.stringify(this.todos, null, 2))
    })
    emiter.subscribe('newTodo', async (event) => {
      event.preventDefault()

      let newSort = null
      if (this.todos.length) {
        const prevTodoSort = this.todos[this.todos.length - 1].sort
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

      console.log(newTodo)

      const newTodoComponent = new Todo({
        id: newTodo._id,
        description: newTodo.description,
        completed: newTodo.completed,
        className: 'todo',
        onRemove: (event) => {
          emiter.emit({ eventName: 'removeTodo', args: [event] })
        },
        onChecked: (event) => {
          emiter.emit({ eventName: 'checkTodo', args: [event] })
        },
        onClick: (event) => {
          emiter.emit({ eventName: 'clickOnTodo', args: [event] })
        },
      })

      this._appendTodo(newTodo)
      emiter.emit({ eventName: 'showTodosOptions', args: [event] })

      const newTodoElement = newTodoComponent.render()

      if (this.state === TODOS_STATES.COMPLETED) {
        newTodoElement.classList.add('hidden')
      }

      todosListElement.append(newTodoElement)

      this._updateTodosCount()

      emiter.emit({ eventName: 'dragAndDrop', args: [this] })
      this._todosCount++
      console.log(this._todosCount)
      emiter.emit({ eventName: 'setSubline', args: [event, true] })
      localStorage.setItem('todos', JSON.stringify(this.todos, null, 2))
      console.log(this.todos)
    })
    emiter.subscribe('removeTodo', async (event) => {
      event.preventDefault()

      const id = event.target.closest('.todos__todo')?.id

      if (!id) return

      const res = await callApi(`/todos/${id}`, {
        method: 'DELETE',
      })
      const deletedTodo = res.payload.dto

      console.log(deletedTodo._id)

      this._removeTodo(deletedTodo._id)
      event.target.closest('.todos__todo').remove()

      if (this.todos.length === 0) {
        emiter.emit({ eventName: 'hideTodosOptions', args: [] })
      }
      this._updateTodosCount()

      emiter.emit({ eventName: 'dragAndDrop', args: [this] })

      this._todosCount--
      console.log(this._todosCount)

      emiter.emit({ eventName: 'setSubline', args: [event, false] })
      localStorage.setItem('todos', JSON.stringify(this.todos, null, 2))

      console.log(this.todos)
    })
    emiter.subscribe('checkTodo', async (event) => {
      const todoElementId = event.target.closest('.todos__todo').id
      const todoElement = event.target.closest('.todos__todo')

      let updatedTodo = null

      this.todos.forEach((todo) => {
        if (todo._id === todoElementId) {
          todo.completed = !todo.completed
          updatedTodo = todo
          this._toggleCrossedTodo(todoElement.id)
          todoElement.classList.toggle('text-crossed')
          if (this.state === TODOS_STATES.ACTIVE) {
            todoElement.classList.add('hidden')
          }
          if (this.state === TODOS_STATES.COMPLETED) {
            todoElement.classList.add('hidden')
          }
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

      this._updateTodosCount()

      CHEACK_ALL_STATE.isActive = this._isCheckedAll()
      CHEACK_ALL_STATE.isActive
        ? checkAllButtonElement.classList.add('active')
        : checkAllButtonElement.classList.remove('active')

      localStorage.setItem('todos', JSON.stringify(this.todos, null, 2))
      localStorage.setItem('checkAllState', JSON.stringify(CHEACK_ALL_STATE))
    })
    emiter.subscribe('clickOnTodo', (event) => {
      clicksCount++
      timerId = setTimeout(() => {
        if (clicksCount === 1) {
          clearInterval(timerId)
          timerId = null
          clicksCount = 0
          ///
          /* One click */
          /* const target = event.target
          if (
            target.classList.contains('todos__todo-checkbox') ||
            target.closest('.todos__todo-remove')
          ) {
            return
          }
          if (!target.closest('.todos__todo')) {
            return
          }

          const todoElement = target.closest('.todos__todo')

          this._toggleCrossedTodo(todoElement.id)
          todoElement.classList.toggle('text-crossed') */
          ///
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
            await this.todos.forEach((todo) => {
              if (todo._id === currentTodoElement.id) {
                const newDescription = tempTodoInputElement.value
                todo.description = newDescription
                currentTodoDescriptionElement.innerText = newDescription
                updatedTodo = todo
              }
            })

            console.log(updatedTodo)

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

          await this.todos.forEach((todo) => {
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

          console.log(updatedTodo)

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

        localStorage.setItem('todos', JSON.stringify(this.todos, null, 2))
        ///
      }
    })
    emiter.subscribe('clearComplitedTodos', async (event) => {
      event.preventDefault()

      let deletedTodos = []

      this.todos.forEach((todo) => {
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
      this._updateTodosCount()

      localStorage.setItem('todos', JSON.stringify(this.todos, null, 2))
    })
    emiter.subscribe('showActiveTodos', (event) => {
      event.preventDefault()

      this.todos.forEach((todo) => {
        const todoElement = document.getElementById(todo.id)
        !todo.isChecked
          ? todoElement.classList.remove('hidden')
          : todoElement.classList.add('hidden')
      })

      this.state = TODOS_STATES.ACTIVE
      localStorage.setItem('todosState', JSON.stringify(this.state))
    })
    emiter.subscribe('showComplitedTodos', (event) => {
      event.preventDefault()

      this.todos.forEach((todo) => {
        const todoElement = document.getElementById(todo.id)
        !todo.isChecked
          ? todoElement.classList.add('hidden')
          : todoElement.classList.remove('hidden')
      })

      this.state = TODOS_STATES.COMPLETED
      localStorage.setItem('todosState', JSON.stringify(this.state))
    })
    emiter.subscribe('showAllTodos', (event) => {
      event.preventDefault()

      this.todos.forEach((todo) => {
        const todoElement = document.getElementById(todo.id)
        todoElement.classList.remove('hidden')
      })

      this.state = TODOS_STATES.ALL
      localStorage.setItem('todosState', JSON.stringify(this.state))
    })
    emiter.subscribe('toggleCheckedAllTodos', (event) => {
      event.preventDefault()

      if (this._isCheckedAll()) {
        this.todos.forEach(async (todo) => {
          todo.completed = !todo.completed
          const todoCheckboxElement = document
            .getElementById(todo._id)
            .querySelector('.todos__todo-checkbox')
          const todoElement = document.getElementById(todo._id)
          todoCheckboxElement.checked = !todoCheckboxElement.checked
          todoElement.classList.toggle('text-crossed')

          await callApi(`/todos/${todo._id}`, {
            method: 'PUT',
            body: JSON.stringify({
              description: todo.description,
              completed: todo.completed,
            }),
          })
        })

        this._updateTodosCount()

        CHEACK_ALL_STATE.isActive = !CHEACK_ALL_STATE.isActive

        CHEACK_ALL_STATE.isActive
          ? checkAllButtonElement.classList.add('active')
          : checkAllButtonElement.classList.remove('active')

        localStorage.setItem('checkAllState', JSON.stringify(CHEACK_ALL_STATE))
      } else {
        this.todos.forEach(async (todo) => {
          todo.completed = true
          const todoCheckboxElement = document
            .getElementById(todo._id)
            .querySelector('.todos__todo-checkbox')
          const todoElement = document.getElementById(todo._id)
          todoCheckboxElement.checked = true
          todoElement.classList.add('text-crossed')

          await callApi(`/todos/${todo._id}`, {
            method: 'PUT',
            body: JSON.stringify({
              description: todo.description,
              completed: todo.completed,
            }),
          })
        })

        this._updateTodosCount()

        CHEACK_ALL_STATE.isActive = true

        CHEACK_ALL_STATE.isActive
          ? checkAllButtonElement.classList.add('active')
          : checkAllButtonElement.classList.remove('active')

        localStorage.setItem('checkAllState', JSON.stringify(CHEACK_ALL_STATE))
      }

      localStorage.setItem('todos', JSON.stringify(this.todos, null, 2))
    })
    emiter.subscribe('hideTodosOptions', () => {
      checkAllButtonElement.classList.add('hidden')
      todosFooterElement.classList.add('hidden')
    })
    emiter.subscribe('showTodosOptions', () => {
      checkAllButtonElement.classList.remove('hidden')
      todosFooterElement.classList.remove('hidden')
    })
    emiter.subscribe('dragAndDrop', (todos) => {
      dragAndDrop(todos)
    })
    emiter.subscribe('setSubline', (event, isAppend) => {
      if (isAppend) {
        if (this.todos.length <= 3 && this.todos.length > 1) {
          const sublineElement = document.createElement('div')
          sublineElement.classList.add('todos__subline')
          todosSublinesListElement.append(sublineElement)
        }
      } else if (this.todos.length < 3) {
        todosSublinesListElement.lastElementChild?.remove()
      }
    })

    const inputElement = new Input({
      className: 'input',
      placeholder: 'Whats need to be done?',
      onEnter: (event) => {
        if (event.key === 'Enter') {
          if (event.target.value) {
            emiter.emit({ eventName: 'newTodo', args: [event] })
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
    todosCountElement.innerText = `${this.todos.length} item left`

    const checkAllButtonElement = document.createElement('a')
    checkAllButtonElement.innerHTML = checkAllSVG
    checkAllButtonElement.classList.add('todos__check-all')

    const todosSublinesListElement = document.createElement('ul')
    todosSublinesListElement.classList.add('todos__sublines')

    checkAllButtonElement.addEventListener('click', (event) => {
      emiter.emit({ eventName: 'toggleCheckedAllTodos', args: [event] })
    })

    const allButton = new Button({
      label: 'All',
      className: 'footer-button',
      isHighlight: true,
      isHighlightDefault: true,
      onClick: (event) => {
        emiter.emit({ eventName: 'showAllTodos', args: [event] })
      },
    }).render()
    const activeButton = new Button({
      label: 'Active',
      className: 'footer-button',
      isHighlight: true,
      isHighlightDefault: false,
      onClick: (event) => {
        emiter.emit({ eventName: 'showActiveTodos', args: [event] })
      },
    }).render()
    const completedButton = new Button({
      label: 'Completed',
      className: 'footer-button',
      isHighlight: true,
      isHighlightDefault: false,
      onClick: (event) => {
        emiter.emit({ eventName: 'showComplitedTodos', args: [event] })
      },
    }).render()
    const clearCompletedButton = new Button({
      label: 'Clear completed',
      className: 'clear-completed',
      onClick: (event) => {
        emiter.emit({ eventName: 'clearComplitedTodos', args: [event] })
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

    // const oldTodos = JSON.parse(localStorage.getItem('todos'))

    // if (oldTodos?.length > 0) {
    //   document.addEventListener('DOMContentLoaded', (event) => {
    //     const todosCurrentState = JSON.parse(localStorage.getItem('todosState'))
    //     CHEACK_ALL_STATE.isActive = JSON.parse(
    //       localStorage.getItem('checkAllState')
    //     ).isActive
    //     emiter.emit({ eventName: 'loadOldTodos', args: [event, oldTodos] })

    //     CHEACK_ALL_STATE.isActive
    //       ? checkAllButtonElement.classList.add('active')
    //       : checkAllButtonElement.classList.remove('active')

    //     if (todosCurrentState === TODOS_STATES.ALL) {
    //       emiter.emit({ eventName: 'showAllTodos', args: [event] })
    //       Button.makeActive(allButton)
    //     }
    //     if (todosCurrentState === TODOS_STATES.ACTIVE) {
    //       emiter.emit({ eventName: 'showActiveTodos', args: [event] })
    //       Button.makeActive(activeButton)
    //     }
    //     if (todosCurrentState === TODOS_STATES.COMPLETED) {
    //       emiter.emit({ eventName: 'showComplitedTodos', args: [event] })
    //       Button.makeActive(completedButton)
    //     }
    //   })
    // }

    if (this.todos.length === 0) {
      emiter.emit({ eventName: 'hideTodosOptions', args: [] })
    }

    return todosContainerElement
  }
}
