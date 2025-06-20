import React, { useState } from "react";

function SearchInput({ onSearch, loading }) {
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedId = searchId.trim();

    if (!/^\d{14}$/.test(trimmedId)) {
      setError("National ID must be exactly 14 digits.");
      return;
    }

    setError(""); 
    onSearch(trimmedId);
  };

  return (
    <form onSubmit={handleSubmit} className="container">
      <div className="d-flex flex-column align-items-start w-100">
        <label htmlFor="search" className="fw-bold mb-1">
          Search by National ID:
        </label>
        <div className="d-flex w-100">
          <input
            className={`form-control ${error ? "is-invalid" : ""}`}
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
        {error && (
          <div className="alert alert-danger mt-2 w-100" role="alert">
            {error}
          </div>
        )}
      </div>
    </form>
  );
}

export default SearchInput;
