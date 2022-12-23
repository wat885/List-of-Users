import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

import { FiTrash2, FiUser, FiEdit } from "react-icons/fi";
import { SearchIcon } from "@chakra-ui/icons";

function UserPage() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const columns = [
    {
      name: "Id",
      selector: (row) => row.user_id,
      width: "10%",
    },
    {
      name: "Avatar",
      selector: (row) => row.avatarurl,
      cell: (row) => (
        <img
          src={row.avatarurl}
          width={50}
          alt={row.avatarurl}
          onClick={() => {
            console.log(row);
            // console.log(index);
            // console.log(column);
            // console.log(id);
          }}
        />
      ),
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
          >
            <Icon as={FiEdit} fontSize="20" />
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => {
              console.log("remove user!", row.user_id);
            }}
            size="sm"
          >
            <Icon as={FiTrash2} fontSize="20" />
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchData(1, perPage, search);
  }, [search]);

  console.log(search);

  const fetchData = async (page, per_page, search) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/?q=${search}&start=${page}&limit=${per_page}`
      );
      setIsLoaded(true);
      setItems(response.data.data);
      console.log(items);
      setTotalRows(response.data.total);
    } catch (error) {
      setIsLoaded(true);
      setError(error);
    }
  };

  const handlePageChange = (page) => {
    fetchData(page, perPage, search);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
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
