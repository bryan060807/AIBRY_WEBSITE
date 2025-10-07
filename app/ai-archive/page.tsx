"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, FC } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, linkWithCredential, EmailAuthProvider, Auth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; 
import { getFirestore, collection, query, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc, deleteDoc, DocumentData, Firestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Gemini API Key
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 

// Mock Audio URL (Used as a fallback if no URL is provided)
const MOCK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

// --- Shared Form Components (Moved outside render functions for stability) ---

interface InputProps {
    name: string;
    label: string;
    type?: string;
    readOnly?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

const Input: FC<InputProps> = ({ name, label, type = 'text', readOnly = false, value, onChange, placeholder, required = true }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-cyan-400 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`w-full px-4 py-2 rounded-lg border border-gray-700 transition duration-150 ${
                readOnly 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            }`}
            required={required}
        />
    </div>
);

interface TextAreaProps {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: FC<TextAreaProps> = ({ name, label, value, onChange }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-cyan-400 mb-1">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={4}
            className="w-full px-4 py-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 transition duration-150 resize-none"
            required
        />
    </div>
);

interface PlayButtonProps {
    isPlaying: boolean;
    onClick: () => void;
}

const PlayButton: FC<PlayButtonProps> = ({ isPlaying, onClick }) => (
    <button
        onClick={onClick}
        className={`
            p-3 rounded-full transition-all duration-300 transform 
            ${isPlaying
                ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50'
                : 'bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-400/50'
            }
            focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 
            ${isPlaying ? 'focus:ring-red-500' : 'focus:ring-cyan-400'}
            active:scale-95
        `}
    >
        {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
        )}
    </button>
);

interface Track {
    id: string;
    title: string;
    artist: string;
    style: string;
    ai_role: string;
    audio_url: string;
    generation_prompt: string;
    tags: string[];
    uploader_id: string;
    creator_name: string;
    timestamp: {
        seconds: number;
    }
}

interface TrackCardProps {
    track: Track;
    currentPlaying: { id: string, audioRef: React.RefObject<HTMLAudioElement> } | null;
    setCurrentPlaying: (track: { id: string, audioRef: React.RefObject<HTMLAudioElement> } | null) => void;
    db: Firestore | null;
    userId: string | null;
    userRole: string | null;
    fetchGeminiGeneration: (userQuery: string, systemPrompt: string, useSearch: boolean, responseSchema?: object | null) => Promise<{ text: string } | null>;
}

const TrackCard: FC<TrackCardProps> = ({ track, currentPlaying, setCurrentPlaying, db, userId, userRole, fetchGeminiGeneration }) => {
    const isPlaying = currentPlaying?.id === track.id;
    const audioSource = track.audio_url && track.audio_url.startsWith('http') ? track.audio_url : MOCK_AUDIO_URL;
    const audioRef = useRef<HTMLAudioElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [aiDescription, setAiDescription] = useState<string | null>(null); 
    const [aiCoverConcepts, setAiCoverConcepts] = useState<string[] | null>(null); 
    const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
    const [isGeneratingCover, setIsGeneratingCover] = useState(false); 

    const canDelete = userId && (
        track.uploader_id === userId || 
        userRole === 'admin' || 
        userRole === 'moderator'
    );
    
    const handleGeneratePitch = async () => {
        if (!fetchGeminiGeneration || isGeneratingPitch) return;

        setIsGeneratingPitch(true);
        setAiDescription(null); 
        
        const systemPrompt = "You are a professional music pitch writer specializing in the trapmetal, industrial, and experimental genres. Create a short, compelling pitch (maximum 3 sentences) for the track based on the source prompt provided. The tone must be dark, digital, and intense. Include the genre and mood in the pitch.";
        const userQuery = `Track Title: "${track.title}". Source Prompt: "${track.generation_prompt}". Style/Tags: ${track.style}, ${track.tags.join(', ')}. Generate the pitch now.`;

        const schema = {
            type: "OBJECT",
            properties: {
                pitch_summary: { "type": "STRING", "description": "The concise 3-sentence summary/pitch." },
            },
            propertyOrdering: ["pitch_summary"]
        };

        try {
            const result = await fetchGeminiGeneration(userQuery, systemPrompt, true, schema);
            if (result && result.text) {
                try {
                    const parsedJson = JSON.parse(result.text);
                    setAiDescription(parsedJson.pitch_summary);
                } catch (e) {
                    console.error("Error parsing AI Pitch JSON:", e);
                    setAiDescription("Error: AI pitch format corrupted. Try regenerating.");
                }
            } else {
                setAiDescription("AI Pitch generation failed. Network or model error.");
            }
        } catch (error) {
            console.error("Gemini Pitch API Error:", error);
            setAiDescription("AI Pitch request failed. Check network connection.");
        } finally {
            setIsGeneratingPitch(false);
        }
    };

    const handleGenerateCoverConcepts = async () => {
        if (!fetchGeminiGeneration || isGeneratingCover) return;

        setIsGeneratingCover(true);
        setAiCoverConcepts(null);

        const systemPrompt = `You are a visual design director for the AIBRY brand, specializing in dark, cinematic, intense, and surreal cover art for trapmetal and industrial music. The designs must integrate themes of resilience, trauma, and identity using fragmented faces, fire, glitch effects, ruined buildings, or neon lighting. Provide exactly three unique, evocative visual concepts (1-2 sentences each).`;
        const userQuery = `Generate cover art concepts for this track. Title: "${track.title}". Source Prompt: "${track.generation_prompt}". Style/Tags: ${track.style}, ${track.tags.join(', ')}.`;

        const schema = {
            type: "OBJECT",
            properties: {
                concepts: { 
                    type: "ARRAY",
                    description: "An array containing three distinct visual concepts for the cover art.",
                    items: {
                        type: "STRING"
                    }
                },
            },
            propertyOrdering: ["concepts"]
        };

        try {
            const result = await fetchGeminiGeneration(userQuery, systemPrompt, false, schema);
            if (result && result.text) {
                try {
                    const parsedJson = JSON.parse(result.text);
                    setAiCoverConcepts(parsedJson.concepts);
                } catch (e) {
                    console.error("Error parsing AI Cover Concepts JSON:", e);
                    setAiCoverConcepts(["Error: AI concept format corrupted. Try regenerating."]);
                }
            } else {
                setAiCoverConcepts(["AI Cover Concept generation failed. Network or model error."]);
            }
        } catch (error) {
            console.error("Gemini Cover Concept API Error:", error);
            setAiCoverConcepts(["AI Cover Concept request failed. Check network connection."]);
        } finally {
            setIsGeneratingCover(false);
        }
    };

    const handleDelete = async () => {
        if (!canDelete || !db || !track.id) return;

        try {
            if (currentPlaying?.id === track.id) {
                 setCurrentPlaying(null); 
            }

            const trackPath = `/artifacts/${appId}/public/data/ai_assisted_tracks/${track.id}`;
            const docRef = doc(db, trackPath);
            
            await deleteDoc(docRef);
            console.log("Track deleted successfully:", track.id);
        } catch (error) {
            console.error("Error deleting document:", error);
        }
        setShowDeleteConfirm(false);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
            setCurrentPlaying(null);
        } else {
            if (currentPlaying && currentPlaying.id !== track.id) {
                currentPlaying.audioRef.current?.pause();
                if (currentPlaying.audioRef.current) currentPlaying.audioRef.current.currentTime = 0;
            }
            
            audioRef.current?.play().catch(e => console.error("Audio playback failed:", e));
            setCurrentPlaying({ id: track.id, audioRef });
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.onended = () => setCurrentPlaying(null);
        }
        return () => {
            if (audio) {
                audio.onended = null;
            }
        };
    }, [setCurrentPlaying]);

    const titleClass = "text-xl font-extrabold tracking-wider mb-2 text-red-500 font-mono";
    const detailClass = "text-sm text-gray-300 mb-1";
    const labelClass = "text-xs font-semibold uppercase text-cyan-400 mr-2";

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-2 border-gray-700 hover:border-cyan-600 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className={titleClass}>{track.title || "Untitled Fragment"}</h3>
                    <p className="text-md text-gray-400 mb-2">
                        {track.creator_name || track.artist || "Unknown Entity"} 
                        {track.uploader_id && (
                             <span className="text-xs text-gray-500 ml-2" title={`Uploader ID: ${track.uploader_id}`}>
                                 (ID: {track.uploader_id.substring(0, 4)}...)
                            </span>
                        )}
                    </p>
                </div>
                <div className="ml-4">
                    <PlayButton isPlaying={isPlaying} onClick={handlePlayPause} />
                </div>
            </div>

            <audio ref={audioRef} src={audioSource} preload="none" className="hidden" />
            
            <div className="text-xs text-gray-500 mt-2 p-2 rounded bg-gray-900 border border-gray-700">
                <span className="text-cyan-400 font-semibold mr-2">AUDIO SOURCE:</span>
                <span className="text-gray-400 italic break-all">
                    {track.audio_url && track.audio_url.startsWith('http') ? 
                        track.audio_url 
                        : track.audio_url ? `Local File: ${track.audio_url} (Mock URL: ${audioSource})` : 'N/A'}
                </span>
                {track.audio_url && !track.audio_url.startsWith('http') && (
                    <p className="text-red-400 mt-1">
                        ⚠️ NOTE: Playback uses a mock URL. For persistent sharing, upload this file to a host and manually edit the track&apos;s URL.
                    </p>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-lg font-bold text-cyan-400 mb-3 tracking-wider uppercase">AI/Source Code</h4>
                
                <div className={detailClass}>
                    <span className={labelClass}>Style/Genre:</span>
                    <span className="text-red-300 font-mono">{track.style || 'Trapmetal / Experimental'}</span>
                </div>

                <div className={detailClass}>
                    <span className={labelClass}>AI Role:</span>
                    {track.ai_role || 'Composition Support'}
                </div>
                
                <div className="mt-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
                    <span className={labelClass}>Generation Prompt:</span>
                    <p className="text-xs italic text-gray-400 leading-relaxed">
                        {track.generation_prompt || 'No log recorded: Human error in the archive matrix.'}
                    </p>
                </div>

                <div className="mt-3">
                    <span className={labelClass}>Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {(track.tags || []).map((tag, index) => (
                            <span key={index} className="px-3 py-1 text-xs font-medium rounded-full bg-red-800 text-red-100 opacity-80 shadow-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <button
                        onClick={handleGeneratePitch}
                        disabled={isGeneratingPitch || !track.generation_prompt || !fetchGeminiGeneration}
                        className="w-full text-center py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-800 hover:bg-red-500/30 transition-all duration-150 disabled:opacity-50 flex items-center justify-center font-bold text-sm tracking-wider"
                    >
                        {isGeneratingPitch ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                ANALYZING
                            </span>
                        ) : (
                            <>
                                ✨ GENERATE AI PITCH
                            </>
                        )}
                    </button>
                    {aiDescription && (
                             <div className="mt-3 p-3 bg-gray-700 rounded-lg border border-cyan-500/50">
                                 <span className="text-xs font-semibold text-cyan-300 block mb-1">AI PITCH:</span>
                                 <p className="text-sm italic text-gray-100">{aiDescription}</p>
                            </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <button
                        onClick={handleGenerateCoverConcepts}
                        disabled={isGeneratingCover || !track.generation_prompt || !fetchGeminiGeneration}
                        className="w-full text-center py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-800 hover:bg-cyan-500/30 transition-all duration-150 disabled:opacity-50 flex items-center justify-center font-bold text-sm tracking-wider"
                    >
                        {isGeneratingCover ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                CONCEPTUALIZING
                            </span>
                        ) : (
                            <>
                                🖼️ GENERATE COVER CONCEPTS
                            </>
                        )}
                    </button>
                    {aiCoverConcepts && aiCoverConcepts.length > 0 && (
                             <div className="mt-3 p-3 bg-gray-700 rounded-lg border border-red-500/50">
                                 <span className="text-xs font-semibold text-red-300 block mb-2">VISUAL CONCEPTS:</span>
                                 <ul className="list-disc list-inside text-sm italic text-gray-100 space-y-1">
                                     {aiCoverConcepts.map((concept, index) => (
                                         <li key={index}>{concept}</li>
                                     ))}
                                 </ul>
                            </div>
                    )}
                </div>

                {/* Delete/Admin Control Section */}
                {canDelete && (
                    <div className="flex justify-end items-center mt-4 pt-3 border-t border-gray-700">
                        {showDeleteConfirm ? (
                            <div className="flex space-x-2 items-center">
                                <span className="text-xs text-red-400 font-bold">CONFIRM DELETION?</span>
                                <button
                                    onClick={handleDelete}
                                    className="text-xs font-bold text-gray-900 bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition active:scale-95"
                                >
                                    YES
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="text-xs text-gray-400 border border-gray-600 px-2 py-1 rounded hover:bg-gray-700 transition active:scale-95"
                                >
                                    NO
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setShowDeleteConfirm(true)}
                                className={`text-xs px-2 py-1 rounded transition ${userRole === 'admin' || userRole === 'moderator' ? 'bg-red-900/50 text-red-300 hover:bg-red-900' : 'text-red-500 hover:text-red-400'}`}
                                title={userRole === 'creator' ? 'Delete your own track' : `Delete track as ${userRole}`}
                            >
                                {userRole !== 'creator' ? 'ADMIN DELETE LOG' : 'DELETE LOG'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


interface UserProfileSetupProps {
    db: Firestore | null;
    userId: string | null;
    auth: Auth | null;
    onProfileSet: (name: string, role: string) => void;
}

const UserProfileSetup: FC<UserProfileSetupProps> = ({ db, userId, auth, onProfileSet }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !db || !userId || !email.trim() || !password.trim() || !auth || !auth.currentUser) {
            setError('All fields are required to create a permanent account.');
            return;
        }

        setIsSaving(true);
        setError(null);
        
        try {
            // Create a credential object with the email and password
            const credential = EmailAuthProvider.credential(email, password);
            
            // Link the anonymous account to an email/password account
            await linkWithCredential(auth.currentUser, credential);

            // Save the profile data in a private user document
            const profileDocRef = doc(db, `/artifacts/${appId}/users/${userId}/profile/user_data`);
            
            await setDoc(profileDocRef, { 
                name: name.trim(), 
                role: 'creator', 
                created_at: serverTimestamp() 
            }, { merge: true }); 
            
            onProfileSet(name.trim(), 'creator');
        } catch (err) {
            console.error("Error setting profile: ", err);
            setError("Failed to save profile. Check console for details.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-xl w-full max-w-sm shadow-2xl border-4 border-cyan-500">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400 font-mono tracking-wider">SET ARTIST ID</h2>
                <p className="text-sm text-gray-400 mb-6">
                    Choose a **Public Display Name**. This name will be associated with your unique ID ({userId?.substring(0, 8)}...) and used for track attribution. Your default role is **CREATOR**. To save your identity permanently, enter an email and password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="artistName" className="block text-sm font-medium text-red-400 mb-1">
                            Public Artist Name
                        </label>
                        <input
                            type="text"
                            id="artistName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 transition duration-150"
                            required
                            maxLength={30}
                            placeholder="e.g., AIBRY"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-red-400 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 transition duration-150"
                            placeholder="your-email@example.com"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-red-400 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 transition duration-150"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition duration-150 disabled:opacity-50 flex items-center"
                            disabled={isSaving || !name.trim()}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    SAVING...
                                </>
                            ) : 'CONFIRM IDENTITY'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface CreativeDirectorModalProps {
    onCancel: () => void;
    fetchGeminiGeneration: (userQuery: string, systemPrompt: string, useSearch: boolean, responseSchema?: object | null) => Promise<{ text: string } | null>;
}

const CreativeDirectorModal: FC<CreativeDirectorModalProps> = ({ onCancel, fetchGeminiGeneration }) => {
    const [mode, setMode] = useState('song');
    const [theme, setTheme] = useState('');
    const [resultText, setResultText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!theme.trim()) return;

        setIsLoading(true);
        setResultText(null);
        setError(null);

        let systemPrompt = "";
        let userQuery = "";
        
        const coreStyle = "trapmetal, industrial, aggressive, cinematic, glitches, 808s, distorted guitars. Themes: trauma, resilience, inner conflict.";

        if (mode === 'song') {
            systemPrompt = `You are a music producer and lyricist for the artist AIBRY. Your task is to generate a full, detailed song generation prompt for an AI model based on the user's core theme. The song must adhere to AIBRY's style (${coreStyle}). The output must be production-ready and include suggested instrumentation, tempo, and vocal cues (scream, rap, spoken word).`;
            userQuery = `Generate a full, highly detailed, production-ready AI music generation prompt for a new song based on the core theme: "${theme}".`;
        } else {
            systemPrompt = `You are an art director for the AIBRY brand. Your task is to generate a detailed, cinematic, high-quality, text-to-image prompt suitable for an image generation model (like Imagen or Midjourney) based on the user's theme. The visual must be dark, surreal, and intense, using the AIBRY aesthetic (fragmented faces, neon lighting, ruined cityscapes). The output must be a single, long, detailed text-to-image prompt.`;
            userQuery = `Generate one single, complex, ready-to-use text-to-image prompt for a cover art based on the core theme: "${theme}". Style must be: high-detail, cinematic lighting, photorealistic digital art, dark contrast, neon red and cyan accents, glitch effects.`;
        }

        try {
            const result = await fetchGeminiGeneration(userQuery, systemPrompt, false);
            if (result && result.text) {
                setResultText(result.text.trim());
            } else {
                setError("Generation failed. Try a different theme or check network.");
            }
        } catch (err) {
            console.error("Gemini API Error:", err);
            setError(`Request failed: ${(err as Error).message}.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (resultText) {
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = resultText;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            
            console.log('Copied to clipboard!');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-xl w-full max-w-4xl shadow-2xl border-4 border-cyan-500">
                <h2 className="text-2xl font-bold mb-6 text-cyan-400 font-mono tracking-wider">AI CREATIVE DIRECTOR</h2>
                
                <div className="flex space-x-4 mb-6 border-b border-gray-700 pb-4">
                    <button
                        onClick={() => { setMode('song'); setResultText(null); setError(null); }}
                        className={`px-4 py-2 font-semibold rounded-t-lg transition duration-150 ${
                            mode === 'song' ? 'bg-red-600 text-gray-950 shadow-md shadow-red-500/50' : 'text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        📝 NEW SONG PROMPT
                    </button>
                    <button
                        onClick={() => { setMode('cover'); setResultText(null); setError(null); }}
                        className={`px-4 py-2 font-semibold rounded-t-lg transition duration-150 ${
                            mode === 'cover' ? 'bg-red-600 text-gray-950 shadow-md shadow-red-500/50' : 'text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        🖼️ COVER ART PROMPT
                    </button>
                </div>

                <form onSubmit={handleGenerate}>
                    <div className="mb-4">
                        <label htmlFor="themeInput" className="block text-sm font-medium text-red-400 mb-2">
                            Core Theme/Concept Idea:
                        </label>
                        <input
                            type="text"
                            id="themeInput"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            placeholder={mode === 'song' ? "e.g., The sound of digital anxiety and resilience" : "e.g., Fragmented face with neon scars in a rainy alley"}
                            className="w-full px-4 py-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-150"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition duration-150 disabled:opacity-50 flex items-center justify-center"
                        disabled={isLoading || !theme.trim()}
                    >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    GENERATING {mode.toUpperCase()} PROMPT...
                                </span>
                            ) : (
                                `ACTIVATE DIRECTOR (${mode === 'song' ? 'Generate Song Prompt' : 'Generate Cover Prompt'})`
                            )}
                    </button>
                </form>

                {/* Result Area */}
                {error && <p className="text-red-500 mt-4 p-3 bg-gray-900 rounded">{error}</p>}
                
                {resultText && (
                    <div className="mt-6 pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                            {mode === 'song' ? 'NEW SONG GENERATION PROMPT' : 'TEXT-TO-IMAGE PROMPT'}
                        </h3>
                        <div className="relative p-4 bg-gray-900 rounded-lg border border-red-500/50">
                            <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono pr-12">{resultText}</pre>
                            <button 
                                onClick={handleCopy}
                                className="absolute top-2 right-2 p-2 bg-gray-700 rounded-lg text-xs text-white hover:bg-gray-600 transition"
                                title="Copy to Clipboard"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v-4.5m-4.5 4.5v-4.5m-4.5 4.5v-4.5m18-6H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3zM12 18h.008v.008H12v-.008z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 rounded-lg text-gray-300 border border-gray-700 hover:bg-gray-700 transition duration-150"
                    >
                        Close Director
                    </button>
                </div>
            </div>
        </div>
    );
};


interface AddTrackFormProps {
    db: Firestore | null;
    userId: string | null;
    userName: string | null;
    onCancel: () => void;
}

const AddTrackForm: FC<AddTrackFormProps> = ({ db, userId, userName, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        artist: userName || 'AIBRY',
        style: 'Trapmetal/Spoken Word',
        ai_role: 'Lyrics & Melody Generation',
        audio_url: '', 
        generation_prompt: '',
        tags: 'trauma, resilience, glitch',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('audio/')) {
                setError("Please select a valid audio file (e.g., mp3, wav, flac).");
                setSelectedFile(null);
                setFormData(prev => ({ ...prev, audio_url: '' }));
                return;
            }
            
            setError(null);
            setSelectedFile(file);
            
            const localUrl = URL.createObjectURL(file);

            setFormData(prev => ({ 
                ...prev, 
                audio_url: localUrl, 
            }));
            
            return () => URL.revokeObjectURL(localUrl);
        } else {
            setSelectedFile(null);
            setFormData(prev => ({ ...prev, audio_url: '' }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile && !formData.audio_url) {
            setError("Please upload an audio file or provide a streaming link.");
            return;
        }

        setIsSaving(true);
        setError(null);
        
        try {
            const tracksCollectionRef = collection(db!, `/artifacts/${appId}/public/data/ai_assisted_tracks`);
            
            let finalAudioUrl = formData.audio_url; 
            let audioFileName = selectedFile ? selectedFile.name : (finalAudioUrl.startsWith('http') ? finalAudioUrl : 'N/A');

            if (selectedFile) {
                finalAudioUrl = audioFileName; 
            }

            const newTrack = {
                ...formData,
                audio_url: finalAudioUrl,
                uploader_id: userId,
                creator_name: userName || formData.artist,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                timestamp: serverTimestamp()
            };

            await addDoc(tracksCollectionRef, newTrack);
            onCancel(); 
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Failed to log track. Check console for details. Ensure you are authenticated.");
        } finally {
            setIsSaving(false);
        }
    };
    
    useEffect(() => {
        return () => {
            if (formData.audio_url && !formData.audio_url.startsWith('http')) {
                URL.revokeObjectURL(formData.audio_url);
            }
        };
    }, [formData.audio_url]);


    return (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-xl w-full max-w-2xl shadow-2xl border-4 border-red-500">
                <h2 className="text-2xl font-bold mb-6 text-red-500 font-mono tracking-wider">LOG NEW GENERATION</h2>
                <p className="text-sm text-gray-400 mb-4">
                    Track will be attributed to: <span className="text-cyan-400 font-semibold">{userName}</span> (ID: {userId ? userId.substring(0, 8) + '...' : 'pending'})
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            name="title" 
                            label="Track Title" 
                            value={formData.title} 
                            onChange={handleChange}
                        />
                        <Input 
                            name="artist" 
                            label="Artist Name (Human Contributor - Locked to Profile)" 
                            readOnly={true} 
                            value={formData.artist}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <Input 
                        name="style" 
                        label="Genre/Style (e.g., Trapmetal, Spoken Word)" 
                        value={formData.style}
                        onChange={handleChange}
                    />

                    <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-red-800">
                        <label htmlFor="audioFile" className="block text-sm font-medium text-red-400 mb-2">
                            Audio Source (File Upload or Streaming Link)
                        </label>
                        <div className="flex space-x-4 items-center">
                            <input
                                type="file"
                                id="audioFile"
                                accept="audio/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-cyan-500 file:text-gray-900
                                                hover:file:bg-cyan-600 cursor-pointer"
                            />
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2 italic">
                            {selectedFile ? `Selected: ${selectedFile.name}` : "Or paste an external streaming link below."}
                        </p>

                         {!selectedFile && (
                            <div className="mt-4">
                                <Input 
                                    name="audio_url" 
                                    label="External Streaming Link (e.g., SoundCloud/Bandcamp URL)" 
                                    value={formData.audio_url}
                                    onChange={handleChange}
                                    required={false}
                                    placeholder="https://external.link/to/track.mp3"
                                />
                            </div>
                        )}
                         
                        <p className="text-xs text-red-400 mt-3 font-semibold">
                            ⚠️ NOTE: File uploads only save the file name. For persistent sharing, the audio file must be hosted externally (e.g., AWS, Firebase Storage).
                        </p>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <h3 className="text-xl text-cyan-400 font-semibold mb-3">AI Generation Details</h3>
                        
                        <TextArea 
                            name="generation_prompt" 
                            label="Core AI Generation Prompt (The Input Text Used to Create the Song)" 
                            value={formData.generation_prompt}
                            onChange={handleChange}
                        />
                        <Input 
                            name="ai_role" 
                            label="AI's Role in Production (e.g., Lyrics, Melody, Mastering)" 
                            value={formData.ai_role}
                            onChange={handleChange}
                        />
                        
                        <Input 
                            name="tags" 
                            label="Tags (Comma separated: trauma, resilience, glitch)" 
                            value={formData.tags}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 rounded-lg text-gray-300 border border-gray-700 hover:bg-gray-700 transition duration-150"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition duration-150 disabled:opacity-50 flex items-center"
                            disabled={isSaving || !userId || (!selectedFile && !formData.audio_url) || !formData.title || !formData.generation_prompt}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    ARCHIVING...
                                </>
                            ) : 'ARCHIVE TRACK'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AuthPage: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            router.push('/ai-archive');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-cyan-400 text-center">
                    {isLogin ? 'Sign In' : 'Sign Up'}
                </h2>
                <form onSubmit={handleAuth}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-red-400 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-red-400 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-cyan-400 hover:underline"
                    >
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const App: FC = () => {
    const [route, setRoute] = useState('landing');
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showCreativeDirector, setShowCreativeDirector] = useState(false);
    const [currentPlaying, setCurrentPlaying] = useState<{ id: string, audioRef: React.RefObject<HTMLAudioElement> } | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                console.log("User authenticated. UID:", user.uid);

                const profileDocRef = doc(db, `/artifacts/${appId}/users/${user.uid}/profile/user_data`);
                const profileSnap = await getDoc(profileDocRef);

                if (profileSnap.exists()) {
                    const data = profileSnap.data();
                    setUserName(data.name);
                    setUserRole(data.role || 'creator');
                    // Automatically redirect to archive if a user is logged in
                    setRoute('archive');
                } else {
                    // Show a profile setup form for a new user
                    // For now, we'll let them set a name on this page
                    setUserName(null);
                    setUserRole('creator');
                }
            } else {
                // If no user, show the landing page or a sign-in form.
                setUserId(null);
                setUserName(null);
                setRoute('landing');
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, [router]);
    
    useEffect(() => {
        if (db && userId) {
            const grantAccess = async (targetUserId: string, role: string) => {
                if (!db || !targetUserId || !['admin', 'moderator', 'creator'].includes(role)) {
                    console.error("Invalid input for aibraryGrantAccess.");
                    return;
                }
                try {
                    const profileDocRef = doc(db, `/artifacts/${appId}/users/${targetUserId}/profile/user_data`);
                    await setDoc(profileDocRef, { role: role }, { merge: true });
                    console.log(`Successfully granted role: ${role} to user ID: ${targetUserId}. Please SIGN OUT and re-enter ARCHIVE to refresh permissions.`);
                } catch (error) {
                    console.error("Failed to grant access:", error);
                }
            };
            
            (window as any).aibraryGrantAccess = grantAccess;
            (window as any).aibraryGrantAccess.userId = userId;

            console.log(`\n--- ADMIN INSTRUCTIONS ---`);
            console.log(`Your current User ID is: ${userId}`);
            console.log(`To grant yourself ADMIN access, run the following command in this console and then refresh:`);
            console.log(`aibraryGrantAccess(aibraryGrantAccess.userId, 'admin')`);
            console.log(`--------------------------\n`);
        }
    }, [db, userId]);

    useEffect(() => {
        if (!db || !isAuthReady) return;

        const tracksCollectionRef = collection(db, `/artifacts/${appId}/public/data/ai_assisted_tracks`);
        const q = query(tracksCollectionRef); 

        const unsubscribe = onSnapshot(q, (snapshot) => {
            try {
                const fetchedTracks = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Track[];
                fetchedTracks.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
                setTracks(fetchedTracks);
            } catch (error) {
                console.error("Error processing tracks snapshot:", error);
            }
        }, (error) => {
            console.error("Error fetching tracks:", (error as Error).message);
            if ((error as {code: string}).code === 'permission-denied') {
                 console.error("Missing or insufficient permissions. Ensure Firebase Security Rules allow public read/authenticated write access to the tracks collection.");
            }
        });

        return () => unsubscribe();
    }, [db, isAuthReady]); 
    
    const fetchGeminiGeneration = useCallback(async (userQuery: string, systemPrompt: string, useSearch: boolean, responseSchema: object | null = null) => {
        if (!GEMINI_API_KEY) {
            throw new Error("Gemini API Key is missing. Please set the GEMINI_API_KEY environment variable.");
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
        const headers = { 'Content-Type': 'application/json' };
        
        const payload: {
            contents: { parts: { text: string; }[]; }[];
            systemInstruction: { parts: { text: string; }[]; };
            tools?: { google_search: {}; }[];
            generationConfig?: {
                responseMimeType: string;
                responseSchema: object;
            };
        } = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        if (useSearch) {
            payload.tools = [{ "google_search": {} }];
        }

        if (responseSchema) {
            payload.generationConfig = {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            };
        }

        const maxRetries = 5;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error(`API request failed with status ${response.status}. Check your API Key.`);
                    }
                    throw new Error(`API request failed with status ${response.status}`);
                }
                
                const result = await response.json();
                const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (text) {
                    return { text };
                }
            } catch (error) {
                if (attempt === maxRetries) {
                    throw new Error(`Gemini API Failed after ${maxRetries} attempts: ${(error as Error).message}`);
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
        return null; 
    }, []); 

    const handleSignOut = () => {
        if (auth) {
            signOut(auth).catch(e => console.error("Sign Out Failed:", e));
        }
    };

    const handleProfileSet = (name: string, role: string) => {
        setUserName(name);
        setUserRole(role);
    };

    const renderContent = () => {
        if (!userId) {
            return <AuthPage />;
        }
        
        if (route === 'landing') {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                    <h1 className="text-6xl md:text-8xl font-extrabold text-red-500 mb-6 font-mono tracking-widest leading-none glitch-text">
                        AIBRY
                    </h1>
                    <p className="text-2xl md:text-4xl font-light text-cyan-400 mb-8 font-mono tracking-tight">
                        DATA CORE ARCHIVE
                    </p>
                    <p className="max-w-xl text-lg text-gray-400 mb-12">
                        The definitive hub for **AI-assisted Trapmetal and Industrial** artists. Log your generative tracks, share source prompts, and collaborate with the Machine and the Community. Resilience through data.
                    </p>
                    <button
                        onClick={() => setRoute('archive')}
                        className="px-10 py-4 text-lg font-bold rounded-xl bg-red-600 text-gray-900 shadow-xl shadow-red-500/40 hover:bg-red-700 transition duration-300 transform hover:scale-105 active:scale-95"
                    >
                        ENTER ARCHIVE
                    </button>
                </div>
            );
        }

        return (
            <div className="p-4 md:p-8">
                <header className="flex justify-between items-center mb-8 pb-4 border-b-2 border-cyan-700">
                    <h1 className="text-3xl font-extrabold text-cyan-400 font-mono tracking-wide">
                        AIBRY [Archive Log]
                    </h1>
                    <div className="flex items-center space-x-4">
                        {isAuthReady && userId && (
                            <>
                                <div className="text-sm text-gray-400 hidden sm:block">
                                    USER: <span className="text-red-400 font-semibold">{userName || 'GUEST'}</span> 
                                    {userRole && <span className="text-xs text-cyan-400 ml-2">[{userRole.toUpperCase()}]</span>}
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="px-3 py-1 text-sm rounded bg-gray-700 text-gray-300 hover:bg-red-800 hover:text-white transition duration-150"
                                >
                                    SIGN OUT
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <div className="flex flex-wrap justify-start md:justify-end gap-3 mb-8">
                    <button
                        onClick={() => setShowCreativeDirector(true)}
                        disabled={!isAuthReady || !userId}
                        className="px-6 py-3 rounded-lg bg-cyan-600 text-gray-900 font-bold hover:bg-cyan-700 transition duration-150 disabled:opacity-50 shadow-md shadow-cyan-500/30"
                    >
                        AI CREATIVE DIRECTOR
                    </button>
                    <button
                        onClick={() => setShowAddForm(true)}
                        disabled={!isAuthReady || !userId || !userName}
                        className="px-6 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition duration-150 disabled:opacity-50 shadow-md shadow-red-500/30"
                    >
                        LOG NEW AI PROJECT
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tracks.length > 0 ? (
                        tracks.map(track => (
                            <TrackCard 
                                key={track.id} 
                                track={track} 
                                currentPlaying={currentPlaying} 
                                setCurrentPlaying={setCurrentPlaying} 
                                db={db}
                                userId={userId}
                                userRole={userRole}
                                fetchGeminiGeneration={fetchGeminiGeneration}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-xl text-gray-500 py-12">
                            {isAuthReady ? "No archived tracks found. Log your first AI project above!" : "Initializing Data Core..."}
                        </p>
                    )}
                </div>

                {showAddForm && (
                    <AddTrackForm 
                        db={db} 
                        userId={userId} 
                        userName={userName} 
                        onCancel={() => setShowAddForm(false)} 
                    />
                )}
                
                {showCreativeDirector && (
                    <CreativeDirectorModal 
                        onCancel={() => setShowCreativeDirector(false)} 
                        fetchGeminiGeneration={fetchGeminiGeneration}
                    />
                )}

                {isAuthReady && userId && !userName && (
                    <UserProfileSetup 
                        db={db} 
                        userId={userId} 
                        onProfileSet={handleProfileSet}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans content-container">
            {renderContent()}
        </div>
    );
};

export default App;