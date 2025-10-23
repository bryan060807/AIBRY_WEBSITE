import React, { useState, useRef, useEffect } from 'react';

interface SongInputFormProps {
  lyrics: string;
  setLyrics: (value: string) => void;
  title: string;
  setTitle: (value: string) => void;
  genre: string;
  setGenre: (value: string) => void;
  style: string;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
  productionNotes: string;
  setProductionNotes: (value: string) => void;
  onSubmit: () => void;
  onClearForm: () => void;
  isLoading: boolean;
}

const GENRE_PRESETS = {
  'Electronic': ['House', 'Techno', 'Trance', 'Drum and Bass', 'Dubstep', 'Synthwave', 'Ambient', 'Lo-fi Hip Hop', 'Trap', 'IDM', 'Hardstyle'],
  'Rock': ['Classic Rock', 'Hard Rock', 'Heavy Metal', 'Punk Rock', 'Alternative Rock', 'Indie Rock', 'Grunge', 'Psychedelic Rock', 'Progressive Rock', 'Shoegaze'],
  'Pop': ['Synth-Pop', 'Indie Pop', 'Dream Pop', 'Electropop', 'J-Pop', 'K-Pop', 'Bubblegum Pop', 'Power Pop', 'Hyperpop'],
  'Hip Hop / R&B': ['Boom Bap', 'Trap', 'Drill', 'Cloud Rap', 'Grime', 'Conscious Hip Hop', 'Neo-Soul', 'Contemporary R&B', 'Funk'],
  'Folk / Country': ['Acoustic Folk', 'Singer-Songwriter', 'Americana', 'Bluegrass', 'Country Pop', 'Outlaw Country', 'Folk Rock'],
  'Jazz / Blues': ['Swing', 'Bebop', 'Cool Jazz', 'Fusion', 'Delta Blues', 'Chicago Blues', 'Soul Jazz', 'Smooth Jazz'],
  'Classical / Cinematic': ['Orchestral Score', 'Chamber Music', 'Minimalism', 'Epic Trailer Music', 'Ambient Film Score', 'Baroque'],
  'World / Reggae': ['Reggae', 'Dub', 'Ska', 'Dancehall', 'Bossa Nova', 'Salsa', 'Afrobeat', 'Cumbia'],
};

const MOOD_PRESETS = {
    'Positive': ['Uplifting & Hopeful', 'Energetic & Driving', 'Playful & Quirky', 'Romantic & Sweet', 'Peaceful & Serene'],
    'Negative': ['Dark & Melancholic', 'Aggressive & Angry', 'Tense & Anxious', 'Eerie & Haunting', 'Chaotic & Dissonant'],
    'Complex': ['Nostalgic & Wistful', 'Mysterious & Enigmatic', 'Epic & Grandiose', 'Introspective & Thoughtful', 'Surreal & Dreamlike'],
};

const VOCALS_PRESETS = {
    'Lead Style': ['Male Lead', 'Female Lead', 'Androgynous Lead', 'Rapped Vocals', 'Spoken Word'],
    'Texture': ['Clean & Polished', 'Raw & Gritty', 'Whispered & Breathy', 'Husky & Raspy', 'Ethereal & Airy'],
    'Effects & Harmonies': ['Layered Harmonies', 'Gospel Choir Backup', 'Autotuned & Robotic', 'Heavily Reverberated', 'Distant & Faded'],
    'No Vocals': ['Instrumental'],
};

const TEMPO_PRESETS = {
    'Slow': ['Very Slow (40-60 BPM)', 'Slow (60-80 BPM)', 'Walking Pace (80-100 BPM)'],
    'Medium': ['Moderate (100-120 BPM)', 'Lively (120-140 BPM)'],
    'Fast': ['Very Fast (140-170 BPM)', 'Extremely Fast (170-200+ BPM)'],
};

const useOutsideAlerter = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
}

