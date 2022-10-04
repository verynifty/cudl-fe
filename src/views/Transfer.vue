<template>
  <div class="mint text-white">
    <div v-if="pets > 0">
      You can claim {{ pets }} pet with the following scores:
      <ul>
        <li v-for="(item, id) in scores" :key="id">
          {{ item }}
        </li>
      </ul>
      <button
        class="
          border
          bg-gray-900
          text-white
          w-1/4
          outline-none
          focus:outline-none
          pt-2
          hover:bg-gray-700
        "
        @click="claim"
      >
        Claim
      </button>
    </div>
    <div v-if="pets == 0">Nothing to claim</div>
  </div>
</template>

<script>
import merkle from "@/assets/merkle/to_arbi.json";
const ethers = require("ethers");

// @ is an alias to /src
export default {
  name: "Transfer",
  components: {},
  data: function () {
    return {
      scores: [],
      pets: 0,
      m: {},
      loading: false,
      CONTRACT: {},
    };
  },
  mounted: async function () {
    await this.init();
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
  created: function () {},
  methods: {
    init: async function () {
      this.$store.commit("setNetworkCheck", true);
      if (this.loading || !this.isConnected) return;
      this.loading = true;
      let m = merkle.find(
        ({ address }) => address === this.$store.state.account
      );
      if (m != null) {
        this.scores = m.scores;
        this.pets = m.scores.length;
        this.m = m;
      } else {
      }

      console.log(m);
    },
    claim: async function () {
      console.log("Claim");
      this.CONTRACT = new this.$store.state.web3.eth.Contract(
        [
          {
            inputs: [
              {
                internalType: "bytes",
                name: "params",
                type: "bytes",
              },
              {
                internalType: "bytes32[]",
                name: "merkleProof",
                type: "bytes32[]",
              },
            ],
            name: "claim",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        "0xf28b9a551c3e5A45ce5B8790Bca77F11602628F0" // TODO change address after deploy
      );
      console.log(this.m.data, this.m.proof);
      await this.CONTRACT.methods.claim(this.m.data, this.m.proof).send({
        from: this.$store.state.account,
      });
    },
    approveCUDLToMigrate: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let minetx = await this.$store.state.CUDL.methods
        .approve("0x8722458C36f9BFE6E2dCf43A5C20efeC18Ecb81a", max)
        .send({
          from: this.$store.state.account,
        });
    },
  },
  watch: {
    isConnected: function () {
      this.init();
    },
  },
};
</script>