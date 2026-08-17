// // import { useState, useEffect } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   Container,
// //   Grid,
// //   TextInput,
// //   Button,
// //   Select,
// //   Pagination,
// //   Title,
// //   Pill,
// //   Group,
// //   ActionIcon,
// //   Loader,
// //   Center,
// //   Text,
// //   Autocomplete,
// // } from "@mantine/core";
// // import { Header } from "./components/Header";
// // import { JobCard } from "./components/JobCard";
// // import { type RootState, type AppDispatch } from "./store/store";
// // import { fetchVacancies } from "./store/slices/vacanciesSlice";
// // import { VACANCIES } from "./mok/vacancies";
// // import { Routes, Route } from "react-router-dom";

// // interface Skill {
// //   name: string;
// //   active: boolean;
// // }

// // export default function App() {
// //   const dispatch = useDispatch<AppDispatch>();
// //   const { list, pages, loading, error } = useSelector(
// //     (state: RootState) => state.vacancies,
// //   );

// //   const [searchInput, setSearchInput] = useState("");
// //   const [searchText, setSearchText] = useState("");

// //   const [area, setArea] = useState<string | null>(null);
// //   const [page, setPage] = useState(1);
// //   const [skillInput, setSkillInput] = useState("");

// //   const [skills, setSkills] = useState<Skill[]>([
// //     { name: "TypeScript", active: false },
// //     { name: "React", active: false },
// //     { name: "Redux", active: false },
// //     { name: "Pyton", active: false },
// //   ]);

// //   useEffect(() => {
// //     const activeSkills = skills.filter((s) => s.active).map((s) => s.name);
// //     const fullSearchText = [searchText, ...activeSkills].join(" ");

// //     dispatch(
// //       fetchVacancies({
// //         text: fullSearchText,
// //         area: area,
// //         page: String(page),
// //       }),
// //     );
// //   }, [page, searchText, skills, area, dispatch]);

// //   const handleAddSkill = () => {
// //     if (skillInput && !skills.find((s) => s.name === skillInput)) {
// //       setSkills([...skills, { name: skillInput, active: true }]);
// //     }
// //     setSkillInput("");
// //   };

// //   const handleRemoveSkill = (skillNameToRemove: string) => {
// //     setSkills(skills.filter((s) => s.name !== skillNameToRemove));
// //   };

// //   const toggleSkill = (skillNameToToggle: string) => {
// //     setSkills(
// //       skills.map((s) =>
// //         s.name === skillNameToToggle ? { ...s, active: !s.active } : s,
// //       ),
// //     );
// //     setPage(1);
// //   };

// //   const handleSearch = () => {
// //     setSearchText(searchInput);
// //     setPage(1);
// //   };

// //   const jobSuggestions = Array.from(
// //     new Set(VACANCIES.items.map((vacancy: any) => vacancy.name)),
// //   );

// //   const cityOptions = Array.from(
// //     new Set(
// //       VACANCIES.items
// //         .filter((item: any) => item.area && item.area.name)
// //         .map((item: any) => item.area.name),
// //     ),
// //   ).map((name) => ({
// //     value: name as string,
// //     label: name as string,
// //   }));

// //   return (
// //     <div>
// //       <Header />
// //       <Container size="lg" py="xl">
// //         <Title order={2} mb="md">
// //           Список вакансий
// //           <br />
// //           <Text c="dimmed" size="md" fw={400}>
// //             по профессии Frontend-разработчик
// //           </Text>
// //         </Title>

// //         <Grid>
// //           <Grid.Col span={{ base: 12, md: 4 }}>
// //             <div
// //               style={{
// //                 background: "#f8f9fa",
// //                 padding: "20px",
// //                 borderRadius: "8px",
// //               }}
// //             >
// //               <TextInput
// //                 label="Ключевые навыки"
// //                 placeholder="Например, Next.js"
// //                 value={skillInput}
// //                 onChange={(e) => setSkillInput(e.currentTarget.value)}
// //                 onKeyDown={(e) => {
// //                   if (e.key === "Enter") handleAddSkill();
// //                 }}
// //                 rightSection={
// //                   <ActionIcon
// //                     onClick={handleAddSkill}
// //                     variant="filled"
// //                     color="blue"
// //                     size="sm"
// //                   >
// //                     +
// //                   </ActionIcon>
// //                 }
// //                 mb="sm"
// //               />

// //               <Group gap="xs" mb="lg">
// //                 {skills.map((skill) => (
// //                   <Pill
// //                     key={skill.name}
// //                     withRemoveButton
// //                     onRemove={() => handleRemoveSkill(skill.name)}
// //                     onClick={() => toggleSkill(skill.name)}
// //                     style={{
// //                       cursor: "pointer",
// //                       transition: "all 0.2s",
// //                       backgroundColor: skill.active ? "#228be6" : "#e9ecef",
// //                       color: skill.active ? "white" : "#495057",
// //                       opacity: skill.active ? 1 : 0.7,
// //                     }}
// //                   >
// //                     {skill.name}
// //                   </Pill>
// //                 ))}
// //               </Group>

// //               <Select
// //                 label="Город"
// //                 placeholder="Все города"
// //                 data={cityOptions}
// //                 value={area}
// //                 onChange={(val) => {
// //                   setArea(val ? String(val) : null);
// //                   setPage(1);
// //                 }}
// //                 clearable
// //               />
// //             </div>
// //           </Grid.Col>
// //           <Grid.Col span={{ base: 12, md: 8 }}>
// //             <Group mb="lg">
// //               <Autocomplete
// //                 placeholder="Должность или название компании"
// //                 style={{ flexGrow: 1 }}
// //                 value={searchInput}
// //                 onChange={setSearchInput}
// //                 onKeyDown={(e) => {
// //                   if (e.key === "Enter") handleSearch();
// //                 }}
// //                 data={jobSuggestions}
// //               />
// //               <Button onClick={handleSearch} color="blue">
// //                 Найти
// //               </Button>
// //             </Group>

// //             {loading && (
// //               <Center py="xl">
// //                 <Loader />
// //               </Center>
// //             )}

// //             {error && (
// //               <Center py="xl">
// //                 <Text c="red">Сервис временно недоступен {error}</Text>
// //               </Center>
// //             )}

// //             {!loading &&
// //               !error &&
// //               list.map((vacancy) => (
// //                 <JobCard key={vacancy.id} vacancy={vacancy} />
// //               ))}

// //             {!loading && !error && pages > 1 && (
// //               <Center mt="xl">
// //                 <Pagination
// //                   total={Math.min(pages, 100)}
// //                   value={page}
// //                   onChange={setPage}
// //                 />
// //               </Center>
// //             )}

// //             {!loading && !error && list.length === 0 && (
// //               <Center py="xl">
// //                 <Text>По вашему запросу вакансии не найдены.</Text>
// //               </Center>
// //             )}
// //           </Grid.Col>
// //         </Grid>
// //       </Container>
// //     </div>
// //   );
// // }


import { Routes, Route } from "react-router-dom";
import Header  from "./components/Header";
import VacanciesPage from "./pages/VacanciesPage";
import VacancyPage from "./components/VacancyPage";

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<VacanciesPage />} />
        <Route path="/vacancies/:id" element={<VacancyPage />} />
      </Routes>
    </div>
  );
}
