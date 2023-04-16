import React, { useEffect, useMemo } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Toolbar } from "staff-app/components/toolbar/toolbar.component"
import { useStudentListStore, SortBy, SortOrder } from "staff-app/stores/studentList.store"

export const HomeBoardPage: React.FC = () => {
  const { sortBy, sortOrder, searchTerm, setInitialRollStates } = useStudentListStore()
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if (!data) return
    setInitialRollStates(data.students.map((s) => s.id))
  }, [data])

  const studentsSorted = useMemo(() => {
    if (!data?.students) return

    return (structuredClone(data.students) as Person[]).sort((a, b) => sortStudents(a, b, sortBy, sortOrder)).filter((s) => filterStudents(s, searchTerm))
  }, [data?.students, sortBy, sortOrder, searchTerm])

  return (
    <>
      <S.PageContainer>
        <Toolbar />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentsSorted && (
          <>
            {studentsSorted.map((s) => (
              <StudentListTile key={s.id} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay />
    </>
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
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}

const sortStudents = (a: Person, b: Person, sortBy: SortBy, sortOrder: SortOrder) => {
  const nameA = a[sortBy].toUpperCase()
  const nameB = b[sortBy].toUpperCase()

  let comparison = 0

  if (nameA > nameB) {
    comparison = 1
  } else if (nameA < nameB) {
    comparison = -1
  }
  return sortOrder === "desc" ? comparison * -1 : comparison
}

const filterStudents = (s: Person, searchTerm: string) => `${s.first_name.toLowerCase()}${s.last_name.toLowerCase()}`.includes(searchTerm.replaceAll(" ", ""))
