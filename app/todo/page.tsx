'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

interface Todo {
  id: string;
  content: string;
  completed: boolean;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        await fetchTodos(session.user.id);
      } else {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchTodos(userId: string) {
    setLoading(true);
    const { data } = await supabase.from('todos').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setTodos(data as Todo[]);
    setLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = { id: crypto.randomUUID(), content: newTodo, completed: false };
    setTodos([todo, ...todos]);
    setNewTodo('');

    if (userId) {
      await supabase.from('todos').insert([{ ...todo, user_id: userId }]);
    }
  }

  async function toggleComplete(id: string, completed: boolean) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    if (userId) {
      await supabase.from('todos').update({ completed: !completed }).eq('id', id).eq('user_id', userId);
    }
  }

  async function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (userId) {
      await supabase.from('todos').delete().eq('id', id).eq('user_id', userId);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">To-Do List</h1>
      <p className="text-gray-400 text-center mb-6">
        {userId ? 'Your tasks are synced with Supabase.' : 'Not signed in — using local mode.'}
      </p>

      <form onSubmit={addTodo} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-md bg-gray-800 border border-gray-700 p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-md bg-[#629aa9] text-white font-semibold hover:bg-[#4f7f86] transition"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-gray-500 text-center italic">No tasks yet.</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-md p-3"
            >
              <span
                onClick={() => toggleComplete(todo.id, todo.completed)}
                className={`cursor-pointer ${
                  todo.completed ? 'line-through text-gray-500' : 'text-white'
                }`}
              >
                {todo.content}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
