import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux"
import {login} from "../actions/auth"
import {Navigate} from "react-router-dom"
import PropTypes from "prop-types"

const Login = ({login, isAuthenticated, isDoctor}) => {
    const [icon, setIcon] = useState("bi bi-eye-fill password-toggle-icon")
    const [type, setType]=useState('password');



    const handleToggle=()=>{    
        if(type==='password'){
            setIcon("bi bi-eye-slash-fill password-toggle-icon");      
          setType('text');
        }
        else{
            setIcon("bi bi-eye-fill password-toggle-icon" );     
          setType('password');
        }
      }

    const [theme, setTheme] = useState("light")

    const darkLight = () => {
        if(theme === 'light'){
            setTheme('dark')
        }else{
        setTheme('light')
        }
    }

    const [user, setUser]=useState({
        username:"",
        password:""
    })

    const {username, password}=user

    const loginChange=(e)=>setUser({...user, [e.target.name]:e.target.value})
     const handleLoginSubmit=(e)=>{
         e.preventDefault();
         login({username, password})
     }
    
     if (isAuthenticated && isDoctor){
        return <Navigate to="/doctor/app" />
    }else if(isAuthenticated && !isDoctor){
        return<Navigate to="/patient/app" />
    }else{  

  return (
    <div className="App container d-flex align-items-center justify-content-center min-vh-100" data-theme={theme}>
        <div className='row border rounded-3 bg-white shadow box-area'>
            <div className="col-md-6 rounded-3 left-box-srt bg">
                <div className=" d-flex align-items-center justify-content-center flex-column">
                    <div className="featured-image mb-3 logo-srt">
                        <img src="assets/img/logo.png" className="img-fluid" alt=""/>
                    </div>
                    <p className="fs-2 mt-4 main-text-srt medichat">MEDiChat</p>
                    <p className="fs-2 mt-3 main-text-srt welcome">Welcome</p>
                    <small className="text-wrap text-center text-primary small-text">An apple a day keeps the doctor away.</small>
                </div>
            </div>
            
            
            <div className="col-md-6 right-box-srt">
                <div className="row align-items-center">

                    <div className="position-relative" onClick={darkLight}>
                        {theme === 'light' ? <i className="bi bi-toggle-off fs-6 position-absolute top-0 end-0 translate-middle" ></i>: <i className="bi bi-toggle-on fs-6 end-0 position-absolute top-0 end-0 translate-middle"></i>}
                    </div>

                    <div className="header-text b-4 text-info">
                        <h2 className="main-text-srt">LOGIN</h2>
                    </div>

                    <form onSubmit={(e)=>handleLoginSubmit(e)}>
                        <div className="input-group mb-3">
                            <input 
                                type="text" 
                                placeholder="Email" 
                                className="fs-6 form-control border-0 bg-light main-text-srt" 
                                id="email" 
                                onChange={ e =>loginChange(e)} 
                                name="username" 
                                autoComplete={username} 
                                value={username}
                            />
                        </div>
                        <div className="input-group mb-1">
                            <input 
                                type={type} 
                                placeholder="Password" 
                                className="fs-6 form-control border-0 bg-light main-text-srt" 
                                id="password"
                                onChange={ e =>loginChange(e)} 
                                name="password" 
                                autoComplete={password} 
                                value={password}
                                
                            />
                            <span onClick={handleToggle}><i className={icon} ></i></span>
                        </div>

                        <div className="d-flex justify-content-between main-text-srt" >
                            <div className="d-flex">
                                <input className="form-check-input" type="checkbox" value="" id="invalidCheck" required/>
                                <p className="px-2">Remember me.</p>
                            </div>
                            <div>
                            <a href="#">forgot password?</a>
                            </div>
                        </div>
                        
                        <div className="input-group mb-3">
                            <button className="btn btn-secondary w-100 ">LOGIN</button>
                        </div>
                    </form>
                    <div className="main-text">No account? Please sign up as a <Link to="/signup/doctor">doctor</Link> or as a <Link to="/signup/patient">patient</Link></div>
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
  )}
}

Login.propTypes={
    login:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool,
    isDoctor:PropTypes.bool
}

const mapStateToProps =state =>({
    isAuthenticated:state.auth.isAuthenticated,
    isDoctor:state.auth.isDoctor
})

export default connect(mapStateToProps, {login})(Login)

