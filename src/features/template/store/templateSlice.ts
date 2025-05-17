import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Template } from "../types";

interface TemplateState {
  items: Template[];
  selectedItem: Template | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Template[]>) => {
      state.items = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<Template | null>) => {
      state.selectedItem = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setItems, setSelectedItem, setLoading, setError } =
  templateSlice.actions;

export default templateSlice.reducer;
