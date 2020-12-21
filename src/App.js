import { FormControl, MenuItem, Select, Card, CardContent} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from "./Map";
import numeral from "numeral";
import './App.css';
import { prettyPrintStat } from "./util";
import LineGraph from "./LinGraph";
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setcountry] = useState([]);
  const [country, setcurrent] =useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((Response) => Response.json())
      .then((data)=>{
        setCountryInfo(data);
      })
  }, [])

  useEffect(()=> {
    //the code inside here will run once, when component loads and not again

    const getCountriesData = async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((Response) => Response.json())
      .then((data)=>{

        const countries = data.map((country)=>(
          {
            name: country.country,//United States, United Kingdom
            value: country.countryInfo.iso2 //UK,USA
          }));
          setMapCountries(data);
          setcountry(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async(event) =>{
    const countryCode = event.target.value;

    setcurrent(countryCode);

    const url = countryCode === 'worldwode' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setcurrent(countryCode);

      //store all the data
      setCountryInfo(data);

    });
   // https://disease.sh/v3/covid-19/all
   //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  };

  return (
    <div className="app">
      <div className="app_header">
        <h1> Covide-19 tracker</h1>
        <FormControl className="app_dropdiwn">
          <Select variant="outlined" onChange={onCountryChange} value={country} >
            {/* loop through all the country and show drop down*/}
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country =>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>
      
      <div className="app_stats">
        <InfoBox active={casesType=== "cases"} onClick={(e) => setCasesType("cases")}
        title = "Coronavirus Cases" 
        cases={prettyPrintStat(countryInfo.todayCases)} 
        total={numeral(countryInfo.cases).format("0.0a")}/>

        <InfoBox active={casesType=== "recovered"} onClick={(e) => setCasesType("recovered")}
        title = "Recovered" 
        cases={prettyPrintStat(countryInfo.todayRecovered)} 
        total ={numeral(countryInfo.recovered).format("0.0a")}/>

        <InfoBox active={casesType=== "deaths"} onClick={(e) => setCasesType("deaths")}
        title = "Deaths" 
        cases={prettyPrintStat(countryInfo.todayDeaths)} 
        total={numeral(countryInfo.deaths).format("0.0a")}/>
      </div>

      {/* map*/ }
      <Map countries={mapCountries} casesType={casesType}/>

      {/* Table*/ }
      {/* Graph*/ }

      <Card className="app_live">
        <CardContent>
            <h3>{casesType} Increses in Four Mouth</h3>
            <LineGraph casesType={casesType}/>
        </CardContent>
      </Card>


    </div>
  );
}

export default App;
