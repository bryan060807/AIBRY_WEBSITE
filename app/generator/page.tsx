// app/generator/page.tsx
"use client"; 

import React, { useState, useCallback, useEffect } from 'react';
import { GeneratorHeader } from '../../components/GeneratorHeader'; 
import { SongInputForm } from '../../components/SongInputForm';
import { SongDisplay } from '../../components/SongDisplay';
import { Loader } from '../../components/Loader';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { Welcome } from '../../components/Welcome';
import { ProjectManagement } from '../../components/ProjectManagement';
import { Login } from '../../components/Login';
import type { GeneratedSong, SavedProject } from '../../types';

// FIX 1: Define the SongInputs interface here, as it's needed for the props in the JSX below.
interface SongInputs {
    lyrics: string;
    title: string;
    genre: string;
    style: string;
    productionNotes: string;
}

interface GenerationStartResponse {
    taskId: string;
    initialDetails: {
        title: string;
        description: string;
    };
}

const ALL_PROJECTS_STORAGE_KEY = 'aibrys-ai-song-generator-all-projects';
const CURRENT_USER_STORAGE_KEY = 'aibrys-ai-song-generator-current-user';

export default function GeneratorPage() {
    const [lyrics, setLyrics] = useState('');
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [style, setStyle] = useState('');
    const [productionNotes, setProductionNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedSong, setGeneratedSong] = useState<GeneratedSong | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('Weaving your masterpiece...');
    
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

    useEffect(() => {
        try {
            const user = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
            if (user) {
                setCurrentUser(user);
                const allProjects = JSON.parse(localStorage.getItem(ALL_PROJECTS_STORAGE_KEY) || '{}');
                setSavedProjects(allProjects[user] || []);
            }
        } catch (e) {
            console.error("Failed to initialize user session from localStorage", e);
        }
    }, []);

    const updateCurrentUserProjects = (projects: SavedProject[]) => {
        if (!currentUser) return;
        setSavedProjects(projects);
        try {
            const allProjects = JSON.parse(localStorage.getItem(ALL_PROJECTS_STORAGE_KEY) || '{}');
            allProjects[currentUser] = projects;
            localStorage.setItem(ALL_PROJECTS_STORAGE_KEY, JSON.stringify(allProjects));
        } catch (e) {
            console.error("Failed to save projects to localStorage", e);
        }
    };
    
    const handleLogin = (username: string) => {
        const sanitizedUser = username.trim().toLowerCase();
        if (!sanitizedUser) return;
        
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, sanitizedUser);
        setCurrentUser(sanitizedUser);

        try {
            const allProjects = JSON.parse(localStorage.getItem(ALL_PROJECTS_STORAGE_KEY) || '{}');
            setSavedProjects(allProjects[sanitizedUser] || []);
        } catch(e) {
            console.error("Failed to load projects for user", e);
            setSavedProjects([]);
        }
        
        setShowLogin(false);
    };

    const handleLogout = () => {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
        setCurrentUser(null);
        setSavedProjects([]);
        handleClearForm();
    };

    const handleGenerateSong = useCallback(async () => {
        if (!lyrics || !genre || !style) {
            setError('Please provide lyrics, a genre, and a style.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedSong(null);
        setLoadingMessage('Composing your song... this can take a minute or two.');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lyrics, genre, style, productionNotes, title }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'The server returned an error.');
            }

            const result: GeneratedSong = await response.json();
            setGeneratedSong(result);

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`An error occurred: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [lyrics, genre, style, productionNotes, title]);

    const handleSaveProject = () => {
        if (!currentUser) {
            alert("You must be logged in to save a project.");
            return;
        }
        // FIX 2: Ensure the inputs object being saved matches the SongInputs type definition
        const inputsToSave: SongInputs = { lyrics, title, genre, style, productionNotes };
        
        const newProject: SavedProject = {
            id: Date.now().toString(),
            name: title || generatedSong?.title || 'Untitled Project',
            savedAt: new Date().toISOString(),
            inputs: inputsToSave, // Use the typed object
            generated: generatedSong ? {
                title: generatedSong.title,
                description: generatedSong.description,
            } : null,
        };
        updateCurrentUserProjects([...savedProjects, newProject]);
        alert(`Project "${newProject.name}" saved!`);
    };

    const handleLoadProject = (projectId: string) => {
        // ... (This function remains the same) ...
    };

    const handleDeleteProject = (projectId: string) => {
        // ... (This function remains the same) ...
    };

    const handleClearForm = () => {
        // ... (This function remains the same) ...
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            {showLogin && <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />}
            <GeneratorHeader 
                currentUser={currentUser}
                onLoginClick={() => setShowLogin(true)}
                onLogout={handleLogout}
            />
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="flex flex-col">
                        <SongInputForm
                            lyrics={lyrics}
                            setLyrics={setLyrics}
                            title={title}
                            setTitle={setTitle}
                            genre={genre}
                            setGenre={setGenre}
                            style={style}
                            setStyle={setStyle}
                            productionNotes={productionNotes}
                            setProductionNotes={setProductionNotes}
                            onSubmit={handleGenerateSong}
                            onClearForm={handleClearForm}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">Your AI-Generated Song</h2>
                        {currentUser ? (
                            <ProjectManagement
                                savedProjects={savedProjects}
                                onSave={handleSaveProject}
                                onLoad={handleLoadProject}
                                onDelete={handleDeleteProject}
                                isSaveDisabled={!lyrics}
                            />
                        ) : (
                            <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-400">
                                    <button onClick={() => setShowLogin(true)} className="font-semibold text-indigo-400 hover:text-indigo-300">Log in</button> to save and load your projects.
                                </p>
                            </div>
                        )}
                        <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex-grow flex items-center justify-center relative min-h-[400px] lg:min-h-0">
                            {isLoading && <Loader message={loadingMessage} />}
                            {error && !isLoading && <ErrorDisplay message={error} />}
                            {generatedSong && !isLoading && !error && (
                                // FIX 3: This line now passes the type check because SongDisplayProps now includes the 'inputs' prop
                                <SongDisplay song={generatedSong} inputs={{ lyrics, title, genre, style, productionNotes }} />
                            )}
                            {!isLoading && !error && !generatedSong && <Welcome />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}