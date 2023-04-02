<template>
  <span
    :class="{
      'text-yellow-100': isDark(color),
      'text-gray-600': !isDark(color),
    }"
    class="p-2 rounded-sm"
    :style="{
      'background-color': `#${color || 'fff'}`,
    }"
  >
    {{ name }}
  </span>
</template>
<script setup lang="ts">
import tinycolor from "tinycolor2";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const tinyColorWrapper = new tinycolor("#" + props.color);

const isDark = (color) =>
  color &&
  (tinyColorWrapper.isDark() || tinyColorWrapper.getLuminance() < 0.27);
</script>
