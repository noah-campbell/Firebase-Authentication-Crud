import { Container, Badge } from '@chakra-ui/react'
import React from 'react'
import { Layout } from '../components/Layout'
import Forum from '../components/Forum';

export default function ProtectedPage() {
  return (
    <Layout>
      <Badge colorScheme='green' fontSize='lg' mx={4}>
        Protected Page
      </Badge>
      <Container maxW='container.lg' overflowX='auto' py={4}>
        <Forum />
      </Container>
    </Layout>
  )
}