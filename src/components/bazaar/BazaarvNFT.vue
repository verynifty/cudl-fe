<template>
  <div
    style="width: 150px"
    id="BazaarvNFT"
    class="
      p-4
      border-2
      rounded
      border-primary
      hover:border-dark
      cursor-pointer
      flex flex-col
      items-center
    "
    v-on:click="onClicked()"
    v-bind:class="{ 'border-dark': isSelected, 'border-primary': !isSelected }"
  >
    <img :src="nft.image_url" alt class="h-24" />
    <div class="text-center">{{ nft.id }}</div>
    <div class="text-center">Score: {{ nft.score }}</div>
    <div class="text-center">HP: {{ hp }}</div>
    <div class="text-center">Rarity: {{ rarity }}</div>
    <div class="w-full">
      <div class="w-full">
        <div class="border rounded border-dark">
          <div
            class="bg-primary py-2 text-sm"
            :style="{ width: `${hp}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BazaarvNFT",
  components: {},
  props: {
    nftId: String,
    isSelected: Boolean,
  },
  data: function () {
    return {
      nft: {},
      hp: 0,
      rarity: 0,
    };
  },
  methods: {
    onClicked: function () {
      this.$emit("on-clicked", this.nftId);
    },
  },
  beforeMount: async function () {
    const { data } = await axios(
      `https://gallery.verynifty.io/api/nft/${this.nftId}`
    );
    let vnftxData = await this.$store.state.vNFTxContract.methods
      .getVnftInfo(this.nftId)
      .call();
    this.rarity = parseInt(vnftxData._rarity);
    this.hp = parseInt(vnftxData._hp);
    this.nft = data;
  },
  mounted: function () {},
};
</script>