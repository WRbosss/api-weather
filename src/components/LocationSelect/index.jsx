import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, List, ListItem, ListItemText, ListItemSecondaryAction, Typography } from '@mui/material';
import { useRequestCompleteLocation } from '../../hooks/Request/useRequestCompleteLocation';
import { LocationContext } from '../../contexts/LocationContext'

export default function LocationSelect() {
  const [open, setOpen] = useState(false);
  const [openSavedLocations, setOpenSavedLocations] = useState(false);
  const { getCompleteLocation } = useRequestCompleteLocation()
  const { location, setLocation } = useContext(LocationContext)
  const [selectedOption, setSelectedOption] = useState(null);
  const [completes, setCompletes] = useState([])
  const [text, setText] = useState('')
  const [savedLocations, setSavedLocations] = useState([]);

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

  useEffect(() => {
    const locations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    setSavedLocations(locations);
  }, [open]);

  const handleDeleteLocation = (locationToDelete) => {
    const updatedLocations = savedLocations.filter(loc => loc !== locationToDelete);
    localStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
    setSavedLocations(updatedLocations);
  };

  const handleClickOpenSavedLocations = () => {
    setOpenSavedLocations(true);
  }

  const handleCloseSavedLocations = () => {
    const currentLocation = location;
    setLocation('');
    setTimeout(() => {
      setLocation(currentLocation);
    }, 0);
    setOpenSavedLocations(false);
  }

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      <IconButton onClick={handleClickOpenSavedLocations} color="primary" aria-label="view saved locations" sx={{ borderRadius: 2 }}>
        <MenuIcon fontSize="medium" />
      </IconButton>
      <IconButton onClick={handleClickOpen} color="primary" aria-label="select location" sx={{ borderRadius: 2 }}>
        <AddIcon fontSize="medium" />
      </IconButton>

      <Dialog 
        disableEscapeKeyDown 
        open={open} 
        onClose={handleClose} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            maxWidth: '400px',
            width: '90%'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Search your location:</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <Autocomplete
                id="city-autocomplete"
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
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmLocation}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openSavedLocations} 
        onClose={handleCloseSavedLocations} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            maxWidth: '400px',
            width: '90%'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Localizações Salvas</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {savedLocations.length > 0 ? (
            <List sx={{ py: 0 }}>
              {savedLocations.map((savedLocation) => (
                <ListItem key={savedLocation} sx={{ py: 1 }}>
                  <ListItemText primary={savedLocation} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteLocation(savedLocation)}
                      size="small"
                      disabled={savedLocation === location}
                      sx={{ 
                        opacity: savedLocation === location ? 0.5 : 1,
                        '&:hover': {
                          backgroundColor: savedLocation === location ? 'transparent' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', py: 1 }}>
              Nenhuma localização salva
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button onClick={handleCloseSavedLocations}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}