/*eslint-disable*/
import { Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import React from "react";

export default function Footer() {
  return (
    <Flex
      flexDirection={{
        base: "column",
      }}
      alignItems={{
        base: "center",
      }}
      justifyContent='space-between'
      px='30px'
      pb='20px'>
      <Text
        color='gray.400'
        textAlign={{
          base: "center",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        &copy; {1900 + new Date().getYear()},{" "}
        <Text as='span'>
          SkyHigh
        </Text>
      </Text>
    </Flex>
  );
}
