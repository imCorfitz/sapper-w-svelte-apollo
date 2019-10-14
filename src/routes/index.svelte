<script context="module">
  import client from '../lib/apollo';
  import { gql } from 'apollo-boost';

  const EVERYTHING = gql`
    {
  todos {
    data {
      id
      title
      completed
    }
  }
}

  `;

  export async function preload() {
    return {
      cache: await client.query({
        query: EVERYTHING
      })
    }
  }
</script>
<script>
 import { setClient, restore, query } from 'svelte-apollo';

  export let cache;
  restore(client, EVERYTHING, cache.data);
  // TODO Uncommenting this part triggers a 500 error.
  // setClient(client);

// query a subset of the preloaded (the rest if for Account)
  const todos = query(client, { query: EVERYTHING });
  </script>
<style lang="scss">

</style>

{#await $todos}
 <p>Loading...</p>
 {:then result}
	{#if result.data}
		<ul>
		{#each result.data.todos.data as todo}
			<li><p><strong>ID: {todo.id}</strong> {todo.title} <input type="checkbox" checked={todo.completed} /></p></li>
		{/each}
		</ul>
		{:else}
		<p>ERROR!!</p>
	{/if}
 {/await}