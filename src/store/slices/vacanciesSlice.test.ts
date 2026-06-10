import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { vacanciesReducer, fetchVacancies } from "./vacanciesSlice";

describe("vacanciesSlice test", () => {
  it("должен возвращать initial state при типе actions unknow", () => {
    const initialState = vacanciesReducer(undefined, { type: "unknown" });

    expect(initialState).toEqual({
      list: [],
      pages: 0,
      perPage: 5,
      loading: false,
      error: null,
    });
  });

  it("должен менять состояние loading на true в статусе fetchVacancies.pending", () => {
    const initialState = {
      list: [],
      pages: 0,
      perPage: 5,
      loading: false,
      error: "ошибка",
    };

    const action = { type: fetchVacancies.pending.type };
    const state = vacanciesReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("должен сохранять вакансии и страницы в статусе fetchVacancies.fulfilled", () => {
    const initialState = {
      list: [],
      pages: 0,
      perPage: 5,
      loading: true,
      error: null,
    };

    const mockPayload = {
      items: [{ id: "1", name: "Frontend Developer" }],
      pages: 3,
      page: 0,
    };

    const action = {
      type: fetchVacancies.fulfilled.type,
      payload: mockPayload,
    };

    const state = vacanciesReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.list).toHaveLength(1);
    expect(state.list[0].name).toBe("Frontend Developer");
    expect(state.pages).toBe(3);
  });

  it("должен сохранять ошибку в статусе fetchVacancies.rejected", () => {
    const initialState = {
      list: [],
      pages: 0,
      perPage: 5,
      loading: true,
      error: null,
    };

    const action = {
      type: fetchVacancies.rejected.type,
      payload: "Ошибка при загрузке",
    };

    const state = vacanciesReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Ошибка при загрузке");
  });

  it("должен успешно выполнять thunk fetchVacancies и обновлять state", async () => {
    const store = configureStore({
      reducer: { vacancies: vacanciesReducer },
    });

    await store.dispatch(
      fetchVacancies({ text: "React", page: "0", area: null }),
    );

    const state = store.getState().vacancies;

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.list.length).toBeLessThanOrEqual(5);
  });
});
