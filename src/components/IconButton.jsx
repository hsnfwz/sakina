function IconButton({
  children,
  handleClick,
  isDisabled,
  isLoading,
  color,
  elementRef,
}) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={`${color ? `${color.tailwindBackgroundColor} ${color.tailwindHoverBackgroundColor} ${color.tailwindTextColor} ${color.tailwindFillColor} ${color.tailwindBorderColor} ${color.tailwindHoverBorderColor} ${color.tailwindFocusBorderColor}` : 'bg-transparent border-transparent text-neutral-500 fill-neutral-500 focus:border-neutral-500'} flex self-center rounded-full border-2 p-1 focus:border-2  focus:ring-0 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50`}
      ref={elementRef}
    >
      {isLoading && (
        <div className="h-[24px] w-[24px] animate-spin rounded-full border-2 border-t-0 bg-sky-500"></div>
      )}
      {!isLoading && <>{children}</>}
    </button>
  );
}

export default IconButton;
