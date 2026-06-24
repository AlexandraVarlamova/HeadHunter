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
      await new Promise((resolve) => setTimeout(resolve, 100));
      let filteredItems = VACANCIES.items || [];

      if (area) {
        filteredItems = filteredItems.filter(
          (item) =>
            String(item.area?.id) === String(area) || item.area?.name === area,
        );
      }

      if (text) {
        const searchWords = text
          .toLowerCase()
          .replace(/[-,.]/g, " ")
          .split(/\s+/)
          .filter(Boolean);

        filteredItems = filteredItems.filter((item) => {
          const skillsText = Array.isArray(item.key_skills)
            ? item.key_skills.map((skill: any) => skill.name).join(" ")
            : "";

          const employerName = item.employer?.name || "";

          const fullVacancyText = [item.name || "", employerName, skillsText]
            .join(" ")
            .toLowerCase()
            .replace(/[-,.]/g, " ");

          return searchWords.every((word) => fullVacancyText.includes(word));
        });
      }

      const perPage = 5;
      let currentPage = parseInt(page, 10);
      if (isNaN(currentPage)) currentPage = 0;

      const MathPages = Math.ceil(filteredItems.length / perPage);
      const apiPage = currentPage > 0 ? currentPage - 1 : 0;
      const start = apiPage * perPage;
      const end = start + perPage;
      const slicedItems = filteredItems.slice(start, end);

      const data: HHResponse = {
        ...VACANCIES,
        items: slicedItems,
        pages: MathPages,
        page: currentPage,
      };

      return data;
    } catch (error) {
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
