import { Flex, Text, Container } from '@mantine/core';
import hhLogo from '../assets/hh.svg';

export const Header = () => {
  return (
    <div style={{ borderBottom: '1px solid #eaeaea', marginBottom: '20px' }}>
      <Container size="lg">
        <Flex justify="space-between" align="center" h={60}>
          
     
          <Flex align="center" gap="xs">
            <img src={hhLogo} alt="hh logo" style={{ height: '28px', display: 'block' }} />
            
            <Text fw={700} c="black" size="xl">
              FrontEnd
            </Text>
          </Flex>

          <Text fw={500} style={{ cursor: 'pointer' }}>Вакансии FE</Text>
        </Flex>
      </Container>
    </div>
  );
};
