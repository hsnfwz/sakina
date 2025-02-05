function Toggle({ handleChange, isChecked }) {
  return (
    <label className="app_toggle-label">
      <input type="checkbox" checked={isChecked} onChange={handleChange} />
      <span className="app_toggle-span"></span>
    </label>
  );
}

export default Toggle;
