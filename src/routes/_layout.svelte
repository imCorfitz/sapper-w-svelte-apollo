<svelte:head>
   <meta name="version" content="pkg.version">
</svelte:head>

<main>
   <slot {segment} />
</main>

<script lang="ts">
  import client from '../lib/apollo'
  import { setClient } from "svelte-apollo";
  setClient(client);

   export let segment: string;
</script>

<style lang="scss">

</style>