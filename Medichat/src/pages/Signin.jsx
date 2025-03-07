import React, {useState}from 'react'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux'
import  PropTypes from "prop-types"
import { create_patientuser } from '../actions/auth'
import { Navigate } from 'react-router-dom'

const Signin = ({create_patientuser, isAuthenticated,isDoctor}) => {

    const [patient, setPatient]=useState({
        username:'',
        email:'',
        password:'',
        password2:''
    })

    const handleChange=(e)=>setPatient({
        ...patient,
        [e.target.name]:e.target.value })
        
    const {username, email, password, password2}=patient
    
    const handleSubmit=(e)=>{
        e.preventDefault();
        
        const newPatient={
           username,
           email,
           password,
           password2
       }
       create_patientuser(newPatient)
    }

    const [theme, setTheme] = useState('light');

    const darkLight = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };


    if(isAuthenticated  && !isDoctor){
        return <Navigate to="/patient/register" />
    }

  return (
    <div className="App container d-flex align-items-center justify-content-center min-vh-100" data-theme={theme}>
        <div className='row border rounded-3 bg-white shadow box-area'>
        <div className="col-md-6 rounded-4 left-box-srt bg">
            <div className=" d-flex align-items-center justify-content-center flex-column">
                <div className="featured-image mb-3 logo-srt">
                    <img src="assets/img/logo.png" className="img-fluid" alt=""/>
                </div>
                <p className="fs-2 mt-4 main-text-srt medichat">MEDiChat</p>
                <p className="fs-2 mt-4 main-text-srt welcome">Join us</p>
                <small className="text-wrap text-center text-primary small-text">Vegetables are good for you.</small>
            </div>
        </div>
            
            
            <div className="col-md-6 right-box-srt">
                <div className="row align-items-center">

                    <div className="position-relative" onClick={darkLight}>
                        {theme === 'light' ? <i className="bi bi-toggle-off fs-6 position-absolute top-0 end-0 translate-middle" ></i>: <i className="bi bi-toggle-on fs-6 end-0 position-absolute top-0 end-0 translate-middle"></i>}
                    </div>
                    <div className="header-text b-4 text-info">
                        <h2 className="main-text-srt">PATIENT SIGN UP</h2>
                    </div>

                    <form onSubmit={e => handleSubmit(e)}>
                        <div className="input-group mb-3">
                            <input 
                                type="text" 
                                placeholder="Username" 
                                className="fs-6 form-control border-top-0 border-end-0 border-start-0 border border-2 main-text-srt" 
                                onChange={ e =>handleChange(e)} 
                                name="username"  
                                value={username}/>
                        </div>
                        <div className="input-group mb-3">
                            <input 
                                type="text" 
                                placeholder="Email / Phone" 
                                className="fs-6 form-control border-top-0 border-end-0 border-start-0 border border-2 main-text-srt"
                                name='email'
                                value={email}
                                onChange={(e)=>handleChange(e)}
                            />
                        </div><div className="input-group mb-3">
                            <input 
                                type="password" 
                                placeholder="Create password" 
                                className="fs-6 form-control border-top-0 border-end-0 border-start-0 border border-2 main-text-srt" 
                                name='password'
                                value={password}
                                onChange={(e)=>handleChange(e)}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                className="fs-6 form-control border-top-0 border-end-0 border-start-0 border border-2 main-text-srt" 
                                name='password2'
                                value={password2}
                                onChange={(e)=>handleChange(e)} 
                            />
                        </div>
                        <div className="input-group mb-3">
                            <button className="btn btn-lg btn-primary w-100 fs-6 main-text-srt" type="submit">SIGN UP</button>
                        </div>
                    </form>    
                    <div className="main-text">Have an account? <Link to="/">Login</Link></div>
                </div>
                <div className="row mb-4 align-items-center d-flex justify-content-around">
                    <div className="pt-4 d-flex justify-content-around">
                        <a href="#" className="icons"><i className="bi bi-twitter-x"></i></a>
                        <a href="#" className="icons"><i className="bi bi-facebook"></i></a>
                        <a href="#" className="icons"><i className="bi bi-instagram"></i></a>
                        <a href="#" className="icons"><i className="bi bi-whatsapp"></i></a>
                    </div>
                </div>
                <div className="row d-flex justify-content-around">
                    <small className="text-wrap text-center small-text">© 2024 Copyright Beatcraft</small>
                </div>
            </div>
            
        </div>
        
    </div>
  )
}

const mapStateToProps =state =>({
    isAuthenticated:state.auth.isAuthenticated,
    isDoctor:state.auth.isDoctor
})

Signin.propTypes = {
    create_patientuser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    isDoctor: PropTypes.bool
};

export default connect(mapStateToProps, {create_patientuser})(Signin)
