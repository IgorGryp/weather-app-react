import axios from 'axios';
import { useEffect } from 'react';

const SearchLocation = ({
  location,
  setLocation,
  locationList,
  setLocationList,
}) => {
  useEffect(() => {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/find?&q=${location}&appid=1e03ba3b67ab150e66b7df060d30f555`
      )
      .then((response) => {
        console.log(response.data.list);

        setLocationList(response.data.list);
      });
  }, [location]);

  return (
    <div>
      <div>{location}</div>
      <div>{locationList}</div>
    </div>
  );
};

export default SearchLocation;
