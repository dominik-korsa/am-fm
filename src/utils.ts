import type {ValueFunction, ValueRange} from "@/types";

export const spanOf = (range: ValueRange) => range.max - range.min;

export const lerp = (t: number, range: ValueRange) => range.min + spanOf(range) * t;

export const square = (v: number) => v * v;

export const mapValue = (value: number, srcRange: ValueRange, targetRange: ValueRange) => {
  return lerp((value - srcRange.min) / spanOf(srcRange), targetRange);
}

export const modulo = (value: number, div: number) => {
  let result = value % div;
  if (result < 0) result += div;
  return result;
}

export const toWave = (value: number) => value * 2 - 1;

export const getMatrix = (
  srcXRange: ValueRange,
  srcYRange: ValueRange,
  targetXRange: ValueRange,
  targetYRange: ValueRange,
) => {
  const scaleX = spanOf(targetXRange) / spanOf(srcXRange);
  const scaleY = spanOf(targetYRange) / spanOf(srcYRange);
  return new DOMMatrix([
    scaleX,
    0, 0,
    scaleY,
    targetXRange.min - scaleX * srcXRange.min,
    targetYRange.min - scaleY * srcYRange.min
  ]);
}

export const sum = (values: number[]) => values.reduce((prev, curr) => prev + curr, 0);

export const average = (...values: number[]) => sum(values) / values.length;

export const getValue = <T extends number | object | string | boolean>(
  value: T | (() => T)
) => typeof value !== 'function' ? value : value();

export const sinX: ValueFunction = (x) => Math.sin(x * 2 * Math.PI);

export const listIf = <T>(condition: boolean, ...values: T[]) => condition ? values : [];
