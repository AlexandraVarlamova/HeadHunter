import { Card, Text, Badge, Group, Button, Stack } from "@mantine/core";
import { type Vacancy } from "../types";

interface Props {
  vacancy: Vacancy;
}

export const JobCard = ({ vacancy }: Props) => {
  const formatSalary = () => {
    if (!vacancy.salary) return "Зарплата не указана";
    const { from, to, currency } = vacancy.salary;
    if (from && to) return `${from} - ${to} ${currency}`;
    if (from) return `от ${from} ${currency}`;
    if (to) return `до ${to} ${currency}`;
    return "Зарплата не указана";
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="sm">
      <Stack gap="xs">
        <Text fw={600} size="lg" c="blue">
          {vacancy.name}
        </Text>

        <Group gap="xs">
          <Text fw={700}>{formatSalary()}</Text>
          <Text c="dimmed">•</Text>
          <Text c="dimmed">{vacancy.experience?.name}</Text>
        </Group>

        <Group gap="xs">
          <Text>{vacancy.employer?.name}</Text>
          <Badge variant="light" color="gray">
            {vacancy.schedule?.name}
          </Badge>
        </Group>

        <Text c="dimmed" size="sm">
          {vacancy.area?.name}
        </Text>

        <Group mt="md">
          <Button variant="default" color="gray">
            Смотреть вакансию
          </Button>
          <Button
            component="a"
            href={vacancy.alternate_url}
            target="_blank"
            color="blue"
          >
            Откликнуться
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};
