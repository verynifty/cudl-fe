<template>
  <div class="MyAccessories md:px-0 px-2">
    <div class="flex items-center flex-wrap mt-4">
      <div
        class="flex items-center justify-start -mx-4 w-full overflow-x-auto"
        id="vnfts"
      >
        <div class="px-4" v-for="nft in nfts" :key="nft">
          <BazaarvNFT
            :nftId="nft"
            :isSelected="nft == selectedNFt"
            v-on:on-clicked="onNFTClicked"
          />
        </div>
      </div>
      <div class="mt-12 w-full text-lg">
        <div class="text-center text-2xl">
          Pet #{{ selectedNFt }} Accessories
        </div>
        <div v-if="selectedAccessories.length > 0" class="flex">
          <Addon
            :key="addon_index"
            :addon="addon"
            :toRemove="true"
            v-on:remove-clicked="removeClicked"
            v-for="(addon, addon_index) in selectedAccessories"
          />
        </div>
        <p class="mt-3" v-if="selectedAccessories.length == 0">
          Poor #{{ selectedNFt }}!
          <router-link to="/bazaar" class="text-primary">buy him </router-link
          >an accessory.
        </p>
      </div>
      <div class="mt-10 w-full text-lg">
        <div class="text-center text-2xl">Unused Accessories</div>
        <div v-if="availableAccessories.length > 0" class="flex">
          <Addon
            :key="addon_index"
            :addon="addon"
            :toUse="notAlreadyEquiped(addon.id)"
            :currentHP="currentHP"
            v-for="(addon, addon_index) in availableAccessories"
            v-on:use-clicked="useClicked"
          />
        </div>
        <p class="mt-3" v-if="availableAccessories.length == 0">
          You don't have any unused accessory,
          <router-link to="/bazaar" class="text-primary">Buy now</router-link>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import BazaarvNFT from "@/components/bazaar/BazaarvNFT.vue";
import Addon from "@/components/bazaar/Addon.vue";

export default {
  name: "MyAccessories",
  props: {},
  components: { BazaarvNFT, Addon },
  data: function () {
    return {
      balance: "",
      contract: null,
      nfts: [],
      selectedAccessories: [],
      availableAccessories: [],
      selectedNFt: "",
      currentHP: 0,
      lockedAddons: [1, 4],
    };
  },
  methods: {
    initialize: async function () {
      this.fetchNFTS();
      this.fetchAvailableAccessories();
    },
    removeClicked: async function (addonId) {
      console.log("remove");
      console.log(addonId);
      let nft = this.selectedNFt;
      let removetx = await this.$store.state.vNFTxContract.methods
        .removeAddon(nft, addonId)
        .send({
          from: this.$store.state.account,
        });

      this.onNFTClicked(nft);
      this.fetchAvailableAccessories();
    },
    useClicked: async function (addonId) {
      console.log("use");
      console.log(addonId);
      let nft = this.selectedNFt;
      console.log("nft", nft);
      confirm(`You are about to use this addon for pet #${this.selectedNFt}`);

      let approval = await this.$store.state.NiftyAddonsContract.methods
        .isApprovedForAll(
          this.$store.state.account,
          this.$store.state.contracts.vNFTx
        )
        .call();
      if (!approval) {
        let approval_tx = await this.$store.state.NiftyAddonsContract.methods
          .setApprovalForAll(this.$store.state.contracts.vNFTx, true)
          .send({ from: this.$store.state.account });
      }
      let useTx = await this.$store.state.vNFTxContract.methods
        .useAddon(nft, addonId)
        .send({
          from: this.$store.state.account,
        });

      this.onNFTClicked(nft);
      this.fetchAvailableAccessories();
    },
    onNFTClicked: async function (nftID) {
      console.log(nftID);
      this.selectedNFt = nftID;
      this.selectedAccessories = [];

      let addonNumber = await this.$store.state.vNFTxContract.methods
        .addonsBalanceOf(nftID)
        .call();

      for (let index = 0; index < parseInt(addonNumber); index++) {
        let id = await this.$store.state.vNFTxContract.methods
          .addonsOfNftByIndex(nftID, index)
          .call();
        let addon = await this.$store.state.vNFTxContract.methods
          .addon(id)
          .call();
        addon.id = id;
        addon.detachable = !this.lockedAddons.includes(parseInt(id));
        this.selectedAccessories.push(addon);
      }
      let vnftxData = await this.$store.state.vNFTxContract.methods
        .getVnftInfo(this.selectedNFt)
        .call();
      this.currentHP = parseInt(vnftxData._hp);
    },
    fetchNFTS: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      this.listSize = await this.$store.state.vNFTContract.methods
        .balanceOf(this.$store.state.account)
        .call();
      let tokens = [];
      for (let index = 0; index < this.listSize; index++) {
        let id = await this.$store.state.vNFTContract.methods
          .tokenOfOwnerByIndex(this.$store.state.account, index)
          .call();
        tokens.push(id);
      }
      this.nfts = tokens;
      this.onNFTClicked(tokens[0]);
    },
    fetchAvailableAccessories: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      let atokens = [];
      this.availableAccessories = [];
      let MAX_ID = 10; //TODO NEED TO HAVE A GETTER FOR COUNTER IN SMART CONTRACT
      for (let index = 0; index < MAX_ID; index++) {
        let listSize = await this.$store.state.NiftyAddonsContract.methods
          .balanceOf(this.$store.state.account, index)
          .call();
        if (parseInt(listSize) > 0) {
          let addon = await this.$store.state.vNFTxContract.methods
            .addon(index)
            .call();
          addon.owned = listSize;
          addon.id = index;
          atokens.push(addon);
        }
      }
      this.availableAccessories = atokens;
    },
    notAlreadyEquiped: function (id) {
      return (
        this.selectedAccessories.filter(
          (addon) => parseInt(addon.id) == parseInt(id)
        ).length == 0
      );
    },
  },
  beforeMount: function () {
    this.initialize();
  },
  watch: {
    isConnected: function () {
      this.initialize();
    },
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#vnfts::-webkit-scrollbar {
  display: none;
}
</style>
