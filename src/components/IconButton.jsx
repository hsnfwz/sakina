function IconButton({
  children,
  handleClick,
  isDisabled,
  isLoading,
  buttonColor,
}) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={`${buttonColor ? `${buttonColor.tailwindColor} ${buttonColor.tailwindColorHover}` : 'bg-transparent hover:bg-neutral-200'} flex self-center rounded-full border-2 border-transparent fill-black p-1 focus:border-2 focus:border-black focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50`}
    >
      {isLoading && (
        <div className="h-[24px] w-[24px] animate-spin rounded-full border-2 border-t-0 bg-sky-500"></div>
      )}
      {!isLoading && <>{children}</>}
    </button>
  );
}

export default IconButton;
