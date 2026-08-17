import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Container, Grid, TextInput, Button, Select, Pagination, Title,
  Pill, Group, ActionIcon, Loader, Center, Text, Autocomplete,
} from "@mantine/core";
import { JobCard } from "../components/JobCard";
import { type RootState, type AppDispatch } from "../store/store";
import { fetchVacancies } from "../store/slices/vacanciesSlice";
import { VACANCIES } from "../mok/vacancies";

interface Skill {
  name: string;
  active: boolean;
}

const VacanciesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, pages, loading, error } = useSelector((state: RootState) => state.vacancies);
  const [searchParams, setSearchParams] = useSearchParams();


  const initialSearch = searchParams.get("search") || "";
  const initialArea = searchParams.get("area") || null;
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSkillsStr = searchParams.get("skills") || "";
  const activeSkillsFromUrl = initialSkillsStr ? initialSkillsStr.split(",") : [];


  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchText, setSearchText] = useState(initialSearch);
  const [area, setArea] = useState(initialArea);
  const [page, setPage] = useState(initialPage);
  const [skillInput, setSkillInput] = useState("");


  const [skills, setSkills] = useState<Skill[]>(() => {
    const defaultSkills = ["TypeScript", "React", "Redux", "Python"];
    const allSkillNames = Array.from(new Set([...defaultSkills, ...activeSkillsFromUrl]));

    return allSkillNames.map((name) => ({
      name,
      active: activeSkillsFromUrl.includes(name),
    }));
  });


  useEffect(() => {
    const params = new URLSearchParams();

    if (searchText) params.set("search", searchText);
    if (area) params.set("area", area);
    if (page > 1) params.set("page", String(page));

    const activeSkills = skills.filter((s) => s.active).map((s) => s.name);
    if (activeSkills.length > 0) {
      params.set("skills", activeSkills.join(","));
    }


    setSearchParams(params, { replace: true });
  }, [searchText, area, skills, page, setSearchParams]);


  useEffect(() => {
    const activeSkills = skills.filter((s) => s.active).map((s) => s.name);
    const fullSearchText = [searchText, ...activeSkills].join(" ");

    dispatch(
      fetchVacancies({
        text: fullSearchText,
        area: area,
        page: String(page),
      })
    );
  }, [page, searchText, skills, area, dispatch]);

  const handleAddSkill = () => {
    if (skillInput && !skills.find((s) => s.name === skillInput)) {
      setSkills([...skills, { name: skillInput, active: true }]);
    }
    setSkillInput("");
    setPage(1);
  };

  const handleRemoveSkill = (skillNameToRemove: string) => {
    setSkills(skills.filter((s) => s.name !== skillNameToRemove));
    setPage(1);
  };

  const toggleSkill = (skillNameToToggle: string) => {
    setSkills(
      skills.map((s) =>
        s.name === skillNameToToggle ? { ...s, active: !s.active } : s
      )
    );
    setPage(1);
  };

  const handleSearch = () => {
    setSearchText(searchInput);
    setPage(1);
  };

  const jobSuggestions = Array.from(new Set(VACANCIES.items.map((v: any) => v.name)));
  const cityOptions = Array.from(
    new Set(VACANCIES.items.filter((item: any) => item.area?.name).map((item: any) => item.area.name))
  ).map((name) => ({ value: name as string, label: name as string }));

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="md">
        Список вакансий<br />
        <Text c="dimmed" size="md" fw={400}>по профессии Frontend-разработчик</Text>
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
            <TextInput
              label="Ключевые навыки" placeholder="Например, Next.js"
              value={skillInput} onChange={(e) => setSkillInput(e.currentTarget.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddSkill(); }}
              rightSection={<ActionIcon onClick={handleAddSkill} variant="filled" color="blue" size="sm">+</ActionIcon>}
              mb="sm"
            />
            <Group gap="xs" mb="lg">
              {skills.map((skill) => (
                <Pill
                  key={skill.name} withRemoveButton onRemove={() => handleRemoveSkill(skill.name)}
                  onClick={() => toggleSkill(skill.name)}
                  style={{
                    cursor: "pointer", transition: "all 0.2s",
                    backgroundColor: skill.active ? "#228be6" : "#e9ecef",
                    color: skill.active ? "white" : "#495057",
                    opacity: skill.active ? 1 : 0.7,
                  }}
                >
                  {skill.name}
                </Pill>
              ))}
            </Group>
            <Select
              label="Город" placeholder="Все города" data={cityOptions} value={area}
              onChange={(val) => { setArea(val); setPage(1); }} clearable
            />
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Group mb="lg">
            <Autocomplete
              placeholder="Должность или название компании" style={{ flexGrow: 1 }}
              value={searchInput} onChange={setSearchInput}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              data={jobSuggestions}
            />
            <Button onClick={handleSearch} color="blue">Найти</Button>
          </Group>

          {loading && <Center py="xl"><Loader /></Center>}
          {error && <Center py="xl"><Text c="red">Сервис временно недоступен {error}</Text></Center>}

          {!loading && !error && list.map((vacancy) => <JobCard key={vacancy.id} vacancy={vacancy} />)}

          {!loading && !error && pages > 1 && (
            <Center mt="xl"><Pagination total={Math.min(pages, 100)} value={page} onChange={setPage}/></Center>
          )}
          {!loading && !error && list.length === 0 && (
            <Center py="xl"><Text>По вашему запросу вакансии не найдены.</Text></Center>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default VacanciesPage;
