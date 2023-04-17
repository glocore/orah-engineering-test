import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, FontSize, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useDailyCareStore } from "staff-app/stores/daily-care-store.store"
import { useApi } from "shared/hooks/use-api"
import { RolllStateType } from "shared/models/roll"
import { CircularProgress, Slide, Snackbar, Typography, withStyles } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type ActiveRollAction = "filter" | "exit"
interface Props {}

export const ActiveRollOverlay: React.FC<Props> = () => {
  const isActive = useDailyCareStore((state) => state.isRollMode)
  const exitRollMode = useDailyCareStore((state) => state.exitRollMode)
  const rollStates = useDailyCareStore((state) => state.rollStates)

  const [snackbar, setSnackbar] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [saveRoll, , saveRollStatus] = useApi({ url: "save-roll", initialLoadState: "unloaded" })

  const handleCompletedClick = async () => {
    const roll = [] as { student_id: number; roll_state: RolllStateType }[]
    rollStates.forEach((roll_state, student_id) => roll.push({ roll_state, student_id }))

    await saveRoll({ student_roll_states: roll })
  }

  useEffect(() => {
    if (saveRollStatus === "error") {
      setSnackbar({ type: "error", message: "Something went wrong. Please try again." })
      return
    }

    if (saveRollStatus === "loaded") {
      exitRollMode()
      setTimeout(() => {
        setSnackbar({ type: "success", message: "Saved roll successfully." })
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

            <S.CompleteButtonWrapper>
              <S.CompleteButton color="inherit" onClick={handleCompletedClick} disabled={saveRollStatus === "loading"}>
                Complete
              </S.CompleteButton>
              {saveRollStatus === "loading" && <S.CircularProgress size={24} color="inherit" />}
            </S.CompleteButtonWrapper>
          </div>
        </div>
      </S.Content>

      <Snackbar
        open={!!snackbar}
        onClose={() => setTimeout(() => setSnackbar(null), 300)}
        TransitionComponent={Slide}
        message={
          <S.SnackbarContent>
            <FontAwesomeIcon icon={snackbar?.type === "error" ? "exclamation-circle" : "check-circle"} color={snackbar?.type === "error" ? "tomato" : "lightgreen"} />
            <Typography>{snackbar?.message}</Typography>
          </S.SnackbarContent>
        }
        autoHideDuration={4000}
      />
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
  CompleteButtonWrapper: styled.div`
    position: relative;
    display: inline-block;
  `,
  CompleteButton: withStyles({
    root: {
      marginLeft: Spacing.u2,
      "&:disabled": {
        color: "gray",
      },
    },
  })(Button),
  CircularProgress: styled(CircularProgress)`
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -12px;
    margin-left: -12px;
  `,
  SnackbarContent: styled.div`
    display: flex;
    align-items: center;
    gap: ${Spacing.u2};
  `,
}
