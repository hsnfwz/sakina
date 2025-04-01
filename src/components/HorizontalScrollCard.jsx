function HorizontalScrollCard({ children, width }) {
  return (
    <div className="snap-start" style={{ width }}>
      {children}
    </div>
  );
}

export default HorizontalScrollCard;
