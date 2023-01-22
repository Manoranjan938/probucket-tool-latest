import { Autocomplete, Box, Button, Modal, TextField } from "@mui/material";
import React from "react";

import "./TodoForm.css";

import image1 from "Images/avatar1.png";
import image2 from "Images/avatar2.png";
import image3 from "Images/avatar3.png";
import image4 from "Images/avatar4.png";
import image5 from "Images/avatar5.png";

const projectData = [
  {
    title: "Mycareerbuild",
    image: image1,
  },
  {
    title: "Mycareerbuild2",
    image: image2,
  },
  {
    title: "Mycareerbuild3",
    image: image3,
  },
  {
    title: "Mycareerbuild4",
    image: image4,
  },
  {
    title: "Mycareerbuild5",
    image: image5,
  },
];

const TodoForm = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="todo_modal_container">
          <form>
            <div className="modal__header">
              <h3 id="parent-modal-title">Create a todo</h3>
            </div>
            <div className="modal__body">
              <Autocomplete
                id="country-select-demo"
                options={projectData}
                autoHighlight
                fullWidth
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img loading="lazy" width="20" src={option.image} alt="" />
                    {option.title}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Project"
                    fullWidth
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
              <TextField
                fullWidth
                className="input_form"
                id="outlined-basic"
                label="Todo title"
                variant="outlined"
              />
              <TextField
                fullWidth
                className="input_form"
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
              />
            </div>
            <div className="modal__footer">
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained">Create</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default TodoForm;
