<script>
  import Sortable from "sortablejs";
  import { onMount } from "svelte";

  import ListTitle from "~/components/ListTitle.svelte";
  import Card from "~/components/Card.svelte";
  import CreateCard from "~/components/CreateCard.svelte";
  import { cards } from "~/store/list";

  export let list;
  export let sortableList;

  let cardsEl;
  let sortableCards;

  function toggleDraggable(e) {
    sortableList.option('disabled', e.detail)
    sortableCards.option('disabled', e.detail)
  }

  onMount(() => {
    sortableCards = new Sortable(cardsEl, {
      group: "Cards",
      handle: ".card",
      delay: 50,
      animation: 0,
      forceFallback: true,
      onEnd(e) {
        cards.reorder({
          fromListID: e.from.dataset.listId,
          toListID: e.to.dataset.listId,
          oldIndex: e.oldIndex,
          newIndex: e.newIndex,
        });
      },
    });
  });
</script>

<style lang="scss">
  .list {
    white-space: normal;
    font-size: 16px;
    word-break: break-all;
    display: inline-block;
    vertical-align: top;
    line-height: 20px;
    width: 290px;
    height: 100%;
    margin: 0 4px;
    user-select: none;
    :global(&.sortable-ghost) {
      opacity: 0.2;
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
    .list__inner {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      box-sizing: border-box;
      padding: 10px 8px;
      background: #ebecf0;
      border-radius: 4px;
      .list__heading {
        margin-bottom: 10px;
        p {
          color: #5E6C84;
          padding: 0 8px;
        }
      }
      .list__cards {
        overflow-x: hidden;
        overflow-y: auto;
        margin-bottom: 10px;
      }
    }
  }
</style>

<div class="list">
  <div class="list__inner">
    <div class="list__heading">
      <ListTitle {list} on:editMode={toggleDraggable}/>
      <p>
        {list.cards.length} cards
      </p>
    </div>
    <div class="list__cards" data-list-id={list.id} bind:this={cardsEl}>
      {#each list.cards as card (card.id)}
        <Card {card} listId={list.id} on:editMode={toggleDraggable} />
      {/each}
    </div>
    <CreateCard listId={list.id} on:editMode={toggleDraggable} />
  </div>
</div>
