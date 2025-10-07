// global.d.ts
export {};

declare global {
  interface Window {
    aibraryGrantAccess: ((userId: string, role: string) => Promise<void>) & { userId: string | null };
  }
}