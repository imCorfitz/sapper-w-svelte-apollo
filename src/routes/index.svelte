<script lang="ts">
  import { mutation, query } from "svelte-apollo";
  import { gql } from "@apollo/client";
  const EVERYTHING = gql`
    {
      todos(options: { sort: { field: "id" }, paginate: { limit: 12 } }) {
        data {
          id
          title
          completed
        }
      }
    }
  `;

  const ADD = gql`
    mutation {
      createTodo(input: { title: "test 123", completed: false }) {
        id
      }
    }
  `;

  const todos = query(EVERYTHING, {
    // variables, fetchPolicy, errorPolicy, and others
  });

  function reload() {
    todos.refetch();
  }

  const addTodo = mutation(ADD);

  async function add() {
    try {
      await addTodo({});
    } catch (error) {
      // TODO
      console.log(error);
    }
  }
</script>

<ul>
  {#if $todos.loading}
    <li>Loading...</li>
  {:else if $todos.error}
    <li>ERROR: {$todos.error.message}</li>
  {:else}
    {#each $todos.data.todos.data as todo (todo.id)}
      <li>{todo.title} is {todo.completed ? 'completed' : 'to be done'}</li>
    {/each}
  {/if}
</ul>

<button on:click={reload}>Reload</button>
<button on:click={add}>Add</button>
