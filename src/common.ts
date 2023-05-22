import {Channel, ValueFunction} from "@/types";
import {average, modulo, sinX, toWave} from "@/utils";

const defineSounds = <T extends Record<string, ValueFunction>>(sounds: T): T => sounds;

export const sounds = defineSounds({
  sine: (x) => sinX(x / 10),
  sawtooth: (x) => toWave(modulo(x / 10, 1)),
  fairlyRandom: (x) => average(sinX(x / 5), sinX(x / 7.94), sinX(x / 21.37)),
  harmonic: (x) => average(sinX(x / 10), sinX((x+1.2) / 5)),
  square: (x) => modulo(x / 10, 1) < 0.5 ? -1 : 1,
  triangle: (x) => toWave(Math.abs(toWave(modulo(x / 10, 1)))),
  steps: (x) => {
    const mod = modulo(x / 10, 1);
    if (mod < 1/3) return -1;
    if (mod < 2/3) return 0;
    return 1;
  },
  silent: () => 0,
});
export type SoundType = keyof typeof sounds;
export const soundTypes = Object.keys(sounds) as SoundType[];

export const getChannel = (
  soundType: SoundType,
  frequency: number,
): Channel => {
  const sound = sounds[soundType];
  const carrier: ValueFunction = (x) => sinX(x * frequency);
  const amSignal: ValueFunction = (x) => carrier(x) * (sound(x) + 1);
  return {
    frequency,
    sound,
    carrier,
    amSignal,
  }
};

export const useGetMaxX = () => {
  const startTime = Date.now();
  return () => (Date.now() - startTime) / 1000;
}
