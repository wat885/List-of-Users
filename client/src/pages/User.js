import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

const columns = [
  {
    name: "Id",
    selector: (row) => row.id,
    width: "100px",
  },
  {
    name: "Avatar",
    selector: (row) => row.avatar,
    cell: (row, index, column, id) => (
      <img
        src={row.avatar}
        width={100}
        alt={row.name}
        onClick={() => {
          console.log(row);
          console.log(index);
          console.log(column);
          console.log(id);
        }}
      />
    ),
  },
  {
    name: "Name",
    selector: (row) => row.first_name,
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
  },
];

function User() {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);


  const fetchUsers = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`
    );

    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };


  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1); // fetch page 1 of users
    console.log('use')
  }, []);

  
  return (
    <div>
      
      <DataTable
        title="Users"
        columns={columns}
        data={data}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />
    </div>
  );
}

export default User;
