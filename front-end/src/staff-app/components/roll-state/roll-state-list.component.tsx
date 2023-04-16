import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Spacing, FontWeight } from "shared/styles/styles"
import { RolllStateType } from "shared/models/roll"
import { useStudentListStore } from "staff-app/stores/studentList.store"
import { Button, ButtonProps } from "@material-ui/core"

interface Props {
  stateList: StateList[]
}
export const RollStateList: React.FC<Props> = ({ stateList }) => {
  const rollStateFilter = useStudentListStore((state) => state.rollStateFilter)
  const setRollStateFilter = useStudentListStore((state) => state.setRollStateFilter)

  const onClick = (type: ItemType) => {
    setRollStateFilter(type === "all" ? null : type)
  }

  return (
    <S.ButtonGroup>
      {stateList.map((s, i) => {
        if (s.type === "all") {
          return (
            <S.Button key={i} onClick={() => onClick(s.type)} title="Show all students">
              <S.ButtonLabel>
                <FontAwesomeIcon icon="users" size="sm" style={{ cursor: "pointer" }} />
                <span>{s.count}</span>
              </S.ButtonLabel>
            </S.Button>
          )
        }

        return (
          <S.Button key={i} onClick={() => onClick(s.type)} selected={rollStateFilter === s.type} title={`Show ${s.type} students`}>
            <S.ButtonLabel>
              <RollStateIcon type={s.type} size={14} />
              <span>{s.count}</span>
            </S.ButtonLabel>
          </S.Button>
        )
      })}
    </S.ButtonGroup>
  )
}

const S = {
  ButtonGroup: styled.div`
    display: flex;
    align-items: center;
    color: #fff;
  `,
  ButtonLabel: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
  Button: styled(Button)<ButtonProps & { selected?: boolean }>`
    && {
      color: #fff;
      ${({ selected }) => `border: 1px solid ${selected ? "#fff" : "transparent"}`}
    }
  `,
}

interface StateList {
  type: ItemType
  count: number
}

type ItemType = RolllStateType | "all"
