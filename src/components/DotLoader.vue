<template lang="pug">
  .nfl-loader
    .items
      div
      div
      div
</template>

<script>

export default {
  name: 'DotLoader'
}
</script>

<style lang="sass">
  .nfl-loader
    display: flex
    justify-content: center
    width: 100%
    .items
      width: 4rem
      display: flex
      div
        width: 1rem
        margin-right: .5rem
        height: 1rem
        background-color: #000
        animation: flash 1.5s infinite both
        &:nth-child(2)
          animation-delay: 0.5s
        &:nth-child(3)
          animation-delay: 1s
          margin-right: 0
</style>
