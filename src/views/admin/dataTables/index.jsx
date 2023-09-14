// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import StudentTable from "views/admin/dataTables/components/StudentTable";
import InstructoTable from "views/admin/dataTables/components/IntructorTable";
import DefaultTable from "views/admin/dataTables/components/DefaultTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React from "react";

export default function Settings() {
  let LoadComponent;
  const userDetail = localStorage.getItem('userDetail');
  if(userDetail){
    const userDetailParsed = JSON.parse(userDetail);
    if(userDetailParsed.role === 'student') LoadComponent = <StudentTable />;      
    else LoadComponent = <InstructoTable />;
  } else {
    LoadComponent = <DefaultTable />;
  }   

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        mt='50px'
        columns={{ lg: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        {LoadComponent}
        {/* <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        /> */}
        {/* <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        /> */}
        {/* <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} /> */}
        {/* <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        /> */}
      </SimpleGrid>
    </Box>
  );
}
