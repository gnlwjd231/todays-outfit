import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from 'styled-components';
import backgroundImage from './assets/sunset.jpeg';

const Hello = styled.div`
  &:before{
    background : url(${ (props) => props.image });
    background-color: ${ (props) => props.color };
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

  const [data,setData] = useState({})
  const [location, setLocation] = useState('')
  const [color,setlazyColor] = useState('')
  const [image,setImages] = useState(backgroundImage)
  const [history,setHistory] = useState([]);
  const [historyImg,setHistoryImg] = useState([]);
  
  const FREEWEATHER_API_KEY = process.env.REACT_APP_FREEWEATHER_API_KEY;
  const PEXEL_API_KEY = process.env.REACT_APP_PEXEL_API_KEY;

  const weatherUrl = `
  https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${FREEWEATHER_API_KEY}
  `

  const fetchImages = async (keyword) => {
    try {
      // Pexels API 호출 URL
      const url = "https://api.pexels.com/v1/search";
      console.log(keyword);
      // Pexels API 호출 매개변수
      const params = {
        "query": keyword,
        "per_page": 1,
        "page": 1,
      };

      // Pexels API 호출
      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: PEXEL_API_KEY,
        }
      });
      // Pexels API 응답 데이터 파싱
      const randomIndex = Math.floor(Math.random() * 5);
      const data = response.data.photos[0];
      
      setImages(data.src.small);

      // 검색 결과 이미지 URL 추출

      setImages(data.src.original);
      setHistoryImg(  historyImg => [...historyImg, data.src.small ])
      console.log(historyImg);
      

    } catch (error) {
      console.log(error);
    }
  }

  const regionNames = new Intl.DisplayNames(
    ['en'], {type: 'region'}
  );

  const searchLocation = (event) => {
    if ( event.key === 'Enter'){
      axios.get(weatherUrl).then((response)=>{
        const countryName = regionNames.of(response.data.sys.country);
        const weatherDesc = `${countryName} ${response.data.name} ${response.data.weather[0].description} street`;
        fetchImages(weatherDesc).then((temp01) => {
          setData(response.data);
        });

        setHistory([...history, response.data]);
        history.map((val)=>{
          console.log(val.name)
        })
      })
      setLocation('')

    }
  }

  // useEffect(()=>{
  //   if( data.main !== undefined ){
      
  //   }

  // },[data])

  return (
    <Hello className="app" image={image} color={color}>
      <div className="search">
        <input type="text" value={location} onChange={event => setLocation(event.target.value)} placeholder='Enter Location' onKeyPress={searchLocation}/>
      </div>
      {data.name === undefined &&
        <StartPage>
          <p>
            enter Location
          </p>
        </StartPage>
      }
      {data.name !== undefined &&
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1>: null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p>: null}
          </div>
        </div>
          <div>
            <div className="bottom">
              <div className="feels">
                {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°C</p>: null}
                <p>Flells Like</p>
              </div>
              <div className="humidity">
                {data.main ? <p className="bold">{data.main.humidity}%</p>: null}
                <p>humidity</p>
              </div>
              <div className="wind">
                {data.wind ? <p className="bold">{data.wind.speed}MPH</p>: null}
                <p>Wind Speed</p>
              </div>
            </div>
            <div className="history">
              {/* <p>History</p> */}
              <div className="history-wrapper">
                {history.map( function(value,key){
                  if(key !== history.length -1){
                    const result = <HidtoryItme historyImg={historyImg[key]} key={key}>
                        <div>
                          <p>
                            {value.name}
                          </p>
                          <p>
                            {value.main.temp.toFixed()}°C
                          </p>
                        </div>
                        <div>
                          <p>
                            {data.weather[0].main}
                          </p>
                        </div>
                      </HidtoryItme>
                    return result
                  }
                })}
                </div>
            </div>
          </div>
      </div>
      }
    </Hello>
  );
}

export default App;
