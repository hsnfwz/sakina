function Toggle({ handleChange, isChecked }) {
  return (
    <label class="app_toggle-label">
      <input type="checkbox" checked={isChecked} onChange={handleChange} />
      <span class="app_toggle-span"></span>
    </label>
  );
}

export default Toggle;
