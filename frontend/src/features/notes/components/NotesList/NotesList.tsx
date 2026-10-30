import React from "react";

import { divider } from "shared/styles/sharedClasses";

import { BsThreeDots } from "react-icons/bs";
import NotesHeader from "features/notes/components/NotesHeader/NotesHeader";
import { connect, type ConnectedProps } from "react-redux";
import { compose } from "redux";
import type { RootState } from "app/store";

const NotesList = ({ notes }: Props) => {
  const truncate = (string: string, n: number) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <>
      <div>
        <NotesHeader />
        <div className={divider} />
        <div className="grid grid-cols-[repeat(3,1fr)] gap-2.5 mt-2.5 mr-5">
          {notes &&
            notes.length > 0 &&
            notes.map((item) => (
              <div className="w-auto py-[5px] px-[15px] rounded-[5px] shadow-[1px_1px_10px_#0006] hover:cursor-move" key={item.id}>
                <div className="flex justify-between items-center">
                  <h2>{item.title}</h2>
                  <span className="text-[20px] cursor-pointer">
                    <BsThreeDots />
                  </span>
                </div>
                <div className="mt-2.5">
                  <span>{truncate(item.description, 30)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  notes: state.note.allNotes,
});

const withConnect = connect(mapStateToProps, null);

type Props = ConnectedProps<typeof withConnect>;

export default compose(withConnect)(NotesList);
