"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-[#83c0cc] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
