function Toggle({ handleChange, isChecked, children }) {
  return (
    <label htmlFor="toggle" className="flex items-center gap-2 self-start">
      <label className="app_toggle-label">
        <input
          id="toggle"
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          onMouseDown={(event) => event.preventDefault()}
        />
        <span className="app_toggle-span"></span>
      </label>
      <div>{children}</div>
    </label>
  );
}

export default Toggle;
