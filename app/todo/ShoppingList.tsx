'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function ShoppingList() {
  const [items, setItems] = useState<{ id: string; item: string }[]>([]);
  const [newItem, setNewItem] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Load user + items initially
  useEffect(() => {
    const loadUserAndItems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from('shopping_items')
        .select('id, item')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      if (data) setItems(data);
    };

    loadUserAndItems();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`shopping_items:user:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shopping_items', filter: `user_id=eq.${userId}` },
        async () => {
          const { data, error } = await supabase
            .from('shopping_items')
            .select('id, item')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) console.error(error);
          if (data) setItems(data);
        }
      )
      .subscribe();

    // ✅ FIX: synchronous cleanup — no async, no promise
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  const addItem = async () => {
    if (!userId || !newItem.trim()) return;
    const { error } = await supabase
      .from('shopping_items')
      .insert({ item: newItem.trim(), user_id: userId });
    if (error) console.error(error);
    setNewItem('');
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase.from('shopping_items').delete().eq('id', id);
    if (error) console.error(error);
  };

  return (
    <div className="w-full text-gray-200">
      <h2 className="text-lg font-semibold mb-3 text-[#83c0cc]">Things to Buy</h2>

      {!userId ? (
        <p className="text-sm text-gray-500 mt-2">Sign in to save your list.</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              className="flex-grow rounded-lg border border-gray-700 bg-gray-900/60 text-gray-100 placeholder-gray-400 px-3 py-2 text-sm focus:border-[#83c0cc] focus:ring-1 focus:ring-[#83c0cc] outline-none transition"
              placeholder="Add a new item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <button
              onClick={addItem}
              className="rounded-lg bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-4 py-2 text-sm transition-colors"
            >
              Add
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">No items yet. Add one!</p>
          ) : (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto custom-scroll">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center bg-gray-800/70 p-2 rounded"
                >
                  <span>{item.item}</span>
                  <button
                    onClick={() => removeItem(item.id)}
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
