import { useState, useEffect } from 'react';
import { db } from '../utils/init-firebase';
import { 
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
 } from 'firebase/firestore'
 import { 
  Container,
  Heading,
  Box,
  Text,
  Stack,
  Button,
  Avatar,
  Icon,
  Input
} from '@chakra-ui/react'
import { FcLike } from "react-icons/fc";

import { useAuth } from "../contexts/AuthContext"

function Forum() {
  const [newTitle, setNewTitle] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [posts, setPosts] = useState([]);
  const postsCollectionRef = collection( db, "posts")
  const { currentUser } = useAuth()

  const createPosts = async () => {
    await addDoc(postsCollectionRef, {avatar: currentUser.photoURL, user: currentUser.displayName, title: newTitle, message: newMsg, likes: 0})
  }

  const likePost = async ( id, likes) => {
    const postDoc = doc(db, "posts", id);
    const newFields = { likes: likes + 1 };
    await updateDoc(postDoc, newFields);
  }

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
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
    <Input 
    placeholder='Title...' 
    onChange={(event) => {
      setNewTitle(event.target.value);
    }} 
    />
    <Input 
    placeholder='Message...'
    onChange={(event) => {
      setNewMsg(event.target.value);
    }}
    />
    <button onClick={createPosts}>Create Post</button>

    {posts.map((post) => {
      return (
        
        <Container>
          <Box
            maxW={'100%'}
            w={'full'}
            bg={'gray.200'}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}
            my="10"
          >
            {" "}
            <Stack direction={'row'} m={'5'} >
              <Stack align={'center'} w={'100px'} >
                  <Avatar 
                    src={post.avatar} 
                    w={'100px'} 
                    h={'100px'}
                    css={{
                      border: '2px solid white',
                      borderRadius: '50%'
                    }} 
                    />   
                  <Text align={'left'} >{post.user}</Text>
              </Stack>
              <Stack>
                <Heading size="md" >{post.title}</Heading>
                <Text>{post.message}</Text>
              </Stack>
            </Stack>
            
            <Stack direction={'row'} justify={'right'} m={'2'} >
              <Icon as={FcLike}  />
              <Text align={'left'}  >{post.likes}</Text>
              <Button
                onClick={() => {
                    likePost(post.id, post.likes);
                }}>
              {" "}
              Like post
              </Button>
              <Button
                onClick={() => {
                  deletePost(post.id);
                }}>
                {" "}
                Delete Post
              </Button>
            </Stack>

          </Box>
        </Container>
        
      );
    })}
  </div>
  )
}

export default Forum;