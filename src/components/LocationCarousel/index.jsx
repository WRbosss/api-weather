import React, { useEffect, useState, useContext } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { LocationContext } from '../../contexts/LocationContext';

export function LocationCarousel() {
    const [locations, setLocations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { location: currentLocation, setLocation } = useContext(LocationContext);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedLocations')) || [];
        setLocations(saved);

        const index = saved.indexOf(currentLocation);
        if (index !== -1) {
            setCurrentIndex(index);
        } else if (saved.length > 0) {
            setLocation(saved[0]);
            setCurrentIndex(0);
        }
    }, [currentLocation, setLocation]);

    const handlePrev = () => {
        const newIndex = (currentIndex - 1 + locations.length) % locations.length;
        setCurrentIndex(newIndex);
        setLocation(locations[newIndex]);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % locations.length;
        setCurrentIndex(newIndex);
        setLocation(locations[newIndex]);
    };

    if (locations.length === 0) return null;

    return (
        <Box display="flex" alignItems="center" gap={2} mt={2} justifyContent="space-between" width={'60%'}>
            {locations.length > 1 && (
                <IconButton onClick={handlePrev} disabled={locations.length < 2}>
                    <ArrowBackIosIcon color='primary' sx={{ flexShrink: 0 }} />
                </IconButton>
            )}
            <Typography variant="body1" sx={{ flex: 1, color: 'white', wordWrap: 'break-word', textAlign: 'center', }}>
                {locations[currentIndex]?.split(',')[0]}
            </Typography>
            {locations.length > 1 && (
                <IconButton onClick={handleNext} disabled={locations.length < 2}>
                    <ArrowForwardIosIcon color='primary' sx={{ flexShrink: 0 }} />
                </IconButton>
            )}
        </Box>
    );
}
