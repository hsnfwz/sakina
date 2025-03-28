function Button({ children, handleClick, isDisabled, isLoading, color }) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={`${color ? `${color.tailwindColor} ${color.tailwindColorHover} text-white` : 'bg-transparent text-black hover:bg-neutral-200'} flex w-full items-center justify-center gap-2 self-start rounded-lg border-2 border-transparent fill-white p-2 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50`}
    >
      {isLoading && (
        <div className="h-[24px] w-[24px] animate-spin rounded-full border-2 border-t-0 bg-sky-500"></div>
      )}
      {!isLoading && <>{children}</>}
    </button>
  );
}

export default Button;
