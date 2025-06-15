import React from "react"
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import styles from '../styles.module.css'

const DAYS_OF_THE_WEEK = ['Saturday','Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export function DayForecast({ date, icon, minTemp, maxTemp, chanceOfRain }) {
    const dateForecast = new Date(date)
    const dayOfTheWeek = dateForecast.getUTCDay()
    const dayOfMonth = dateForecast.getDate()

    const currentDate = new Date()
    const currentDay = currentDate.getDate()

    return currentDay <= dayOfMonth ? (
        <Box
            display="flex"
            gap={2}
            justifyContent="space-around"
            alignItems="center"
        >
            <Box width="120px">
                {dayOfMonth === currentDay ? 'Today' : DAYS_OF_THE_WEEK[dayOfTheWeek] + ", " + dayOfMonth}
            </Box>
            
            <Box className={styles.rowChanceOfRain}>
                <img src={icon} width="30px" alt="Icon" />
                <Box className={styles.labelChanceOfRain}>
                    {chanceOfRain}%
                </Box>
            </Box>
            
            <Box display="flex" alignItems="center">
                <Box width="30px" textAlign="right">
                    {minTemp}º
                </Box>
                <hr className={styles.linhaMinMaxTemp} />
                <Box width="30px" textAlign="left">
                    {maxTemp}º
                </Box>
            </Box>
        </Box>
    ) : ""
}

DayForecast.propTypes = {
    date: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    minTemp: PropTypes.number.isRequired,
    maxTemp: PropTypes.number.isRequired,
    chanceOfRain: PropTypes.number.isRequired
}

DayForecast.defaultProps = {

}