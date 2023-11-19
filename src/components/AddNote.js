import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

export default function AddNote(props) {
    const context = useContext(noteContext);
    const {addNote} = context;

    const [note, setNote]= useState({
        title: "",
        description: "",
        tag:""
    })

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag|| "Default");
        props.showAlert("Note Added", "success")
        setNote({title: "",
        description: "",
        tag:""
    })
    }

    const onChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }
  return (
    <div>   
         <div className="container mx-5 my-1">
        <h2>Add Note</h2>
        <form>
          <div className="mb-3 my-4">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name = "title"
              aria-describedby="emailHelp"
              onChange={onChange}
              minLength={3} 
              required
              value={note.title}
            />
           
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label" >
              Description
            </label>

            <textarea  type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={onChange}
              value={note.description}
              minLength={5}
              required
              />
            
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label" >
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              value={note.tag}
              onChange={onChange}
              
            />
          </div>
          <button 
          type="submit" disabled={note.title.length < 3 || note.description.length < 5} 
          className="btn btn-primary" onClick= {handleClick}>
            Add Note
          </button>
        </form>
      </div>
    </div>
  )
}
