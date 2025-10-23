import React from 'react';

interface HeaderProps {
    currentUser: string | null;
    onLoginClick: () => void;
    onLogout: () => void;
}

export const GeneratorHeader: React.FC<HeaderProps> = ({ currentUser, onLoginClick, onLogout }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
          </svg>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            AIBRY's AI Song <span className="text-indigo-400">Generator</span>
          </h1>
        </div>
        <div>
            {currentUser ? (
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-300 hidden sm:block">
                        Welcome, <span className="font-bold capitalize">{currentUser}</span>
                    </span>
                    <button 
                        onClick={onLogout}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-2 px-4 rounded-md transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <button 
                    onClick={onLoginClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Log In
                </button>
            )}
        </div>
      </div>
    </header>
  );
};
