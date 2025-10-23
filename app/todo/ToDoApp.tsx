// app/todo/ToDoApp.tsx (Supabase Version)

'use client'; // <-- THIS IS THE CRITICAL FIX for the "useEffect" error

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';

// --- PROPS INTERFACE ---
interface ToDoAppProps {
    supabaseUrl: string;
    supabaseAnonKey: string;
}

// --- GLOBAL STATE & UTILITIES ---
const getPriorityValue = (priority: string) => {
    switch (priority) {
        case 'High': return 1;
        case 'Medium': return 2;
        case 'Low': return 3;
        default: return 4;
    }
};

const getPriorityClasses = (priority: string) => {
    switch (priority) {
        case 'High': return 'bg-[#ff4757] text-white'; // Aggressive Red
        case 'Medium': return 'bg-[#ffb400] text-gray-900'; // Dark Gold/Amber
        case 'Low': return 'bg-[#54a0ff] text-white'; // Shadow Blue
        default: return 'bg-gray-500 text-white';
    }
};

// --- CORE APPLICATION COMPONENT ---
const ToDoApp: React.FC<ToDoAppProps> = ({ supabaseUrl, supabaseAnonKey }) => {
    const [supabase, setSupabase] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [newPriority, setNewPriority] = useState('Medium');
    const [newTargetTime, setNewTargetTime] = useState('');
    const [message, setMessage] = useState('Initializing Supabase System...');
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [countdownTime, setCountdownTime] = useState<string | null>(null);
    const [modal, setModal] = useState({ visible: false, title: '', text: '', confirmLabel: '', onConfirm: () => {} });
    const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

    const TASKS_TABLE = 'routine_tasks';

    // 1. SUPABASE INITIALIZATION & REAL-TIME LISTENER SETUP
    useEffect(() => {
        if (!supabaseUrl || !supabaseAnonKey) {
            setMessage("Error: Supabase config missing. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
            return;
        }

        try {
            // 1a. Initialize Supabase Client
            const client = createClient(supabaseUrl, supabaseAnonKey, {
                auth: { persistSession: false }, 
            });
            setSupabase(client);
            setMessage('Supabase client initialized. Establishing real-time connection...');

            // 1b. Setup Real-time Listener (on insert, update, delete)
            const channel = client
                .channel('aibry_tasks_channel')
                .on('postgres_changes', { event: '*', schema: 'public', table: TASKS_TABLE }, (payload) => {
                    console.log('Realtime change received:', payload.eventType);
                    // Trigger a re-fetch to ensure the sorting logic is applied correctly client-side
                    fetchTasks(client); 
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        setMessage("Real-time Protocol Engaged. Fetching initial tasks...");
                        fetchTasks(client);
                    } else if (status === 'CHANNEL_ERROR') {
                        setMessage("Error: Real-time connection failed. Tasks will not update automatically.");
                    }
                });

            setRealtimeChannel(channel);

            // Cleanup function for useEffect
            return () => {
                if (channel) {
                    channel.unsubscribe();
                }
            };

        } catch (error) {
            console.error("Supabase Initialization Error:", error);
            setMessage("Error during Supabase initialization.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supabaseUrl, supabaseAnonKey]); 


    // 2. DATA FETCHING LOGIC (called on mount and real-time updates)
    const fetchTasks = useCallback(async (clientInstance: any) => {
        const { data, error } = await clientInstance
            .from(TASKS_TABLE)
            .select('*');

        if (error) {
            console.error("Error fetching tasks:", error);
            setMessage("Error loading tasks. Check Supabase connection and RLS policies.");
            return;
        }

        const fetchedTasks = data.map((task: any) => ({
            ...task,
            timestampMs: new Date(task.created_at).getTime(),
            priority: task.priority || 'Low',
            targetTime: task.targetTime || ''
        }));

        // Apply complex client-side sorting logic (same as before)
        fetchedTasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            if (!a.completed) {
                const priorityA = getPriorityValue(a.priority);
                const priorityB = getPriorityValue(b.priority);
                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }
                const timeA = a.targetTime;
                const timeB = b.targetTime;
                if (timeA && timeB) {
                    if (timeA < timeB) return -1;
                    if (timeA > timeB) return 1;
                } else if (timeA) {
                    return -1;
                } else if (timeB) {
                    return 1;
                }
            }
            return a.timestampMs - b.timestampMs;
        });

        setTasks(fetchedTasks);
        if (!isFocusMode) {
            setMessage(fetchedTasks.length === 0 ? "No tasks. Ready to add a new one." : "Tasks updated in real-time.");
        }
    }, [isFocusMode]);


    // 3. COUNTDOWN TIMER LOGIC
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        const targetTask = isFocusMode ? tasks.find(t => !t.completed) : null;

        const updateTimer = () => {
            if (!targetTask || targetTask.completed || !targetTask.targetTime) {
                setCountdownTime(null);
                if (interval) clearInterval(interval);
                return;
            }

            const [targetHour, targetMinute] = targetTask.targetTime.split(':').map(Number);
            const now = new Date();
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute, 0);

            let diff = target.getTime() - now.getTime();

            if (diff < 0) {
                setCountdownTime("TARGET PASSED");
                if (interval) clearInterval(interval);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            diff -= hours * (1000 * 60 * 60);
            const minutes = Math.floor(diff / (1000 * 60));
            diff -= minutes * (1000 * 60);
            const seconds = Math.floor(diff / 1000);

            const h = String(hours).padStart(2, '0');
            const m = String(minutes).padStart(2, '0');
            const s = String(seconds).padStart(2, '0');

            setCountdownTime(`:: ${h}:${m}:${s} REMAINING`);
        };
        
        if (isFocusMode && targetTask && !targetTask.completed && targetTask.targetTime) {
            updateTimer();
            interval = setInterval(updateTimer, 1000);
        } else {
            setCountdownTime(null);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isFocusMode, tasks]);


    // --- CRUD OPERATIONS (Supabase versions) ---

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = newTaskText.trim();
        if (!text || !supabase) return;

        try {
            const { error } = await supabase
                .from(TASKS_TABLE)
                .insert([
                    {
                        text,
                        completed: false,
                        priority: newPriority,
                        targetTime: newTargetTime,
                    }
                ]);

            if (error) throw error;
            
            setNewTaskText('');
            setNewTargetTime('');
            setNewPriority('Medium');
            console.log("Task added.");
        } catch (error) {
            console.error("Error adding task:", error);
            setMessage("Error: Could not add task. Check console.");
        }
    };

    const toggleTask = useCallback(async (taskId: number, completed: boolean) => {
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from(TASKS_TABLE)
                .update({ completed: !completed })
                .eq('id', taskId);

            if (error) throw error;
            console.log("Task toggled.");
        } catch (error) {
            console.error("Error toggling task:", error);
            setMessage("Error: Could not toggle task. Check console.");
        }
    }, [supabase]);

    const handleDeleteTask = useCallback(async (taskId: number) => {
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from(TASKS_TABLE)
                .delete()
                .eq('id', taskId);

            if (error) throw error;
            console.log("Task deleted.");
        } catch (error) {
            console.error("Error deleting task:", error);
            setMessage("Error: Could not delete task. Check console.");
        }
    }, [supabase]);

    const initiatePurge = async () => {
        if (!supabase) return;

        try {
            const { count, error: countError } = await supabase
                .from(TASKS_TABLE)
                .select('id', { count: 'exact', head: true })
                .eq('completed', true);
            
            if (countError) throw countError;

            if (count && count > 0) {
                const { error: deleteError } = await supabase
                    .from(TASKS_TABLE)
                    .delete()
                    .eq('completed', true);

                if (deleteError) throw deleteError;

                setMessage(`PURGE EXECUTED. ${count} completed tasks cleared.`);
            } else {
                setMessage("Purge canceled. No completed tasks found.");
            }

        } catch (error) {
            console.error("Error initiating purge:", error);
            setMessage("Error during PURGE. Check console.");
        }
    };

    // --- MODAL HANDLERS ---
    const showModal = (title: string, text: string, confirmLabel: string, onConfirm: () => void) => {
        setModal({ visible: true, title, text, confirmLabel, onConfirm });
    };

    const hideModal = () => {
        setModal({ visible: false, title: '', text: '', confirmLabel: '', onConfirm: () => {} });
    };

    const handleModalConfirm = () => {
        modal.onConfirm();
        hideModal();
    };

    // --- FEATURE HANDLERS ---
    const handleToggleFocusMode = () => {
        const newMode = !isFocusMode;
        setIsFocusMode(newMode);
        if (newMode) {
            setMessage("Focus Protocol Engaged. Only high-priority targets visible.");
        } else {
            setMessage("Focus Protocol Disengaged. All tasks visible.");
        }
    };

    const handlePurgeClick = () => {
        showModal(
            "SYSTEM PURGE INITIATION",
            "Are you ready to clear all completed tasks from the system? This cannot be undone.",
            "Execute Purge",
            initiatePurge
        );
    };

    const handleTaskClick = (task: any) => {
        if (task.completed) {
            toggleTask(task.id, task.completed);
        } else {
            showModal(
                "PROTOCOL EXECUTION REQUIRED",
                `Execute Task "${task.text.substring(0, 30)}..." or Signal Loop Failure?`,
                "Executed. No Regrets.",
                () => toggleTask(task.id, task.completed)
            );
        }
    };

    const handleDeleteClick = (task: any) => {
        showModal(
            "DELETE RECORD WARNING",
            `Are you sure you want to delete "${task.text.substring(0, 30)}..." permanently? This action cannot be undone.`,
            "Confirm Deletion",
            () => handleDeleteTask(task.id)
        );
    }
    
    // --- TASK LIST RENDERING ---
    const tasksToRender = useMemo(() => {
        return isFocusMode ? tasks.filter(t => !t.completed) : tasks;
    }, [tasks, isFocusMode]);

    const TaskItem: React.FC<{ task: any, index: number }> = ({ task, index }) => {
        const isFocusedTask = isFocusMode && index === 0 && !task.completed;

        const DeleteIcon = () => (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
            </svg>
        );

        return (
            <div 
                className={`task-list-item flex items-center justify-between p-3 rounded-xl cursor-default ${
                    task.completed 
                    ? 'completed' 
                    : 'bg-[#232340] hover:bg-[#33334f]'
                } ${
                    isFocusedTask 
                    ? 'shadow-xl shadow-[#ff4757]/40 border-4 border-[#ff4757] animate-pulse-slow' 
                    : ''
                }`}
            >
                <div className="flex-grow mr-4">
                    <div className="flex items-center space-x-2 mb-1 text-xs">
                        {!task.completed && (
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${getPriorityClasses(task.priority)}`}>
                                {task.priority}
                            </span>
                        )}
                        {task.targetTime && (
                            <span className={`text-gray-400 ${task.completed ? '' : 'font-semibold'}`}>
                                &#x23F1; {task.targetTime}
                            </span>
                        )}
                        {isFocusedTask && countdownTime && (
                            <span className={`ml-4 text-sm font-extrabold tracking-widest ${countdownTime && countdownTime.includes("PASSED") ? 'text-gray-500' : 'text-[#ff4757]'}`}>
                                {countdownTime}
                            </span>
                        )}
                    </div>
                    <span 
                        className="text-lg font-medium cursor-pointer" 
                        onClick={() => handleTaskClick(task)}
                    >
                        {task.text}
                    </span>
                </div>
                
                <button
                    className="text-gray-400 hover:text-[#ff4757] p-1 rounded-full transition-colors"
                    onClick={() => handleDeleteClick(task)}
                >
                    <DeleteIcon />
                </button>
            </div>
        );
    };


    return (
        <div className="flex items-start justify-center" style={{ backgroundColor: '#0a0a1a', minHeight: 'calc(100vh - 120px)'}}>
            {/* Main Application Container */}
            <div id="app-container" className="w-full max-w-md bg-[#131320] p-6 rounded-xl shadow-2xl text-white">

                <h1 className="text-3xl font-extrabold mb-6 text-center text-[#e03b8b] uppercase tracking-wider">
                    THE PLAN FOR TODAY
                </h1>

                {/* Task Input Form */}
                <form id="task-form" onSubmit={handleAddTask} className="flex flex-col gap-2 mb-6">
                    {/* Task Text Input */}
                    <input
                        type="text"
                        id="task-input"
                        placeholder="Add a new routine task..."
                        required
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        className="flex-grow p-3 rounded-lg border-2 border-[#e03b8b] bg-[#0a0a1a] text-white focus:outline-none focus:border-white transition"
                    />

                    {/* Priority and Time Group */}
                    <div id="priority-time-group" className="flex gap-2">
                        {/* Priority Selector */}
                        <select 
                            id="priority-input" 
                            value={newPriority} 
                            onChange={(e) => setNewPriority(e.target.value)}
                            className="p-3 rounded-lg border-2 border-[#e03b8b] bg-[#0a0a1a] text-white focus:outline-none focus:border-white transition w-1/2"
                        >
                            <option value="Low">Priority: Low</option>
                            <option value="Medium">Priority: Medium</option>
                            <option value="High">Priority: High</option>
                        </select>

                        {/* Target Time Input */}
                        <input
                            type="time"
                            id="time-input"
                            value={newTargetTime}
                            onChange={(e) => setNewTargetTime(e.target.value)}
                            className="p-3 rounded-lg border-2 border-[#e03b8b] bg-[#0a0a1a] text-white focus:outline-none focus:border-white transition w-1/2"
                            title="Target Time"
                        />
                    </div>
                    
                    {/* Add Button */}
                    <button
                        type="submit"
                        className="bg-[#e03b8b] text-gray-900 font-bold p-3 rounded-lg hover:bg-white transition-colors duration-200 shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Add Task
                    </button>
                </form>

                {/* Loading/Message Indicator */}
                <div id="message" className="text-center text-[#e03b8b] font-semibold mb-4">{message}</div>

                {/* Task List Container */}
                <div id="task-list" className="space-y-3 max-h-96 custom-scroll overflow-y-auto">
                    {tasksToRender.map((task, index) => (
                        <TaskItem key={task.id} task={task} index={index} />
                    ))}
                    {tasksToRender.length === 0 && (
                        <p className="text-center text-gray-500 py-6">
                            {isFocusMode ? 'No incomplete tasks to focus on. Purge or add more.' : 'No tasks yet. Define your routine!'}
                        </p>
                    )}
                </div>

                {/* Footer / User ID Display and Purge Button */}
                <div className="mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center flex flex-col items-center">
                    
                    {/* Focus Protocol Button */}
                    <button 
                        id="focus-button"
                        onClick={handleToggleFocusMode}
                        className={`font-bold px-4 py-2 rounded-lg transition-colors duration-200 mb-3 text-sm tracking-widest ${
                            isFocusMode 
                            ? 'bg-[#e03b8b] text-gray-900 shadow-lg shadow-[#e03b8b]/40 transform scale-[1.02]' 
                            : 'bg-[#232340] text-[#e03b8b] hover:bg-white/10'
                        }`}
                        title="Hides completed tasks and focuses on the next priority task."
                    >
                        {isFocusMode ? "EXIT FOCUS PROTOCOL" : "ACTIVATE FOCUS PROTOCOL"}
                    </button>

                    {/* Daily Cycle Reset Button */}
                    <button 
                        id="purge-button"
                        onClick={handlePurgeClick}
                        className="bg-gray-700 text-red-400 font-bold px-4 py-2 rounded-lg hover:bg-red-900/50 transition-colors duration-200 mb-3 text-sm tracking-widest"
                        title="Deletes all completed tasks."
                    >
                        INITIATE PURGE
                    </button>
                    
                    <p className="text-gray-500 mt-2">Persistence Protocol Activated: Supabase/Postgres</p>
                </div>
            </div>

            {/* Confirmation Modal Container */}
            {modal.visible && (
                <div id="confirmation-modal" className="modal-overlay">
                    <div className="modal-content">
                        <h2 id="modal-title" className="text-xl font-bold mb-3 text-[#ff4757]">{modal.title}</h2>
                        <p id="modal-text" className="text-gray-300 mb-4">{modal.text}</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                id="modal-cancel-btn" 
                                onClick={hideModal}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                id="modal-confirm-btn" 
                                onClick={handleModalConfirm}
                                className="px-4 py-2 rounded-lg bg-[#e03b8b] text-gray-900 font-bold hover:bg-white transition"
                            >
                                {modal.confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToDoApp;