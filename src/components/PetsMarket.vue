<template>
  <div class="MyAccessories md:px-0 px-2">
    <button class="btn hidden" @click="showModal = true">
      <span> Sell My Pet </span>
    </button>
    <!-- <div class="flex items-center justify-center">
      <div
        class="md:w-1/3 w-4/5 p-3 md:px-3"
        v-for="nft in nfts"
        :key="nft._pet"
      >
        <NftListing :nft="nft" />
      </div>
    </div> -->

    <div class="text-center">
      You will get a randomly generated CUDL pet after you purchase.
    </div>

    <div class="flex items-center justify-center">
      <div class="md:w-1/3 w-4/5 p-3 md:px-3">
        <div class="text-center mb-4">Sold: {{ sold }} / 2000</div>

        <NftListing />
      </div>
    </div>

    <Modal
      v-if="showModal"
      @close="showModal = false"
      class="text-gray-900"
      :title="`List your Pet for Sale`"
    >
      <div slot="body">
        <div class="mb-4">
          <h2 class="mb-4">Select Pet</h2>
          <div class="justify-between flex">
            <div class="border p-4">sd</div>
            <div class="border p-4">asd</div>
            <div class="border p-4">sds</div>
          </div>
        </div>

        <div class="flex items-center mb-4 space-x-2">
          <div>Price:</div>
          <input type="text" class="border focus:outline-none" />
        </div>
        <button class="btn mb-4">List</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BazaarvNFT from "@/components/bazaar/BazaarvNFT.vue";
import Addon from "@/components/bazaar/Addon.vue";
import NftListing from "@/components/bazaar/NftListing.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "PetsMarket",
  props: {},
  components: { Modal, BazaarvNFT, Addon, NftListing },
  data: function () {
    return {
      showModal: false,
      balance: "",
      contract: null,
      nfts: [],
      selectedAccessories: [],
      availableAccessories: [],
      selectedNFt: "",
      currentHP: 0,
      lockedAddons: [1, 4],
      isLoading: false,
      isLoaded: false,
      sold: 0,
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
      console.log(
        this.$store.state.web3 == null,
        this.isLoading,
        this.isLoaded
      );
      if (this.$store.state.web3 == null || this.isLoading || this.isLoaded) {
        return;
      }
      this.isLoading = true;

      this.sold = await this.$store.state.DistributePets.methods.sold().call();

      console.log(this.$store.state.account);

      let nfts = [];
      const pets = await axios(
        `https://api.nft20.io/cudl/owner/${this.$store.state.account}`
      );

      if (pets.data.petsOwned.length > 0) {
        for (const pet of pets.data.petsOwned) {
          const { data } = await axios(
            `https://api.mooncat.community/traits/${pet.nft_id}`
          );

          pet.image = data.image;
          console.log("ADDING", pet);
          this.nfts.push(pet);
        }
      }
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
