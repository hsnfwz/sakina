function Button({ children, handleClick, isDisabled, isLoading, buttonColor }) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={`${buttonColor ? `${buttonColor.tailwindColor} ${buttonColor.tailwindColorHover}` : 'bg-transparent hover:bg-neutral-700'} flex w-full items-center justify-center gap-2 self-start rounded-lg border-2 border-transparent fill-white p-2 focus:border-2 focus:border-white focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50`}
    >
      {isLoading && (
        <div className="h-[24px] w-[24px] animate-spin rounded-full border-2 border-t-0 bg-sky-500"></div>
      )}
      {!isLoading && <>{children}</>}
    </button>
  );
}

export default Button;
