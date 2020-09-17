import React, {useState, useEffect} from 'react';
import {
	MenuItem,
	FormControl,
	Select,
	Card,
	CardContent,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

import {sortData, prettyPrintStat} from './util';
import './App.css';

function App() {
  const [countries, setCountries]= useState([]);
  const [mapCountries, setMapCountries]= useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
	  lat: 34.80746, lng: -40.4796
  });
  const [mapZoom, setMapZoom] = useState(3)

  useEffect(()=>{
	  fetch('https://disease.sh/v3/covid-19/all')
	  .then(response => response.json())
	  .then(data => {
		  setCountryInfo(data);
	  })
  }, [])
  
  useEffect(()=>{
	  const getCountriesData = async () => {
		  await fetch('https://disease.sh/v3/covid-19/countries')
		    .then(response => response.json())
		    .then(data => {
			  let countries = data.map(country => (
			  	{
					name: country.country,
					value: country.countryInfo.iso2,
				}))
			  countries = countries.filter((country) => country.value !== null);
			  let sortedData = sortData(data);
			  setTableData(sortedData);
			  setMapCountries(data);
			  setCountries(countries);
		  })
	  }
	  getCountriesData();
  },[]);
	
  const onCountryChange = async (event) => {
	  const countryCode = event.target.value;
	  setCountry(countryCode);
	  
	  const url = 
		countryCode === 'Worldwide' 
	  	? 'https://disease.sh/v3/covid-19/all' 
	  	: `https://disease.sh/v3/covid-19/countries/${countryCode}`;
	  
	  await fetch(url)
	  .then(response => response.json())
	  .then(data =>{
		  setCountry(countryCode);
		  setCountryInfo(data);
		  console.log("country code ", countryCode)
		  countryCode === "Worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
		  setMapZoom(4);
	  })
  }
  
	
  return (
    <div className="app">
		  <div className="app_left">
			  <div className="app_header">
			<h1>Covid Tracker</h1>
			<FormControl className="app_dropdown">
				<Select
					variant="outlined"
					onChange={onCountryChange}
					value={country}
					>
					<MenuItem value="Worldwide">Worldwide</MenuItem>
					{countries.map(country =>(
						<MenuItem value={country.value}>{country.name}</MenuItem>)
					)}
			
				</Select>
		  </FormControl>
		</div>
       
		  
		 <div className="app_stats">
			 <InfoBox
				 isRed
				 active={casesType === "cases"}
				 onClick={e => setCasesType("cases")}
				 title="Coronavirus Cases"
				 cases={prettyPrintStat(countryInfo.todayCases)}
				 total={prettyPrintStat(countryInfo.cases)}
				 
			  />
			 
			 <InfoBox
				 active={casesType === "recovered"}
				 onClick={e => setCasesType("recovered")}
				 title="Recovered"
				 cases={prettyPrintStat(countryInfo.todayRecovered)}
				 total={prettyPrintStat(countryInfo.recovered)}
				 
			  />
			 
			 <InfoBox
				 isRed
				 active={casesType === "deaths"}
				 onClick={e => setCasesType("deaths")}
				 title="Deaths"
				 cases={prettyPrintStat(countryInfo.todayDeaths)}
				 total={prettyPrintStat(countryInfo.deaths)}
				 
			  />
		 </div>	  
		  
		  
		  {/*Map */}
		  <Map
			casesType={casesType}
			center={mapCenter}
			zoom={mapZoom}
			countries={mapCountries}
			  
		  />
		  
		  </div>
		  <Card className="app_right">
			  <CardContent>
				  <h3>Live Cases by Country</h3>
	
				  {/*Table */}
				  <Table countries={tableData} />
				  <h3 className="app_graphTitle">Worldwide New {casesType}</h3>
		 		 {/*Graph*/}
				  <LineGraph casesType={casesType} />
			  
			  </CardContent>
			  
		  </Card>
		
    </div>
  );
}

export default App;
