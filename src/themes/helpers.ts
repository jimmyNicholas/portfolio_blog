export function createFractalNoise(size: number, octaves: number = 1): string {
  return `fractalNoise(${size}, ${octaves})`;
}

export function createTurbulenceNoise(octaves: number = 1): string {
  return `turbulence(${octaves})`;
}

export function createRadialDot(x: number, y: number, color: string, intensity: number, size: number): string {
  return `radial-gradient(circle at ${x}% ${y}%, ${color} ${size}px, transparent ${size + 2}px)`;
}

export function createSVGFilter(id: string, noiseType: string, intensity: number, viewBox: string = "0 0 100 100"): string {
  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'><filter id='${id}'><feTurbulence type='${noiseType}' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${intensity} 0'/></filter><rect width='100%' height='100%' filter='url(%23${id})'/></svg>")`;
} 