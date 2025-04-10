function Button({
  elementRef,
  children,
  handleClick,
  isDisabled,
  color,
  isRound,
}) {
  return (
    <button
      ref={elementRef}
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      onMouseDown={(event) => event.preventDefault()}
      className={`${color ? `${color.tailwindBackgroundColor} ${color.tailwindHoverBackgroundColor} ${color.tailwindTextColor} ${color.tailwindFillColor} ${color.tailwindBorderColor} ${color.tailwindHoverBorderColor}` : 'border-transparent bg-transparent fill-neutral-500 text-neutral-500'} flex cursor-pointer items-center justify-center gap-2 self-start rounded-full border-2 ${isRound ? 'p-1' : 'px-2 py-1'} text-center transition-all focus:z-50 focus:border-black focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

export default Button;
