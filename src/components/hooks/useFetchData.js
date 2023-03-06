import { useEffect, useState } from "react";
import { client } from "../../utils/api.js";

export const useFetchData = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!salesOrders.length && !isLoading) {
      const getData = () => {
        // setIsLoading(true);
        client.post('/DEV/stub', {
          angular_test: "angular-developer"
        })
          .then(response => {
            setSalesOrders(response.data);
          }).catch(error => {
            console.log(error);
          }).finally(() => {
            setIsLoading(false);
          });
      }

      getData();
    }

  });

  return { isLoading, salesOrders };

}