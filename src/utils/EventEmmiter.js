class EventEmitter {
  constructor() {
    this._events = {}
  }
  subscribe(eventName, handler) {
    if (!this._events[eventName]) {
      this._events[eventName] = []
    }
    this._events[eventName].push(handler)

    return this._unsubscribe.bind(this, eventName, handler)
  }
  _unsubscribe(eventName, handler) {
    this._events[eventName] = this._events[eventName].filter(
      (eventHandler) => eventHandler !== handler
    )
  }
  emit(event) {
    const handlers = this._events[event.eventName]
    if (handlers) {
      handlers.forEach((handler) => handler(...event.args))
    }
  }
}
export const emiter = new EventEmitter()
