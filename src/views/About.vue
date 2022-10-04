<template>
  <div class="flex justify-center">
    <div
      class="
        about
        bg-white
        mt-12
        px-8
        md:w-2/3
        flex
        border-4 border-black
        boxShadow
      "
    >
      <div
        class="
          flex flex-col
          items-center
          justify-center
          mx-6
          mt-8
          md:mt-16
          mb-10
          secondary
          text-gray-900
        "
      >
        <h1
          class="
            text-xl text-red
            md:text-4xl
            mb-12
            leading-loose
            tracking-wide
            font-bold
            uppercase
            txtShadow
            hidden
          "
        >
          The game is currently paused. See
          <a
            class="underline"
            href="https://medium.com/cudl-finance/post-mortem-an-overdose-of-cudl-8e20c475fddb"
            >the announcement for details</a
          >.
        </h1>
        <h1
          class="
            text-l
            md:text-4xl
            mb-12
            leading-loose
            tracking-wide
            font-bold
            uppercase
            txtShadow
          "
        >
          Your Crypto Pet that Feeds off Crypto
        </h1>

        <div class="text-lg md:text-lg font-medium leading-loose tracking-wide">
          <p class="mb-4">
            Pet your NFT to mine $CUDL (an ERC20 token) once a day.
          </p>
          <p class="mb-4">
            Use $CUDL to buy different foods for your Pet and move up the
            leaderboard. The higher you are on the leaderboard the more $CUDL
            you'll mine daily.
          </p>
          <p class="mb-4">
            Use $CUDL to get MILK and improve your Pet in the bazaar.
          </p>
          <p class="mb-4">
            Careful though, if you don't buy food for your Pet and your
            countdown reaches 0, your Pet can die be burned from your wallet.
          </p>
          <p class="mb-4">
            Watch the leaderboard for dead Pets that have left the game - you
            can claim 20% of their points by clicking the grumpy cat icon and
            burn other users NFTs.
          </p>
        </div>
        <div class="mt-10 flex items-center">
          <div class="px-4">
            <button class="btn">
              <router-link class="px-2 inline-block" to="/bazaar?buy=true"
                >Buy a Cudl Pet</router-link
              >
            </button>
          </div>
          <div class="px-4">
            <button class="btn flex items-start justify-center -mx-2 w-64">
              <img
                :src="require('../assets/img/cat.png')"
                class="h-6 pb-1 pr-2"
              />
              <router-link class="px-2 inline-block" to="/play"
                >Check My Pets</router-link
              >
            </button>
          </div>
        </div>
      </div>
      <Modal
        v-if="showModal"
        @close="showModal = false"
        :text="`cudl finance is currently in BETA, many bugs might occur. Also Cudl Finance is not designed for investment purposes and should not be considered as a type of investment. It is a free to participate game on the Ethereum Network.`"
        :title="`CUDL Finance is not an investment vehicle. `"
        :button="`I understand & agree.`"
      />
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";

export default {
  components: {
    Modal,
  },
  data: function () {
    return {
      showModal: true,
    };
  },
  mounted: function () {},
};
</script>
