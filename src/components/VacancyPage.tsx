import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVacancyById,
  clearCurrentVacancy,
} from "../store/slices/vacanciesSlice";
import { type RootState, type AppDispatch } from "../store/store";
import {
  Container,
  Title,
  Text,
  Button,
  Loader,
  Center,
  Stack,
  Divider,
} from "@mantine/core";

const HtmlContent = ({
  content,
  fallback,
}: {
  content?: string;
  fallback: string;
}) => {
  if (!content) return <Text>{fallback}</Text>;
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

const VacancyPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentVacancy, detailsLoading, detailsError } = useSelector(
    (state: RootState) => state.vacancies,
  );

  const vacancy = (currentVacancy as any)?.job
    ? (currentVacancy as any).job
    : currentVacancy;

  useEffect(() => {
    if (id) {
      dispatch(fetchVacancyById(id));
    }
    return () => {
      dispatch(clearCurrentVacancy());
    };
  }, [id, dispatch]);

  if (detailsLoading) {
    return (
      <Center style={{ height: "80vh" }}>
        <Loader size="xl" />
        <Text mt="sm">Загрузка вакансии...</Text>
      </Center>
    );
  }

  if (detailsError) {
    return (
      <Center style={{ height: "80vh" }}>
        <Stack align="center">
          <Text c="red">Ошибка: {detailsError}</Text>
          <Button onClick={() => navigate("/vacancies")}>
            Вернуться назад
          </Button>
        </Stack>
      </Center>
    );
  }

  if (!vacancy) {
    return (
      <Center style={{ height: "80vh" }}>
        <Text>Вакансия не найдена</Text>
      </Center>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Button
          variant="subtle"
          onClick={() => navigate(-1)}
          align="flex-start"
        >
          ← Назад
        </Button>

        <Title order={1} c="blue">
          {vacancy.name}
        </Title>

        {vacancy.company_name && (
          <Text size="lg" fw={600}>
            Компания: {vacancy.company_name}
          </Text>
        )}

        {vacancy.salary && (
          <Text fw={700} size="md">
            Зарплата: {vacancy.salary}
          </Text>
        )}

        <Divider />

        <div>
          <Title order={3} mb="xs">
            Описание вакансии:
          </Title>
          <HtmlContent
            content={vacancy.description}
            fallback="Описание отсутствует."
          />
        </div>

        <Divider />

        <div>
          <Title order={3} mb="xs">
            О компании:
          </Title>
          <HtmlContent
            content={vacancy.about_company}
            fallback="Информация отсутствует."
          />
        </div>
      </Stack>
    </Container>
  );
};

export default VacancyPage;
