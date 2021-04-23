import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Search from "../../components/searchBox/SearchBox";
import ListView from "../../components/ListView/ListView";
import axios from "axios";
import { isCheckedAnyOfItem } from "../../helpers/Utility";
import {
  faWindowMinimize,
  faWindowMaximize,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

function NewComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [minimize, setMinimize] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortByWords, setSortByWords] = useState({});
  const [data, setData] = useState([]);
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
      });
      // element.parentNode.scrollTop = element.offsetTop - 30;
      if (isCheckedAnyOfItem(data)) {
        setClearAll(true);
      } else {
        setClearAll(false);
      }
    }
  };

  const toGetSearchTerm = (val) => {
    setSearchTerm(val);
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
    <Container>
      <Main>
        <ContentOne collapsed={collapsed}>
          <Header collapsed={collapsed}>
            {!collapsed && <Logo>Location</Logo>}
            {collapsed && <LogoWithCollapsed>Locations</LogoWithCollapsed>}
            <IconSection>
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
            </IconSection>
          </Header>
          {!minimize && !collapsed && (
            <SearchBox>
              <Search
                searchTerm={searchTerm}
                setSearchTerm={(val) => setSearchTerm(val)}
              />
              <Icon>
                <FontAwesomeIcon icon={faSearch} />
              </Icon>
            </SearchBox>
          )}
        </ContentOne>
        <ContentTwo
          clearAll={clearAll}
          minimize={minimize}
          collapsed={collapsed}
        >
          {!minimize && !collapsed && (
            <>
              <ListContainer>
                {clearAll && (
                  <ClearAll onClick={clearAllChecked}>
                    <FontAwesomeIcon icon={faTimes} /> <p>Clear All</p>
                  </ClearAll>
                )}
                <ListWrapper>
                  <ListView
                    loading={loading}
                    handleCheckBox={handleCheckBox}
                    data={data.filter((val) => {
                      if (searchTerm === "") return val;
                      else if (
                        val.city
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
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
                </ListWrapper>
                <AlphabeticalList clearAll={clearAll}>
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
                </AlphabeticalList>
              </ListContainer>
            </>
          )}
        </ContentTwo>
      </Main>
    </Container>
  );
}

const Container = styled.section`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  width: 100%;
  transition: all 0.5s ease 0s;
`;

const Main = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s ease 0s;
`;

const ContentOne = styled.div`
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-height: 600px;
  min-width: 400px;
  max-width: 500px; 
  background-color: #f9f9f9;
  border-radius: 5px 5px 0 0;
  transition: all 0.5s ease-out 0s;
  ${(props) =>
    props.collapsed &&
    css`
      min-width: 100px;
      min-height: 200px;
      transition: all 0.5s ease-out 0s;
    `};
`;
const ContentTwo = styled.div`
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: all 0.5s ease 0s;
  align-items: center;
  max-height: 600px;
  min-width: 400px;
  max-width: 500px;
  background-color: #f9f9f9;
  border-radius: 0 0 5px 5px;
  ${(props) =>
    props.collapsed &&
    css`
      min-width: 100px;
    `};
  ${(props) =>
    !props.clearAll &&
    !props.minimize &&
    !props.collapsed &&
    css`
      padding-top: 20px;
    `};
`;

const Header = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  padding: 0 20px;
  transition: all 0.5s ease 0s;
  ${(props) =>
    props.collapsed &&
    css`
      flex-direction: column;
      justify-content: space-around;
    `};
`;

const Logo = styled.h2`
  cursor: pointer;
`;

const LogoWithCollapsed = styled.h2`
  transform: rotate(-90deg);
  position: absolute;
  font-size: 2rem;
  bottom: 20%;
`;

const IconSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 3rem;
  cursor: pointer;
  color: #1e80ef;
`;
const SearchBox = styled.div`
  position: relative;
  width: 100%;
  padding: 0 20px;
`;

const Icon = styled.span`
  position: absolute;
  color: #1e80ef;
  left: 27px;
  top: calc(50% - 0.65em);
`;

const ListContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const ClearAll = styled.p`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  color: #1e80ef;
  padding: 0 20px;
  p {
    margin: 0;
    padding: 0;
    width: 5rem;
  }
`;

const ListWrapper = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  height: 500px;
  width: 100%;
  padding: 0 17px;
`;

const AlphabeticalList = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  justify-content: center;
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  right: 20px;
  cursor: pointer;
  color: #040714;
  font-size: 0.8rem;
  top: 10px;
  ${(props) =>
    !props.clearAll &&
    css`
      top: -10px;
    `};
`;

export default NewComponent;
