<template>
  <div class="branding">
    <h1 class="text-2xl text-center mt-6">Branding</h1>
    <div
      class=" flex flex-col items-center justify-center mx-6 mt-8 md:mt-16 mb-10 text-gray-900 md:text-gray-900 "
    >
      <div class="mb-8 text-xl">
        Download the .svg and .png transparent versions of our logo and mark.
        <a :href="`${publicPath}api/VeryNifty_assets.zip`" class="text-red-400" download=""
          >Download all (<span class="font-semibold">400kb</span>)</a
        >.

        <div class="mt-12 flex -mx-8 items-center">
          <div class="px-8">
              <img
                :src="require('../assets/img/branding/LogoGreen@3x.png')"
                alt=""
                class="h-16"
              />
              <div class="text-md py-4 text-center">vNFT Logo</div>
            </a>
          </div>
          <div class="px-8">
              <img
                :src="
                  require('../assets/img/branding/Muse LogoMark Green@3x.png')
                "
                alt=""
                class="h-16"
              />
              <div class="text-md py-4 text-center">Muse Logo</div>
            </a>
          </div>
          <div class="px-8">
       
              <img
                :src="
                  require('../assets/img/branding/VNFT LogoMark Green@3x.png')
                "
                alt=""
                class=" h-16"
              />
              <div class="text-md py-4 text-center">Icon</div>
            </a>
          </div>
        </div>
        <div class="mb-12 text-gray-600 font-thin text-sm">
          Click on 'Download all' to get all assets in .svg &amp; .png and the different colors,
          or
          <a
            :href="`${publicPath}api/VeryNifty_assets.zip`"
            class="text-red-400"
            download=""
            >Download all (<span class="font-semibold">400kb</span>)</a
          >
        </div>

        <p class="mt-4">You can:</p>
        <ul class="list-disc list-inside">
          <li>Use these files to refer to vNFT and VeryNifty.</li>
          <li>Use these files when mentioning VeryNifty on the web.</li>
    
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
      return {
          publicPath: process.env.BASE_URL,

      };

  },
  mounted: function() {
  },
};
</script>
