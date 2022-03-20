import { useState, useEffect } from 'react';
import { db } from '../utils/init-firebase';
import { 
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp } from 'firebase/firestore';
 import { 
  Container,
  Heading,
  Box,
  Text,
  Stack,
  HStack,
  Button,
  Avatar,
  Icon,
  Input,
  Textarea,
  useToast,
  FormControl,
  chakra } from '@chakra-ui/react';
import { TiDeleteOutline, TiHeartOutline } from "react-icons/ti";
import { useAuth } from "../contexts/AuthContext"




function Forum() {
  const [newTitle, setNewTitle] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [posts, setPosts] = useState([]);
  const postsCollectionRef = collection( db, "posts")
  const { currentUser } = useAuth()
  const toast = useToast()

  const createPosts = async () => {
    await addDoc(
      postsCollectionRef, {
        avatar: currentUser.photoURL, 
        user: currentUser.displayName, 
        title: newTitle, 
        message: newMsg, 
        likes: 0, 
        created: serverTimestamp()
      })
    window.location.reload();
  }

  const likePost = async ( id, likes) => {
    const postDoc = doc(db, "posts", id);
    const newFields = { likes: likes + 1 };
    await updateDoc(postDoc, newFields);
    window.location.reload();
  }

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    window.location.reload();
  };

  useEffect(() => {
    const postsCollectionRef = collection( db, "posts")
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    getPosts();
  }, [])

  return (
  <div>
    <chakra.form
    align="center"
    onSubmit={async e => {
      e.preventDefault()
      
      if(!newTitle || !newMsg) {
        toast({
          description: "Inputs can not be empty",
          status: "error",
          duration: 5000,
          isClosable: true
        })
      } else {
      createPosts(newTitle, newMsg)
      }
    }}
    >
      <Stack spacing='2' align="center">
        <FormControl id="newTitle">
          <Input 
            maxW={'60%'}
            w={'full'}
            placeholder='Title...' 
            onChange={(event) => {
              setNewTitle(event.target.value);
            }} 
          />
        </FormControl>
        <FormControl id="newMsg">
          <Textarea 
            maxlength={"250"}
            maxW={'60%'}
            w={'full'}
            h={'100px'}
            placeholder='Message...'
            onChange={(event) => {
              setNewMsg(event.target.value);
            }}
          />
        </FormControl>
        <Button type='submit' colorScheme={'green'} >Create Post</Button>
      </Stack>
    </chakra.form>
    {posts.map((post) => {
      return (
        
        <Container>
          <Box
            maxW={'100%'}
            w={'full'}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}
            my="10"
          >

            <Stack direction={'row'} m={'5'} >
              <Stack align={'center'} w={'100px'} mx={'2'} mr={'5'} >
                  <Avatar 
                    src={post.avatar} 
                    w={'70px'} 
                    h={'70px'}
                    css={{
                      border: '2px solid white',
                      borderRadius: '50%'
                    }} 
                    />   
                  <Heading size="sm" align={'left'} >{post.user}</Heading>
                  <Text fontSize={'12'} >{new Date(post.created.seconds * 1000).toLocaleDateString("en-US")}</Text>
              </Stack>
              <Stack >
                <Heading size="xs" >{post.title}</Heading>
                <Text>{post.message}</Text>
              </Stack>
            </Stack>
            
            <HStack direction={'row'} justify={'right'} m={'4'} > 
              <Button
                p={'3'}
                color={'white'}
                colorScheme={'red'}
                onClick={() => {
                    likePost(post.id, post.likes);
                }}>
                <Text align={'left'} >{post.likes}</Text>
                <Icon as={TiHeartOutline} w={5} h={5} ml={'1'} />
              </Button>
              <Button
                p={'1'}
                fontSize='12'
                onClick={() => {
                  deletePost(post.id);
                }}>
                <Icon as={TiDeleteOutline} w={5} h={5} />
                Delete
              </Button>
            </HStack>

          </Box>
        </Container>
        
      );
    })}
  </div>
  )
}

export default Forum;