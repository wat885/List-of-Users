import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "id",
    selector: (row) => row.id,
    width: "100px",
  },
  {
    name: "coverimage",
    cell: (row, index, column, id) => (
      <img
        src={row.coverimage}
        width={150}
        alt={row.name}
        onClick={(e) => {
          console.log(row);
          console.log(index);
          console.log(column);
          console.log(id);
        }}
      ></img>
    ),
    selector: (row) => row.coverimage,
    width: "200px",
  },
  {
    name: "name",
    selector: (row) => row.name,
  },
  {
    name: "detail",
    selector: (row) => row.detail,
  },
  {
    name: "latitude",
    selector: (row) => row.latitude,
  },
  {
    name: "longitude",
    selector: (row) => row.longitude,
  },
];

function UserPage() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  console.log(items);

  useEffect(() => {
    fetchData(1 , perPage);
  }, []);

  const fetchData = async (page, per_page) => {
    fetch(
      ` https://www.melivecode.com/api/attractions?page=${page}&per_page=${per_page}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.data);
          setTotalRows(result.total);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const handlePageChange = (page) => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    fetchData(page, newPerPage);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <DataTable
          columns={columns}
          data={items}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
        />
      </div>
    );
  }
}

export default UserPage;
