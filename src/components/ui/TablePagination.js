import { Flex, Text } from "@chakra-ui/react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const TablePagination = ({
  totalCount,
  handlePreviousPage,
  handleNextPage,
  page,
  pageSize,
}) => {
  const hasPrevious = page > 1;
  const count = pageSize * (page - 1);
  const nextCount = count + pageSize > totalCount
    ? totalCount
    : count + pageSize;
  const hasNext = nextCount !== totalCount;

  return (
    <Flex fontWeight="300" align="center" justify="end" gap="1rem">
      <Text>
        {count + (totalCount > 0 ? 1 : 0)} - {nextCount} of {totalCount}
      </Text>
      <Flex gap=".5rem">
        <Flex
          display="flex"
          h="2rem"
          w="2rem"
          alignItems="center"
          justifyContent="center"
          border="50%"
          outline="none"
          cursor={!hasPrevious ? "not-allowed" : "pointer"}
          onClick={() => {
            if (hasPrevious) handlePreviousPage();
          }}
        >
          <IoChevronBack color={!hasPrevious ? "#9FA2B4" : "#6B7280"} />
        </Flex>
        <Flex
          display="flex"
          h="2rem"
          w="2rem"
          alignItems="center"
          justifyContent="center"
          border="50%"
          outline="none"
          cursor={!hasNext ? "not-allowed" : "pointer"}
          onClick={() => {
            if (hasNext) handleNextPage();
          }}
        >
          <IoChevronForward
            style={{ pointerEvents: !hasNext ? "none" : "auto" }}
            color={!hasNext ? "#9FA2B4" : "#6B7280"}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TablePagination;
