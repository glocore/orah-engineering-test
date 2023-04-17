import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, FontSize, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useStudentListStore } from "staff-app/stores/studentList.store"
import { useApi } from "shared/hooks/use-api"
import { RolllStateType } from "shared/models/roll"
import { CircularProgress, Slide, Snackbar, makeStyles } from "@material-ui/core"

export type ActiveRollAction = "filter" | "exit"
interface Props {}

export const ActiveRollOverlay: React.FC<Props> = () => {
  const classes = useStyles()

  const isActive = useStudentListStore((state) => state.isRollMode)
  const exitRollMode = useStudentListStore((state) => state.exitRollMode)
  const rollStates = useStudentListStore((state) => state.rollStates)

  const [snackbar, setSnackbar] = useState<string | null>(null)

  const [saveRoll, , saveRollStatus] = useApi({ url: "save-roll", initialLoadState: "unloaded" })

  const handleCompletedClick = async () => {
    const roll = [] as { student_id: number; roll_state: RolllStateType }[]
    rollStates.forEach((roll_state, student_id) => roll.push({ roll_state, student_id }))

    await saveRoll({ student_roll_states: roll })
  }

  useEffect(() => {
    if (saveRollStatus === "error") {
      setSnackbar("Something went wrong. Please try again.")
      return
    }

    if (saveRollStatus === "loaded") {
      exitRollMode()
      setTimeout(() => {
        setSnackbar("Saved roll successfully.")
      }, 100)

      return
    }
  }, [saveRollStatus])

  const counts = { all: 0, unmark: 0, present: 0, late: 0, absent: 0 }
  counts.all = rollStates.size
  rollStates.forEach((r) => counts[r]++)

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div style={{ marginTop: Spacing.u2, fontSize: FontSize.u3 }}>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: counts.all },
              { type: "present", count: counts.present },
              { type: "late", count: counts.late },
              { type: "absent", count: counts.absent },
            ]}
          />
          <div style={{ marginTop: Spacing.u1, textAlign: "right" }}>
            <Button color="inherit" onClick={exitRollMode}>
              Exit
            </Button>

            <div className={classes.wrapper}>
              <Button color="inherit" className={classes.completeButton} onClick={handleCompletedClick} disabled={saveRollStatus === "loading"}>
                Complete
              </Button>
              {saveRollStatus === "loading" && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </div>
        </div>
      </S.Content>

      <Snackbar open={!!snackbar} onClose={() => setSnackbar(null)} TransitionComponent={Slide} message={snackbar} autoHideDuration={4000} />
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

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "relative",
    display: "inline-block",
  },
  completeButton: {
    marginLeft: Spacing.u2,
    "&:disabled": {
      color: "gray",
    },
  },
  buttonProgress: {
    color: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}))
