<template>
  <main class="p-8">
    <function-card :label="`Fala nośna ${frequency} Hz`">
      <function-graph :config="firstConfig" @click.prevent="changeFrequency()" class="cursor-pointer" />
    </function-card>
    <function-card label="Dźwięk" class="mt-4">
      <function-graph :config="soundConfig" @click.prevent="changeSound()" class="cursor-pointer" />
    </function-card>
    <function-card label="Fala AM" class="mt-4">
      <function-graph :config="amSignalConfig" @click="toggleSoundOnSignal()" class="cursor-pointer" />
    </function-card>
    <function-card label="Fala FM" class="mt-4">
      <function-graph :config="fmSignalConfig" />
    </function-card>
  </main>
</template>

<script setup lang="ts">
import FunctionGraph from "@/components/FunctionGraph.vue";
import type {FunctionOptions, GraphConfig, ValueFunction, ValueRange} from "@/types";
import {computed} from "vue";
import {average, listIf, modulo, sinX, toWave} from "@/utils";
import FunctionCard from "@/components/FunctionCard.vue";
import {useCycleList, useToggle} from "@vueuse/core";
import {getFmSignalFunction, getFrequencyTransform} from "@/functions/fm-signal";

const yRange: ValueRange = { min: -1, max: 1 };

const startTime = Date.now();
const getMaxX = () => (Date.now() - startTime) / 1000;

const { state: frequency, next: changeFrequency } = useCycleList([0.5, 1, 1.5, 2, 2.5, 3], {
  initialValue: 1.5,
});

const carrier: ValueFunction = (x) => sinX(x * frequency.value);
const sounds: Record<string, ValueFunction> = {
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
};

const { state: soundType, next: changeSound } = useCycleList(Object.keys(sounds));
const sound = computed(() => sounds[soundType.value]);

const signal: ValueFunction = (x) => carrier(x) * (sound.value(x) + 1);

const unitWidth = 30;
const unitHeight = 30;

const firstConfig = computed<GraphConfig>(() => ({
  functions: [
    { function: carrier },
  ],
  getMaxX,
  unitWidth,
  yRange,
  unitHeight,
  baselines: [
    { y: 1 },
    { y: 0 },
    { y: -1 },
  ],
}));

const soundConfig = computed<GraphConfig>(() => ({
  functions: [
    { function: sound.value, color: '#3A7E70' },
  ],
  getMaxX,
  unitWidth,
  yRange,
  unitHeight,
  baselines: [
    { y: 1 },
    { y: 0 },
    { y: -1 },
  ],
}));

const [showSoundOnSignal, toggleSoundOnSignal] = useToggle(false);

const amSignalConfig = computed<GraphConfig>(() => ({
  functions: [
    ...listIf<FunctionOptions>(showSoundOnSignal.value,
      { function: (x) => sound.value(x) + 1, color: '#3A7E70' }
    ),
    { function: signal },
  ],
  getMaxX,
  unitWidth,
  yRange: { min: -2, max: 2 },
  unitHeight,
  baselines: [
    { y: 2 },
    { y: 1 },
    { y: 0 },
    { y: -1 },
    { y: -2 },
  ],
}));

const fmSignalConfig = computed<GraphConfig>(() => {
  return ({
    functions: [
      {
        function: getFmSignalFunction(
          sound.value,
          getFrequencyTransform(frequency.value, 0.5),
          0.01
        ),
      },
    ],
    yRange: {min: -1, max: 1},
    getMaxX,
    unitWidth,
    unitHeight,
    baselines: [
      { y: 1 },
      { y: 0 },
      { y: -1 },
    ],
  });
});


</script>
