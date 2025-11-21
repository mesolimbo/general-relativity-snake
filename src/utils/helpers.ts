import { GRID_SIZE, WARP_RADIUS_TILES, WARP_MAX_PULL_PIXELS } from '../config/constants';

export interface Position {
  x: number;
  y: number;
}

export interface WarpedPosition {
  x: number;
  y: number;
  pullFactor: number;
}

export interface ColorStyle {
  color: number;
  alpha: number;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function getWarpedPixelCoordinates(
  pixelX: number,
  pixelY: number,
  snakeHead: Position | null
): WarpedPosition {
  if (!snakeHead) return { x: pixelX, y: pixelY, pullFactor: 0 };

  const headPixelX = snakeHead.x * GRID_SIZE + GRID_SIZE / 2;
  const headPixelY = snakeHead.y * GRID_SIZE + GRID_SIZE / 2;

  const distPixels = distance(pixelX, pixelY, headPixelX, headPixelY);
  const distTiles = distPixels / GRID_SIZE;

  let warpedX = pixelX;
  let warpedY = pixelY;
  let finalPullFactor = 0;

  if (distTiles < WARP_RADIUS_TILES && distTiles > 0) {
    const normalizedDistFromHead = Math.min(1, distTiles / WARP_RADIUS_TILES);
    finalPullFactor = 1 - Math.pow(normalizedDistFromHead, 3);

    const deltaX = headPixelX - pixelX;
    const deltaY = headPixelY - pixelY;
    const angle = Math.atan2(deltaY, deltaX);
    const pullMagnitude = finalPullFactor * WARP_MAX_PULL_PIXELS;

    warpedX = pixelX + Math.cos(angle) * pullMagnitude;
    warpedY = pixelY + Math.sin(angle) * pullMagnitude;
  }
  return { x: warpedX, y: warpedY, pullFactor: finalPullFactor };
}

export function rgbToHex(r: number, g: number, b: number): number {
  return (r << 16) | (g << 8) | b;
}

export function getRedshiftColor(pullFactor: number): ColorStyle {
  const factor = Math.min(1, Math.max(0, pullFactor));

  const R = Math.round(0 + 255 * factor);
  const G = Math.round(255 + (77 - 255) * factor);
  const B = Math.round(128 + (79 - 128) * factor);

  const color = rgbToHex(R, G, B);
  const alpha = 0.1 + 0.3 * factor;
  return { color, alpha };
}

export function getSnakeBodyColor(index: number, totalLength: number): number {
  if (totalLength <= 1) return 0xffffff;

  const ratio = (index - 1) / (totalLength - 1);
  const factor = Math.min(1, Math.max(0, ratio));

  // White to Green
  const startR = 255,
    startG = 255,
    startB = 255;
  const endR = 35,
    endG = 134,
    endB = 54;

  const R = Math.round(startR + (endR - startR) * factor);
  const G = Math.round(startG + (endG - startG) * factor);
  const B = Math.round(startB + (endB - startB) * factor);

  return rgbToHex(R, G, B);
}
