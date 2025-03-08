function TextInput({ handleInput, placeholder, label, value }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <label htmlFor={placeholder}>{label}</label>}
      <input
        id={placeholder}
        type="text"
        placeholder={placeholder}
        className="flex w-full rounded-lg border-2 border-neutral-700 bg-black px-4 py-2 placeholder-neutral-700 focus:border-2 focus:border-white focus:outline-none focus:ring-0"
        onInput={handleInput}
        value={value}
        autoComplete="off"
      />
    </div>
  );
}

export default TextInput;