const DropdownMenu: React.FC<{
    presets: Record<string, string[]>;
    onSelect: (value: string) => void;
}> = ({ presets, onSelect }) => (
    <div className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5 py-1 max-h-60 overflow-y-auto">
        {Object.entries(presets).map(([category, items]) => (
            <div key={category}>
                <h4 className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-700">{category}</h4>
                {items.map(preset => (
                <button
                    key={preset}
                    onClick={() => onSelect(preset)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-indigo-600 hover:text-white transition-colors duration-150"
                    role="menuitem"
                >
                    {preset}
                </button>
                ))}
            </div>
        ))}
    </div>
);


export const SongInputForm: React.FC<SongInputFormProps> = ({
  lyrics,
  setLyrics,
  title,
  setTitle,
  genre,
  setGenre,
  style,
  setStyle,
  productionNotes,
  setProductionNotes,
  onSubmit,
  onClearForm,
  isLoading,
}) => {
    const [genreMenuOpen, setGenreMenuOpen] = useState(false);
    const [moodMenuOpen, setMoodMenuOpen] = useState(false);
    const [vocalsMenuOpen, setVocalsMenuOpen] = useState(false);
    const [tempoMenuOpen, setTempoMenuOpen] = useState(false);
    const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);

    const genreMenuRef = useRef<HTMLDivElement>(null);
    const moodMenuRef = useRef<HTMLDivElement>(null);
    const vocalsMenuRef = useRef<HTMLDivElement>(null);
    const tempoMenuRef = useRef<HTMLDivElement>(null);

    useOutsideAlerter(genreMenuRef, () => setGenreMenuOpen(false));
    useOutsideAlerter(moodMenuRef, () => setMoodMenuOpen(false));
    useOutsideAlerter(vocalsMenuRef, () => setVocalsMenuOpen(false));
    useOutsideAlerter(tempoMenuRef, () => setTempoMenuOpen(false));
    
    const handleStyleSelect = (value: string) => {
        setStyle(prev => prev ? `${prev}, ${value}` : value);
    };

    const handleGenerateNotes = async () => {
    if (!lyrics || !genre || !style) {
        alert("Please provide lyrics, a genre, and a style before generating production notes.");
        return;
    }
    setIsGeneratingNotes(true);
    try {
        const response = await fetch('/api/generate-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lyrics, genre, style }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate notes from the server.');
        }

        const data = await response.json();
        setProductionNotes(data.notes);
    } catch (error) {
        console.error("Failed to generate production notes:", error);
        alert("Sorry, an error occurred while generating production notes. Please try again.");
    } finally {
        setIsGeneratingNotes(false);
    }
};

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 flex-grow flex flex-col">
       <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-400">Create Your Track</h2>
            <button
                onClick={onClearForm}
                disabled={isLoading}
                className="text-sm text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                title="Clear all fields"
            >
                Clear Work
            </button>
        </div>
      <div className="flex-grow flex flex-col space-y-4">
        <div>
            <label htmlFor="lyrics" className="block text-sm font-medium text-gray-300 mb-2">
            Lyrics
            </label>
            <textarea
            id="lyrics"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Paste or write your song lyrics here..."
            rows={6}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y"
            disabled={isLoading || isGeneratingNotes}
            aria-label="Song Lyrics Input"
            />
        </div>
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title <span className="text-gray-400">(Optional)</span>
            </label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title, or let the AI create one..."
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                disabled={isLoading || isGeneratingNotes}
                aria-label="Song Title Input"
            />
        </div>
        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-300">
                    Genre
                </label>
                <div className="relative" ref={genreMenuRef}>
                    <button 
                        onClick={() => setGenreMenuOpen(prev => !prev)}
                        className="flex items-center space-x-1 text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                        disabled={isLoading || isGeneratingNotes}
                        aria-haspopup="true"
                        aria-expanded={genreMenuOpen}
                    >
                        <span>Presets</span>
                        <svg className={`w-4 h-4 transition-transform ${genreMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {genreMenuOpen && <DropdownMenu presets={GENRE_PRESETS} onSelect={value => { setGenre(value); setGenreMenuOpen(false); }} />}
                </div>
            </div>
            <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g., Synthwave, Indie Pop"
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            disabled={isLoading || isGeneratingNotes}
            aria-label="Genre Input"
            />
        </div>
         <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="style" className="block text-sm font-medium text-gray-300">
                Style <span className="text-gray-400">(Required)</span>
                </label>
                <div className="flex items-center space-x-2">
                    {/* Mood Dropdown */}
                    <div className="relative" ref={moodMenuRef}>
                         <button 
                            onClick={() => setMoodMenuOpen(prev => !prev)}
                            className="text-sm px-2 py-1 bg-gray-700/50 border border-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50"
                            disabled={isLoading || isGeneratingNotes}
                            aria-haspopup="true" aria-expanded={moodMenuOpen}
                        >
                            Mood
                        </button>
                        {moodMenuOpen && <DropdownMenu presets={MOOD_PRESETS} onSelect={value => { handleStyleSelect(value); setMoodMenuOpen(false); }} />}
                    </div>
                    {/* Vocals Dropdown */}
                     <div className="relative" ref={vocalsMenuRef}>
                         <button 
                            onClick={() => setVocalsMenuOpen(prev => !prev)}
                            className="text-sm px-2 py-1 bg-gray-700/50 border border-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50"
                            disabled={isLoading || isGeneratingNotes}
                            aria-haspopup="true" aria-expanded={vocalsMenuOpen}
                        >
                            Vocals
                        </button>
                        {vocalsMenuOpen && <DropdownMenu presets={VOCALS_PRESETS} onSelect={value => { handleStyleSelect(value); setVocalsMenuOpen(false); }} />}
                    </div>
                    {/* Tempo Dropdown */}
                    <div className="relative" ref={tempoMenuRef}>
                         <button 
                            onClick={() => setTempoMenuOpen(prev => !prev)}
                            className="text-sm px-2 py-1 bg-gray-700/50 border border-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50"
                            disabled={isLoading || isGeneratingNotes}
                            aria-haspopup="true" aria-expanded={tempoMenuOpen}
                        >
                            Tempo
                        </button>
                        {tempoMenuOpen && <DropdownMenu presets={TEMPO_PRESETS} onSelect={value => { handleStyleSelect(value); setTempoMenuOpen(false); }} />}
                    </div>
                </div>
            </div>
            <textarea
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="Describe the overall vibe using presets or your own words..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y"
            disabled={isLoading || isGeneratingNotes}
            aria-label="Style Input"
            />
        </div>
        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="production" className="block text-sm font-medium text-gray-300">
                    Production Notes <span className="text-gray-400">(Optional)</span>
                </label>
                <button
                    onClick={handleGenerateNotes}
                    disabled={isLoading || isGeneratingNotes || !lyrics || !genre || !style}
                    className="flex items-center space-x-1.5 text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Generate production notes with AI"
                >
                    {isGeneratingNotes ? (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M9.53 2.47a.75.T5 0 0 1 0 1.06L4.81 8.25H15a.75.75 0 0 1 0 1.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                        <path d="M12.25 3.25a.75.75 0 0 1 .75-.75h.25a.75.75 0 0 1 .75.75v.25a.75.75 0 0 1-.75.75h-.25a.75.75 0 0 1-.75-.75v-.25ZM10.75 5a.75.75 0 0 0-.75.75v.25a.75.75 0 0 0 .75.75h.25a.75.75 0 0 0 .75-.75v-.25a.75.75 0 0 0-.75-.75h-.25ZM15.25 5.25a.75.75 0 0 1 .75-.75h.25a.75.75 0 0 1 .75.75v.25a.75.75 0 0 1-.75.75h-.25a.75.75 0 0 1-.75-.75v-.25ZM13.75 7a.75.75 0 0 0-.75.75v.25a.75.75 0 0 0 .75.75h.25a.75.75 0 0 0 .75-.75v-.25a.75.75 0 0 0-.75-.75h-.25Z" />
                        <path fillRule="evenodd" d="M12.5 10a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1-.75-.75v-4Zm.75 3.25v-2.5h2.5v2.5h-2.5Z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span>{isGeneratingNotes ? 'Generating...' : 'Generate'}</span>
                </button>
            </div>
            <textarea
            id="production"
            value={productionNotes}
            onChange={(e) => setProductionNotes(e.target.value)}
            placeholder="Add specific details or click 'Generate' for AI suggestions..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y"
            disabled={isLoading || isGeneratingNotes}
            aria-label="Production Notes Input"
            />
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || isGeneratingNotes || !lyrics || !genre || !style}
        className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-200 mt-4"
      >
        {isLoading ? 'Weaving...' : 'Generate Song'}
      </button>
    </div>
  );
};
