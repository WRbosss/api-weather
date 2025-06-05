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
    setLocation(text)
    setOpen(false)
  }

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
      <IconButton onClick={handleClickOpen} color="primary" aria-label="select location" sx={{borderRadius:2}}>
        <AddIcon fontSize="large" />
      </IconButton>
      

      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Search your location:</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Autocomplete
                id="country-select-demo"
                sx={{ width: 300 }}
                options={completes}
                autoHighlight
                getOptionLabel={(complete) => complete.formatted}
                renderOption={(props, complete) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    {complete.formatted}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search here"
                    onChange={e => handleChange(e.target.value)}
                    value={text}
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