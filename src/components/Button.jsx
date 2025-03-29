function Button({ children, handleClick, isDisabled, isLoading, color }) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      onMouseDown={(event) => event.preventDefault()}
      className={`${color ? `${color.tailwindBackgroundColor} ${color.tailwindHoverBackgroundColor} ${color.tailwindTextColor} ${color.tailwindFillColor} ${color.tailwindBorderColor} ${color.tailwindHoverBorderColor}` : 'border-transparent bg-transparent fill-neutral-500 text-neutral-500'} flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-2 focus:z-50 focus:ring-2 focus:ring-black focus:outline-0 disabled:pointer-events-none disabled:opacity-50`}
    >
      {isLoading && (
        <div className="h-[24px] w-[24px] animate-spin rounded-lg border-2 border-t-0 bg-black"></div>
      )}
      {!isLoading && <>{children}</>}
    </button>
  );
}

export default Button;
