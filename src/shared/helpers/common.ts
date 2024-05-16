export function generateRandomValue(min: number, max: number, numAfterDot = 0): number {
  return +(Math.random() * (max - min) + min).toFixed(numAfterDot);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomBoolean(): boolean {
  return Math.random() > 0.5;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
