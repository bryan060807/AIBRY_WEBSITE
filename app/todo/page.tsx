// app/todo/page.tsx

import dynamic from 'next/dynamic';
import { type Metadata } from 'next';
import './app.css'; // Import the custom styles for the To-Do app

export const metadata: Metadata = {
    title: "Routine | AIBRY Productivity",
    description: "AIBRY's daily productivity task manager powered by Supabase.",
};

// Dynamic import for client-side component (ensures it only runs in the browser)
const ToDoApp = dynamic(() => import('./ToDoApp'), { ssr: false });

export default function ToDoPage() {
    return (
        <div className="flex justify-center py-10 md:py-20">
            {/* We no longer pass props. The ToDoApp component
              will create its own authenticated client.
            */}
            <ToDoApp />
        </div>
    );
}