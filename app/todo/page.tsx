'use client';

import dynamic from 'next/dynamic';
import DashboardCard from '@/components/ui/DashboardCard';

// Keep everything consistent with the file name: TodoApp.tsx
const TodoApp = dynamic(() => import('./TodoApp'), { ssr: false });
const ShoppingList = dynamic(() => import('./ShoppingList'), { ssr: false });
const Watchlist = dynamic(() => import('./Watchlist'), { ssr: false });

export default function TodoPage() {
  return (
    <main className="min-h-screen bg-black text-gray-200 flex flex-col items-center">
      <div className="w-full max-w-6xl px-6 py-20">
        {/* Header */}
        <header className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-[#83c0cc] tracking-tight mb-4">
            Your Productivity Hub
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            Manage your daily routine, shopping list, and entertainment goals — all in one space.
            Everything syncs automatically with your account.
          </p>
        </header>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DashboardCard>
            <TodoApp />
          </DashboardCard>

          <DashboardCard>
            <ShoppingList />
          </DashboardCard>

          <DashboardCard>
            <Watchlist />
          </DashboardCard>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-16">
          <p>
            Data securely stored in Supabase — synced across devices. Built with&nbsp;
            <span className="text-[#83c0cc] font-medium">AIBRY</span>.
          </p>
        </footer>
      </div>

      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>
    </main>
  );
}
