import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast,
  Progress,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EditPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const toastIdRef = React.useRef();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAvatarUrl(image[Math.floor(Math.random() * image.length)]);
  }, []);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const data = {
        name: name,
        age: Number(age),
        email: email,
        avatarUrl: avatarUrl,
      };

      const response = await axios.post(
        `http://localhost:4000/api/users/`,
        data
      );
      // console.log(response.data.status)
      if (response.data.status === "duplicate")
        addToast("warning", response.data.message);
      else if (response.data.status === "emailNotValid")
        addToast("warning", response.data.message);
      else if (response.data.status === "success") {
        setIsLoaded(true);
        setTimeout(() => {
          // console.log("Delayed for 1.5 second.");
          setIsLoaded(true);
          addToast("success", response.data.message);
          navigate(`/`);
        }, 1500);
      } else {
        navigate(`/`);
      }
    } catch (error) {
      console.log("error", error.response.data.status);

      if (error.response.data.status === "duplicate")
        addToast("warning", error.response.data.message);
      else if (error.response.data.status === "emailNotValid")
        addToast("warning", error.response.data.message);
      else if (error.response.data.status === "success") {
        setIsLoaded(true);
        setTimeout(() => {
          // console.log("Delayed for 1.5 second.");
          setIsLoaded(true);
          addToast("success", error.response.data.message);
          navigate(`/`);
        }, 1500);
      } else {
        navigate(`/`);
      }
    }
  };

  function addToast(status, msg) {
    toastIdRef.current = toast({
      status: status,
      description: msg,
    });
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        {isLoaded ? (
          <Progress size="xs" isIndeterminate />
        ) : (
          <form onSubmit={handleSubmit}>
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
              User Profile Create
            </Heading>
            <FormControl id="userName">
              <FormLabel>User Icon</FormLabel>
              <Stack direction={["column", "row"]} spacing={6}>
                <Center>
                  <Avatar size="xl" src={avatarUrl} alt={name}>
                    {/* <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon onClick={() => console.log("test")} />}
                /> */}
                  </Avatar>
                </Center>
                {/* <Center w="full">
                  <Button w="full">Change Icon</Button>
                </Center> */}
              </Stack>
            </FormControl>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                _placeholder={{ color: "gray.500" }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="age" isRequired>
              <FormLabel>Age</FormLabel>
              <Input
                placeholder="Age"
                _placeholder={{ color: "gray.500" }}
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: "gray.500" }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Stack spacing={6} direction={["column", "row"]}>
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
                onClick={() => navigate(`/`)}
              >
                Cancel
              </Button>
              <Button
                bg={"blue.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "blue.500",
                }}
                type="submit"
              >
                Submit
              </Button>
            </Stack>
          </form>
        )}
      </Stack>
    </Flex>
  );
}

const image = [
  "https://robohash.org/beataecupiditateet.png?size=50x50&set=set1",
  "https://robohash.org/accusantiumrerumneque.png?size=50x50&set=set1",
  "https://robohash.org/ipsainciduntet.png?size=50x50&set=set1",
  "https://robohash.org/perspiciatisestmodi.png?size=50x50&set=set1",
  "https://robohash.org/perspiciatisestmodi.png?size=50x50&set=set1",
  "https://robohash.org/dolorumquasquaerat.png?size=50x50&set=set1",
  "https://robohash.org/doloribusnonitaque.png?size=50x50&set=set1",
  "https://robohash.org/voluptatemdoloribusdolores.png?size=50x50&set=set1",
  "https://robohash.org/utvitaeillo.png?size=50x50&set=set1",
  "https://robohash.org/earumtemporesunt.png?size=50x50&set=set1",
];
