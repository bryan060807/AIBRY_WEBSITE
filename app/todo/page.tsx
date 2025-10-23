// app/todo/page.tsx

import dynamic from 'next/dynamic';
import { type Metadata } from 'next';
import './app.css'; // Import the custom styles for the To-Do app

// --- SUPABASE CONFIG RETRIEVAL ---
// Retrieves the required environment variables.
// NOTE: These must be set in your .env.local file (NEXT_PUBLIC_ prefix is required for client access).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// ----------------------------------------

export const metadata: Metadata = {
    title: "Routine | AIBRY Productivity",
    description: "AIBRY's daily productivity task manager powered by Supabase.",
};

// Dynamic import for client-side component (ensures it only runs in the browser)
const ToDoApp = dynamic(() => import('./ToDoApp'), { ssr: false });

// Simple error component to display when config is missing
const ConfigError = () => (
    <div className="text-center p-8 bg-red-900/50 rounded-xl border border-red-500 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-red-300 mb-2">
            CONFIGURATION ERROR: SUPABASE KEYS MISSING
        </h2>
        <p className="text-red-400">
            Please check your **.env.local** file. The variables
            <code className="bg-red-900 px-1 rounded mx-1">NEXT_PUBLIC_SUPABASE_URL</code> and
            <code className="bg-red-900 px-1 rounded mx-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            must be set with your actual project keys and the server restarted.
        </p>
    </div>
);

export default function ToDoPage() {
    // Check if configuration is valid before rendering the client component
    const configValid = supabaseUrl && supabaseAnonKey && 
                        !supabaseUrl.includes('YOUR_SUPABASE') && 
                        !supabaseAnonKey.includes('YOUR_SUPABASE');

    if (!configValid) {
        return (
            <div className="flex justify-center py-10 md:py-20">
                <ConfigError />
            </div>
        );
    }

    return (
        <div className="flex justify-center py-10 md:py-20">
            {/* Pass Supabase config to the client component */}
            <ToDoApp 
                supabaseUrl={supabaseUrl as string} 
                supabaseAnonKey={supabaseAnonKey as string} 
            />
        </div>
    );
}