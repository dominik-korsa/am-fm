<template>
  <function-card :label="`Kanał ${channel.frequency} Hz`" class="w-0 grow">
    <function-graph :config="soundConfig" />
    <function-graph :config="amSignalConfig" class="mt-2" />
  </function-card>
</template>
<script setup lang="ts">
import FunctionCard from "@/components/FunctionCard.vue";
import type {Channel} from "@/types";
import {computed} from "vue";
import {GraphConfig} from "@/types";
import FunctionGraph from "@/components/FunctionGraph.vue";

const props = defineProps<{
  channel: Channel;
  getMaxX: () => number;
}>();

const unitWidth = 30;

const soundConfig = computed<GraphConfig>(() => ({
  functions: [
    { function: props.channel.sound, color: '#3A7E70' },
  ],
  getMaxX: props.getMaxX,
  unitWidth,
  unitHeight: 20,
  yRange: { min: -1, max: 1 },
  baselines: [
    { y: 1 },
    { y: 0 },
    { y: -1 },
  ],
}));

const amSignalConfig = computed<GraphConfig>(() => ({
  functions: [
    { function: props.channel.amSignal },
  ],
  getMaxX: props.getMaxX,
  unitWidth,
  unitHeight: 15,
  yRange: { min: -2, max: 2 },
  baselines: [
    { y: 2 },
    { y: 1 },
    { y: 0 },
    { y: -1 },
    { y: -2 },
  ],
}));
</script>
