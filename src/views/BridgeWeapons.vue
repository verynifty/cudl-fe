<template>
  <div
    class="mint text-white flex justify-center w-1/2 flex-col m-0 m-auto my-10"
  >
    <div v-if="userWeapons.length > 0">
      <div>
        <div>Select Your Weapon to Bridge:</div>

        <div class="flex space-x-2 items-center text-center">
          <div
            v-for="(weapon, i) in userWeapons"
            :key="i"
            class="
              border border-white
              p-4
              cursor-pointer
              hover:bg-white hover:text-gray-900
            "
            @click="selectWeapon(weapon)"
            :class="toBridge == weapon ? 'bg-white text-gray-900' : ''"
          >
            {{ weapon }}
          </div>
        </div>
      </div>
      <div class="hidden">
        Migrate your CUDL (Will be two transactions on Mainnet: Approve and
        Bridge)
      </div>
      <button class="w-full pt-2 my-5 btn" @click="migrate">
        Approve & Bridge to Arbitrum (2 txs)
      </button>
      <div>
        The Weapons will take around 10 minutes to appear in your Arbitrum
        wallet
      </div>
    </div>
    <div v-else>
      <div class="text-center text-2xl">You don't own any weapons</div>
    </div>
  </div>
</template>

<script>
const { Bridge } = require("arb-ts");
const ethers = require("ethers");
import ERC721ABI from "@/assets/ABIS/ERC721";

