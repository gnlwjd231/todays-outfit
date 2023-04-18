import React, { useState } from "react";
import axios from "axios";
import styled from 'styled-components';

const Hello = styled.div`
  &:before{
    background : url(${ (props) => props.image });
    background-color: ${ (props) =>  props.color };
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    /* filter: brightness(0.6); */
  }
`;

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
  const [color,setlazyColor] = useState('#fff')
  const [image,setImages] = useState('')

  const weatherUrl = `
  https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=b00d6520bef052f43a8b1e6d5528ce09
  `

  const fetchImages = async (keyword) => {
    try {
      // Pexels API 호출 URL
      const url = "https://api.pexels.com/v1/search";
      // Pexels API 키
      const api_key = "NP9vZQi2BOhCS5kJVn4F6ptQR4ncSEYidydV7LKW4s2jo5Qt5vlNkpK2";
      console.log(keyword);
      // Pexels API 호출 매개변수
      const params = {
        "query": keyword,
        "per_page": 3,
        "page": 1,
      };

      // Pexels API 호출
      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: api_key
        }
      });
      // Pexels API 응답 데이터 파싱
      const randomIndex = Math.floor(Math.random() * 3);
      console.log(randomIndex);
      const data = response.data.photos[randomIndex];

      console.log(data);
      setlazyColor(data.avg_color);
      // 검색 결과 이미지 URL 추출
      setImages(data.src.original)

    } catch (error) {
      console.log(error);
    }
  }

  const searchLocation = (event) => {
    if ( event.key === 'Enter'){
      axios.get(weatherUrl).then((response)=>{
        const weatherDesc = `${response.data.name} ${response.data.weather[0].main}`;
        fetchImages(weatherDesc)
        setData(response.data);
      })
      setLocation('')

    }
  }

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
        {data.name !== undefined &&
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
         }
      </div>
    </Hello>
  );
}

export default App;
