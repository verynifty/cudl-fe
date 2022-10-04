<template>
  <div class="about flex justify-center">
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
            text-xl
            md:text-4xl
            mb-12
            leading-loose
            tracking-wide
            font-bold
            uppercase
            txtShadow
          "
        >
          How To Play Cudl.Finance
        </h1>

        <div class="text-lg md:text-lg font-medium leading-loose tracking-wide">
          <div class="flex flex-col space-y-6 my-6">
            <div class="font-bold">Who is behind CUDL Finance?</div>
            <div>
              $CUDL is a fun game created by the
              <a href="htps://verynifty.io" target="_blank" class="underline"
                >VeryNifty</a
              >
              Team, the same team behind
              <a href="https://nft20.io" target="_blank" class="underline"
                >NFT20</a
              >,
              <a href="https://wraplp.com" target="_blank" class="underline"
                >wraplp.com</a
              >,

              <a
                href="https://gallery.verynifty.io"
                target="_blank"
                class="underline"
                >The VeryNifty Game.</a
              >
              and
              <a href="https://game.nft20.io" target="_blank" class="underline"
                >Royal NFT Game.</a
              >
            </div>
          </div>
          <div class="flex flex-col space-y-6 my-6">
            <div class="font-bold">How to play CUDL FINANCE?</div>
            <div>
              <p class="mb-4">
                Pet your NFT to earn $CUDL (an ERC20 token) once a day by simply
                clicking "Claim Rewards".
              </p>
              <p class="mb-4">
                Use $CUDL to buy different foods for your Pet and move up the
                leaderboard. The higher you are on the leaderboard the more
                $CUDL you'll mine daily.
              </p>
              <p class="mb-4">
                Careful though, if you don't buy food for your Pet and your
                countdown reaches 0, your Pet can be killed and burned from
                your.
              </p>
              <p class="mb-4">
                Watch the leaderboard for grumpy Pets that have left the game -
                you can claim 20% of their points by clicking the grumpy cat
                icon.
              </p>

              <p class="mb-4">
                There are hidden eggs and strategies within the game.
              </p>
            </div>
          </div>
          <div class="flex flex-col space-y-6 my-6">
            <div class="font-bold">What are the risks of CUDL Finance?</div>
            <div>
              You can join the game for free with any of your Pets. By playing
              the CUDL game you can win $CUDL tokens (in game currency), you
              should not treat the token or game as speculative vehicle, the
              contracts were not audited and were developed on our free time,
              any bugs might occur.
            </div>
          </div>

          <div class="flex flex-col space-y-6 my-6">
            <div class="font-bold">Is there a DAO?</div>
            <div>
              The game was developed by the nft20/verynifty team, our governance
              token is $MUSE so the governing DAO of the game is $MUSE,
              decisions will be decided by the nft20/MUSE DAO.
            </div>
          </div>

          <div class="flex flex-col space-y-6 my-6">
            <div class="font-bold">What are the tokenomics of $CUDL?</div>
            <div>
              Bruh. there was not any pre mine or presale, $CUDL is only minted
              by users playin the game. When players use $CUDL within the game
              90% gets burned, the remaining 10% is divided 70% to the
              MUSE/NFT20 DAO, and 30% to the developers of the game. any of the
              parties can do as they wish with their tokens at any time. BUY
              SELL TRADE DUMP GIFT BURN ETC, work is being done, a service is
              being provided , tokens are used to pay for a service....kind of
              what existed for millenia before you had to do a presale to get
              millions of usd without shipping anything.
            </div>
          </div>
        </div>
        <div class="mt-10 flex items-center">
          <div class="px-4">
            <button class="btn">
              <router-link class="px-2 inline-block" to="/play#join"
                >Register Your Pet</router-link
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
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
      showModal: true,
    };
  },
  mounted: function () {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Love+Ya+Like+A+Sister&display=swap");
</style>