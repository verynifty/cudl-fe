<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <router-link to="/play" class="justify-end">
        <img
          src="@/assets/img/icons/heart-box.svg"
          class="h-8 cursor-pointer"
        />
      </router-link>
      <a href="/weapons">
        <img
          src="https://cdns.iconmonstr.com/wp-content/assets/preview/2018/240/iconmonstr-boxing-2.png"
          alt=""
          class="h-8 cursor-pointer"
        />
      </a>
    </div>

    <div
      class="mb-6 leading-loose tracking-widest flex flex-col justify-center"
    >
      <!-- <span class="">
                1 - Approve (only once) our contract as caretaker for every Pet
                you want to multi feed or multi mine.</span
              >
              <span class="">
                2 - Next time you can multi mine and multi feed with one tx
              </span> -->
    </div>

    <table class="table-auto w-full border border-gray-900">
      <thead>
        <tr>
          <th class="px-4 py-2">Pet</th>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Can Mine</th>
          <th class="px-4 py-2">TOD</th>
          <th class="px-4 py-2">Food</th>
        </tr>
      </thead>
      <tbody
        class="border border-gray-900"
        v-for="nft in nfts"
        :key="nft.pet_id"
      >
        <tr class="cursor-pointer">
          <td class="border border-gray-900 px-4 py-2">
            <router-link :to="`/nft/${nft.pet_id}`">
              <img
                v-bind:src="nft.image"
                alt="NFT"
                class="object-contain h-24 m-0 m-auto"
                style
              />
            </router-link>
          </td>
          <td class="border border-gray-900 px-4 py-2">
            <router-link :to="`/nft/${nft.pet_id}`">
              <span class="hidden md:inline-block"> #{{ nft.pet_id }}</span>
              <span class="md:hidden">#{{ nft.pet_id }}</span>
            </router-link>
          </td>
          <td class="border border-gray-900 px-4 py-2" v-if="checkCanMine(nft)">
            <div class="flex justify-center space-x-4 items-center">
              <div>{{ checkCanMine(nft) }}</div>
              <div class="tooltip">
                <span class="tooltiptext">Toggle to mine with it.</span>
                <input type="checkbox" id="mine" :data-id="nft.pet_id" />
              </div>
            </div>
          </td>
          <td
            class="border border-gray-900 px-4 py-2"
            v-if="!checkCanMine(nft)"
          >
            In

            <countdown
              :end-time="
                (parseInt(new Date(nft.last_time_mined).getTime() / 1000) +
                  60 * 60 * 24) *
                1000
              "
            >
              <template v-slot:process="{ timeObj }">
                <span>
                  {{ `${timeObj.h}:${timeObj.m}:${timeObj.s}` }}
                </span>
              </template>
              <template v-slot:finish>
                <span>Done!</span>
              </template>
            </countdown>
          </td>
          <td class="border border-gray-900 px-4 py-2">
            <span v-if="nft.is_alive">
              <countdown :end-time="Math.floor(new Date(nft.tod).getTime())">
                <span slot="process" slot-scope="{ timeObj }">
                  {{
                    `${timeObj.d} days and ${timeObj.h}:${timeObj.m}:${timeObj.s}`
                  }}
                </span>
                <span slot="finish">Dead!</span>
              </countdown>
            </span>

            <span v-else>Dead</span>
          </td>
          <td class="border border-gray-900 px-4 py-2">
            <div
              class="
                w-full
                md:w-full
                px-3
                mb-6
                md:mb-0
                m-0 m-auto
                flex
                -mx-2
                items-center
              "
            >
              <div class="relative px-2 w-full">
                <select
                  class="
                    text-center
                    block
                    appearance-none
                    w-full
                    bg-gray-200
                    border border-gray-200
                    text-gray-700
                    py-3
                    px-4
                    pr-8
                    rounded
                    leading-tight
                    focus:outline-none focus:bg-white focus:border-gray-500
                    feed-gem
                  "
                  id="grid-state"
                  :data-nftid="nft.pet_id"
                >
                  <option value="null">Don't feed</option>
                  <option value="1">
                    Bananuman: 2d tod, 100 points, 0.5$CUDL
                  </option>
                  <option value="2">
                    Catnip: 1.5d tod, 190 points, 0.6$CUDL
                  </option>
                  <option value="3">Cucombre: 4d tod, 1 point, 2$CUDL</option>
                  <option value="4">
                    Moon Milk: 2d tod, 1300 point, 5$CUDL
                  </option>
                  <option value="5">
                    Thicc Duck: 3d tod, 50 points, 0.8$CUDL
                  </option>
                  <option value="6">Tuna: 5d tod, 2700 points, 10$CUDL</option>
                </select>
                <div
                  class="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    flex
                    items-center
                    px-2
                    text-gray-700
                  "
                >
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const axios = require("axios").default;
import Address from "@/components/Address.vue";

export default {
  name: "NFTTools",
  components: { Address },
  props: {
    nfts: Array,
  },
  data: function () {
    return {
      timeUntilStarving: 0,
      canMineTime: 0,
      isLoaded: false,
    };
  },
  methods: {
    checkCanMine: function (nft) {
      var a = new Date(nft.last_time_mined);

      console.log("nft.pet_id ", nft.pet_id);
      console.log(a.getTime() / 1000 + 60 * 60 * 24);

      return (
        parseInt(a.getTime() / 1000) + 60 * 60 * 24 <
        new Date().getTime() / 1000
      );
    },
  },
  beforeMount: function () {},
  mounted: function () {
    // console.log("nft ", this.nft);
    // console.log((parseInt(this.nft._lastTimeMined) + 60 * 60 * 24) * 1000);
  },
  watch: {},
  created: function () {},
  computed: {},
};
</script>
<style scoped>
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  font-size: 12px;
  top: -5px;
  right: 105%;
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>