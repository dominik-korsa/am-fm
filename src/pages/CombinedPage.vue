<template>
  <main class="p-8">
    <div class="flex gap-2">
      <combined-channel :channel="firstChannel" :get-max-x="getMaxX" />
      <combined-channel :channel="secondChannel" :get-max-x="getMaxX" />
      <combined-channel :channel="thirdChannel" :get-max-x="getMaxX" />
    </div>
    <function-card label="Sygnał AM" class="mt-2">
      <function-graph :config="amCombinedConfig" />
    </function-card>
  </main>
</template>

<script setup lang="ts">

import CombinedChannel from "@/components/CombinedChannel.vue";
import {computed} from "vue";
import {getChannel, useGetMaxX} from "@/common";
import {sum} from "@/utils";
import type {ValueFunction} from "@/types";
import FunctionGraph from "@/components/FunctionGraph.vue";
import {GraphConfig} from "@/types";
import FunctionCard from "@/components/FunctionCard.vue";

const getMaxX = useGetMaxX();

const firstChannel = computed(() => {
  return getChannel('sine', 2);
});
const secondChannel = computed(() => {
  return getChannel('triangle', 2.5);
});
const thirdChannel = computed(() => {
  return getChannel('fairlyRandom', 3);
});

const amCombined: ValueFunction = (x) => sum(
  [firstChannel, secondChannel, thirdChannel].map((channel) => channel.value.amSignal(x))
);
const amCombinedConfig = computed<GraphConfig>(() => ({
  functions: [
    { function: amCombined },
  ],
  getMaxX,
  unitWidth: 30,
  unitHeight: 15,
  yRange: { min: -5, max: 5 },
  baselines: [
    { y: 0 },
  ],
}));
</script>
