<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" @click="$emit('close')">
        <div class="modal-container">
          <div class="modal-header flex justify-between items-center mb-12">
            <slot name="header ">
              <h1 class="text-xl">
                Choose Your Racer & pay the 3 CUDL to join
              </h1>
              <button
                @click="$emit('close')"
                class="
                  hover:text-gray-900
                  text-dark text-4-xl text-md
                  focus:outline-none
                "
              >
                X
              </button>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div
                class="
                  md:flex-wrap
                  my-4
                  md:-mx-4 md:-my-4
                  flex
                  md:flex-row
                  flex-col
                  items-center
                  justify-start
                "
              >
                <div
                  class="w-full text-center text-2xl font-semibold"
                  v-if="ownerNFTs.length == 0"
                >
                  You don't have any Cudl Pets NFTs in your wallet.
                </div>
                <div
                  class="
                    py-4
                    md:py-0
                    md:px-4
                    mb-4
                    md:mb-8
                    md:w-1/4
                    flex
                    items-center
                    flex-col
                  "
                  v-for="nft in ownerNFTs"
                  v-bind:key="nft.key"
                >
                  <img
                    :src="nft.image"
                    alt
                    class="
                      w-24
                      h-24
                      mb-2
                      rounded-full
                      bg-orange-100
                      object-cover
                    "
                    loading="lazy"
                    style="min-width: 10rem; min-height: 10rem"
                  />
                  <p class="mb-2 text-center">
                    <span v-if="nft.name">
                      {{ nft.name.slice(0, 10).toUpperCase() }}..</span
                    >
                    <span v-else>
                      {{ nft.key.slice(0, 10).toUpperCase() }}..</span
                    >
                  </p>

                  <button
                    class="
                      border-2 border-gray-900
                      bg-gray-900 bg-opacity-100
                      hover:text-gray-900
                      hover:bg-white
                      text-white
                      py-2
                      px-3
                      mt-2
                      text-md
                    "
                    @click.stop="
                      enterRace(nft.contractOrigin, nft.idOrigin, nft.type)
                    "
                  >
                    Enter race
                  </button>
                </div>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <!-- foter -->
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  components: {},
  props: {
    text: String,
    ownerNFTs: Array,
  },
  data: function () {
    return {
      hasTokenApproval: false,
    };
  },
  methods: {
    enterRace: async function (contract, nftId, type) {
      console.log(contract, nftId);
      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.NFTRace
            )
            .call()
        ).length >= 18;
      if (!this.hasTokenApproval) {
        await this.approve();
      }
      let send = await this.$store.state.NFTRace.methods
        .joinRace(contract, nftId)
        .send({
          from: this.$store.state.account,
        });

      this.$emit("close");
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let approve = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.NFTRace, max)
        .send({
          from: this.$store.state.account,
        });
    },
  },
  mounted: function () {
    console.log("owned nfts ", this.ownerNFTs);
  },
  beforeMount: function () {},
  watch: {},
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-height: calc(100vh - 80px);

  overflow-y: auto;
  width: 70%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

@media (max-width: 768px) {
  .modal-container {
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    /* margin: 0; */

    width: 80%;
  }
}
</style>
