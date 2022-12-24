import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { FiTrash2, FiEdit } from "react-icons/fi";
import { SearchIcon } from "@chakra-ui/icons";

function UserPage() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const toast = useToast();
  const toastIdRef = React.useRef();

  const columns = [
    {
      name: "Id",
      selector: (row) => row.user_id,
      width: "10%",
    },
    {
      name: "Avatar",
      selector: (row) => row.avatarurl,
      cell: (row) => <img src={row.avatarurl} width={50} alt={row.avatarurl} />,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Age",
      selector: (row) => row.age,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },

    {
      name: "Action",
      selector: (row) => row.avatarUrl,
      cell: (row) => (
        <>
          <Button
            colorScheme="gray"
            onClick={() => {
              console.log(row.user_id);
              navigate(`/edit-profile/${row.user_id}`);
            }}
            size="sm"
            mr={1}
          >
            <Icon as={FiEdit} fontSize="20" />
          </Button>
          {/* <Button
            colorScheme="gray"
            onClick={() => {
              console.log("remove user!", row.user_id);
              deleteUser(row.user_id, perPage, page);
            }}
            size="sm"
          >
            <Icon as={FiTrash2} fontSize="20" />
          </Button> */}

          <AlertDialogExample user_id={row.user_id} />
        </>
      ),
    },
  ];

  function AlertDialogExample({ user_id }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    return (
      <>
        <Button colorScheme="gray" onClick={onOpen} size="sm">
          <Icon as={FiTrash2} fontSize="20" />
        </Button>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete User
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    onClose();
                    deleteUser(user_id, perPage, page);
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }

  useEffect(() => {
    fetchData(1, perPage, search);
  }, [search]);

  // console.log(search);
  // console.log(items)

  const fetchData = async (page, per_page, search) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/?q=${search}&start=${page}&limit=${per_page}`
      );
      setIsLoaded(true);
      setItems(response.data.data);
      // console.log(items);
      setTotalRows(response.data.total);
    } catch (error) {
      setIsLoaded(true);
      setError(error);
    }
  };

  const deleteUser = async (user_id, perPage, page) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/users/${user_id}`
      );
      console.log(response.data.status);
      if (response.data.status === "success") {
        addToast("success", "Successfully deleted");
      } else {
        addToast("error", "Failed to delete");
      }

      fetchData(page, perPage, search);
    } catch (error) {
      console.log(error);
    }
  };
  function addToast(status, msg) {
    toastIdRef.current = toast({
      status: status,
      description: msg,
    });
  }

  const handlePageChange = (page) => {
    setPage(page);

    fetchData(page, perPage, search);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPage(page);
    setPerPage(newPerPage);
    fetchData(page, newPerPage, search);
  };

  return (
    <Box p="12">
      <Flex alignItems="center" justify="space-between">
        <Heading size="lg" as="h3" maxWidth="300px">
          List of Users
        </Heading>
        <InputGroup maxWidth="600px">
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            type="Search"
            placeholder="Search"
            maxWidth="600px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button
          bg={"blue.400"}
          color={"white"}
          w="full"
          _hover={{
            bg: "blue.500",
          }}
          maxWidth="200px"
          onClick={() => {
            navigate(`/create-profile`);
          }}
        >
          Create user
        </Button>
      </Flex>
      <DataTable
        columns={columns}
        data={items}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
      />
    </Box>
  );
}

export default UserPage;
