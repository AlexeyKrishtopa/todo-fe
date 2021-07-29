import store from './Store'

export const storeStateLogger = (label) => {
  console.group(`       Store State Logger: ${label}       `)
  console.log(`todos: ${store.state.todos}`)
  console.log(`todosState: ${store.state.todosState}`)
  console.groupEnd()
}
