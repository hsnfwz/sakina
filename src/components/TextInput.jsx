function TextInput({ handleInput, placeholder, label, value, isDisabled }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <label htmlFor={placeholder}>{label}</label>}
      <input
        id={placeholder}
        type="text"
        placeholder={placeholder}
        className="flex w-full rounded-lg border-2 border-transparent bg-neutral-200 px-4 py-2 placeholder-neutral-400 focus:border-2 focus:border-black focus:bg-white focus:outline-hidden focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
        onInput={handleInput}
        value={value}
        autoComplete="off"
        disabled={isDisabled}
      />
    </div>
  );
}

export default TextInput;
