<template>
  <div class="Market">
    <div v-for="(type, type_index) in accessories" :key="type_index">
      <div class="p-2 mb-6 mt-6 text-2xl">{{ type_index.toUpperCase() }}</div>

      <div class="flex items-start flex-wrap mx-6">
        <Addon
          v-on:buy-clicked="buyClicked"
          :key="addon_index"
          :addon="addon"
          v-for="(addon, addon_index) in type.addons"
          :toBuy="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Addon from "@/components/bazaar/Addon.vue";

export default {
  name: "Market",
  components: { Addon },
  data: function () {
    return {
      balance: "",
      contract: null,
      accessories: {
        Addons: {
          addons: [
            {
              name: "Name Change",
              price: 1, //in milk
              id: 1,
              rarity: 40,
              quantity: 700,
              requiredhp: 20,
              img: require("@/assets/img/addons/cat.png"),
              description: "Change name in game",
              used: 0,
              detachable: true,
            },
            {
              name: "Hibernation",
              price: 100,
              cudl: 0,
              id: 2,
              rarity: 40,
              quantity: 700,
              requiredhp: 20,
              img: require("@/assets/img/addons/hibernation.png"),
              description: "Lazy Cat 30 days",
              used: 0,
              detachable: true,
            },
            {
              name: "Litter Box",
              price: "10",
              id: 3,
              rarity: 100,
              quantity: 450,
              requiredhp: 50,
              img: require("@/assets/img/addons/litter-box.svg"),
              description: "Clean Cat, +100 score",
              used: 0,
              detachable: false,
            },
            {
              name: "Proud Milker Badge",
              price: "100",
              cudl: "10",
              id: 4,
              rarity: 40,
              quantity: 700,
              requiredhp: 20,
              img: require("@/assets/img/addons/medal.png"),
              description: "Show achievements",
              used: 0,
              detachable: true,
            },
          ],
        },
        // shield: {
        //   title: "Shields",
        //   addons: [],
        // },
      },
    };
  },
  methods: {
    initialize: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      let hasNextMember = true;
      let index = 1;

      console.log(this.accessories);
    },
    buyClicked: async function (id, addon) {
      let hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.Bazaar
            )
            .call()
        ).length >= 18;

      if (!hasTokenApproval) {
        await this.approve();
      }

      // name change
      if (id == 1) {
        const tokenId = prompt(`Which pet would you like to name?`);
        const name = prompt(`What's the name of your pet?`);

        let buytx = await this.$store.state.Bazaar.methods
          .setName(tokenId, name)
          .send({
            from: this.$store.state.account,
          });

        // hibernation
      } else if (id == 2) {
        const tokenId = prompt(
          `Which pet would you like to send to a 30 day hibernation?`
        );
        let buytx = await this.$store.state.Bazaar.methods
          .hibernate(tokenId)
          .send({
            from: this.$store.state.account,
          });

        // litter box
      } else if (id == 3) {
        const tokenId = prompt(
          `Which pet would you like to clean and earn 100 points?`
        );
        let buytx = await this.$store.state.Bazaar.methods
          .litter(tokenId)
          .send({
            from: this.$store.state.account,
          });

        // Proud Milker Badge
      } else if (id == 4) {
        const tokenId = prompt(
          `To which pet would you like to give the Milker Badge?`
        );

        let buytx = await this.$store.state.Bazaar.methods
          .getMilkerAchievement(tokenId)
          .send({
            from: this.$store.state.account,
          });
      }
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let minetx = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.Bazaar, max)
        .send({
          from: this.$store.state.account,
        });
    },
  },
  beforeMount: async function () {
    await this.initialize();
  },
  watch: {
    isConnected: async function () {
      await this.initialize();
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
</style>
