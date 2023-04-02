<template>
  <div class="col-span-full">
    <div class="form-control">
      <label class="label text-sm">{{ $t(label) }}</label>
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>
