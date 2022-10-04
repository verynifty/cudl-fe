<template>
  <div class="calc">
    <h1 class="text-3xl text-center mt-6">Killerboard</h1>

    <div class="mt-8">
      <table class="table-auto w-full border border-gray-900">
        <thead>
          <tr>
            <th class="px-4 py-2">Killer</th>

            <th class="px-4 py-2">Killed</th>
          </tr>
        </thead>
        <tbody
          class="border border-gray-900"
          v-for="(killer, index) in killers"
          :key="index"
        >
          <tr class="cursor-pointer">
            <td class="border border-gray-900 px-4 py-2">
              <a
                target="_blank"
                class="hover:text-red-400"
                :href="`https://arbiscan.io/address/${killer.killer}`"
                >{{ killer.killer }}
              </a>
            </td>
            <td class="border border-gray-900 px-4 py-2">
              {{ killer.count }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
      killers: [],
    };
  },
  methods: {},
  mounted: async function () {
    const killers = await axios.get(
      "https://gallery.verynifty.io/api/killerboard"
    );
    this.killers = killers.data;
    console.log(killers.data);
  },
  computed: {},
};
</script>
