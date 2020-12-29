<script>
  import { tick } from "svelte";

  import { lists } from "~/store/list";
  import { autoFocusOut } from "~/actions/autofocusout";

  let editMode;
  let title;
  let textareaEl;

  async function onEditMode() {
    editMode = true;
    await tick();
    textareaEl && textareaEl.focus();
  }

  function offEditMode() {
    title = "";
    editMode = false;
  }

  function addList() {
    if (title.trim()) {
      lists.add({
        title,
      });
      offEditMode();
    }
  }
</script>

<style lang="scss">
  .create-list {
    white-space: normal;
    font-size: 16px;
    width: 290px;
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

<div class="create-list" use:autoFocusOut={offEditMode}>
  {#if editMode}
    <div class="edit-mode">
      <textarea
        bind:this={textareaEl}
        bind:value={title}
        placeholder="Enter a title for thie list..."
        on:keydown={(e) => e.key === 'Esc' && offEditMode()}
        on:keydown={(e) => e.key === 'Escape' && offEditMode()}
        on:keydown={(e) => e.key === 'Enter' && addList()} />
      <div class="actions">
        <div class="btn success" on:click={addList}>Add</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
      </div>
    </div>
  {:else}
    <div on:click={onEditMode}>+ Add Another List</div>
  {/if}
</div>
