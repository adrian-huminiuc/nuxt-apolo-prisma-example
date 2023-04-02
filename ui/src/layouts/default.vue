<template>
  <div class="mx-auto max-w-8xl py-8 sm:px-6 lg:px-8">
    <slot />
  </div>
</template>
<script setup>
useHead({
  htmlAttrs: {
    "data-theme": "lofi",
  },
  link: [{ rel: "icon", type: "image/png", href: "/favicon-32x32.png" }],
});
</script>
