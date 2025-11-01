'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import './app.css';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

export default function ToDoApp() {
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in.');
      return;
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) toast.error(error.message);
    else setTodos(data || []);
    setLoading(false);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error('Please log in.');

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: newTodo.trim(), user_id: user.id, due_date: dueDate || null }])
      .select();

    if (error) return toast.error(error.message);
    setTodos([...(data || []), ...todos]);
    setNewTodo('');
    setDueDate('');
    toast.success('Task added!');
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id);
    if (error) return toast.error(error.message);

    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    toast.success(completed ? 'Marked incomplete' : 'Marked complete');
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setTodos(todos.filter((t) => t.id !== id));
    toast.success('Task deleted');
  };

  const filteredTodos = todos.filter((t) =>
    filter === 'all'
      ? true
      : filter === 'completed'
      ? t.completed
      : !t.completed
  );

  return (
    <div className="todo-container">
      <h1 className="todo-title">My To-Dos</h1>

      <form onSubmit={addTodo} className="todo-form flex-col sm:flex-row">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input flex-1"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="todo-date-input"
          />
        </div>
        <button type="submit" className="todo-add-btn w-full sm:w-auto">
          Add
        </button>
      </form>

      <div className="todo-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <p className="todo-status">Loading tasks...</p>
      ) : filteredTodos.length === 0 ? (
        <p className="todo-status">No tasks found.</p>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className={`todo-text ${todo.completed ? 'completed' : ''}`}
              >
                {todo.title}
                {todo.due_date && (
                  <span className="todo-due">
                    Due {new Date(todo.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="todo-delete"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}