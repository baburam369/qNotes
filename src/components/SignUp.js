import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = (props) => {
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({name:"",email:"", password:"", cpassword:""})
  const {name, email, password} = credentials;
    
    const handleSubmit= async (e) => {
      e.preventDefault();
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name, email, password})
      });
      const json = await response.json()
      console.log(json);
  
      if(json.success){
        //save auth token and redirect
        localStorage.setItem('token', json.authToken)
        navigate("/");
        props.showAlert("Account Created Successfully", "success")
      } else {
        props.showAlert("User Exist Already", "danger")
      }
    } 
    const onChange = (e) => {
      setCredentials({...credentials, [e.target.name]: e.target.value})
    }
  return (
    <div className='container mx-5 my-5'>
       <form onSubmit={handleSubmit} >
       <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            id="name"
            onChange={onChange}
            minLength={3}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="email"
            onChange={onChange}
  
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
          name="password"
            type="password"
            className="form-control"
            id="password"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
          name="cpassword"
            type="password"
            className="form-control"
            id="cpassword"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          SignUp!
        </button>
      </form>
    </div>
  )
}

export default SignUp
