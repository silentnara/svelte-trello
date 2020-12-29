<script>
  import Sortable from "sortablejs";
  import { onMount } from "svelte";

  import { lists } from "~/store/list";
  import List from "~/components/List.svelte";
  import CreateList from "~/components/CreateList.svelte";

  let listsEl;
  let sortableList;

  function toggleDraggable(e) {
    sortableList.option('disabled', e.detail)
  }

  onMount(() => {
    sortableList = new Sortable(listsEl, {
      group: "Lists",
      handle: ".lists",
      delay: 50,
      animation: 0,
      forceFallback: true,
      onEnd(e) {
        lists.reorder({
          oldIndex: e.oldIndex,
          newIndex: e.newIndex,
        });
      },
    });
  });
</script>

<style lang="scss">
  .list-container {
    width: 100vw;
    height: calc(100vh - 40px);
    padding: 30px;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    font-size: 0;
    .lists {
      display: inline-block;
      font-size: 0px;
      white-space: nowrap;
      height: 100%;
    }
  }
</style>

<div class="list-container">
  <div class="lists" bind:this={listsEl}>
    {#each $lists as list (list.id)}
      <List {list} {sortableList} />
    {/each}
  </div>
  <CreateList on:editMode={toggleDraggable} />
</div>
