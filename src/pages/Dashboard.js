import {
  Box,
  Flex,
  Grid,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import DateTimeRangePicker from "@wojtekmaj/react-daterange-picker";
import moment from 'moment';
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetchData } from "../components/hooks/useFetchData.js";
import Card from "../components/ui/card/Card.js";
import BarChart from "../components/ui/charts/BarChart";
import LineChart from "../components/ui/charts/LineChart";
import PieChart from "../components/ui/charts/PieChart.js";
import ScatterChart from "../components/ui/charts/ScatterChart.js";
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "../components/ui/icons";
import IconBox from "../components/ui/icons/IconBox";
import {
  getLineChartOptions,
  getBarChartOptions,
  getPieChartOptions,
  getScatterChartOptions,
} from "../components/ui/charts/options";
import { SearchBar } from "../components/ui/SearchBar";
import TablePagination from "../components/ui/TablePagination.js";
import { DataModel } from "../utils/data-model/index.js";
import {
  combinatorDataTransformer,
  compositeDataTransformer,
  countUniqueObjectReducer,
  simpleDataTransformer,
  sumTotalObjectReducer,
  tableDataTransformer,
} from "../utils/data-model/transformers.js";

export default function Dashboard() {
  const [dateRangeValue, setDateRangeValue] = useState([
    moment('2012-01-01', 'YYYY-MM-DD').toDate(),
    moment('2018-12-31', 'YYYY-MM-DD').toDate(),
  ]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [modelData, setModelData] = useState([]);
  const [salesTableData, setSalesTableData] = useState([]);
  const [filteredCount, setFilteredCount] = useState();
  
  const debouncedSearchTerm = useCallback(
    _.debounce((dataModel, term, filters) => {
      const mData = dataModel.filter(term, { keys: filters });
      const salesData = tableDataTransformer({
        data: mData.data || [],
        page,
        pageSize,
      });
      setFilteredCount((mData?.data || []).length);
      setSalesTableData(salesData);
    }, 1500),
    [page, pageSize]
  );

  const handleNextPage = () => {
    setPage(page => page + 1);
  }

  const handlePreviousPage = () => {
    setPage(page => page - 1);
  }

  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");
  const numberFormatter = new Intl.NumberFormat('en-US');
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const { salesOrders } = useFetchData();

  useEffect(() => {
    const sales = _.filter(salesOrders, (data) => {
      return moment(data['Order Date']).isSameOrAfter(moment(dateRangeValue[0])) && moment(data['Order Date']).isSameOrBefore(moment(dateRangeValue[1]));
    });
    setModelData(sales);
    setPage(1);
  }, [salesOrders, dateRangeValue]);

  const salesData = useMemo(() => {
    return compositeDataTransformer({
      data: modelData,
      xOrKeyFn: (row) => moment(row['Order Date']).format('YYYY-MM'),
      keyLblFn: (val) => moment(val, 'YYYY-MM').format('MMM YYYY'),
      y: 'Category',
      value: 'Quantity',
    });
  }, [modelData]);

  const scatterChartOptions = useMemo(
    () => getScatterChartOptions(),
    [salesData]
  );

  const yearlySales = useMemo(() => {
    const data = compositeDataTransformer({
      data: modelData,
      xOrKeyFn: (row) => moment(row['Order Date']).format('YYYY'),
      keyLblFn: (val) => moment(val, 'YYYY').format('YYYY'),
      y: 'Category',
      value: 'Sales',
    });
    return data;
  }, [modelData]);

  const regionalSales = useMemo(() => {
    const data = simpleDataTransformer({
      data: modelData,
      xOrKeyFn: 'Region',
      value: 'Sales',
    });
    return data;
  }, [modelData]);

  const salesProfits = useMemo(() => {
    const data = combinatorDataTransformer({
      data: modelData,
      x: 'Sales',
      y: 'Profit',
      sample: 'Ship Mode',
    });
    return data;
  }, [modelData]);

  const totalSales = useMemo(() => {
    return currencyFormatter.format(
      modelData.reduce(sumTotalObjectReducer('Sales'), 0)
    );
  }, [modelData]);

  const totalProfit = useMemo(() => {
    return currencyFormatter.format(
      modelData.reduce(sumTotalObjectReducer('Profit'), 0)
    );
  }, [modelData]);

  const itemsSold = useMemo(() => {
    return numberFormatter.format(
      modelData.reduce(sumTotalObjectReducer('Quantity'), 0)
    );
  }, [modelData]);

  const uniqueCustomers = useMemo(() => {
    return numberFormatter.format(
      countUniqueObjectReducer(modelData, 'Customer ID')
    );
  }, [modelData]);

  useEffect(() => {
    if (searchTerm) {
      const dataModel = new DataModel(modelData);
      debouncedSearchTerm(
        dataModel,
        searchTerm,
        [
          'Category',
          'Sub-Category',
          'City',
          'Customer Name',
          'Region',
          'Ship Mode',
          'Product ID',
          'Product Name'
        ]
      );
    } else {
      const data = tableDataTransformer({ data: modelData, page, pageSize });
      setFilteredCount(undefined);
      setSalesTableData(data);
    }
  }, [modelData, page, pageSize, searchTerm]);

  return (
    <Flex flexDirection='column' pt={{ sm: "15px", xl: "25px" }}>
      <Box bg="#fff" p="10px 30px" mb="30px" borderRadius="15px">
        <Text fontWeight='bold'>Filters:</Text>
        <Flex direction="row" py="5px">
          <Text mr="10px">Order Date: </Text>
          <DateTimeRangePicker
            value={dateRangeValue}
            onChange={setDateRangeValue}
          />
        </Flex>
      </Box>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px' mb='20px'>
      <Card minH='125px'>
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'>
              <Stat me='auto'>
                <StatLabel
                  fontSize='xs'
                  color='gray.400'
                  fontWeight='bold'
                  textTransform='uppercase'>
                  Total Sales
                </StatLabel>
                <Flex>
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    {totalSales}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius='50%'
                as='box'
                h={"45px"}
                w={"45px"}
                bg={iconBlue}>
                <CartIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
          </Flex>
        </Card>
        <Card minH='115px'>
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'>
              <Stat me='auto'>
                <StatLabel
                  fontSize='xs'
                  color='gray.400'
                  fontWeight='bold'
                  textTransform='uppercase'>
                  Total Profit
                </StatLabel>
                <Flex>
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    {totalProfit}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius='50%'
                as='box'
                h={"45px"}
                w={"45px"}
                bg={iconBlue}>
                <WalletIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
          </Flex>
        </Card>
        <Card minH='125px'>
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'>
              <Stat me='auto'>
                <StatLabel
                  fontSize='xs'
                  color='gray.400'
                  fontWeight='bold'
                  textTransform='uppercase'>
                  Unique Customers
                </StatLabel>
                <Flex>
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    {uniqueCustomers}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius='50%'
                as='box'
                h={"45px"}
                w={"45px"}
                bg={iconBlue}>
                <GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
          </Flex>
        </Card>
        <Card minH='125px'>
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'>
              <Stat me='auto'>
                <StatLabel
                  fontSize='xs'
                  color='gray.400'
                  fontWeight='bold'
                  textTransform='uppercase'>
                  Items Sold
                </StatLabel>
                <Flex>
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    {itemsSold}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                borderRadius='50%'
                as='box'
                h={"45px"}
                w={"45px"}
                bg={iconBlue}>
                <DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
            </Flex>
          </Flex>
        </Card>
      </SimpleGrid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "2fr 1fr" }}
        templateRows={{ lg: "repeat(2, auto)" }}
        gap='20px'
        mb="20px">
        <Card
          bg={"linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"}
          pb="10px"
          maxW={{ sm: "320px", md: "100%" }}>
          <Flex direction='column' mb='40px' p='5px 0px 0px 22px'>
            <Text color='#fff' fontSize='lg' fontWeight='bold' mb='6px'>
              Sales Overview
            </Text>
          </Flex>
          <Box minH='300px'>
            <LineChart
              chartData={salesData?.collections || []}
              chartOptions={
                salesData?.categories ? getLineChartOptions(salesData.categories) : []}
            />
          </Box>
        </Card>
        <Card pb='10px' maxW={{ sm: "320px", md: "100%" }}>
          <Flex direction='column' mb='40px' p='5px 0px 0px 22px'>
            <Text color={textColor} fontSize='lg' fontWeight='bold'>
              Total Sales
            </Text>
          </Flex>
          <Box minH='300px'>
            <BarChart
              chartData={yearlySales?.collections}
              chartOptions={yearlySales.categories
                ? getBarChartOptions(yearlySales.categories)
                : []
              }
            />
          </Box>
        </Card>
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "1fr 2fr" }}
        templateRows={{ lg: "repeat(2, auto)" }}
        gap='20px'
        mb="20px">
          <Card pb='10px' maxW={{ sm: "320px", md: "100%" }}>
          <Flex direction='column' mb='20px' p='5px 0px 0px 22px'>
            <Text color={textColor} fontSize='lg' fontWeight='bold'>
              Regional Sales
            </Text>
          </Flex>
          <Box minH='300px'>
            <PieChart
              chartData={regionalSales?.data}
              chartOptions={regionalSales.labels
                ? getPieChartOptions(regionalSales.labels)
                : []
              }
            />
          </Box>
        </Card>
        <Card pb='10px' maxW={{ sm: "320px", md: "100%" }}>
          <Flex direction='column' mb='20px' p='5px 0px 0px 22px'>
            <Text color={textColor} fontSize='lg' fontWeight='bold'>
              Sales Profit
            </Text>
          </Flex>
          <Box minH='300px'>
            <ScatterChart
              chartData={salesProfits}
              chartOptions={scatterChartOptions}
            />
          </Box>
        </Card>
      </Grid>
      <Grid
        templateColumns={{ sm: "1fr" }}
        templateRows={{ lg: "repeat(1, auto)" }}
        gap='20px'
        mb='20px'>
        <Card pb='10px' maxW={{ sm: "320px", md: "100%" }} overflow="hidden">
          <Flex direction='column'>
            <Flex direction="column">
              <Text  p='22px' fontSize='lg' color={textColor} fontWeight='bold'>
                Sales
              </Text>
              <Flex pb="22px" px="22px" direction="row" justify="space-between">
                <SearchBar
                  me='18px'
                  borderWidth="1px"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setPage(1);
                  }}
                />
                <TablePagination
                  totalCount={filteredCount || modelData?.length || 0}
                  handlePreviousPage={handlePreviousPage}
                  handleNextPage={handleNextPage}
                  page={page}
                  pageSize={pageSize}
                />
              </Flex>
            </Flex>
            <Box overflow={{ sm: "scroll", lg: "auto" }} minH="350px">
              <Table>
                <Thead>
                  <Tr bg={tableRowColor}>
                    <Th color='gray.400' borderColor={borderColor}>
                      Order Date
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Customer Name
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Product ID
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Product Name
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Quantity
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Sales
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Profit
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Category
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Sub Category
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      City
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Region
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Ship Mode
                    </Th>
                    <Th color='gray.400' borderColor={borderColor}>
                      Ship Date
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(salesTableData).map((el, index, arr) => {
                    return (
                      <Tr key={index} pb="5px">
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          fontWeight='bold'
                          borderColor={borderColor}
                          border={index === arr.length - 1 ? "none" : null}>
                          {el['Order Date']}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Customer Name']}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Product ID']}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Product Name']}
                        </Td>
                        <Td
                          isNumeric
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Quantity']}
                        </Td>
                        <Td
                          isNumeric
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {Number(el['Sales']).toFixed(2)}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          textAlign="right"
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {Number(el['Profit']).toFixed(2)}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Category']}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Sub-Category']}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['City']}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Region']}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Ship Mode']}
                        </Td>
                        <Td
                          color={textTableColor}
                          fontSize='sm'
                          border={index === arr.length - 1 ? "none" : null}
                          borderColor={borderColor}>
                          {el['Ship Date']}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
}
