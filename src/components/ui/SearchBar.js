import React from "react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";

export function SearchBar(props) {
  const { value, variant, children, onChange, ...rest } = props;
  const searchIconColor = useColorModeValue("gray.700", "gray.200");
  const inputBg = useColorModeValue("white", "navy.800");
  return (
    <InputGroup borderRadius='8px' w='200px' {...rest}>
      <InputLeftElement
        children={
          <IconButton
            bg='inherit'
            borderRadius='inherit'
            _hover='none'
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            icon={
              <SearchIcon color={searchIconColor} w='15px' h='15px' />
            }></IconButton>
        }
      />
      <Input
        variant='search'
        // value={value || ''}
        bg={inputBg}
        placeholder='Type here...'
        onChange={onChange}
        {...rest}
      />
    </InputGroup>
  );
}
