import { Box, Flex, Link } from "@chakra-ui/react";

export default function Navbar(props) {
  const { brandText } = props;
  let mainText = "#fff";
  
  return (
    <Flex
      borderColor="transparent"
      filter="none"
      backdropFilter="none"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      borderRadius="16px"
      display="flex"
      minH="75px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mt="0px"
      pb="8px"
      px={{
        sm: "15px",
        md: "40px",
      }}
      pt="30px"
      top="18px"
      w="100%"
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "column",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
      >
        <Box mb={{ sm: "8px", md: "0px" }}>
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize="2xl"
            _hover={{ color: { mainText } }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            {brandText}
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
}
