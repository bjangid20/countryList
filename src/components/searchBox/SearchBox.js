import React from "react";
import styled from "styled-components";

export default function SearchBox({ searchTerm, setSearchTerm }) {
  return (
    <Input
      type="text"
      className="outerBox_search_input"
      title="FilterLocations"
      placeholder="Filter locations"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

const Input = styled.input`
  width: 100%;
  padding: 10px 10px 10px 30px;
`;
