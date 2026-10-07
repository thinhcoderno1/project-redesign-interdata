// Decorative approximation of land masses. No facility markers or network routes.
const continents = [
  [
    [10, 12],
    [24, 6],
    [39, 10],
    [44, 20],
    [33, 30],
    [26, 30],
    [23, 40],
    [16, 34],
    [15, 23],
  ],
  [
    [30, 40],
    [42, 43],
    [48, 53],
    [42, 66],
    [36, 78],
    [32, 64],
  ],
  [
    [50, 14],
    [62, 10],
    [69, 18],
    [63, 27],
    [57, 26],
    [50, 21],
  ],
  [
    [52, 30],
    [65, 30],
    [72, 40],
    [69, 56],
    [60, 65],
    [55, 52],
  ],
  [
    [66, 11],
    [87, 8],
    [111, 13],
    [125, 24],
    [116, 39],
    [101, 39],
    [93, 51],
    [84, 39],
    [78, 32],
    [69, 27],
  ],
  [
    [108, 57],
    [124, 56],
    [131, 65],
    [124, 72],
    [112, 70],
  ],
];
function inside(x: number, y: number, polygon: number[][]) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      result = !result;
  }
  return result;
}
export function WorldMap() {
  const dots = [];
  for (let y = 4; y < 82; y += 3)
    for (let x = 4; x < 140; x += 3)
      if (continents.some((p) => inside(x, y, p)))
        dots.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1.3"
            height="1.3"
            rx=".2"
          />,
        );
  return (
    <svg className="world-map" viewBox="0 0 144 86" aria-hidden="true">
      {dots}
    </svg>
  );
}
