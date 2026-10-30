import { Autocomplete, Box, Button, Modal, TextField } from "@mui/material";
import React from "react";
import type { Dispatch, SetStateAction } from "react";

import { formField } from "shared/styles/sharedClasses";

import image1 from "shared/assets/images/avatar1.png";
import image2 from "shared/assets/images/avatar2.png";
import image3 from "shared/assets/images/avatar3.png";
import image4 from "shared/assets/images/avatar4.png";
import image5 from "shared/assets/images/avatar5.png";

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

const TodoForm = ({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) => {
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
        <div className="w-[400px] h-[370px] my-[5%] mx-auto py-3.5 px-5 rounded-xl bg-white outline-none max-[1400px]:w-[350px]">
          <form>
            <div className="w-auto mb-2.5 border-b-2 border-[#e5e5e5]">
              <h3 id="parent-modal-title">Create a todo</h3>
            </div>
            <div className="w-auto h-[290px] mt-5 overflow-y-auto">
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
                className={formField}
                id="outlined-basic"
                label="Todo title"
                variant="outlined"
              />
              <TextField
                fullWidth
                className={formField}
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
              />
            </div>
            <div className="fixed left-[51%] flex gap-2.5 w-auto max-[1400px]:left-[50%]">
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
