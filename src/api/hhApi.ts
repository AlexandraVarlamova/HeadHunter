// // src/api/hhApi.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { type HHResponse } from '../types';

// export const hhApi = createApi({
//   reducerPath: 'hhApi',
//   baseQuery: fetchBaseQuery({ 
//     baseUrl: '/api/', 
//     prepareHeaders: (headers) => {
//       // 👇 ИСПОЛЬЗУЕМ developer@example.com
//       // Надеемся, что API HeadHunter сочтет его достаточно "реальным" для тестовых запросов.
//       headers.set('User-Agent', 'JobFinderApp/1.0 (alexandra210492@yandex.ru)'); 
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getVacancies: builder.query<HHResponse, Record<string, any>>({
//       query: (params) => ({
//         url: 'vacancies',
//         params: {           
//           industry: '7',
//           professional_role: '96',
//           per_page: '10',
//           search_field: 'snippet', // Ищем по тексту в сниппете (требования/обязанности)
//           ...params,
//         },
//       }),
//     }),
//   }),
// });

// export const { useGetVacanciesQuery } = hhApi;
