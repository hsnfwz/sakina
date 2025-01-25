function IconButton({ children, handleClick, isDisabled, isLoading }) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className="flex self-start rounded-full border border-transparent stroke-white p-2 hover:bg-neutral-700 focus:border focus:border-white focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
    >
      {isLoading && (
        <div className="h-[24px] w-[24px] animate-spin rounded-full border-2 border-t-0 bg-sky-500"></div>
      )}
      {!isLoading && <>{children}</>}
    </button>
  );
}

export default IconButton;
