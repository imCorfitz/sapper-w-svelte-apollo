<script>
  import { query } from "svelte-apollo";
  const GET_BOOKS = gql`{
  todos {
    data {
      id
      title
      completed
      user {
        name
        id
      }
    }
  }
}`;

  // 2. Execute the GET_BOOKS GraphQL query using the Apollo client
  //    -> Returns a svelte store of promises that resolve as values come in
  const books = query(GET_BOOKS);
</script>

<!-- 3. Use $books (note the "$"), to subscribe to query values -->
{#if $books.loading}
  Loading...
{:else if $books.error}
  Error: {$books.error.message}
{:else}
  {#each $books.data.todos as book}
    {book.title} by {book.user.name}
  {/each}
{/if}