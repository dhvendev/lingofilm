export default function BottomControls({ showControls, children }) {
    return (
      <div
        className={`relative mt-auto bg-gradient-to-t from-black to-transparent text-white p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 50 }}
      >
        {children}
      </div>
    );
  }