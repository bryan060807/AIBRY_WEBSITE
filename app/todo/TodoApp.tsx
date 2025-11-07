'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';

interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Load user and todos
  useEffect(() => {
    const loadUserAndTodos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      const { data, error } = await supabase
        .from('todos')
        .select('id, task, completed')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else if (data) setTodos(data);
    };

    loadUserAndTodos();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`todos:user:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${userId}` },
        async () => {
          const { data, error } = await supabase
            .from('todos')
            .select('id, task, completed')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) console.error(error);
          else if (data) setTodos(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Add a new task
  const addTodo = useCallback(async () => {
    const task = newTask.trim();
    if (!userId || !task) return;

    const { error } = await supabase.from('todos').insert({ task, user_id: userId });
    if (error) console.error(error);
    setNewTask('');
  }, [newTask, userId]);

  // Toggle completed status
  const toggleTodo = useCallback(async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id);
    if (error) console.error(error);
  }, []);

  // Delete a task
  const deleteTodo = useCallback(async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) console.error(error);
  }, []);

  return (
    <div className="w-full text-gray-200">
      <h2 className="text-lg font-semibold mb-3 text-[#83c0cc]">To-Do List</h2>

      {!userId ? (
        <p className="text-sm text-gray-500 mt-2">Sign in to save your tasks.</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              className="flex-grow rounded-lg border border-gray-700 bg-gray-900/60 text-gray-100 placeholder-gray-400 px-3 py-2 text-sm focus:border-[#83c0cc] focus:ring-1 focus:ring-[#83c0cc] outline-none transition"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            />
            <button
              onClick={addTodo}
              className="rounded-lg bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-4 py-2 text-sm transition-colors"
            >
              +
            </button>
          </div>

          {todos.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks yet. Add one!</p>
          ) : (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto custom-scroll">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex justify-between items-center bg-gray-800/70 p-2 rounded"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                      className="accent-[#83c0cc]"
                    />
                    <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                      {todo.task}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
