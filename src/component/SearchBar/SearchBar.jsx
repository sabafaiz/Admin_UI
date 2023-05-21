import { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ userData ,setUserData , searchData}) => {
    const [value, setValue] = useState('');
    const [debounceTime, setDebounceTime] = useState(null);

    
  const search = (value) =>{
    let arr = searchData.filter((user) => {
      return user.name.toLowerCase().match(value) ||
      user.email.toLowerCase().match(value) ||
      user.role.toLowerCase().match(value)
  })
  setUserData([...arr]);
  }


    const debounceSearch = (event) => {
        setValue(event.target.value)
        if (debounceTime) {
            clearTimeout(debounceTime)
        }

        let value = event.target.value
        let timer;
        timer = setTimeout(() => {
            search(value.toLowerCase())
        }, 500)

        setDebounceTime(timer)

    };

    return (
        <div className="container mb-4">
            <input
                type="search"
                placeholder='Search By Name , Email, Role...'
                className='form-control'
                value={value}
                onChange={(event) => debounceSearch(event)}
            />
        </div>
    )
}

export default SearchBar;