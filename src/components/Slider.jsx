function Slider({ value, handleInput, max, sliderRef }) {
  return (
    <input
      onInput={handleInput}
      type="range"
      value={value}
      max={max}
      ref={sliderRef}
      step={0.001} // 1 ms (1 second = 1000 ms)
    />
  );
}

export default Slider;
