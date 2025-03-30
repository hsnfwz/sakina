function ContentTableGrid({ children }) {
  return (
    <div className="flex w-full flex-col divide-y-2 divide-neutral-200">
      {children}
    </div>
  );
}

export default ContentTableGrid;
