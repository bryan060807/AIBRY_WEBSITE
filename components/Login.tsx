import React, { useState } from 'react';

interface LoginProps {
    onLogin: (username: string) => void;
    onCancel: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm m-4 relative border border-gray-700">
                 <button onClick={onCancel} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                </button>
                <div className="text-center mb-6">
                     <h2 className="text-2xl font-bold text-indigo-400">Log In / Sign Up</h2>
                     <p className="text-sm text-gray-400 mt-1">Enter a username to save and load your projects.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="sr-only">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            required
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!username.trim()}
                        className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-200"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};
