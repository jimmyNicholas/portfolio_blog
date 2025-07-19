import { DEFAULT_VIEWBOX, SVG_NAMESPACE } from "./consts";

export const createSVGFilter = (id: string, turbulence: string, opacity: number, viewBox = DEFAULT_VIEWBOX) =>
  `url("data:image/svg+xml,<svg viewBox='${viewBox}' xmlns='${SVG_NAMESPACE}'><filter id='${id}'>${turbulence}</filter><rect width='100%' height='100%' filter='url(%23${id})' opacity='${opacity}'/></svg>")`;

export const createFractalNoise = (baseFrequency: number, numOctaves = 4) =>
  `<feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='${numOctaves}' stitchTiles='stitch'/>`;

export const createTurbulenceNoise = (baseFrequency: number, numOctaves = 2) =>
  `<feTurbulence type='turbulence' baseFrequency='${baseFrequency}' numOctaves='${numOctaves}' stitchTiles='stitch'/>`;

export const createRadialDot = (x: number, y: number, color: string, intensity: number, radius: number) =>
  `radial-gradient(circle at ${x}% ${y}%, ${color}${intensity}) ${radius}px, transparent ${radius}px)`;
