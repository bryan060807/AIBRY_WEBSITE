// lib/jobStore.ts
const jobStore = new Map<string, any>();
export const setJob = (id: string, data: any) => jobStore.set(id, { ...data, receivedAt: Date.now() });
export const getJob = (id: string) => jobStore.get(id);