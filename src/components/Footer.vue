<template>
  <div class="w-full mt-64">
    <div class="bg-dark100 antialiased tracking-normal leading-loose">
      <div
        class="
          flex
          justify-center
          full-width
          bg-purple-500
          text-blue-900
          relative
          border-t-4 border-purple-900
        "
      >
        <img
          :src="require('../assets/img/vnftLogo.svg')"
          class="h-48 absolute left-0 bottom-0 -mx-16 opacity-50"
        />

        <div
          class="
            py-16
            w-4/5
            items-center
            flex flex-col-reverse
            md:flex-row
            text-center
            sm:text-left
            md:justify-between md:-mx-4
          "
        >
          <div class="w-full md:w-1/2 md:px-4">
            <div class="text-blue-900 text-2xl mb-2 font-bold">
              Cudl Finance
            </div>

            <div class="mb-2 text-xs pr-6">
              Cudl Finance is an experimental game and currently in beta
              developed by the
              <a
                href="https://verynifty.io"
                class="text-white hover:underline"
                target="_blank"
                >VeryNifty</a
              >
              the team, who is also behind
              <a
                href="https://nft20.io"
                class="text-white hover:underline"
                target="_blank"
                >NFT20</a
              >
              . Any risks you take using this platform are your own. This is not
              an investment vehicle. Caution is advised.
            </div>
            <div class="">
              <!-- <a
                href="https://twitter.com/niftymuseum"
                target="_blank"
                class="text-xl text-white hover:text-blue-400"
                >Twitter</a
              > -->
            </div>
          </div>
          <div class="md:w-2/3 -mx-4 md:flex text-md">
            <div class="w-full md:px-4">
              <ul class="list-reset">
                <!--
                <li>
                  <a
                    href="https://docs.verynifty.io/"
                    target="_blank"
                    class="hover:text-white"
                    >Docs</a
                  >
                </li>
                -->
                <li>
                  <a href="https://discord.gg/kfByfux" class="hover:text-white"
                    >Discord</a
                  >
                </li>
                <li>
                  <a href="https://t.me/cudlfinance" class="hover:text-white"
                    >Telegram</a
                  >
                </li>

                <li>
                  <a
                    href="https://twitter.com/niftymuseum"
                    target="_blank"
                    class="hover:text-white"
                    >Twitter</a
                  >
                </li>
                <li>
                  <router-link to="/calc">Calculate Rewards</router-link>
                </li>
                <li>
                  <router-link to="/weapons">My Weapons</router-link>
                </li>
                <li>
                  <router-link to="/care-taker">Care Takers</router-link>
                </li>
              </ul>
            </div>
            <div class="w-full md:px-4">
              <ul class="list-reset">
                <li>
                  <router-link to="/faqs" class="hover:text-white"
                    >How To Play</router-link
                  >
                </li>

                <li>
                  <router-link to="claim-old" class="hover:text-white"
                    >Claim Stuck Balances</router-link
                  >
                </li>
                <li>
                  <router-link to="transfer" class="hover:text-white"
                    >Claim your pets from Old game</router-link
                  >
                </li>
                <li>
                  <a
                    href="https://arbiscan.io/address/0x58b1422b21d58Ae6073ba7B28feE62F704Fc2539"
                    class="hover:text-white"
                    target="_blank"
                    >Game Contract</a
                  >
                </li>

                <li>
                  <a
                    href="https://arbiscan.io/address/0x0f4676178b5c53Ae0a655f1B19A96387E4b8B5f2"
                    class="hover:text-white"
                    target="_blank"
                    >CUDL Token Contract</a
                  >
                </li>
                <li>
                  <a
                    href="https://arbiscan.io/address/0x72C546FFABa89b269C4290698D8f106f05e090Fe"
                    class="hover:text-white"
                    target="_blank"
                    >Pet Contract</a
                  >
                </li>
                <!-- <li>
                  <router-link to="/dead" class="hover:text-white"
                    >Can my NFT Join?</router-link
                  >
                </li> -->
                <li>
                  <router-link to="/care-taker" class="hover:text-white"
                    >Care Taker</router-link
                  >
                </li>
                <li>
                  <router-link to="/gift" class="hover:text-white"
                    >Transfer NFT</router-link
                  >
                </li>
                <li>
                  <router-link to="/branding" class="hover:text-white"
                    >Branding</router-link
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  components: {},
  props: {},
  data: function () {
    return {};
  },
  methods: {},
  beforeMount: function () {},
  watch: {},
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
