<template>
  <div class="container">
    {{ t1 }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      t1: `
      There are <b>t</b> items
   in your basket, <em>b</em>
  are on sale!
      `,
      t2: `
      forof
      dd
      `
    }
  }
}
</script>
