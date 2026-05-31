// src/App.tsx
import { useState, type KeyboardEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Text
} from '@mantine/core';
import { Header } from './components/Header';
import { JobCard } from './components/JobCard';
import { type RootState, type AppDispatch } from './store/store';
import { fetchVacancies } from './store/slices/vacanciesSlice';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, pages, loading, error } = useSelector((state: RootState) => state.vacancies);

  const [searchText, setSearchText] = useState('');
  const [area, setArea] = useState<string | null>(null);
  const [page, setPage] = useState(1); // Mantine UI работает с 1 страницы
  const [skills, setSkills] = useState<string[]>(['TypeScript', 'React', 'Redux']);
  const [skillInput, setSkillInput] = useState('');

  // Универсальная функция для запуска поиска
  const triggerSearch = (targetPage: number) => {
    // Собираем скиллы в строку, например: "TypeScript OR React"
    const skillsQuery = skills.join(' OR ');
    
    // Объединяем текстовый поиск и скиллы
    const fullSearchText = [searchText, skillsQuery]
      .filter(Boolean) // Убирает пустые строки
      .join(' '); // Склеиваем через пробел
      
    dispatch(fetchVacancies({
      text: fullSearchText,
      page: targetPage - 1, // Отнимаем 1, т.к. API HH начинает счет с нулевой страницы
      area: area
    }));
  };

  // Эффект срабатывает при первой загрузке И при клике на пагинацию
  useEffect(() => {
    triggerSearch(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Зависимость только от page, чтобы при вводе текста не спамить API

  // Обработчик кнопки "Найти"
  const handleSearch = () => {
    if (page !== 1) {
      setPage(1); // Если мы были не на 1 странице, смена стейта вызовет useEffect
    } else {
      triggerSearch(1); // Если уже на 1-й, запрашиваем данные вручную
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleKeyDownSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddSkill();
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
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
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <TextInput 
                label="Ключевые навыки" 
                placeholder="Например, Next.js" 
                value={skillInput} 
                onChange={(e) => setSkillInput(e.currentTarget.value)} 
                onKeyDown={handleKeyDownSkill} 
                rightSection={
                  <ActionIcon onClick={handleAddSkill} variant="filled" color="blue" size="sm">
                    +
                  </ActionIcon>
                } 
                mb="sm" 
              />
              <Group gap="xs" mb="lg">
                {skills.map(skill => (
                  <Pill key={skill} withRemoveButton onRemove={() => handleRemoveSkill(skill)}>
                    {skill}
                  </Pill>
                ))}
              </Group>
              <Select 
  label="Город" 
  placeholder="Все города" 
  data={[
    { value: '1', label: 'Москва' }, 
    { value: '2', label: 'Санкт-Петербург' }
  ]} 
  value={area} 
  // ВАЖНО: вот здесь мы явно приводим тип
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
              <Button onClick={handleSearch} color="blue">Найти</Button>
            </Group>

            {loading && <Center py="xl"><Loader /></Center>}
            {error && <Center py="xl"><Text c="red">Произошла ошибка: {error} 😥</Text></Center>}
            
            {!loading && !error && list.map(vacancy => (
              <JobCard key={vacancy.id} vacancy={vacancy} />
            ))}
            
            {!loading && !error && pages > 1 && (
              <Center mt="xl">
                <Pagination total={Math.min(pages, 100)} value={page} onChange={setPage} />
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
