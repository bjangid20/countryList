import React from "react";
import "./ListView.css";

export default function ListView({ data, loading, handleCheckBox }) {
  return (
    <div className="listView">
      {data.length > 0 &&
        data.map((data, index) => (
          <div id={data.id} key={index} className="dataWrapper">
            <input
              key={index}
              type="checkbox"
              data-testid="toggle"
              checked={data.checked}
              onChange={(e) => handleCheckBox(e.target.checked, data.id)}
            />
            <p>
              {data.city}-{data.country}
            </p>
          </div>
        ))}
      {data.length === 0 && loading && <h4>Loading...</h4>}
      {data.length === 0 && !loading && <h4>No Data Found</h4>}
    </div>
  );
}
