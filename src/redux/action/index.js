// For Add Item to Cart
export const addCart = (product) => {
  return {
    type: "ADDITEM",
    payload: product,
  };
};

// For Delete Item to Cart
export const delCart = (product) => {
  return {
    type: "DELITEM",
    payload: product,
  };
};
export const deleteAllItemsFromCart = () => {
  return {
    type: "DELETE_ALL_ITEMS_FROM_CART",
  };
};
export const addUser = (userInfo) => {
  return {
    type: "ADD_USER",
    payload: userInfo,
  };
};

export const updateUser = (userInfo) => {
  return {
    type: "UPDATE_USER",
    payload: userInfo,
  };
};
