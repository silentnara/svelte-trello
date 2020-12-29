<script>
  import { tick, onDestroy, createEventDispatcher } from "svelte";

  import { cards } from "~/store/list";
  import { autoFocusOut } from "~/actions/autofocusout";

  export let card;
  export let listId;

  let { title } = card;
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
    dispatch('editMode', false);
    editMode = false;
  }

  function editTitle() {
    if (title.trim()) {
      cards.edit({
        listId,
        cardId: card.id,
        title,
      });
      offEditMode();
    }
  }

  function deleteCard() {
    cards.delete({
      listId,
      cardId: card.id,
    });
    offEditMode();
  }

  onDestroy(() => {
    offEditMode();
  })
</script>

<style lang="scss">
  .card {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 1px;
    }
    :global(&.sortable-ghost) {
      opacity: 0.1;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        border-radius: 4px;
      }
    }
    :global(&.sortable-chosen) {
      cursor: move;
    }
  }
  .title {
    position: relative;
    border-radius: 4px;
    background: #FFF;
    padding: 6px 8px;
    box-shadow: 0 1px 0 rgba(9, 30, 66, .25);
    line-height: 20px;
    user-select: none;
    &:hover {
      background: #F5F5F5;
    }
    .btn {
      position: absolute;
      top: 6px;
      right: 8px;
      display: none;
    }
    &:hover .btn {
      display: block;
    }
  }
</style>

<div class="card" use:autoFocusOut={offEditMode}>
  {#if editMode}
    <div class="edit-mode">
      <textarea
        bind:this={textareaEl}
        bind:value={title}
        placeholder="Enter a title for thie card..."
        on:keydown={(e) => e.key === 'Esc' && offEditMode()}
        on:keydown={(e) => e.key === 'Escape' && offEditMode()}
        on:keydown={(e) => e.key === 'Enter' && editTitle()} />
      <div class="actions">
        <div class="btn success" on:click={editTitle}>Save</div>
        <div class="btn" on:click={offEditMode}>Cancel</div>
        <div class="btn danger" on:click={deleteCard}>Delete Me</div>
      </div>
    </div>
  {:else}
    <h2 class="title">
      {title}
      <div class="btn small edit-btn-for-card" on:click={onEditMode}>Edit</div>
    </h2>
  {/if}
</div>
