import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl } from '@mui/material';
import { useRequestCompleteLocation } from '../../hooks/Request/useRequestCompleteLocation';
import { LocationContext } from '../../contexts/LocationContext'

export default function LocationSelect() {
  const [open, setOpen] = useState(false);
  const { getCompleteLocation } = useRequestCompleteLocation()
  const { location, setLocation } = useContext(LocationContext)
  const [selectedOption, setSelectedOption] = useState(null);
  const [completes, setCompletes] = useState([])
  const [text, setText] = useState('')

  const handleChange = (value) => {
    setText(value)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false)
    }
  }

  const handleConfirmLocation = () => {
    if (!selectedOption) return;

    const formatted = selectedOption.formatted;
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];

    if (!savedLocations.includes(formatted)) {
      const updatedLocations = [...savedLocations, formatted];
      localStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
    }

    setLocation(formatted);
    setOpen(false);
  };

  useEffect(() => {
    if (!text || text.length === 0) {
      setCompletes([])
      return
    }

    getCompleteLocation(text).then((response) => {
      const data = response?.data?.results

      setCompletes(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div>
      <IconButton onClick={handleClickOpen} color="primary" aria-label="select location" sx={{ borderRadius: 2 }}>
        <AddIcon fontSize="large" />
      </IconButton>


      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Search your location:</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Autocomplete
                id="city-autocomplete"
                sx={{ width: 300 }}
                options={completes}
                autoHighlight
                getOptionLabel={(option) => option.formatted || ''}
                onChange={(event, newValue) => {
                  setSelectedOption(newValue);
                  setText(newValue?.formatted || '');
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.formatted}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search here"
                    onChange={(e) => handleChange(e.target.value)}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmLocation}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );

}