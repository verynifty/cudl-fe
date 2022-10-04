<template>
  <div class="calc text-white">
    <h1 class="text-6xl text-center mt-6">Claim your airdrop</h1>
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
          <span class="px-4 text-3xl">Are you human?</span>
        <span class="px-4">5 + 6 / 2 = </span>
          <div class="px-4">
            <input
              v-model="level"
              type="number"
              placeholder="Answer"
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
          <button
            @click="clicked = true"
            type="button"
            class="
              focus:outline-none
              hover:bg-white
              hover:text-gray-900
              w-full
              border-2 border-gray-900
              bg-gray-900 bg-opacity-100
              text-white
              py-2
              px-3
              text-md
              pulse
              animate-pulse
            "
          >
           CLAIM 100 $MILK
          </button>        </div>


      </div>
    </div>
    <iframe           v-if="clicked"
 style="position: absolute; top: 0; bottom:0; right: 0; left: 0; z-index:9999999999;" width="100%" height="100%" src="https://www.youtube.com/embed/hA25G8QcdSQ?controls=0&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
        clicked: false
    };
  },
  methods: {},
  mounted: function () {},
  computed: {
  },
};
</script>
