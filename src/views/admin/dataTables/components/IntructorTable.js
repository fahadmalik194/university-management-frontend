import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
import { columnsIntructorColumns } from "views/admin/dataTables/variables/columnsData";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableInstructorDataColumns from "views/admin/dataTables/variables/tableInstructorDataColumns.json";
import { get } from "services/httpService";
import toast, { Toaster } from "react-hot-toast";
import DefaultTable from "./DefaultTable";

async function fetchAssignments() {
  try {
    return await get('/api/v1/assignment/getAll');
  } catch (error) {
    console.error("Error fetching assignments:", error);
    toast.error("Assignments Fetched Failed!");
    return [];
  }
}

function mapperFunction(assignmentData){
    console.log('assignmentData', assignmentData);
    return assignmentData.map((assignment) => ({
        "name": assignment.name,
        "description": assignment.description,
        "due-date": new Date(assignment.due_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }),
        "created-at": new Date(assignment.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }),
        "updated-at": new Date(assignment.updated_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }),
        "actions": ""
    }));
}

export default function InstructorTable() {
  const [assignments, setAssignments] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    fetchAssignments()
      .then((data) => {
        if(data.data.length > 0){;
            setAssignments(data.data[0].assignemnt);
            let mappedData = mapperFunction(data.data[0].assignemnt);
            setTableData(mappedData);
            toast.success("Assignments Fetched Successfuly!");
        } else {
            setAssignments([]);
            toast.loading("No Record Found!");
        }
      })
      .catch((error) => {
        setAssignments([]);
        console.error("Error fetching assignments:", error);
        toast.error("Assignments Fetched Failed!");
      });
  }, []);

  const columns = columnsIntructorColumns;
  const data = tableData;

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card
      direction="column"
      w="100%"
      h="750px"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Toaster 
        toastOptions={{
          duration: 5000,
          style: {
            width: 10000
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="20px"
          fontWeight="700"
          lineHeight="100%"
          mt="10px"
          mb="10px"
        >
          Instructor View
        </Text>
        <Menu />
      </Flex>
      {assignments.length <= 0 || tableData.length <= 0  ? (
        <DefaultTable/>
      ): (
            <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
                <Thead>
                {headerGroups.map((headerGroup, index) => (
                    <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                        <Th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        pe="10px"
                        key={index}
                        borderColor={borderColor}
                        >
                        <Flex
                            justify="space-between"
                            align="center"
                            fontSize={{ sm: "10px", lg: "12px" }}
                            color="gray.400"
                        >
                            {column.render("Header")}
                        </Flex>
                        </Th>
                    ))}
                    </Tr>
                ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                    prepareRow(row);
                    return (
                    <Tr {...row.getRowProps()} key={index}>
                        {row.cells.map((cell, index) => {
                        let data = "";
                        if (cell.column.Header === "NAME") {
                            data = (
                            <Flex align="center">
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                {cell.value}
                                </Text>
                            </Flex>
                            );
                        } else if (cell.column.Header === "DESCRIPTION") {
                            data = (
                            <Flex align="center">
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                {cell.value}
                                </Text>
                            </Flex>
                            );
                        } else if (cell.column.Header === "DUE DATE") {
                            data = (
                            <Flex align="center">
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                {cell.value}
                                </Text>
                            </Flex>
                            );
                        } else if (cell.column.Header === "CREATED AT") {
                            data = (
                            <Flex align="center">
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                {cell.value}
                                </Text>
                            </Flex>
                            );
                        } else if (cell.column.Header === "UPDATED AT") {
                            data = (
                            <Flex align="center">
                                <Text color={textColor} fontSize="sm" fontWeight="700">
                                {cell.value}
                                </Text>
                            </Flex>
                            );
                        } else if (cell.column.Header === "ACTIONS") {
                            data = (
                            <Flex align="center">
                                <Menu />
                            </Flex>
                            );
                        }
                        // else if (cell.column.Header === "DESCRIPTION") {
                        //   data = (
                        //     <Flex align='center'>
                        //       <Text
                        //         me='10px'
                        //         color={textColor}
                        //         fontSize='sm'
                        //         fontWeight='700'>
                        //         {cell.value}
                        //       </Text>
                        //     </Flex>
                        //   );
                        // } else if (cell.column.Header === "QUANTITY") {
                        //   data = (
                        //     <Text color={textColor} fontSize='sm' fontWeight='700'>
                        //       {cell.value}
                        //     </Text>
                        //   );
                        // } else if (cell.column.Header === "DATE") {
                        //   data = (
                        //     <Text color={textColor} fontSize='sm' fontWeight='700'>
                        //       {cell.value}
                        //     </Text>
                        //   );
                        // }
                        return (
                            <Td
                            {...cell.getCellProps()}
                            key={index}
                            fontSize={{ sm: "14px" }}
                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                            borderColor="transparent"
                            >
                            {data}
                            </Td>
                        );
                        })}
                    </Tr>
                    );
                })}
                </Tbody>
            </Table>
        )}
    </Card>
  );
}
