<script>
  import { tick, onDestroy, createEventDispatcher } from "svelte";

  import { cards } from "~/store/list";
  import { autoFocusOut } from "~/actions/autofocusout";

  export let listId

  let editMode;
  let title;
  let textareaEl;

  const dispatch = createEventDispatcher();

  async function onEditMode() {
    editMode = true;
    await tick();
    dispatch('editMode', true);
    textareaEl && textareaEl.focus();
  }

  function offEditMode() {
    title = "";
    editMode = false;
    dispatch('editMode', false);
  }

  function addCard() {
    if (title.trim()) {
      cards.add({
        listId,
        title,
      });
      offEditMode();
    }
  }

  onDestroy(() => {
    offEditMode();
  })
</script>

<style lang="scss">
  .create-card {
    white-space: normal;
    font-size: 16px;
    display: inline-block;
    padding: 10px 8px;
    vertical-align: top;
    background: rgba(#ebecf0, 0.6);
    border-radius: 4px;
    margin: 0 4px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background-color: #ebecf0;
    }
  }
</style>

<div class="create-card" use:autoFocusOut={offEditMode}>
  {#if editMode}
    <div class="edit-mode">
      <textarea
        bind:this={textareaEl}
        bind:value={title}
        placeholder="Enter a title for thie card..."
        on:keydown={(e) => e.key === 'Esc' && offEditMode()}
        on:keydown={(e) => e.key === 'Escape' && offEditMode()}
        on:keydown={(e) => e.key === 'Enter' && addCard()} />
      <div class="actions">
        <div class="btn success" on:click={addCard}>Add</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
      </div>
    </div>
  {:else}
    <div on:click={onEditMode}>+ Add Another Card</div>
  {/if}
</div>
