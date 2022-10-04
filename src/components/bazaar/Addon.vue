<template>
  <div class="py-4 px-6 w-1/2 md:w-1/4 text-sm" id="item">
    <div
      class="
        p-3
        border-4 border-dark
        hover:shadow
        hover:border-primary
        cursor-pointer
        rounded-lg
        flex flex-col
        items-center
        justify-between
        relative
      "
    >
      <div v-if="addon.owned != null" class="absolute top-0 right-0 m-2">
        x{{ addon.owned }}
      </div>
      <div>
        {{ addon.name }}
      </div>
      <!-- {{ addon.id }} -->
      <img :src="addon.img" class="h-24" />

      <ul class="text-center flex flex-col space-y-3 mt-4">
        <li class="mt-4">
          <div class="flex items-center -mx-1 justify-center">
            <div class="w-2/3">
              <div class="border rounded border-dark">
                <div
                  class="bg-primary py-2 text-sm"
                  :style="{ width: `${addon.requiredhp}%` }"
                ></div>
              </div>
            </div>
          </div>
        </li>
        <!-- <li>Rarity: adds {{ addon.rarity }}</li> -->
        <li class="text" v-if="toBuy">{{ addon.description }}</li>
        <!-- <li class="text" v-if="toBuy">
          {{ parseInt(addon.quantity) - parseInt(addon.used) }} left
        </li> -->
      </ul>

      <button
        v-if="toBuy"
        v-on:click="onBuyClicked()"
        class="btn flex items-center justify-center mt-6 focus:outline-none"
      >
        <span v-if="addon.price == 'TBD'">{{ addon.price }}</span>
        <span v-else class="px-1 text-md"
          >{{ addon.price }} MILK
          <span v-if="addon.cudl > 0"> + {{ addon.cudl }} CUDL</span></span
        >
      </button>

      <button
        v-if="toUse && currentHP >= parseInt(addon.requiredhp)"
        v-on:click="onUseClicked()"
        class="
          btn
          flex
          items-center
          justify-center
          -mx-1
          w-32
          focus:outline-none
        "
      >
        <span class="px-1 inline-block text-lg">Attach</span>
      </button>

      <button
        v-if="toUse && currentHP < parseInt(addon.requiredhp)"
        class="
          btn
          flex
          items-center
          justify-center
          -mx-1
          w-auto
          focus:outline-none
        "
      >
        <span class="px-1 inline-block text-lg" to="/play"
          >{{ addon.requiredhp }} HP Required</span
        >
      </button>

      <button
        v-if="toRemove && addon.detachable"
        v-on:click="onRemoveClicked()"
        class="
          btn
          flex
          items-center
          justify-center
          -mx-1
          w-32
          focus:outline-none
        "
      >
        <span class="px-1 inline-block text-lg" to="/play">Remove</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Addon",
  components: {},
  props: {
    addon: Object,
    toUse: Boolean,
    toRemove: Boolean,
    toBuy: Boolean,
    currentHP: Number,
  },
  data: function () {
    return {};
  },
  methods: {
    onBuyClicked: function () {
      this.$emit("buy-clicked", this.addon.id, this.addon);
    },
    onUseClicked: function () {
      this.$emit("use-clicked", this.addon.id, this.addon);
    },
    onRemoveClicked: function () {
      this.$emit("remove-clicked", this.addon.id, this.addon);
    },
  },
  beforeMount: function () {},
  mounted: function () {},
};
</script>
