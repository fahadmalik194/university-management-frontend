import {
  Icon,
  Flex,
  Table,
  TableContainer,
  TableCaption,
  Tbody,
  Tfoot,
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
// Assets
import {
  MdOutlinePerson,
  MdOutlineSettings,
  MdAdd,
  MdEdit,
} from "react-icons/md";
import React, { useEffect, useMemo } from "react";
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
// import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
// import tableInstructorDataColumns from "views/admin/dataTables/variables/tableInstructorDataColumns.json";
import { get, post, put } from "services/httpService";
import toast, { Toaster } from "react-hot-toast";
import DefaultTable from "./DefaultTable";
import { IoMdEye } from "react-icons/io";

async function fetchAssignments() {
  try {
    return await get("/assignment/getteacherassignments");
  } catch (error) {
    console.error("Error fetching assignments:", error);
    toast.error("Assignments Fetched Failed!");
    return [];
  }
}

async function createAssignment(data) {
  try {
    return await post("/assignment/createassignment", data);
  } catch (error) {
    console.error("Error creating assignment:", error);
    toast.error("Error Creating Assignment");
    return [];
  }
}

async function editAssignment(id, data) {
  try {
    return await put(`/assignment/updateassignment?id=${id}`, data);
  } catch (error) {
    console.error("Error editing assignment:", error);
    toast.error("Error Editing Assignment");
    return [];
  }
}

async function fetchSubmitterAssignment(id) {
  try {
    return await get(`/assignment/getsubmissions?assignment_id=${id}`);
  } catch (error) {
    console.error("Error fetching submitted assignment:", error);
    toast.error("Error Fetching Assignments");
    return [];
  }
}

function mapperFunction(assignmentData) {
  return assignmentData.map((assignment) => ({
    name: assignment.name,
    description: assignment.description,
    "due-date": new Date(assignment.due_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
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

function isEditableAssignment(dueDate, currentDate) {
  const differenceInDays = Math.floor(
    (new Date(dueDate) - currentDate) / (1000 * 60 * 60 * 24)
  );
  return differenceInDays < 5;
}

function formatDateTime(dateTimeString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = new Date(dateTimeString).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
}

export default function InstructorTable() {
  const [selectedAssignment, setSelectedAssignment] = React.useState();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Fetch
  const [assignments, setAssignments] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [submissionDetail, setSubmissionDetail] = React.useState([]);

  // Create
  const [createDataName, setCreateDataName] = React.useState("");
  const [createDataDescription, setCreateDataDescription] = React.useState("");
  const [createDataDueDate, setCreateDataDueDate] = React.useState("");

  // Edit
  const [editDataName, setEditDataName] = React.useState("");
  const [editDataDescription, setEditDataDescription] = React.useState("");

  // Fetch
  const fetchAssignmentsData = () => {
    fetchAssignments()
      .then((response) => {
        if (response.code === 200) {
          if (response.data.teacherAssignmets.length > 0) {
            setAssignments(response.data.teacherAssignmets[0].assignemnt);
            let mappedData = mapperFunction(
              response.data.teacherAssignmets[0].assignemnt
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

  // Create
  function handleClickCreate() {
    createAssignment({
      name: createDataName,
      description: createDataDescription,
      due_date: createDataDueDate,
    })
      .then((response) => {
        if (response.statusCode === 200) {
          toast.success("Assignment Created Successfuly!");
          fetchAssignmentsData();
          closeCreateModal();
        } else {
          console.error("Error creating assignments:", response);
          toast.error("Error Creating Assignment");
        }
      })
      .catch((error) => {
        console.error("Error creating assignments:", error);
        toast.error("Error Creating Assignment");
      });
  }

  function handleNameInput(value) {
    setCreateDataName(value);
  }
  function handleDescriptionInput(value) {
    setCreateDataDescription(value);
  }
  function handleDueDateInput(value) {
    setCreateDataDueDate(value);
  }

  // Edit
  const editAssignmentData = () => {
    editAssignment(selectedAssignment.id, {
      name: editDataName,
      description: editDataDescription,
    })
      .then((response) => {
        if (response.code === 200) {
          toast.success("Assignment Updated Successfuly!");
          fetchAssignmentsData();
          closeEditModal();
        } else {
          console.error("Error editing assignment:", response);
          toast.error("Error Editing Assignment!");
        }
      })
      .catch((error) => {
        console.error("Error editing assignment:", error);
        toast.error("Error Editing Assignment!");
      });
  };

  function handleNameEditInput(value) {
    setEditDataName(value);
  }
  function handleDescriptionEditInput(value) {
    setEditDataDescription(value);
  }

  // Create Modal
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const openCreateModal = () => {
    setCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  // Edit Modal
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const openEditModal = () => {
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  // View Modal
  const [isViewModalOpen, setViewModalOpen] = React.useState(false);
  const openViewModal = () => {
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    fetchAssignmentsData();
    setViewModalOpen(false);
  };

  function handleEditIcon(rowData) {
    setSelectedAssignment(assignments[rowData.row.index]);
    setEditDataName(assignments[rowData.row.index].name);
    setEditDataDescription(assignments[rowData.row.index].description);

    openEditModal();
  }

  function handleViewIcon(rowData) {
    setSelectedAssignment(assignments[rowData.row.index]);
    fetchSubmitterAssignment(assignments[rowData.row.index].id)
      .then((response) => {
        if (response.code === 200) {
          toast.success("Assignment Detail Fetched Successfuly!");
          setSubmissionDetail(response.data.submissionDetails);
          console.log(
            "response.data.submissionDetails",
            response.data.submissionDetails
          );
          console.log("submissionDetail", submissionDetail);
          
        } else {
          console.error("Error fetching submitted assignment:", response);
          toast.error("Error Fetching Assignment!");
        }
      })
      .catch((error) => {
        console.error("Error fetching submitted assignment:", error);
        toast.error("Error Fetching Assignment!");
      });
  }
  useEffect(()=>{
    if(submissionDetail.length > 0){
      openViewModal();
    }
  }, [submissionDetail])
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
          Instructor View
        </Text>
        {/* <Menu /> */}
        <Button
          type="button"
          fontSize="sm"
          variant="brand"
          fontWeight="500"
          w="100"
          h="50"
          mb="24px"
          onClick={openCreateModal}
        >
          <Icon as={MdAdd} h="16px" w="16px" me="8px" />
          Create Assignment
        </Button>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          size={size}
          // isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Assignment</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  ref={initialRef}
                  onChange={(e) => {
                    handleNameInput(e.target.value);
                  }}
                  placeholder="Enter Assignment Name"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  onChange={(e) => {
                    handleDescriptionInput(e.target.value);
                  }}
                  rows="5"
                  placeholder="Enter Assignment Description"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="datetime-local"
                  onChange={(e) => {
                    handleDueDateInput(e.target.value);
                  }}
                  placeholder="Select Date and Time"
                  min={currentDate}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={handleClickCreate}
                colorScheme="blue"
                mr={3}
                disabled={
                  !(
                    createDataName &&
                    createDataDescription &&
                    createDataDueDate
                  )
                }
              >
                Save
              </Button>
              <Button onClick={closeCreateModal}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      {assignments.length <= 0 || tableData.length <= 0 ? (
        <DefaultTable />
      ) : (
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
                    // console.log('Cell', cell);
                    let data = "";
                    if (cell.column.Header === "NAME") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "DESCRIPTION") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "DUE DATE") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "CREATED AT") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "UPDATED AT") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "ACTIONS") {
                      data = (
                        <Flex align="center">
                          {/* <Menu /> */}
                          {/* {!isEditableAssignment(cell.row.cells[2].value, Date.now()) && (
                            <Button
                              disabled
                            >
                            <Icon
                              as={MdEdit}
                              h="25px"
                              w="25px"
                              me="8px"
                              cursor="pointer"
                              onClick={() => {
                                handleEditIcon(cell);
                              }}
                            />
                            </Button>
                          )} */}
                          <Button
                            size="sm"
                            mr="10px"
                            leftIcon={<MdEdit />}
                            colorScheme="blue"
                            variant="solid"
                            onClick={() => {
                              handleEditIcon(cell);
                            }}
                            disabled={isEditableAssignment(
                              cell.row.cells[2].value,
                              Date.now()
                            )}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            leftIcon={<IoMdEye />}
                            colorScheme="teal"
                            variant="solid"
                            onClick={() => {
                              handleViewIcon(cell);
                            }}
                          >
                            View
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
      )}
      {/* Edit */}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        size={size}
        // isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                ref={initialRef}
                onChange={(e) => {
                  handleNameEditInput(e.target.value);
                }}
                placeholder="Enter Assignment Name"
                value={editDataName}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                onChange={(e) => {
                  handleDescriptionEditInput(e.target.value);
                }}
                rows="5"
                placeholder="Enter Assignment Description"
                value={editDataDescription}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={editAssignmentData}
              colorScheme="blue"
              mr={3}
              disabled={!(editDataName !== "" && editDataDescription !== "")}
            >
              Update
            </Button>
            <Button onClick={closeEditModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* View */}
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        size={"full"}
        // isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assignment Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <hr></hr>
            <Text mt="20px" fontSize="18px" fontWeight="700">
              Name: {selectedAssignment?.name}
            </Text>
            <Text mb="20px" fontSize="18px" fontWeight="700">
              Description: {selectedAssignment?.description}
            </Text>
            <hr></hr>
            {submissionDetail.length > 0 ? (
              <TableContainer>
                <Table variant="striped" colorScheme="gray" color="gray.700">
                  <TableCaption>
                    List of all students, assigned to this assignment
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Student Name</Th>
                      <Th>Submission Status</Th>
                      <Th>Submission Date</Th>
                      <Th>Due Date</Th>
                      <Th>Created At</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {submissionDetail.map((element) => (

                      <Tr key={element.id}>
                        <Td>{element.submitted_assignments.name}</Td>
                        <Td>{element.submission_status}</Td>
                        <Td>{(element.submission_date) ? formatDateTime(element.submission_date) : '-'}</Td>
                        <Td>{formatDateTime(element.assignments.due_date)}</Td>
                        <Td>{formatDateTime(element.assignments.created_at)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <DefaultTable />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeViewModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
