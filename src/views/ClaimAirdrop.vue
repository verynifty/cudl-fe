<template>
  <div class="home">
    <ConnectWallet />

    <div :v-if="isConnected">
      <div class="md:w-1/3 px-3">
        <div
          class="rounded flex justify-center items-center border-2 p-4 border-gray-900 flex-col shadow-xl bg-white bg-opacity-50"
        >
          Hey!
          <br />
          Your NFT with ID {{id}} is ready for you! Just claim it using the button.
          <div class="card" style="margin: 1rem; padding: 1rem;">
            Details
            <b-field label="ID">
              <b-input v-model="id" placeholder="Disabled" disabled></b-input>
            </b-field>
            <b-field label="Key">
              <b-input v-model="key" placeholder="Disabled" disabled></b-input>
            </b-field>
          </div>
          <button
            v-if="isClaimable"
            class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-2 px-3 mt-6 text-md"
            v-on:click="claim()"
          >Claim</button>
          <p v-if="!isClaimable">This NFT was already claimed.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConnectWallet from "@/components/ConnectWallet.vue";

export default {
  name: "Claim",
  components: { ConnectWallet },
  data: function() {
    return {
      id: "",
      key: "",
      isClaimable: true
    };
  },
  created: async function() {
    console.log("CLAIM");
    this.id = this.$route.params.id;
    this.key = this.$route.params.key;
    this.isClaimable = await this.checkIfClaimable();
  },
  methods: {
    keyAsParameter: function() {
      return this.key.split("J");
    },
    claim: async function() {
      console.log("CLAIM");
      if (this.$store.state.web3 == null) {
        return;
      }
      /* logic to claim */
      // frst use gas estimate to see if correct
      // then do the transaction
      this.isClaimable = await this.checkIfClaimable();
      if (this.isClaimable) {
        let claim = await this.$store.state.AirdropperContract.methods
          .claim(this.id, this.keyAsParameter())
          .send({
            from: this.$store.state.account
          });
        this.checkIfClaimable();
      }
    },
    checkIfClaimable: async function(id, key) {
      if (this.$store.state.web3 == null) {
        return false;
      }
      let res = await this.$store.state.AirdropperContract.methods
        .isClaimed(this.id)
        .call();
      return !res;
    }
  },
  computed: {
    isConnected: function() {
      return this.$store.state.web3 != null;
    }
  },
  watch: {
    isConnected: async function() {
      this.isClaimable = await this.checkIfClaimable();
    }
  }
};
</script>
