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
  export default function DefaultTable() {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    return (
      <Card
        direction='column'
        w='100%'
        px='0px'
        overflowX={{ sm: "scroll", lg: "hidden" }}
        >
        <Flex px='25px' justify='space-between' mb='20px' mt='20px' align='center' justifyContent='center'>
          <Text
            color={textColor}
            fontSize='20px'
            fontWeight='700'
            lineHeight='100%'
            mt='10px'
            mb='10px'
            >
            No Record Found!
          </Text>
          {/* <Menu /> */}
        </Flex>
        
      </Card>
    );
  }
  