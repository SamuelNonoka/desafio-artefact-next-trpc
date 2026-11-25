const BASE_CLASSES =
  "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:bg-slate-50 disabled:text-slate-500";

export function useTaskFormHook() {
  function inputClasses(hasError: boolean) {
    return hasError
      ? `${BASE_CLASSES} animate-shake border-red-400 focus:border-red-500 focus:ring-red-100`
      : `${BASE_CLASSES} border-slate-300 focus:border-indigo-500 focus:ring-indigo-100`;
  }

  return { inputClasses };
}
