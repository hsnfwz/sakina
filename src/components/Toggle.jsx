function Toggle({ handleChange, isChecked, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center self-start">
      <input
        type="checkbox"
        value=""
        className="peer sr-only"
        checked={isChecked}
        onChange={handleChange}
      />
      <div className="peer relative h-6 w-11 rounded-full bg-neutral-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-neutral-700 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rtl:peer-checked:after:-translate-x-full"></div>
      <span className="ms-3 text-sm">{label}</span>
    </label>
  );
}

export default Toggle;
