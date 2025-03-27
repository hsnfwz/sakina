function TextInput({ handleInput, placeholder, label, value, isDisabled }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <label htmlFor={placeholder}>{label}</label>}
      <input
        id={placeholder}
        type="text"
        placeholder={placeholder}
        className="flex w-full rounded-full border-2 border-black px-4 py-2 placeholder-neutral-400 focus:border-2 focus:border-sky-500 focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
        onInput={handleInput}
        value={value}
        autoComplete="off"
        disabled={isDisabled}
      />
    </div>
  );
}

export default TextInput;
