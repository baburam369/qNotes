import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import NoteItems from "./NoteItems";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

export default function Notes(props) {
  const navigate = useNavigate();
  const { showAlert } = props;
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem("token")) {
          await getNotes(); 
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const handleClick = (e) => {
    console.log("Updating note...", note);
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    showAlert("Note Updated", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  return (
    <div>
      <AddNote showAlert={showAlert} />

      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    value={note.etitle}
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    aria-describedby="emailHelp"
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>

                  <input
                    type="text"
                    value={note.edescription}
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    value={note.etag}
                    className="form-control"
                    id="etag"
                    name="etag"
                    onChange={onChange}
                  />
                </div>
                {/* <button type="submit" className="btn btn-primary" onClick= {handleClick}>
            Add Note
          </button> */}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleClick}
                className="btn btn-primary"
                disabled={
                  note.etitle.length < 3 || note.edescription.length < 5
                }
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Display Notes */}
      <div className="row mx-5 my-3">
        <h2>Your Notes</h2>
        <div className="row mx-1">
          {notes.length === 0
            ? "No notes found"
            : notes.map((note) => (
                <NoteItems
                  key={note._id}
                  showAlert={showAlert}
                  updateNote={updateNote}
                  note={note}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
