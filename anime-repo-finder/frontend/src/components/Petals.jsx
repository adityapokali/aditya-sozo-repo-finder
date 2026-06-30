const PETAL_COUNT = 14;

export default function Petals() {
  const petals = Array.from({ length: PETAL_COUNT }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = 10 + Math.random() * 10;
    const size = 6 + Math.random() * 8;
    return { id: i, left, delay, duration, size };
  });

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
