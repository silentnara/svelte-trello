<script>
  import { tick, onDestroy, createEventDispatcher } from "svelte";

  import { lists } from "~/store/list";
  import { autoFocusOut } from "~/actions/autofocusout";

  export let list;
  let { title } = list;
  let editMode;
  let textareaEl;

  const dispatch = createEventDispatcher();

  async function onEditMode() {
    editMode = true;
    await tick();
    dispatch('editMode', true);
    textareaEl && textareaEl.focus();
  }

  function offEditMode() {
    editMode = false;
    dispatch('editMode', false);
  }

  function editTitle() {
    if (title.trim()) {
      lists.edit({
        id: list.id,
        title,
      });
      offEditMode();
    }
  }

  function deleteList() {
    lists.delete({
      id: list.id,
    });
    offEditMode();
  }

  onDestroy(() => {
    offEditMode();
  })
</script>

<style lang="scss">
  h2.title {
    font-weight: 700;
    padding: 4px 8px;
    cursor: pointer;
    position: relative;
    .btn {
      position: absolute;
      top: 0;
      right: 0;
      display: none;
    }
  }
  :global(.list__inner:hover .edit-btn-for-list) {
    display: block !important;
  }
</style>

<div class="list__title" use:autoFocusOut={offEditMode}>
  {#if editMode}
    <div class="edit-mode">
      <textarea
        bind:this={textareaEl}
        bind:value={title}
        placeholder="Enter a title for thie list..."
        on:keydown={(e) => e.key === 'Esc' && offEditMode()}
        on:keydown={(e) => e.key === 'Escape' && offEditMode()}
        on:keydown={(e) => e.key === 'Enter' && editTitle()} />
      <div class="actions">
        <div class="btn success" on:click={editTitle}>Save</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
        <div class="btn danger" on:click={deleteList}>Delete Me</div>
      </div>
    </div>
  {:else}
    <h2 class="title">
      {title}
      <div class="btn small edit-btn-for-list" on:click={onEditMode}>Edit</div>
    </h2>
  {/if}
</div>
