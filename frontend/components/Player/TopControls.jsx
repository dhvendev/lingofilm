import { Button } from "../ui/button";

export default function TopControls({ showControls, title, onClose }) {
  return (
    <div 
      className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 transition-opacity duration-300 ${
        showControls ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center">
        <span className="text-white text-lg font-semibold">{title}</span>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
          variant="ghost"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </Button>
      </div>
    </div>
  );
}