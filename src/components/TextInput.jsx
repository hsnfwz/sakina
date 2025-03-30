function TextInput({
  handleInput,
  placeholder,
  label,
  value,
  isDisabled,
  limit,
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={placeholder}
          className="flex w-full justify-between gap-2"
        >
          <span>{label}</span>
          {limit && (
            <span
              className={`self-end ${value.length > limit.max ? 'text-rose-500' : 'text-black'}`}
            >
              {value.length}{limit.max && ` / ${limit.max}`}
            </span>
          )}
        </label>
      )}
      <input
        id={placeholder}
        type="text"
        placeholder={placeholder}
        className="flex w-full rounded-lg border-2 border-transparent bg-neutral-200 px-4 py-2 placeholder-neutral-400 focus:border-2 focus:border-black focus:bg-white focus:ring-0 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        onInput={handleInput}
        value={value}
        autoComplete="off"
        disabled={isDisabled}
      />
    </div>
  );
}

export default TextInput;
