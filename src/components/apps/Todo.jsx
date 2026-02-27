import React, { useState } from 'react'
export default function Todo() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Plan next project', completed: false },
    { id: 2, text: 'Fix text visibility', completed: true },
    { id: 3, text: 'Revamp apps', completed: true },
  ])
  const [newTodo, setNewTodo] = useState('')
  const addTodo = (e) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }])
      setNewTodo('')
    }
  }
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }
  return (
    <div className="todo-container">
      <h2 style={{ marginBottom: '20px', fontWeight: 500, color: '#fff' }}>Tasks</h2>
      <div className="todo-input-row">
        <input
          className="todo-input"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={addTodo}
          placeholder="Add a task"
        />
      </div>
      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={`todo-text ${todo.completed ? 'done' : ''}`} style={{ color: todo.completed ? '#888' : '#fff' }}>
              {todo.text}
            </span>
            <span className="todo-delete" onClick={() => deleteTodo(todo.id)}>
              ✕
            </span>
          </div>
        ))}
      </div>
      {todos.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '40px', opacity: 0.5 }}>
          <p>No more tasks!</p>
        </div>
      )}
    </div>
  )
}
