<template>
  <section>
    <div
      class="border-2 rounded-t-md -mb-4 pb-4 w-fit bg-gray-300"
      :class="{
        'select-none cursor-pointer': !!headerClick,
      }"
      @click="headerClick?.()"
    >
      <h4 class="px-4">
        {{ label }}
      </h4>
    </div>
    <div class="border-2 rounded-md bg-white">
      <slot />
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
  headerClick?: (() => void) | undefined;
}>();
</script>
