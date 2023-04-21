import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from 'styled-components';
import backgroundImage from './assets/sunset.jpeg';

const Hello = styled.div`
  &:before{
    background-color : ${props => props.color || '#FFFFFF'};
    background-image : url(${ props => props.image });
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

const HidtoryItme = styled.div`
  background : url(${ (props) => props.historyImg });
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  &:before{
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
  &:hover{
    &:before{
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
`

const StartPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 20%);
  p{
    text-align: center;
  }
`

function App(props) {

  const [weatherData,setWeatherData] = useState(null)
  const [data,setData] = useState(null)
  const [history,setHistory] = useState([])
  const [location, setLocation] = useState('')

  const FREEWEATHER_API_KEY = process.env.REACT_APP_FREEWEATHER_API_KEY;
  const PEXEL_API_KEY = process.env.REACT_APP_PEXEL_API_KEY;

  const weatherUrl = `
  https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${FREEWEATHER_API_KEY}
  `
  

  const getLocation  = () => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition);
    }else{
      console.log( "no" );
    }
  }
  const showPosition = (position) => {
    let userLatitude = position.coords.latitude
    let userLongitude = position.coords.longitude
    const weatherPositionUrl = `
      https://api.openweathermap.org/data/2.5/weather?lat=${userLatitude}&lon=${userLongitude}&units=metric&appid=${FREEWEATHER_API_KEY}
    `
    axios.get(weatherPositionUrl).then((response)=>{
      setWeatherData(response.data);
    })
  }

  useEffect(()=>{
    getLocation();
  },[])

  const searchLocation = (event) => {
    if ( event.key === 'Enter'){
      axios.get(weatherUrl).then((response)=>{
        setWeatherData(response.data);
      })
      setLocation('')
    }
  }

  const regionNames = new Intl.DisplayNames(
    ['en'], {type: 'region'}
  );

  useEffect(() => {
    if (weatherData !== null) {
      const countryName = regionNames.of(weatherData.sys.country);
      const weatherDesc = `${countryName} ${weatherData.name} ${weatherData.weather[0].description}`;
      fetchImages(weatherDesc).then((imageResult) => {
        const Data = {
          name: weatherData.name,
          temp: weatherData.main.temp,
          weather: weatherData.weather[0].main,
          feels: weatherData.main.feels_like,
          humidity: weatherData.main.humidity,
          wind: weatherData.wind.speed,
          img: {
            original: imageResult.original,
            small: imageResult.small,
            color: imageResult.color
          }
        };
        setData(Data);
        setHistory([...history, Data]);
      });
    }
  }, [weatherData]);

  async function fetchImages(keyword) {
    try {
      // Pexels API 호출 URL
      const url = "https://api.pexels.com/v1/search";
      console.log(keyword);
      // Pexels API 호출 매개변수
      const params = {
        query: keyword,
        per_page: 1,
        page: 1,
      };
      // Pexels API 호출
      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: PEXEL_API_KEY,
        },
      });
      // Pexels API 응답 데이터 파싱
      const data = response.data.photos[0];
      // 검색 결과 이미지 URL 추출
      const images = {
        original: data.src.original,
        small: data.src.small,
        color: data.avg_color
      };

      return images;
    } catch (error) {
      console.log(error);
    }
  }

  const backToHistory = (targetData,key)=>{
    setData(targetData);
  }


  return (
    <Hello className="app" image={ data ? data.img.original : backgroundImage } color={data ? data.img.color : "#ccc" } >
      <div className="search">
        <input type="text" value={location} onChange={event => setLocation(event.target.value)} placeholder='Enter Location' onKeyPress={searchLocation}/>
      </div>
      {data === null &&
        <StartPage>
          <p>
            enter Location
          </p>
        </StartPage>
      }
      {data !== null &&
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            <h1>{data.temp.toFixed()}°C</h1>
          </div>
          <div className="description">
            <p>{data.weather}</p>
          </div>
        </div>
          <div>
            <div className="bottom">
              <div className="feels">
                <p className="bold">{data.feels.toFixed()}°C</p>
                <p>Flells Like</p>
              </div>
              <div className="humidity">
                <p className="bold">{data.humidity}%</p>
                <p>humidity</p>
              </div>
              <div className="wind">
                <p className="bold">{data.speed}MPH</p>
                <p>Wind Speed</p>
              </div>
            </div>
            <div className="history">
              {/* <p>History</p> */}
              <div className="history-wrapper">
                {history === null ? (
                  <p>Array is null</p>
                ) : (
                  history.map((value,key) => (
                    <HidtoryItme key={key} historyImg={value.img.small} onClick={() => backToHistory(value,key)} >
                      <div>
                        <p>
                          {value.name}
                        </p>
                        <p>
                          {value.temp.toFixed()}°C
                        </p>
                      </div>
                      <div>
                        <p>
                          {value.weather}
                        </p>
                      </div>
                    </HidtoryItme>
                  ))
                )}
                </div>
            </div>
          </div>
      </div>
      }
    </Hello>
  );
}

export default App;
