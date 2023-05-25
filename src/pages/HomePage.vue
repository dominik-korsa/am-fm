<template>
  <main class="p-8">
    <function-card :label="`Fala nośna ${frequency} Hz`">
      <function-graph :config="carrierConfig" @click.prevent="changeFrequency()" class="cursor-pointer" />
    </function-card>
    <function-card label="Dźwięk" class="mt-4">
      <function-graph :config="soundConfig" @click.prevent="changeSound()" class="cursor-pointer" />
    </function-card>
    <function-card label="Fala AM" class="mt-4" :header-click="changeMode" v-if="mode.am">
      <function-graph :config="amSignalConfig" @click="toggleSoundOnSignal()" class="cursor-pointer" />
    </function-card>
    <function-card label="Fala FM" class="mt-4" :header-click="changeMode" v-if="mode.fm">
      <function-graph :config="fmSignalConfig" />
    </function-card>
  </main>
</template>

<script setup lang="ts">
import FunctionGraph from "@/components/FunctionGraph.vue";
import type {FunctionOptions, GraphConfig} from "@/types";
import {computed} from "vue";
import {listIf} from "@/utils";
import FunctionCard from "@/components/FunctionCard.vue";
import {useCycleList, useToggle} from "@vueuse/core";
import {getFmSignalFunction, getFrequencyTransform} from "@/functions/fm-signal";
import {getChannel, soundTypes, useGetMaxX} from "@/common";

const { state: frequency, next: changeFrequency } = useCycleList([0.5, 1, 1.5, 2, 2.5, 3], {
  initialValue: 1.5,
});
const { state: soundType, next: changeSound } = useCycleList(soundTypes);
const { state: mode, next: changeMode } = useCycleList([
  { am: true, fm: true },
  { am: true, fm: false },
  { am: false, fm: true },
]);
const getMaxX = useGetMaxX();
const channel = computed(() => getChannel(soundType.value, frequency.value));

const unitWidth = 30;
const unitHeight = 30;

const carrierConfig = computed<GraphConfig>(() => ({
  functions: [
    { function: channel.value.carrier },
  ],
  getMaxX,
  unitWidth,
  yRange: {min: -1, max: 1},
  unitHeight,
  baselines: [
    { y: 1 },
    { y: 0 },
    { y: -1 },
  ],
}));

const soundConfig = computed<GraphConfig>(() => ({
  functions: [
    { function: channel.value.sound, color: '#3A7E70' },
  ],
  getMaxX,
  unitWidth,
  yRange: {min: -1, max: 1},
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
      { function: (x) => channel.value.sound(x) + 1, color: '#3A7E70' },
      { function: (x) => -channel.value.sound(x) - 1, color: '#3A7E7066' },
    ),
    { function: channel.value.amSignal },
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
          channel.value.sound,
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
