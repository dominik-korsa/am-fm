import type {PointsFunction, ValueFunction} from "@/types";
import {Queue} from "@/queue";
import {average, lerp, square} from "@/utils";

export const getFrequencyTransform = (carrierFrequency: number, min: number): ValueFunction => {
  const max = 4 - 3 * min;
  return (value) => carrierFrequency * lerp(square((value + 1) / 2), {min, max});
};

export const getPointsFunction = <PointY>(
  computeNext: (prevX: number, x: number) => PointY,
  resetState: () => PointY,
  step: number,
): PointsFunction<[number, PointY]> => {
  let queue: Queue<[number, PointY]>;
  return {
    update: (range) => {
      if (!queue || queue.first()[0] > range.min) {
        queue = new Queue<[number, PointY]>([ range.min, resetState() ]);
      }

      while (true) {
        const [prevX] = queue.last();
        if (prevX > range.max) break;
        const x = prevX + step;
        queue.pushBack([x, computeNext(prevX, x)]);
      }
      while (true) {
        const pos = queue.second();
        if (!pos || pos[0] >= range.min) break;
        queue.popFront();
      }
    },
    first: () => {
      if (!queue) throw new Error('Call PointsFunction.update() before accessing PointsFunction.first()');
      return queue.first();
    },
    secondGenerator: () => {
      if (!queue) throw new Error('Call PointsFunction.update() before accessing PointsFunction.secondGenerator()');
      return queue.secondGenerator();
    },
  };
}

export const getFmSignalFunction = (
  sound: ValueFunction,
  getSoundFrequency: ValueFunction,
  step: number,
): PointsFunction => {
  let phase = 0;
  return getPointsFunction<number>(
    (prevX, x) => {
      const frequency = getSoundFrequency(average(sound(prevX), sound(x)));
      phase += step * frequency * 2 * Math.PI;
      return Math.sin(phase);
    },
    () => {
      phase = 0;
      return 0;
    },
    step,
  );
};
