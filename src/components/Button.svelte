<!--
 @component
 Here's some documentation for this component. It will show up on hover for
 JavaScript/TypeScript projects using a LSP-compatible editor such as VSCode or
 Vim/Neovim with coc.nvim.

 - You can use markdown here.
 - You can use code blocks here.
 - JSDoc/TSDoc will be respected by LSP-compatible editors.
 - Indentation will be respected as much as possible.
-->

<!-- @component You can use a single line, too -->

<!-- @component But only the last documentation comment will be used -->
{#if href}
   <a {href} on:click>
      <slot />
   </a>
{:else}
   <button on:click>
      <slot />
   </button>
{/if}

<script>
   export let href = false;
</script>