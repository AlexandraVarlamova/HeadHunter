import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  TextInput,
  Button,
  Select,
  Pagination,
  Title,
  Pill,
  Group,
  ActionIcon,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import { Header } from "./components/Header";
import { JobCard } from "./components/JobCard";
import { type RootState, type AppDispatch } from "./store/store";
import { fetchVacancies } from "./store/slices/vacanciesSlice";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, pages, loading, error } = useSelector(
    (state: RootState) => state.vacancies,
  );

  const [searchText, setSearchText] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "React",
    "Redux",
  ]);
  const [skillInput, setSkillInput] = useState("");

  //загрузка вакансий

  useEffect(() => {
    const skillsQuery = skills.join(" OR ");

    const fullSearchText = [searchText, skillsQuery].filter(Boolean).join(" ");

    dispatch(
      fetchVacancies({
        text: fullSearchText,
        area: area,
      }),
    );
  }, [page, searchText, skills, area, dispatch]);



  const handleAddSkill = () => {
    if (skillInput) {
      setSkills([...skills, skillInput]);
    }

    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((currentSkill) => {
      return currentSkill !== skillToRemove;
    });

    setSkills(updatedSkills);
  };

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div>
      <Header />
      <Container size="lg" py="xl">
        <Title order={2} mb="md">
          Список вакансий
          <br />
          <Text c="dimmed" size="md" fw={400}>
            по профессии Frontend-разработчик
          </Text>
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <div
              style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <TextInput
                label="Ключевые навыки"
                placeholder="Например, Next.js"
                value={skillInput}
                onChange={(e) => setSkillInput(e.currentTarget.value)}
                rightSection={
                  <ActionIcon
                    onClick={handleAddSkill}
                    variant="filled"
                    color="blue"
                    size="sm"
                  >
                    +
                  </ActionIcon>
                }
                mb="sm"
              />

              <Group gap="xs" mb="lg">
                {skills.map((skill) => (
                  <Pill
                    key={skill}
                    withRemoveButton
                    onRemove={() => handleRemoveSkill(skill)}
                  >
                    {skill}
                  </Pill>
                ))}
              </Group>

              <Select
                label="Город"
                placeholder="Все города"
                data={[
                  { value: "1", label: "Москва" },
                  { value: "2", label: "Уфа" },
                ]}
                value={area}
                onChange={(val) => setArea(val ? String(val) : null)}
                clearable
              />
            </div>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Group mb="lg">
              <TextInput
                placeholder="Должность или название компании"
                style={{ flexGrow: 1 }}
                value={searchText}
                onChange={(e) => setSearchText(e.currentTarget.value)}
              />

              <Button onClick={handleSearch} color="blue">
                Найти
              </Button>
            </Group>

            {loading && (
              <Center py="xl">
                <Loader />
              </Center>
            )}
            {error && (
              <Center py="xl">
                <Text c="red">Сервис временно недоступен {error}</Text>
              </Center>
            )}

            {!loading &&
              !error &&
              list.map((vacancy) => (
                <JobCard key={vacancy.id} vacancy={vacancy} />
              ))}

            {!loading && !error && pages > 1 && (
              <Center mt="xl">
                <Pagination
                  total={Math.min(pages, 100)}
                  value={page}
                  onChange={setPage}
                />
              </Center>
            )}

            {!loading && !error && list.length === 0 && (
              <Center py="xl">
                <Text>По вашему запросу вакансии не найдены.</Text>
              </Center>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
