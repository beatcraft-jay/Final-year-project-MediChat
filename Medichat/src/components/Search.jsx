import React from 'react'

const Search = () => {
  return (
        <div className="input-group my-3 px-3">
            <input type="text" className="form-control border-0 bg-light" placeholder="Search"/>
            <button className="btn btn-outline-secondary border-0 bg-light" type="button" id="button-addon2"><i className="bi bi-search"></i></button>
        </div>
  )
}

export default Search
