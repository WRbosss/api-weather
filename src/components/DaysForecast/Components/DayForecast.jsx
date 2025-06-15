import React from "react"
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import styles from '../styles.module.css'
import { DateTime } from 'luxon'

const DAYS_OF_THE_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function DayForecast({ date, icon, minTemp, maxTemp, chanceOfRain }) {
    const dateForecast = DateTime.fromISO(date, { zone: "America/Sao_Paulo" })
    const dayOfTheWeek = dateForecast.weekday % 7
    const dayOfMonth = dateForecast.day

    const currentDate = new Date()
    const currentDay = currentDate.getDate()

    return currentDay <= dayOfMonth? (
        <Box
            display="flex"
            gap={2}
            justifyContent="space-around"
            alignItems="center"
        >
            <Box width="120px">
                {dayOfMonth === currentDay ? 'Today' : DAYS_OF_THE_WEEK[dayOfTheWeek] + ", "+ dayOfMonth}
            </Box>
            
            <Box className={styles.rowChanceOfRain}>
                <img src={icon} width="30px" alt="Icon" />

                { chanceOfRain > 0 ? (
                    <Box className={styles.labelChanceOfRain}>
                        { chanceOfRain }%
                    </Box>
                ) : '' }
            </Box>

            <Box display="flex" alignItems="center">
                { minTemp }º
                <hr className={styles.linhaMinMaxTemp}></hr>
                { maxTemp }º
            </Box>

        </Box>
    ):""
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