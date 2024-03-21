"use client";
import { Button, Select } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  letterOptions,
  numOfLettersOptions,
  genderOptions,
  birthYearsOptions,
  sortByOptions,
} from "./selectOptions";
import { useRouter, useSearchParams } from "next/navigation";
import BabyCard from "./babyCard";
import { CloseCircleOutlined } from "@ant-design/icons";

const Main = () => {
  const [startWithLetterValue, setStartWithLetterValue] = useState(null);
  const [endsWithLetterValue, setEndsWithLetterValue] = useState(null);
  const [numberOfLettersValue, setNumberOfLettersValue] = useState(null);
  const [genderValue, setGenderValue] = useState(null);
  const [BirthYearValue, setBirthYearValue] = useState(null);
  const [sortByValue, setSortByValue] = useState(null);
  const [babies, setBabies] = useState([]);
  const [loading,setLoading] =useState(true);

  const searchParams  = useSearchParams();
  console.log('slug_input',searchParams?.get('slug_input'))
  const slug = searchParams?.get('slug_input');
  function SearchBarFallback() {
    return <>placeholder</>
  }
  useEffect(() => {
  
    const fetchBabies = async () => {
      try { 
        setLoading(true);
        
        let requestBody = {};
  
        // Add slug_input to request body if it's present in the URL
        if (slug ) {
          requestBody.slug = slug;
        } else {
          // Prepare the request body with filters
          requestBody = {
            first_letter: startWithLetterValue,
            last_letter: endsWithLetterValue,
            name_length: numberOfLettersValue,
            m_gender: genderValue === 'male' ? 'M' : null,
            f_gender: genderValue === 'female' ? 'F' : null,
            birth_year: BirthYearValue,
            sort_order: sortByValue
          };
        }
  
        // Remove null or undefined values from the request body
        requestBody = Object.fromEntries(
          Object.entries(requestBody).filter(([_, value]) => value != null)
        );
  
        const response = await fetch('https://babynames-backend.onrender.com/api/filter_names', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
  
        if (!response.ok) {
          setLoading(false);
          throw new Error('Failed to fetch data');
        }
  
        const data = await response.json();
        setBabies(data);
        setLoading(false);
  
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };
  
    fetchBabies();
  }, [startWithLetterValue, endsWithLetterValue, numberOfLettersValue, genderValue, BirthYearValue, sortByValue]);
  

  const handleSelectValue = (type, event) => {
    switch (type) {
      case "startsWith":
        setStartWithLetterValue(event);
        break;
      case "endsWith":
        setEndsWithLetterValue(event);
        break;
      case "numOfLetters":
        setNumberOfLettersValue(event);
        break;
      case "gender":
        setGenderValue(event);
        break;
      case "birthYear":
        setBirthYearValue(event);
        break;
      case "sortBy":
        setSortByValue(event);
        break;
      default:
        console.log(event);
    }
  };
  const clearFilter = () => {
      setStartWithLetterValue( null),
      setEndsWithLetterValue( null),
      setNumberOfLettersValue (null),
      setGenderValue (null),
      setBirthYearValue (null),
      setSortByValue (null)
    
  };
  const dummyBabies = new Array(5).fill(null); // Create an array with 8 null elements for dummy cards

  return (
    <>
    
      <div className="flex flex-col gap-12 justify-start items-start py-6 px-4 bg-white">
        <div className="flex flex-col justify-start items-start gap-6">
          {/* Heading */}
          <p className="text-[#0D121C] text-3xl font-bold leading-normal px-4 md:px-6 lg:px-24 xl:px-40">
{
  babies?.data?.title?.seo_title
}          </p>

          {/* Select fields */}
          <div className="flex flex-wrap justify-center items-center gap-3 w-[95vw]">
            <div className="text-base font-medium items-center gap-2 flex bg-[#e8edf5] p-2 rounded-[8px] ">Starts with : <Select
              className="min-w-fit bg-[#e5e5e5] rounded-xl"
              onChange={(e) => handleSelectValue("startsWith", e)}
              
              variant="filled"
              style={{ flex: 1 }}
              options={letterOptions}
              value={ startWithLetterValue?.toUpperCase() }
            />{startWithLetterValue && (
              <CloseCircleOutlined
                className="bg-[#e8edf5] p-2 rounded-xl text-[#FF0000] cursor-pointer"
                onClick={() => handleSelectValue('startsWith', null)} // Clear individual filter
              />
            )}</div>
            
            <div className="text-base font-medium items-center gap-2 flex bg-[#e8edf5] p-2 rounded-[8px] ">Ends with : <Select
   
              className="min-w-[50px] bg-[#e5e5e5] rounded-xl"
              onChange={(e) => handleSelectValue("endsWith", e)}
             
              variant="filled"
              style={{ flex: 1 }}
              options={letterOptions}
              value={endsWithLetterValue?.toUpperCase()}
            />
            {endsWithLetterValue && (
              <CloseCircleOutlined
                className="bg-[#e8edf5] p-2 rounded-xl text-[#FF0000] cursor-pointer"
                onClick={() => handleSelectValue('endsWith', null)} // Clear individual filter
              />
            )}
            </div>
            <div className="text-base font-medium items-center gap-2 flex bg-[#e8edf5] p-2 rounded-[8px] ">Number of Letters : <Select
              className="min-w-[50px] bg-[#e5e5e5] rounded-xl"
              onChange={(e) => handleSelectValue("numOfLetters", e)}
            
              variant="filled"
              style={{ flex: 1 }}
              options={numOfLettersOptions}
              value={numberOfLettersValue}
            /> {numberOfLettersValue && (
              <CloseCircleOutlined
                className="bg-[#e8edf5] p-2 rounded-xl text-[#FF0000] cursor-pointer"
                onClick={() => handleSelectValue('numOfLetters', null)} // Clear individual filter
              />
            )}
                      </div>

            <div className="text-base font-medium items-center gap-2 flex bg-[#e8edf5] p-2 rounded-[8px]  ">Gender : <Select
              className="min-w-[100px] bg-[#e5e5e5] rounded-xl"
              onChange={(e) => handleSelectValue("gender", e)}
              
              variant="filled"
              style={{ flex: 1 }}
              options={genderOptions}
              value={genderValue}
            /> {genderValue && (
              <CloseCircleOutlined
                className="bg-[#e8edf5] p-2 rounded-xl text-[#FF0000] cursor-pointer"
                onClick={() => handleSelectValue('gender', null)} // Clear individual filter
              />
            )}
                      </div>

            <div className="text-base font-medium items-center gap-2 flex bg-[#e8edf5] p-2 rounded-[8px] ">Birth Year : <Select
              className="min-w-[100px] bg-[#e5e5e5] rounded-xl"
              onChange={(e) => handleSelectValue("birthYear", e)}
              variant="filled"
              style={{ flex: 1 }}
              options={birthYearsOptions}
              value={BirthYearValue}
            /> {BirthYearValue && (
              <CloseCircleOutlined
                className="bg-[#e8edf5] p-2 rounded-xl text-[#FF0000] cursor-pointer"
                onClick={() => handleSelectValue('birthYear', null)} // Clear individual filter
              />
            )}
                      </div>

            <div className="text-base font-medium items-center gap-2 flex bg-[#e8edf5] p-2 rounded-[8px] ">Sort By : <Select
              className="min-w-[100px] bg-[#e5e5e5] rounded-xl"
              onChange={(e) => handleSelectValue("sortBy", e)}
              variant="filled"
              style={{ flex: 1 }}
              options={sortByOptions}
              value={sortByValue}
            /> {sortByValue && (
              <CloseCircleOutlined
                className="bg-[#e8edf5] p-2 rounded-xl text-[#FF0000] cursor-pointer"
                onClick={() => handleSelectValue('sortBy', null)} // Clear individual filter
              />
            )}
                      </div>
                      {(startWithLetterValue|| endsWithLetterValue|| numberOfLettersValue|| genderValue|| BirthYearValue|| sortByValue) && (
              <Button type="primary" onClick={clearFilter}>Clear All Filters</Button> // Button to clear all filters
            )}

          </div>
        </div>
        <div className="px-4 md:px-6 lg:px-24 xl:px-40 grid grid-cols-5 mx-auto gap-3">
        {loading
        ? dummyBabies.map((_, index) => <BabyCard key={index} loading={loading} />)
        : babies?.data?.baby_list?.length > 0 ? babies?.data?.baby_list?.map((baby, index) => (
            <BabyCard key={index} baby={baby} loading={loading} />
          )):<div className="text-3xl font-bold text-center w-[70vw] mt-8">No Data Found</div>}
        </div>
      </div>
    </>
  );
};

export default Main;
