<template>
  <div class="mint text-white">
    <div class="text-xl md:text-2xl text-center mt-16 px-4 md:px-0">
      <div class="text-3xl animate-pulse">Farm to earn CUDL</div>
      <div class="">
        The farm gives out 100 $CUDL a day shared between all liquidity
        providers
      </div>
    </div>
    <div
      class="
        flex flex-col
        md:flex-row
        md:space-x-10
        md:justify-center
        items-start
        mt-6
        text-center
      "
      style=""
    >
      <Stake
        title="CUDL-ETH LP"
        poolId="0"
        lpToken="0xeff704f96bc14185c51d78d200baa1f65121f67b"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Number from "@/components/Number.vue";
import Stake from "@/components/Stake.vue";
export default {
  name: "Farm",
  components: {
    Number,
    Stake,
  },
  data: function () {
    return {};
  },
  mounted: function () {},
  created: function () {},
  methods: {},
};
</script>