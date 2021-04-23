import React, { useEffect, useState } from "react";
import "./searchWidget.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListView from "../../components/ListView/ListView";
import Search from "../../components/searchBox/SearchBox";
import { isCheckedAnyOfItem } from "../../helpers/Utility";
import {
  faWindowMinimize,
  faWindowMaximize,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const SearchWidget = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByWords, setSortByWords] = useState({});
  const [minimize, setMinimize] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clearAll, setClearAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    function fetchData() {
      axios
        .get("http://localhost:9292/api/v1/countries")
        .then((res) => {
          setLoading(false);
          let sortedArr = res.data.sort((a, b) => a.city.localeCompare(b.city));
          sortedArr.forEach((ele) => {
            ele.checked = false;
            return ele;
          });
          for (let item of sortedArr) {
            if (!sortByWords.hasOwnProperty(item.city.substring(0, 1))) {
              sortByWords[item.city.substring(0, 1)] = item.id;
            }
          }
          setSortByWords(sortByWords);
          setData(sortedArr);
        })
        .catch((err) => {
          setLoading(false);
          console.log("some error occurred");
        });
    }
    fetchData();
  }, [sortByWords]);

  const toScrollToCity = (id, word) => {
    var element = document.getElementById(id);
    if (element) {
      setClearAll(true);
      setData(
        data.map((item) => {
          if (item.city.substring(0, 1) === word) {
            item.checked = true;
            return item;
          } else {
            item.checked = false;
            return item;
          }
        })
      );
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
      // element.parentNode.scrollTop = element.offsetTop - 30;
      if (isCheckedAnyOfItem(data)) {
        setClearAll(true);
      } else {
        setClearAll(false);
      }
    }
  };

  const handleCheckBox = (checked, id) => {
    setData(
      data.map((item) => {
        if (item.id === id) {
          if (!checked) {
            item.checked = false;
            return item;
          } else {
            item.checked = true;
            return item;
          }
        } else {
          return item;
        }
      })
    );
    if (isCheckedAnyOfItem(data)) {
      setClearAll(true);
    } else {
      setClearAll(false);
    }
  };

  const clearAllChecked = () => {
    setData(
      data.map((item) => {
        if (item.checked) {
          item.checked = false;
          return item;
        } else {
          return item;
        }
      })
    );
    setClearAll(false);
  };

  return (
    <>
      <div
        className={`outerBox ${collapsed ? "collapsed" : ""} ${
          minimize ? "minimized" : ""
        }`}
      >
        <div className="outerBox_wrapper1">
          <div className="outerBox_heading">
            <h3>Locations</h3>
            <span className="outerBox_icons">
              {!minimize && !collapsed && (
                <FontAwesomeIcon
                  icon={faWindowMinimize}
                  onClick={(e) => setMinimize(!minimize)}
                />
              )}
              {minimize && (
                <FontAwesomeIcon
                  icon={faWindowMaximize}
                  className={` ${collapsed ? "disabled-button" : ""} `}
                  onClick={(e) => setMinimize(!minimize)}
                />
              )}
              {!collapsed && (
                <FontAwesomeIcon
                  icon={faAngleDoubleLeft}
                  className={` ${minimize ? "disabled-button" : ""} `}
                  onClick={(e) => setCollapsed(!collapsed)}
                />
              )}
              {collapsed && (
                <FontAwesomeIcon
                  icon={faAngleDoubleRight}
                  className={` ${minimize ? "disabled-button" : ""} `}
                  onClick={(e) => setCollapsed(!collapsed)}
                />
              )}
            </span>
          </div>
          {!minimize && !collapsed && (
            <div className="outerBox_search">
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <FontAwesomeIcon
                icon={faSearch}
                className="outerBox_search_icon"
              />
            </div>
          )}
        </div>
        {!minimize && !collapsed && (
          <div className="outerBox_wrapper2">
            <div className="outerBox_keyIndex">
              <div className="outerBox_keyIndex_wrapper">
                {Object.keys(sortByWords).map((keyWord) => (
                  <span
                    key={sortByWords[keyWord]}
                    id={`word${sortByWords[keyWord]}`}
                    onClick={() =>
                      toScrollToCity(sortByWords[keyWord], keyWord)
                    }
                  >
                    {keyWord}
                  </span>
                ))}
              </div>
            </div>
            {clearAll && (
              <div className="outerBox_clearAll" onClick={clearAllChecked}>
                <span>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                <span>Clear All</span>
              </div>
            )}
            <div
              className="outerBox_list_wrapper"
              style={{ paddingTop: clearAll ? "30px" : "" }}
            >
              <div className="outerBox_list">
                <ListView
                  loading={loading}
                  handleCheckBox={handleCheckBox}
                  data={data.filter((val) => {
                    if (searchTerm === "") return val;
                    else if (
                      val.city.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                      return val;
                    else if (
                      val.country
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                      return val;
                  })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchWidget;
