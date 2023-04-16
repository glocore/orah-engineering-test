import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useStudentListStore } from "staff-app/stores/studentList.store"

export type ActiveRollAction = "filter" | "exit"
interface Props {}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const isActive = useStudentListStore((state) => state.isRollMode)
  const exitRollMode = useStudentListStore((state) => () => {
    state.exitRollMode()
    state.resetRollStates()
  })
  const rollStates = useStudentListStore((state) => state.rollStates)

  const counts = { all: 0, unmark: 0, present: 0, late: 0, absent: 0 }
  counts.all = rollStates.size
  rollStates.forEach((r) => counts[r]++)

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: counts.all },
              { type: "present", count: counts.present },
              { type: "late", count: counts.late },
              { type: "absent", count: counts.absent },
            ]}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={exitRollMode}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={exitRollMode}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
