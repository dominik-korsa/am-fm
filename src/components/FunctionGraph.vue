<template>
  <div ref="wrapper" class="w-full select-none">
    <canvas ref="canvas" :width="width" :height="height" />
  </div>
</template>

<script lang="ts" setup>
import {nextTick, ref, watch} from "vue";
import type {GraphConfig, Pos, ValueRange} from "@/types";
import {computedEager, useElementSize, useRafFn} from "@vueuse/core";
import {getValue, lerp, mapValue, spanOf} from "@/utils";

const props = defineProps<{
  config: GraphConfig;
}>();
const yMargin = 12;

const wrapper = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();

const { width } = useElementSize(wrapper, { width: 100, height: 0 });
const height = computedEager(() => Math.round(
  spanOf(props.config.yRange) * props.config.unitHeight + yMargin * 2
));

watch([width, height], () => {
  nextTick(update);
});

const update = () => {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;

  const { width, height } = ctx.canvas;

  const screenXRange: ValueRange = { min: 0, max: width };
  const screenYRange: ValueRange = { min: height - yMargin, max: yMargin };

  let xRange: ValueRange;
  if ('xRange' in props.config) xRange = getValue(props.config.xRange);
  else {
    const max = props.config.getMaxX();
    const min = max - width / props.config.unitWidth;
    xRange = { min, max };
  }

  const mapPos = (pos: Pos): Pos => [
    mapValue(pos[0], xRange, screenXRange),
    mapValue(pos[1], props.config.yRange, screenYRange),
  ]

  ctx.clearRect(0, 0, width, height);

  props.config.baselines.forEach((baseline) => {
    ctx.save();
    ctx.lineWidth = 1 ;
    ctx.strokeStyle = baseline.color ?? '#0003';
    ctx.beginPath();
    const screenY = mapValue(baseline.y, props.config.yRange, screenYRange);
    ctx.moveTo(0, screenY);
    ctx.lineTo(width, screenY);
    ctx.stroke();
    ctx.restore();
  })

  // const withTransform = (callback: () => void) => {
  //   ctx.save();
  //   ctx.setTransform(getMatrix(xRange, props.config.yRange, screenXRange, screenYRange));
  //   callback();
  //   ctx.resetTransform();
  // };

  props.config.functions.forEach(({ function: f, width, color }) => {
    ctx.save();
    ctx.lineWidth = width ?? 1.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color ?? 'black';
    ctx.beginPath();
    if (typeof f === 'function') {
      let t = 0;
      const getPos = (): [number, number] => {
        const x = lerp(t, xRange);
        return mapPos([x, f(x)]);
      }
      ctx.moveTo(...getPos());
      const step = 0.5 / spanOf(screenXRange);
      do {
        t = Math.min(1, t + step);
        ctx.lineTo(...getPos());
      } while (t != 1);
    } else {
      f.update(xRange);
      ctx.moveTo(...mapPos(f.first()));
      for (const point of f.secondGenerator()) {
        ctx.lineTo(...mapPos(point));
      }
    }
    ctx.stroke();
    ctx.restore();
  });
}

useRafFn(update);
</script>
