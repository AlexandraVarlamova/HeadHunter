import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type HHResponse, type Vacancy } from "../../types";

interface FetchVacancies {
  text: string;
  page: number;
  area: string | null;
}

interface VacanciesState {
  list: Vacancy[];
  pages: number;
  loading: boolean;
  error: string | null;
}

export const fetchVacancies = createAsyncThunk<HHResponse, FetchVacancies>(
  "vacancies/fetchVacancies",
  async ({ text, page}, { rejectWithValue }) => {
    try {
      const url = `/api/hh/openapi/redoc#tag/Poisk-vakansij/operation/get-vacancies?text=${encodeURIComponent(text)}&page=${page}`;


      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      const data: HHResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Произошла неизвестная ошибка");
    }
  },
);

const initialState: VacanciesState = {
  list: [],
  pages: 0,
  loading: false,
  error: null,
};

const vacanciesSlice = createSlice({
  name: "vacancies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVacancies.fulfilled,
        (state, action: PayloadAction<HHResponse>) => {
          state.loading = false;
          state.list = action.payload.items;

          state.pages = action.payload.pages;
        },
      )
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const vacanciesReducer = vacanciesSlice.reducer;
