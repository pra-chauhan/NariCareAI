const BackgroundOrbs = () => (
  <>
    <div className="gradient-orb orb-rose" style={{ top: '-5%', right: '-10%' }} />
    <div className="gradient-orb orb-peach" style={{ bottom: '10%', left: '-8%' }} />
    <div className="gradient-orb orb-sage" style={{ top: '40%', right: '20%' }} />
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="petal"
        style={{
          left: `${15 + i * 15}%`,
          width: 8,
          height: 8,
          borderRadius: '50% 0 50% 0',
          background: `hsl(330 60% ${75 + i * 3}%)`,
          animationDuration: `${8 + i * 3}s`,
          animationDelay: `${i * 2}s`,
        }}
      />
    ))}
  </>
);

export default BackgroundOrbs;
