export type Pos = [number, number];

export interface ValueRange {
    min: number;
    max: number;
}

export type ValueFunction = (x: number) => number;

export interface PointsFunction {
  update: (xRange: ValueRange) => void;
  first: () => Pos;
  secondGenerator: () => Generator<Pos>;
}

export interface FunctionOptions {
  function: ValueFunction | PointsFunction;
  width?: number;
  color?: string;
}

export interface Baseline {
  y: number;
  color?: string;
}

export interface BaseGraphConfig {
  functions: FunctionOptions[];
  unitHeight: number;
  yRange: ValueRange;
  baselines: Baseline[];
}

export interface XRangeGraphConfig extends BaseGraphConfig {
  xRange: (() => ValueRange) | ValueRange;
}

export interface MaxXGraphConfig extends BaseGraphConfig {
  unitWidth: number;
  getMaxX: () => number;
}

export type GraphConfig = XRangeGraphConfig | MaxXGraphConfig;
