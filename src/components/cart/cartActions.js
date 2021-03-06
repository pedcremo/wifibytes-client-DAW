import {
  SET_LOCALSTORAGE,
  SET_ITEM,
  GET_ITEMS,
  DEL_ITEM,
  SET_QUANTITY,
} from '../../constants/actionTypes';
export const setItem = (item) => ({
  type: SET_ITEM,
  item,
  localStorageSave: true,
  reducer: 'cartReducer',
});

export const getItems = () => ({
  type: GET_ITEMS,
  reducer: 'cartReducer',
  localStorageGet: true,
  action: SET_LOCALSTORAGE,
});

export const quantityItem = (item, quantity) => ({
  type: SET_QUANTITY,
  item,
  quantity,
  reducer: 'cartReducer',
  localStorageSave: true,
});

// export const increment_item = (item) => ({
//   type: QUANTITY_ITEM,
//   item
// });

export const delete_item = (item) => ({
  type: DEL_ITEM,
  item,
  localStorageUpdate: true,
  reducer: 'cartReducer',
});
