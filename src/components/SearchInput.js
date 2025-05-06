import React, { useState } from "react";

function SearchInput({ onSearch, loading }) {
  const [searchId, setSearchId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      onSearch(searchId); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container">
      <div className="d-flex flex-column align-items-start">
        <label htmlFor="search" className="fw-bold mb-1"> Search by National ID:</label>
        <div className="d-flex w-100">
          <input
            className="form-control"
            type="search"
            placeholder="Enter National ID"
            aria-label="Search"
            value={searchId}
            id="search"
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button className="btn btn-primary ms-2" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchInput;
