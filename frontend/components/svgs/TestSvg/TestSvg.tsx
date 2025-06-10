const TestSvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
      <clipPath id="clip">
        <rect id="rect" x="140" y="20" width="120" height="100" />
      </clipPath>
      <filter id="blur" width="160%" height="160%" x="-30%" y="-30%">
        <feFlood flood-color="#fff" result="neutral" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blurred" />
        <feMerge>
          <feMergeNode in="neutral" />
          <feMergeNode in="blurred" />
        </feMerge>
      </filter>
      <g id="backdrop">
        <rect fill="red" x="0" y="0" width="200" height="100" />
        <rect fill="yellow" x="120" y="40" width="40" height="40" />
      </g>
      <g style={{ clipPath: "url(#clip)" }}>
        <use href="#backdrop" style={{ filter: "url(#blur)" }} />
      </g>
      <use href="#rect" style={{ fill: "none", stroke: "black" }} />
    </svg>
  );
};

export default TestSvg;
