function Textarea({
  handleInput,
  placeholder,
  label,
  value,
  isDisabled,
  limit,
  isError,
}) {
  return (
    <div className={`flex w-full flex-col gap-2 ${isError ? 'text-rose-500' : 'text-black'}`}>
      {label && (
        <label
          htmlFor={placeholder}
          className="flex w-full justify-between gap-2"
        >
          <span>{label}</span>
          {limit && (
            <span
              className={`self-end ${value.length > limit.max || isError ? 'text-rose-500' : 'text-black'}`}
            >
              {value.length}
              {limit.max && ` / ${limit.max}`}
            </span>
          )}
        </label>
      )}
      <textarea
        id={placeholder}
        placeholder={placeholder}
        className={`flex w-full rounded-lg border-2 ${isError ? 'border-rose-500' : 'border-transparent'} bg-neutral-100 px-2 py-1 placeholder-neutral-400 transition-all hover:border-neutral-200 focus:z-50 focus:border-black focus:bg-white focus:ring-0 focus:outline-0 disabled:pointer-events-none disabled:opacity-50`}
        onInput={handleInput}
        value={value}
        rows={10}
        autoComplete="off"
        disabled={isDisabled}
      />
    </div>
  );
}

export default Textarea;