// @ is an alias to /src
export default {
  name: "Bridge",
  components: {},
  data: function () {
    return {
      scores: [],
      pets: 0,
      m: {},
      loading: false,
      CONTRACT: {},
      toBridge: null,
      userWeapons: [],
      cudlWeapons: null,
    };
  },
  mounted: async function () {
    await this.init();
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
    CUDLToken: function () {
      return this.$store.state.contracts.CUDLMiannet;
    },
  },
  created: function () {},
  methods: {
    init: async function () {
      this.$store.commit("setNetworkCheck", false);
      if (this.loading || !this.isConnected) return;
      this.loading = true;

      this.getUserWeapons();
    },

    approve: async function () {
      let minetx = await this.cudlWeapons.methods
        .setApprovalForAll("0x99f3968A835a068Fd4e961fB8B567f794B29fC12", true)
        .send({
          from: this.$store.state.account,
        })
        .on("transactionHash", (hash) => {
          console.log("hash of tx ", hash);
          // pass the hash to notify to track it
          this.$store.state.notify.hash(hash);
        });
    },
    getUserWeapons: async function () {
      this.cudlWeapons = new this.$store.state.web3.eth.Contract(
        ERC721ABI,
        "0xb191ffba3caf34b39eacd8d63e2acc4b448552d4"
      );

      this.listSize = await this.cudlWeapons.methods
        .balanceOf(this.$store.state.account)
        .call();
      let tokens = [];
      for (let index = 0; index < this.listSize; index++) {
        let id = await this.cudlWeapons.methods
          .tokenOfOwnerByIndex(this.$store.state.account, index)
          .call();
        tokens.push(id);
      }
      console.log("user weapons ", tokens);
      this.userWeapons = tokens;
    },

    selectWeapon: async function (id) {
      this.toBridge = id;
    },
    migrate: async function () {
      let isApprovedForAll = await this.cudlWeapons.methods
        .isApprovedForAll(
          this.$store.state.account,
          "0x99f3968A835a068Fd4e961fB8B567f794B29fC12"
        )
        .call();

      if (!isApprovedForAll) {
        await this.approve();
      }
      const l1Provider = new ethers.providers.JsonRpcProvider(
        "https://eth-mainnet.alchemyapi.io/v2/"
      );
      const l2Provider = new ethers.providers.JsonRpcProvider(
        "https://arb1.arbitrum.io/rpc"
      );

      // This is a random private key that shpuld not be used elsewhere
      const signer = new ethers.Wallet(
        "0x4cf589044a39240806c762dc47829abc21c8123e2e880dd03ce062e728762c4c"
      );

      const l1Signer = signer.connect(l1Provider);
      const l2Signer = signer.connect(l2Provider);
      const bridge = await Bridge.init(l1Signer, l2Signer);

      const MessageSize = 4 + 20 + 32; // func sig + address + amount ?
      const [_submissionPriceWei, nextUpdateTimestamp] =
        await bridge.l2Bridge.getTxnSubmissionPrice(MessageSize);
      console.log(
        `Current retryable base submission price: ${_submissionPriceWei.toString()}`
      );
      const submissionPriceWei = _submissionPriceWei.mul(5);
      const gasPriceBid = await bridge.l2Provider.getGasPrice();
      console.log(`L2 gas price: ${gasPriceBid.toString()}`);

      /**
       * For the gas limit, we'll simply use a hard-coded value (for more precise / dynamic estimates, see the estimateRetryableTicket method in the NodeInterface L2 "precompile")
       */
      const maxGas = 1800252;
      //const maxGas = 100000;

      /**
       * With these three values, we can calculate the total callvalue we'll need our L1 transaction to send to L2
       */
      const callValue = submissionPriceWei.add(gasPriceBid.mul(maxGas));
      console.log(
        `Sending greeting to L2 with ${callValue.toString()} callValue for L2 fees:`
      );

      let BRIDGEL1 = new this.$store.state.web3.eth.Contract(
        BRIDGEL1ABI,
        "0x99f3968A835a068Fd4e961fB8B567f794B29fC12"
      );

      console.log("toBridge ", this.toBridge);
      console.log("submissionPriceWei ", submissionPriceWei.toString());
      console.log("maxGas ", maxGas);
      console.log("gasPriceBid ", gasPriceBid.toString());
      const passMessageTx = await BRIDGEL1.methods
        .sendMsgToL2(this.toBridge, submissionPriceWei, maxGas, gasPriceBid)
        .send({
          // value: callValue,
          value: "3500000000000000",
          from: this.$store.state.account,
        })
        .on("transactionHash", (hash) => {
          console.log("hash of tx ", hash);
          // pass the hash to notify to track it
          this.$store.state.notify.hash(hash);
        });
      const setGreetingRec = await passMessageTx.wait();

      console.log(
        `Greeting txn confirmed on L1! 🙌 ${setGreetingRec.transactionHash}`
      );

      /**
       * The L1 side is confirmed; now we listen and wait for the for the Sequencer to include the L2 side; we can do this by computing the expected txn hash of the L2 transaction.
       * To compute this txn hash, we need our message's "sequence number", a unique identifier. We'll fetch from the event logs with a helper method
       */
      const inboxSeqNums = await bridge.getInboxSeqNumFromContractTransaction(
        setGreetingRec
      );
      /**
       * In principle, a single txn can trigger many messages (each with its own sequencer number); in this case, we know our txn triggered only one. Let's get it, and use it to calculate our expected transaction hash.
       */
      const ourMessagesSequenceNum = inboxSeqNums[0];

      const retryableTxnHash = await bridge.calculateL2RetryableTransactionHash(
        ourMessagesSequenceNum
      );

      /**
       * Now we wait for the Sequencer to include it in its off chain inbox.
       */
      console.log(
        `waiting for L2 tx 🕐... (should take < 10 minutes, current time: ${new Date().toTimeString()}`
      );

      const retryRec = await l2Provider.waitForTransaction(retryableTxnHash);

      console.log(`L2 retryable txn executed 🥳 ${retryRec.transactionHash}`);
    },
  },
  watch: {
    isConnected: function () {
      this.init();
    },
  },
};

const BRIDGEL1ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxSubmissionCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxGas",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gasPriceBid",
        type: "uint256",
      },
    ],
    name: "sendMsgToL2",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];
</script>