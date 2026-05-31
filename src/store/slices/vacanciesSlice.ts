import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type HHResponse, type Vacancy } from '../../types';


interface FetchVacanciesArgs {
  text: string;
  page: number;
  area?: string | null;
}


interface VacanciesState {
  list: Vacancy[];
  pages: number;
  loading: boolean;
  error: string | null;
}

export const fetchVacancies = createAsyncThunk<HHResponse, FetchVacanciesArgs>(
  'vacancies/fetchVacancies',
  async ({ text, page, area }, { rejectWithValue }) => {
    try {

      let url = `/api/hh/vacancies?text=${encodeURIComponent(text)}&page=${page}`;

      if (area) {
        url += `&area=${area}`;
      }


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
      return rejectWithValue('Произошла неизвестная ошибка');
    }
  }
);

// 3. Добавляем pages в initialState
const initialState: VacanciesState = {
  list: [],
  pages: 0,
  loading: false,
  error: null,
};

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, action: PayloadAction<HHResponse>) => {
        state.loading = false;
        state.list = action.payload.items;
        // 4. Сохраняем общее количество страниц из ответа API (HH.ru присылает поле pages)
        state.pages = action.payload.pages;
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const vacanciesReducer = vacanciesSlice.reducer;
