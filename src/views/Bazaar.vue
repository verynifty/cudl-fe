<template>
  <div class="martket py-6 text-white">
    <div class="m-auto m-0">
      <h1 class="text-center text-2xl flex items-center justify-center -mx-3">
        <img src="@/assets/img/addons/market.svg" class="h-8 px-3" />
        <span class="px-3">{{ showMine ? "Pets Market" : "Milk Market" }}</span>
        <img src="@/assets/img/addons/market.svg" class="h-8 px-3" />
      </h1>
    </div>

    <div>
      <div class="">
        <div class="text-xl p-2 mt-4 flex items-center justify-end">
          <!-- <div class="">{{ showMine ? "My Accessories" : "Market" }}</div> -->
          <div
            class="
              mr-8
              flex
              items-center
              md:justify-start
              md:ml-2
              justify-center
              space-x-6
              text-sm
              border-4 border-black
              pl-3
              pt-3
              bg-yellow-400
              text-black
              hidden
              boxShadow
            "
          >
            <div class="uppercase font-bold">
              <span>Milk: </span><span class="number">{{ milk }}</span>
            </div>
            <!-- <div data-v-17d8fd80="" class="uppercase font-bold">
              <span data-v-17d8fd80="">Milk Used: </span
              ><span data-v-56c2960e="" data-v-17d8fd80="" class="number"
                >37.5714</span
              >
            </div> -->
          </div>
          <div>
            <button class="btn hidden">
              <router-link to="/milk"> Get Milk </router-link>
            </button>
            <button class="btn" @click="toggleView">
              <span v-if="!showMine"> Pets Market </span>
              <span v-else> Addon Market </span>
            </button>
          </div>
        </div>
        <div v-if="showMarket">
          <Market />
        </div>
        <div v-if="showMine">
          <PetsMarket />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Market from "../components/Market.vue";
import MyAccessories from "../components/MyAccessories.vue";
import PetsMarket from "../components/PetsMarket.vue";
export default {
  components: { Market, MyAccessories, PetsMarket },
  data: function () {
    return {
      showMarket: true,
      showMine: false,
      milk: 0,
    };
  },
  methods: {
    milkBalance: async function () {
      const earned = await this.$store.state.Milk.methods
        .earned(this.$store.state.account)
        .call();

      this.milk = parseInt(earned / 1e8) / 1e10;
    },
    toggleView: function (tab) {
      this.showMarket = !this.showMarket;
      this.showMine = !this.showMine;
    },
  },
  mounted: async function () {
    if (this.$route.query.buy) {
      this.toggleView();
    }
  },
  beforeMount: async function () {
    await this.milkBalance();
  },
};
</script>
