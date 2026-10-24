export function CheckIcon() {
  return <span className="cm-check">✓</span>;
}

export function ServerArt() {
  return (
    <div className="cm-server-art" aria-hidden="true">
      <div className="cm-server-promo-banner">
        <strong>TIẾT KIỆM ĐẾN 81%</strong>
        <span>CHỈ DIỄN RA TRONG THÁNG NÀY</span>
      </div>
      <div className="cm-cloud">
        <span />
        <span />
        <span />
        <b>↑</b>
      </div>
      <div className="cm-server-stack">
        {[0, 1, 2].map((item) => (
          <div className="cm-server-row" key={item}>
            <i />
            <i className={item === 1 ? "is-warning" : ""} />
            <span />
            <strong />
          </div>
        ))}
      </div>
    </div>
  );
}
