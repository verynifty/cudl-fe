<template>
  <div class="text-gray-100 bg-gray-100">
    <h1 class="text-center mt-4">Check nfts</h1>

    <div class="flex -m-4 flex-wrap mt-4 p-10 justify-center">
      <div class="bg-white text-black">
        <div class="bg-white">
          <img style="width: 100%; height: 600px" :src="thisImg" class="" />
        </div>
      </div>
    </div>
  </div>
  <!-- 
    <div class="flex -m-4 flex-wrap mt-4 p-10">
      <div :key="img.id" v-for="(img, index) in nfts" class="w-1/4 p-4">
        <div class="bg-white text-black">
          {{ img.id }}

          <div class="bg-white">
            <img style="width: 100%; height: 200px" :src="img.img" class="" />
          </div>
          <div :key="i" v-for="(metadata, i) in img.metadata" class="">
            <p>{{ metadata.trait_type }} - {{ metadata.value }}</p>
          </div>
        </div>
      </div>
    </div> -->
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
      nfts: [],
      nft: "",
      image: "",
      loaded: false,
      thisImg: "",
    };
  },
  methods: {
    load: async function () {
      console.log("REDNER");
      if (this.loaded == true || this.isConnected == false) {
        return;
      }
      this.loaded = true;
      for (let i = 0; i < 1000; i++) {
        let a = await this.$store.state.Render.methods.render(i).call();

        let getObject = a.substring(27);
        console.log(getObject);
        let { image, attributes } = JSON.parse(`${getObject}`);
        console.log(attributes);
        this.nfts.push({ img: image, id: i, metadata: attributes });
      }

      console.log(this.nfts);
    },
  },
  mounted: async function () {
    this.load();
    let i = 0;
    setInterval(() => {
      this.thisImg = this.nfts[i].img;
      i++;
    }, 40);
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
  watch: {
    isConnected: function () {
      this.load();
    },
  },
};
</script>
