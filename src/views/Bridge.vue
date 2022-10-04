<template>
  <div
    class="mint text-white flex justify-center w-1/2 flex-col m-0 m-auto my-10"
  >
    <div class="mb-4">
      Your CUDL BALANCE On Mainnet:
      <span>
        <TokenBalance
          :erc20="CUDLToken"
          :account="$store.state.account"
          symbol="CUDL"
          decimals="18"
          class="inline-block text-green-500"
      /></span>
    </div>
    <div>
      <div>Bridge:</div>

      <div
        class="
          w-full
          items-center
          flex
          border-gray-900
          bg-white bg-opacity-100
          text-gray-900 text-md
        "
      >
        <input
          v-model="toBridge"
          type="number"
          placeholder="Amount"
          class="w-3/4 outline-none pt-2 text-center"
        />
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
          @click="maxBal"
        >
          max
        </button>
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
      The CUDL will take around 10 minutes to appear in your Arbitrum wallet
    </div>
  </div>
</template>

<script>
const { Bridge } = require("arb-ts");
const ethers = require("ethers");
import TokenBalance from "@/components/TokenBalance.vue";
import ERC20ABI from "@/assets/ABIS/ERC20";
import BigNumber from "bignumber.js";

// @ is an alias to /src
export default {
  name: "Bridge",
  components: { TokenBalance },
  data: function () {
    return {
      scores: [],
      pets: 0,
      m: {},
      loading: false,
      CONTRACT: {},
      cudlBalance: 0,
      toBridge: 0,
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

      let balance = await this.$store.state.CudlMainnet.methods
        .balanceOf(this.$store.state.account)
        .call();
      this.cudlBalance = balance.toString();
      // this.cudlBalance = "1000000000000000000";

      this.toBridge = new BigNumber(this.cudlBalance)
        .shiftedBy(-18)
        .toFixed(2, 1);
    },

    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let minetx = await this.$store.state.CudlMainnet.methods
        .approve("0x8722458C36f9BFE6E2dCf43A5C20efeC18Ecb81a", max)
        .send({
          from: this.$store.state.account,
        })
        .on("transactionHash", (hash) => {
          console.log("hash of tx ", hash);
          // pass the hash to notify to track it
          this.$store.state.notify.hash(hash);
        });
    },
    maxBal: async function () {
      let balance = await this.$store.state.CudlMainnet.methods
        .balanceOf(this.$store.state.account)
        .call();
      this.cudlBalance = balance.toString();
      // this.cudlBalance = "1000000000000000000";

      this.toBridge = new BigNumber(this.cudlBalance)
        .shiftedBy(-18)
        .toFixed(2, 1);
    },
    migrate: async function () {
      let hasTokenApproval =
        (
          await this.$store.state.CudlMainnet.methods
            .allowance(
              this.$store.state.account,
              "0x8722458C36f9BFE6E2dCf43A5C20efeC18Ecb81a"
            )
            .call()
        ).length >= 18;

      if (!hasTokenApproval) {
        await this.approve();
      }
      const l1Provider = new ethers.providers.JsonRpcProvider(
        `https://eth-mainnet.alchemyapi.io/v2/`
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
      const maxGas = 507252;
      //const maxGas = 100000;

      /**
       * With these three values, we can calculate the total callvalue we'll need our L1 transaction to send to L2
       */
      const callValue = submissionPriceWei.add(gasPriceBid.mul(maxGas));

      console.log(
        `Sending greeting to L2 with ${callValue.toString()} callValue for L2 fees:`
      );

      let BRIDGEL1 = new this.$store.state.web3.eth.Contract(
        [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "amount",
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
            name: "sendCUDLToL2",
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
        ],
        "0x8722458C36f9BFE6E2dCf43A5C20efeC18Ecb81a"
      );

      let toBridge = new BigNumber(this.toBridge).shiftedBy(18).toFixed();

      console.log(toBridge);
      const passMessageTx = await BRIDGEL1.methods
        .sendCUDLToL2(toBridge, submissionPriceWei, maxGas, gasPriceBid)
        .send({
          value: callValue,
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
</script>