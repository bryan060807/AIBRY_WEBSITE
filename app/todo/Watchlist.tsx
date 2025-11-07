'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function Watchlist() {
  const [movies, setMovies] = useState<{ id: string; title: string }[]>([]);
  const [newMovie, setNewMovie] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Load user + watchlist
  useEffect(() => {
    const loadUserAndMovies = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from('watchlist')
        .select('id, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      if (data) setMovies(data);
    };

    loadUserAndMovies();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Listen for realtime updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`watchlist:user:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'watchlist', filter: `user_id=eq.${userId}` },
        async () => {
          const { data, error } = await supabase
            .from('watchlist')
            .select('id, title')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) console.error(error);
          if (data) setMovies(data);
        }
      )
      .subscribe();

    // ✅ FIX: synchronous cleanup, no async nonsense
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  const addMovie = async () => {
    if (!userId || !newMovie.trim()) return;
    const { error } = await supabase
      .from('watchlist')
      .insert({ title: newMovie.trim(), user_id: userId });
    if (error) console.error(error);
    setNewMovie('');
  };

  const removeMovie = async (id: string) => {
    const { error } = await supabase.from('watchlist').delete().eq('id', id);
    if (error) console.error(error);
  };

  return (
    <div className="w-full text-gray-200">
      <h2 className="text-lg font-semibold mb-3 text-[#83c0cc]">Watchlist</h2>

      {!userId ? (
        <p className="text-sm text-gray-500 mt-2">Sign in to save your watchlist.</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              className="flex-grow rounded-lg border border-gray-700 bg-gray-900/60 text-gray-100 placeholder-gray-400 px-3 py-2 text-sm focus:border-[#83c0cc] focus:ring-1 focus:ring-[#83c0cc] outline-none transition"
              placeholder="Add a movie or show..."
              value={newMovie}
              onChange={(e) => setNewMovie(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMovie()}
            />
            <button
              onClick={addMovie}
              className="rounded-lg bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-4 py-2 text-sm transition-colors"
            >
              Add
            </button>
          </div>

          {movies.length === 0 ? (
            <p className="text-gray-500 text-sm">Nothing added yet. Add something to watch!</p>
          ) : (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto custom-scroll">
              {movies.map((movie) => (
                <li
                  key={movie.id}
                  className="flex justify-between items-center bg-gray-800/70 p-2 rounded"
                >
                  <span>{movie.title}</span>
                  <button
                    onClick={() => removeMovie(movie.id)}
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
