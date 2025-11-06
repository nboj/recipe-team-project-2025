// ---------- Local UI Pieces ----------
const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="inline-block text-xs bg-gray-200 text-gray-800 rounded px-2 py-0.5 mr-1 mt-1">
      {children}
    </span>
  );
};

export default Tag
