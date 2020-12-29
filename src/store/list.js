import { writable } from "svelte/store";
import cryptoRandomString from "crypto-random-string";
import _ from "lodash";

const generateID = () => cryptoRandomString({ length: 10 });

const repoLists = JSON.parse(window.localStorage.getItem("lists")) || [];

const _lists = writable(repoLists);
_lists.subscribe(($lists) => {
  window.localStorage.setItem("lists", JSON.stringify($lists));
});

export const lists = {
  subscribe: _lists.subscribe,
  reorder(payload) {
    const { oldIndex, newIndex } = payload;
    _lists.update(($lists) => {
      const target = _.cloneDeep($lists[oldIndex]);
      $lists.splice(oldIndex, 1);
      $lists.splice(newIndex, 0, target);
      return $lists;
    });
  },
  add(payload) {
    const { title } = payload;
    _lists.update(($lists) => {
      $lists.push({
        id: generateID(),
        title,
        cards: [],
      });
      return $lists;
    });
  },
  edit(payload) {
    const { id, title } = payload;
    _lists.update(($lists) => {
      const target = _.find($lists, { id });
      target.title = title;
      return $lists;
    });
  },
  delete(payload) {
    const { id } = payload;
    _lists.update(($lists) => {
      _.remove($lists, { id });
      return $lists;
    });
  },
};

export const cards = {
  reorder(payload) {
    const { fromListID, toListID, oldIndex, newIndex } = payload;
    _lists.update(($lists) => {
      const targetFrom = _.find($lists, { id: fromListID });
      const targetTo =
        fromListID == toListID ? targetFrom : _.find($lists, { id: toListID });
      const clone = _.cloneDeep(targetFrom.cards[oldIndex]);
      targetFrom.cards.splice(oldIndex, 1);
      targetTo.cards.splice(newIndex, 0, clone);
      return $lists;
    });
  },
  add(payload) {
    const { title, listId } = payload;
    _lists.update(($lists) => {
      _.find($lists, { id: listId }).cards.push({
        id: generateID(),
        title,
      });
      return $lists;
    });
  },
  edit(payload) {
    const { listId, cardId, title } = payload;
    _lists.update(($lists) => {
      const targetList = _.find($lists, { id: listId });
      const targetCard = _.find(targetList.cards, { id: cardId });
      targetCard.title = title;
      return $lists;
    });
  },
  delete(payload) {
    const { listId, cardId } = payload;
    _lists.update(($lists) => {
      const targetList = _.find($lists, { id: listId });
      _.remove(targetList.cards, { id: cardId });
      return $lists;
    });
  },
};
