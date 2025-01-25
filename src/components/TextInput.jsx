function TextInput({ handleInput, placeholder, label, value }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <label htmlFor={placeholder}>{label}</label>}
      <input
        id={placeholder}
        type="text"
        placeholder={placeholder}
        className="flex w-full rounded-lg border border-neutral-700 bg-black p-2 placeholder-neutral-700 focus:border focus:border-white focus:outline-none focus:ring-0"
        onInput={handleInput}
        value={value}
      />
    </div>
  );
}

export default TextInput;
