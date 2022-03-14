import React from 'react'
import { Layout } from '../components/Layout'
import { 
  chakra, 
  Container, 
  Heading,
  Avatar,
  Box,
  Center,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue, 
} from '@chakra-ui/react'

import { useAuth } from "../contexts/AuthContext"

export default function Profilepage() {
  const { currentUser } = useAuth()
  
  return (
    <Layout>
      <Center py={6}>
        <Box
          maxW={'50%'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}>
          <Box
            h={'120px'}
            w={'full'}
            backgroundColor={"green.800"}
            objectFit={'cover'}
          ></Box>
          <Flex justify={'center'} mt={-12}>
            <Avatar
              size={'xl'}
              src={currentUser.photoURL}
              alt={'Current user avatar'}
              css={{
                border: '2px solid white',
                borderRadius: '50%'
              }}
            />
          </Flex>
          <Box p={6}>
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
              {currentUser.displayName}
              </Heading>
              <Text color={'gray.500'}>{currentUser.email}</Text>
              <Text color={'gray.500'}>{currentUser.createdAt}</Text>
            </Stack>
            <Button
              w={'full'}
              mt={8}
              bg={useColorModeValue('#151f21', 'gray.900')}
              color={'white'}
              rounded={'md'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}>
              Edit
            </Button>
          </Box>
        </Box>
      </Center>
      <Container maxW='container.lg' overflowX='auto' py={4}>
        <chakra.pre>
          {JSON.stringify(currentUser, null, 2)}
        </chakra.pre>
      </Container>
    </Layout>
  )
}
