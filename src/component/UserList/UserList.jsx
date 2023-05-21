/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { FaEdit, FaRegTrashAlt, FaSave } from "react-icons/fa";
import "./UserList.css";
import SearchBar from '../SearchBar/SearchBar';
import 'bootstrap/dist/css/bootstrap.css';

function UserList() {

  const [userData, setUserData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateRole, setUpdateRole] = useState("");
  const [editData, setEditData] = useState(null);
  const [isChecked, setIsChecked] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const allSelRef = useRef()
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = userData.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(userData.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);






  // Edit user data on click

  const editUser = (id) => {
    setEditData(id)

  }

  const updateUser = (id) => {
    setEditData(id);
    setUpdateName(id);
    setUpdateEmail(id);
    setUpdateRole(id);
  }

  // handle Pagination
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  function nextPage() {
    if (currentPage !== nPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  function changeCurrentPage(id) {
    setCurrentPage(id);
  }


  // Delete user by onclick

  const deleteUser = (selectUser) => {
    let deleteRow = userData.filter((user) => {
      return user.id !== selectUser;
    })
    setUserData(deleteRow);
    setSearchData(deleteRow)

  }


  // mutliple checkbox 
  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setIsChecked([...isChecked, value]);
    } else {
      setIsChecked(isChecked.filter((e) => e !== value)) // return all the non-checked --> use
    }

  }

  // all delete button

  const deleteAllChecked = () => {
    setUserData(userData => userData.filter(user => !isChecked.includes(user.id)))
    setSearchData(userData => userData.filter(user => !isChecked.includes(user.id)))
    setIsChecked([])
    allSelRef.current.checked = false
  }

  //  select All row
  const selectAllRows = () => {
    const allSelectedIds = []
    records.forEach(user => {
      allSelectedIds.push(user.id)
    })
    setIsChecked(allSelectedIds)
  }

  const deselectAllRows = () => setIsChecked([])

  // handle toggle
  const selectCheckBox =(id) =>{
    if(isChecked.includes(id)){
      return true;
    }
    return false;
  }



  useEffect(() => {
    getUserResponse()
  }, []);

  const dataURL = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  const getUserResponse = async () => {
    try {
      const { data } = await axios
        .get(dataURL);
      setUserData(data)
      setSearchData(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='container'>
      <h1 className='heading'> Admin UI</h1>
      <SearchBar userData={userData} setUserData={setUserData} searchData={searchData} />
      <form>
        <table className='user-table table-responsive'>
          <thead>
            <tr className='center'>
              <th className='center'>
                <input type='checkbox' ref={allSelRef} value="" onChange={(e) => {
                  if (e.currentTarget.checked) {
                    selectAllRows()
                  } else {
                    deselectAllRows()
                  }
                }} /></th>
              <th className='center'>Name</th>
              <th className='center'>Email</th>
              <th className='center'>Role</th>
              <th className='center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              records.map((user, index) =>
                user.id === editData ? (
                  <tr key={index}>
                    <td className='center'>
                      <input type='checkbox' />
                    </td>
                    <td><input type='text'
                      name='name' value={user.name}
                      onChange={e => setUpdateName(e.target.value)} />
                    </td>
                    <td><input type='text'
                      name='email'
                      value={user.email}
                      onChange={e => setUpdateEmail(e.target.value)} />
                    </td>
                    <td><input type='text'
                      name='role' value={user.role}
                      onChange={e => setUpdateRole(e.target.value)} />
                    </td>
                    <td><FaSave onClick={updateUser} /></td>
                  </tr>
                )
                  :
                  (
                    <tr key={user.id} className={selectCheckBox(user.id) ? 'selected' : 'null'} onClick={() =>selectCheckBox()}>
                      <td className='center'><input type='checkbox'
                        value={user.id} checked={user.isChecked || isChecked.includes(user.id)}
                        onChange={(e) => handleCheckbox(e)} />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td><span onClick={() => editUser(user.id)}><FaEdit /></span>
                        <span onClick={() => deleteUser(user.id)} className='deleteButton' ><FaRegTrashAlt /></span>
                      </td>
                    </tr>
                  )
              )
            }
          </tbody>
        </table>
        <nav className='nav justify-content-center m-4 mb-0'>
          <ul className='pagination'>
            <li className='page-item'>
              <a href='#' className='page-link' onClick={prePage}>Prev</a>
            </li>
            {
              numbers.map((n, i) => (
                <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                  <a href='#' className='page-link' onClick={() => changeCurrentPage(n)}>{n}</a>
                </li>
              ))
            }
            <li className='page-item'>
              <a href='#' className='page-link' onClick={nextPage}>Next</a>
            </li>
          </ul>
        </nav>
        <button type="button" className="btn btn-danger"
          onClick={deleteAllChecked}
          disabled={!isChecked.length}>
          Delete
        </button>
      </form>
    </div>
  )
}

export default UserList
