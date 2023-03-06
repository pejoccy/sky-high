import { Flex, Image } from "@chakra-ui/react";
import loader from "assets/img/loader.gif";

const SuspenseLoader = () => {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" h="100vh" pb="20rem" bg="#fff">
      <Image h="15rem" w="auto" src={loader} alt="Loading..." />
    </Flex>
  );
};

export default SuspenseLoader;
