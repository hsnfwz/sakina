function Textarea({
  handleInput,
  placeholder,
  label,
  value,
  max,
  min,
  isDisabled,
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <label htmlFor={placeholder}>{label}</label>}
      <textarea
        id={placeholder}
        placeholder={placeholder}
        className="flex w-full rounded-lg border-2 border-black bg-white p-2 placeholder-neutral-400 focus:border-2 focus:border-sky-500 focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
        onInput={handleInput}
        value={value}
        rows={10}
        maxLength={max}
        minLength={min}
        autoComplete="off"
        disabled={isDisabled}
      />
    </div>
  );
}

export default Textarea;
