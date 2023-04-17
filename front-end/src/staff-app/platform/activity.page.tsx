import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Chip, Divider, List, ListItem, ListItemText, Typography } from "@material-ui/core"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { RolllStateType } from "shared/models/roll"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <>
      <S.PageContainer>
        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}

        {loadState === "loaded" &&
          ((data?.activity.length ?? 0) < 1 ? (
            <CenteredContainer>
              <div>No activity recorded</div>
            </CenteredContainer>
          ) : (
            <S.List>
              {data?.activity &&
                [...data.activity].reverse().map((a, index) => (
                  <React.Fragment key={a.entity.id}>
                    <ActivityCard activity={a} />
                    {index < data.activity.length - 1 ? <Divider /> : null}
                  </React.Fragment>
                ))}
            </S.List>
          ))}
      </S.PageContainer>
    </>
  )
}

const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={
            <S.ListItemPrimary>
              <S.ListItemTitle>{activity.entity.name}</S.ListItemTitle>
              <Chip label="Roll" size="small" />
            </S.ListItemPrimary>
          }
          secondary={
            <S.ListItemSecondary>
              <Typography component="span" variant="body2" color="textPrimary">
                {new Date(activity.entity.completed_at).toLocaleString("en-gb", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
              </Typography>
              {" | "}
              <RollSummary activity={activity} />
            </S.ListItemSecondary>
          }
        />
      </ListItem>
    </>
  )
}

const RollSummary = ({ activity }: { activity: Activity }) => {
  const rollStates = activity.entity.student_roll_states
  const total = rollStates.length

  const { present, late, absent } = rollStates.reduce(
    (acc, { roll_state }) => {
      acc[roll_state]++
      return acc
    },
    { present: 0, late: 0, absent: 0 } as Record<RolllStateType, number>
  )

  return (
    <>
      <S.RollCount title="Total students">
        <FontAwesomeIcon icon="users" size="sm" />
        <span>{total}</span>
      </S.RollCount>
      <S.RollCount title="Present students">
        <RollStateIcon type="present" size={14} />
        <span>{present}</span>
      </S.RollCount>
      <S.RollCount title="Late students">
        <RollStateIcon type="late" size={14} />
        <span>{late}</span>
      </S.RollCount>
      <S.RollCount title="Absent students">
        <RollStateIcon type="absent" size={14} />
        <span>{absent}</span>
      </S.RollCount>
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
  List: styled(List)`
    background-color: #fff;
  `,
  ListItemPrimary: styled.div`
    margin-bottom: ${Spacing.u2};
    display: flex;
    align-items: center;
    gap: ${Spacing.u3};
  `,
  ListItemTitle: styled(Typography)`
    display: inline-block;
    font-weight: 500 !important;
  `,

  ListItemSecondary: styled.div`
    display: flex;
    align-items: center;
    gap: ${Spacing.u3};
  `,
  RollCount: styled.div`
    display: flex;
    align-items: center;
    gap: ${Spacing.u2};
  `,
}
