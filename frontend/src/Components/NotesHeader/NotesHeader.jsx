import { Button } from '@mui/material'
import React from 'react'

import './NotesHeader.css'

import { FaSearch } from "react-icons/fa";
import { useState } from 'react';
import NewNote from 'Components/NewNote/NewNote';

const NotesHeader = () => {

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true)
  }

  return (
    <>
      <div className="notes_header_container">
        <div className="search">
          <div className="search__field">
            <FaSearch className="search" />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="notes_create_btn">
          <Button variant="contained" color="primary" onClick={handleClick}>
            Create New Note
          </Button>
        </div>
      </div>
      <NewNote open={open} handleNoteClose={handleClose} />
    </>
  );
}

export default NotesHeader