import axios from 'axios';
import { useEffect } from 'react';

const SearchLocation = ({ location, setLocation, locationList, setLocationList }) => {
  useEffect(() => {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/find?&q=${location}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      )
      .then((response) => {
        console.log(response.data.list);

        const newLocations = response.data.list.map((element) => element);

        setLocationList((prevLocationList) => [...prevLocationList, ...newLocations]);
      })

      .catch((error) => console.error('Error fetching data: ', error));
  }, [location]);

  console.log(locationList);

  return (
    <div>
      <div>{location}</div>

      <ul>
        {locationList.length > 0 &&
          locationList.map((item, index) => (
            <li key={index}>
              <span
                onClick={() => console.log('Hello!')}
              >{`${item.name}, ${item.sys.country}`}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SearchLocation;
