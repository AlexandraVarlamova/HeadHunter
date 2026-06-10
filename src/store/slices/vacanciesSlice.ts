import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type HHResponse, type Vacancy } from "../../types";
import { VACANCIES } from "../../mok/vacancies";
interface FetchVacancies {
  text: string;
  page: string;
  area: string | null;
}
interface VacanciesState {
  list: Vacancy[];
  pages: number;
  perPage: number;
  loading: boolean;
  error: string | null;
}
export const fetchVacancies = createAsyncThunk<HHResponse, FetchVacancies>(
  "vacancies/fetchVacancies",
  async ({ text, page, area }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const allItems = VACANCIES.items || [];
      const perPage = 5;

      let currentPage = parseInt(page, 5);
      if (isNaN(currentPage)) currentPage = 0;

      const start = currentPage * perPage;
      const end = start + perPage;

      const slicedItems = allItems.slice(start, end);



      const data: HHResponse = {
        ...VACANCIES,
        items: slicedItems,
        pages: Math.ceil(allItems.length / perPage),
        page: currentPage,
      };

      return data;
    } catch (error) {
      console.error("Ошибка в Thunk:", error);
      return rejectWithValue("Ошибка при загрузке");
    }
  },
);

const initialState: VacanciesState = {
  list: [],
  pages: 0,
  perPage: 5,
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

          state.list = action.payload.items || [];
          state.pages = action.payload.pages || 0;
        },
      )
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const vacanciesReducer = vacanciesSlice.reducer;
