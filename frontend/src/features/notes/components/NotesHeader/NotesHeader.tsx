import { Button } from '@mui/material'
import React from 'react'

import { searchField, searchIcon, searchInput } from "shared/styles/sharedClasses";

import { FaSearch } from "react-icons/fa";
import { useState } from 'react';
import NewNote from 'features/notes/components/NewNote/NewNote';

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
      <div className="flex justify-between items-center mt-2.5 mr-5">
        <div className="text-[#929191]">
          <div className={searchField}>
            <FaSearch className={searchIcon} />
            <input type="text" placeholder="Search" className={searchInput} />
          </div>
        </div>
        <div>
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