
function Radio({ value, fields, handleChange }) {

  return (
    <fieldset className="flex flex-col gap-2 self-start">
      <legend className="py-2">Orientation</legend>
      {fields.map((field, index) => (
        <label key={index} className="app_radio-container">
          {field[0]}
          <input type="radio" id="horizontal" name="orientation" value="horizontal" checked={field[1] === value} onChange={handleChange} />
          <span className="app_radio-checkmark" for="horizontal"></span>
        </label>
      ))}
    </fieldset>
  );
}

export default Radio;
