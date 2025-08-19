import { createSlice } from '@reduxjs/toolkit';

type TModalState = {
  isModalOpened: boolean;
};

export const initialState: TModalState = {
  isModalOpened: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpened = true;
    },
    closeModal: (state) => {
      state.isModalOpened = false;
    }
  },
  selectors: {
    selectIsModalOpened: (state) => state.isModalOpened
  }
});

export const { openModal, closeModal } = modalSlice.actions;
export const { selectIsModalOpened } = modalSlice.selectors;
export default modalSlice.reducer;
