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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
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
import { columnsDataColumns } from "views/admin/dataTables/variables/columnsData";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import toast, { Toaster } from "react-hot-toast";
import { get, post, put } from "services/httpService";
import DefaultTable from "./DefaultTable";
import { MdUpload } from "react-icons/md";

async function fetchAssignments() {
  try {
    return await get("/submitassignment/getsubmittedassignments");
  } catch (error) {
    console.error("Error fetching assignments:", error);
    toast.error("Assignments Fetched Failed!");
    return [];
  }
}

async function editAssignment(id, data) {
  try {
    return await put(`/submitassignment/submitassignment?assignemnt_id=${id}`, data);
  } catch (error) {
    console.error("Error uploading assignment:", error);
    toast.error("Error Uploading Assignment");
    return [];
  }
}

function mapperFunction(assignmentData) {
  return assignmentData.map((assignment) => ({
    name: assignment.assignments.name,
    description: assignment.assignments.description,
    "submission-status": assignment.submission_status,
    "submission-date": (assignment.submission_date) ? new Date(assignment.submission_date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }
    ) : "-",
    "due-date": new Date(assignment.assignments.due_date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }
    ),
    "created-at": new Date(assignment.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
    "updated-at": new Date(assignment.updated_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
    actions: "",
  }));
}

function isUploadAssignment(dueDate, submissionStatus) {
  const currentDate = new Date();
  const parsedDueDate = new Date(dueDate);
  return parsedDueDate < currentDate || submissionStatus === 'submitted';
}

export default function StudentTable(props) {
  // Fetch
  const [assignments, setAssignments] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);

  // Uplaod
  const [uploadDataSolution, setUploadDataSolution] = React.useState([]);

  // Selected Assignment
  const [selectedAssignment, setSelectedAssignment] = React.useState({name: '', description: ''});
  
  function handleUploadInput(value) {
    setUploadDataSolution(value);
  }

  // Fetch
  const fetchAssignmentsData = () => {
    fetchAssignments()
      .then((response) => {
        if (response.code === 200) {
          if (response.data.studentAssignments.length > 0) {
            setAssignments(
              response.data.studentAssignments[0].submitted_assignments
            );
            let mappedData = mapperFunction(
              response.data.studentAssignments[0].submitted_assignments
            );
            setTableData(mappedData);
            // toast.success("Assignments Fetched Successfuly!");
          } else {
            setAssignments([]);
            toast.loading("No Record Found!");
          }
        } else {
          setAssignments([]);
          console.error("Error fetching assignments:", response);
          toast.error("Assignments Fetched Failed!");
        }
      })
      .catch((error) => {
        setAssignments([]);
        console.error("Error fetching assignments:", error);
        toast.error("Assignments Fetched Failed!");
      });
  };

  React.useEffect(() => {
    fetchAssignmentsData();
  }, []);

  const uploadAssignmentData = () => {
    editAssignment(selectedAssignment.id, {
      submission_date: new Date()
    })
      .then((response) => {
        if (response.code === 200) {
          toast.success("Assignment Uploaded Successfuly!");
          fetchAssignmentsData();
          closeUploadModal();
        } else {
          console.error("Error uploading assignment:", response);
          toast.error("Error Uploading Assignment!");
        }
      })
      .catch((error) => {
        console.error("Error uploading assignment:", error);
        toast.error("Error Uploading Assignment!");
      });
  }

  function handleUploadIcon(rowData) {
    setSelectedAssignment(assignments[rowData.row.index]);
    openUploadModal();
  }

  // React.useEffect(()=>{
  //   if(selectedAssignment.name !== ''){
  //     openUploadModal();
  //   }
  // }, [selectedAssignment]);

  // Edit Modal
  const [isUploadModalOpen, setUploadModalOpen] = React.useState(false);
  const openUploadModal = () => {
    setUploadModalOpen(true);
  };
  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  const columns = columnsDataColumns;
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


  //Modal Settings
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [size, setSize] = React.useState("xl");
  // const [size, setSize] = React.useState('full')

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
            width: 10000,
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
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
          Student View
        </Text>
        {/* <Menu /> */}
      </Flex>
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
                  } else if (cell.column.Header === "SUBMISSION STATUS") {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "SUBMISSION DATE") {
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
                  } else if (cell.column.Header === "ACTIONS") {
                    data = (
                      <Flex align="center">
                        {/* <Menu/> */}
                        <Button
                          size="sm"
                          mr="10px"
                          leftIcon={<MdUpload />}
                          colorScheme="blue"
                          variant="solid"
                          onClick={() => {
                            handleUploadIcon(cell);
                          }}
                          disabled={isUploadAssignment(
                            cell.row.cells[4].value,
                            cell.row.cells[2].value
                          )}
                        >
                          Submit Assignment
                        </Button>
                      </Flex>
                    );
                  }
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
      {/* Edit */}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        size={size}
        // isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* <hr></hr>
            <Text mt="20px" fontSize="18px" fontWeight="700">
              Name: {selectedAssignment?.name}
            </Text>
            <Text mb="20px" fontSize="18px" fontWeight="700">
              Description: {selectedAssignment?.description}
            </Text>
            <hr></hr> */}
            <FormControl mt={4}>
              <FormLabel>Solution:</FormLabel>
              <Textarea
                onChange={(e) => {
                  handleUploadInput(e.target.value);
                }}
                rows="8"
                placeholder="Add your assignment solution here"
                value={uploadDataSolution}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={uploadAssignmentData}
              colorScheme="blue"
              mr={3}
              disabled={!(uploadDataSolution !== "")}
            >
              Submit
            </Button>
            <Button onClick={closeUploadModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
