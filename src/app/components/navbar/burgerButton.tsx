

export const BurgerButton = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <button
      type="button"
      aria-label="Menu"
      className="px-2 py-1 rounded-sm flex flex-col gap-1 z-[100]"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`w-7 h-[3px] bg-gray-900 rounded-sm transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></div>
      <div className={`w-7 h-[3px] bg-gray-900 rounded-sm transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></div>
      <div className={`w-7 h-[3px] bg-gray-900 rounded-sm transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}></div>
    </button>
  );
};
