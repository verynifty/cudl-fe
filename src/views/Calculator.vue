<template>
  <div class="calc text-white">
    <h1 class="text-3xl text-center mt-6">Calculate levels & rewards</h1>
    <div class="mt-12">
      <div
        class="
          flex
          md:flex-row
          flex-col
          items-center
          jutify-center
          -mx-4
          text-xl
          w-full
        "
      >
        <div class="px-4 flex items-center -mx-4">
          <span class="px-4">Level:</span>
          <div class="px-4">
            <input
              v-model="level"
              type="number"
              placeholder="Your level"
              class="
                border-2 border-gray-900
                bg-white bg-opacity-100
                text-gray-900
                py-2
                px-3
                text-md
              "
            />
          </div>
        </div>

        <div class="px-4">
          Reward: <span class="text-xl">{{ calcReward }}</span>
        </div>

        <div class="px-4">
          Points needed: <span class="text-xl">{{ pointsNeeded }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
      level: 2,
      score: 0,
    };
  },
  methods: {},
  mounted: function () {},
  computed: {
    // a computed getter
    calcReward: function () {
      if (this.level < 2) return 0.6;
      return ((this.level * 6) / 7 + 5).toFixed(2) / 10;
    },
    pointsNeeded: function () {
      return ((this.level * this.level) / 8) * 100;
    },
  },
};
</script>
