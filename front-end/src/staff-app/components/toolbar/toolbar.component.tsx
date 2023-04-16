import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, IconButton, Typography } from "@material-ui/core"
import React from "react"
import { useStudentListStore } from "staff-app/stores/studentList.store"
import { Colors } from "shared/styles/colors"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import styled from "styled-components"

type ToolbarProps = {}

export const Toolbar: React.FC<ToolbarProps> = () => {
  const { sortBy, sortOrder, isRollMode, setSortOrder, setSortBy, setSearchTerm, enterRollMode, exitRollMode } = useStudentListStore()

  function handleSortByClick() {
    setSortBy(sortBy === "first_name" ? "last_name" : "first_name")
  }

  function handleSortOrderClick() {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value)
  }

  function handleRollButtonClick() {
    isRollMode ? exitRollMode() : enterRollMode()
  }

  return (
    <S.ToolbarContainer>
      <div>
        <Typography variant="caption">Sort by:</Typography>
        <S.Button onClick={handleSortByClick} style={{ width: 110 }} title={`Sort by ${sortBy === "first_name" ? "first name" : "last name"}`}>
          {sortBy === "first_name" ? "First Name" : "Last Name"}
        </S.Button>
        <S.SortButton onClick={handleSortOrderClick} size="small" title={`Sort in ${sortOrder === "asc" ? "ascending" : "descending"} order`}>
          {sortOrder === "asc" ? <FontAwesomeIcon icon="arrow-down" size="sm" /> : <FontAwesomeIcon icon="arrow-up" size="sm" />}
        </S.SortButton>
      </div>
      <S.TextField id="search" placeholder="Search" onChange={handleSearchChange} />
      <S.Button onClick={handleRollButtonClick} style={{ width: 100 }}>
        {isRollMode ? "Cancel" : "Start Roll"}
      </S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      font-weight: ${FontWeight.strong};
      color: #fff;
    }
  `,
  SortButton: styled(IconButton)`
    && {
      color: #fff;
      padding: 10px;
    }
  `,
  TextField: styled.input`
    border: 1px solid white;
    background-color: transparent;
    padding: 7px 10px;
    border-radius: 5px;
    font-size: 16px;
    outline: none;
    color: #fff;

    ::placeholder {
      color: white;
    }
  `,
}
