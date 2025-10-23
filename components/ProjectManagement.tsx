import React, { useState, useRef, useEffect } from 'react';
import type { SavedProject } from '../types';

interface ProjectManagementProps {
    savedProjects: SavedProject[];
    onSave: () => void;
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    isSaveDisabled: boolean;
}

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

export const ProjectManagement: React.FC<ProjectManagementProps> = ({ savedProjects, onSave, onLoad, onDelete, isSaveDisabled }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useOutsideAlerter(menuRef, () => setMenuOpen(false));

    const handleLoad = (id: string) => {
        onLoad(id);
        setMenuOpen(false);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent dropdown from closing
        if (window.confirm("Are you sure you want to delete this project?")) {
            onDelete(id);
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={onSave}
                disabled={isSaveDisabled}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.06.44l7.152 7.152a1.5 1.5 0 0 1 0 2.121l-7.152 7.152A1.5 1.5 0 0 1 4.648 20H3.5A1.5 1.5 0 0 1 2 18.5v-15Zm1.5 0v15h1.148a.5.5 0 0 0 .354-.146l7.152-7.152a.5.5 0 0 0 0-.708L5.002 3.646A.5.5 0 0 0 4.648 3.5H3.5Z" />
                  <path d="M12 4.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 1 0v-10a.5.5 0 0 0-.5-.5ZM15 4.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 1 0v-10a.5.5 0 0 0-.5-.5Z" />
                </svg>
                <span>Save Project</span>
            </button>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    disabled={savedProjects.length === 0}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-400 transition duration-200"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2H10a.75.75 0 0 1 .75.75v.063a.75.75 0 0 0 .53.708l3.688 1.844a.75.75 0 0 1 0 1.366L11.28 8.577a.75.75 0 0 0-.53.708V9.75A.75.75 0 0 1 10 10.5H3.5A1.5 1.5 0 0 1 2 9V3.5ZM3.5 3.5v5.25H10V9.077l2.21-1.105L10 6.866V3.5H3.5Z" clipRule="evenodd" />
                      <path d="M11.5 12.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5Z" />
                      <path d="M13 12.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5Z" />
                      <path d="M14.5 12.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5Z" />
                      <path d="M16 12.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                    <span>Load Project</span>
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-gray-700 rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5 py-1 max-h-80 overflow-y-auto">
                        {savedProjects.length > 0 ? (
                            [...savedProjects].reverse().map(project => (
                                <div key={project.id} className="group flex items-center justify-between px-3 py-2 text-sm text-gray-200 hover:bg-indigo-600 hover:text-white transition-colors duration-150 cursor-pointer" onClick={() => handleLoad(project.id)}>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold truncate">{project.name}</p>
                                        <p className="text-xs text-gray-400 group-hover:text-indigo-200">{new Date(project.savedAt).toLocaleString()}</p>
                                    </div>
                                    <button 
                                        onClick={(e) => handleDelete(e, project.id)}
                                        className="ml-2 p-1 rounded-full text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete project"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .465 1.458A14.37 14.37 0 0 1 12.5 6.25a.75.75 0 0 0 0-1.5 12.87 12.87 0 0 0-3.088-.335V3.75a1.25 1.25 0 1 1 2.5 0v.443c.795.077 1.58.22 2.365.468a.75.75 0 1 0 .465-1.458A14.37 14.37 0 0 1 7.5 3.75a.75.75 0 0 0 0 1.5 12.87 12.87 0 0 0 3.088.335V6.25a.75.75 0 0 0 0 1.5 14.37 14.37 0 0 1-5.415-1.599.75.75 0 0 0-.466-1.458c.785-.248 1.57-.391 2.365-.468v-.443A2.75 2.75 0 0 0 8.75 1Z" clipRule="evenodd" /><path d="M12.266 9.172a.75.75 0 0 0-1.06 0L9.435 10.94l-1.77-1.77a.75.75 0 1 0-1.06 1.06L8.373 12l-1.77 1.77a.75.75 0 1 0 1.06 1.06l1.77-1.77 1.77 1.77a.75.75 0 1 0 1.06-1.06L10.5 12l1.77-1.77a.75.75 0 0 0 0-1.06Z" /></svg>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="px-4 py-2 text-sm text-gray-400">No saved projects.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
