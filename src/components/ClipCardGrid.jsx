function ClipCardGrid({ children }) {
  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
      {children}
    </div>
  );
}

export default ClipCardGrid;
