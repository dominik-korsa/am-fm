import type {PointsFunction, Pos, ValueFunction} from "@/types";
import {Queue} from "@/queue";
import {average, lerp, square} from "@/utils";

export const getFrequencyTransform = (carrierFrequency: number, min: number): ValueFunction => {
  const max = 4 - 3 * min;
  return (value) => carrierFrequency * lerp(square((value + 1) / 2), {min, max});
};

export const getFmSignalFunction = (
  sound: ValueFunction,
  getSoundFrequency: ValueFunction,
  step: number,
): PointsFunction => {
  let queue: Queue<Pos>;
  let phase = 0;
  return {
    update: (range) => {
      if (!queue || queue.first()[0] > range.min) {
        queue = new Queue<Pos>([ range.min, sound(range.min) ]);
      }

      while (true) {
        const [prevX] = queue.last();
        if (prevX > range.max) break;
        const x = prevX + step;
        const frequency = getSoundFrequency(average(sound(prevX), sound(x)));
        phase += step * frequency * 2 * Math.PI;
        queue.pushBack([x, Math.sin(phase)]);
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
};
