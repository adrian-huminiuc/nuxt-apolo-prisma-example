<template>
  <span>
    <ArrowUpIcon class="h-5 w-5" v-if="direction === SortDirection.ASC" />
    <ArrowDownIcon class="h-5 w-5" v-else />
  </span>
</template>

<script setup lang="ts">
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/vue/24/solid";
import { SortDirection } from "~/models/SortDirection";

defineProps({
  direction: {
    type: String,
    required: true,
  },
});
</script>
