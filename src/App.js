import React, {useState, useEffect} from 'react';
import {
	MenuItem,
	FormControl,
	Select,
} from '@material-ui/core';
import './App.css';

function App() {
  const [countries, setCountries]= useState([]);
  const [country, setCountry] = useState('Worldwide');
	
  // https://disease.sh/v3/covid-19/countries
  useEffect(()=>{
	  // async -> send requires, wait for it, do something
	  
	  const getCountriesData = async () => {
		  await fetch('https://disease.sh/v3/covid-19/countries')
		    .then(response => response.json())
		    .then(data => {
			  const countries = data.map(country => (
			  	{
					name: country.country,
					value: country.countryInfo.iso2,
				}))
			  setCountries(countries);
		  })
	  }
	  getCountriesData();
  },[]);
	
  const onCountryChange = async (event) => {
	  const countryCode = event.target.value;
	  console.log("yoo ", countryCode);
	  setCountry(countryCode);
  }
	
  return (
    <div className="app">
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
       
		  
		  {/* Header */}
		  {/* Title + Select input drop down */}
		  
		  {/*Infobox */}
		  {/*Infobox */}
		  {/*Infobox */}
		  
		  {/*Table */}
		  {/*Graph*/}
		  
		  {/*Map */}
    </div>
  );
}

export default App;
