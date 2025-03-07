import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getConsultations, setCurrentConsultation} from '../actions/auth';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from '../components/Chat';
import Messages from '../components/Messages';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Contacts from '../components/Contacts';
import DoctorsList from '../components/DoctorsList';
import Maps from '../components/Maps';
import Sidebar from '../components/Sidebar';
import News from '../components/News';
import Settings from '../components/Settings';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import Consultations from '../components/Consultations';

const PatientHome = () => {
    const dispatch = useDispatch();
    const [activeButton, setActiveButton] = useState("chat");
    
    // Redux state selectors
    const {
        data: consultations,
        current: currentConsultation,
        loading,
        error
    } = useSelector(state => state.consultations);
    
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getConsultations());
    }, [dispatch]);

    useEffect(() => {
        if (consultations?.data?.length > 0 && !currentConsultation) {
          dispatch(setCurrentConsultation(consultations.data[0].id));
        }
      }, [consultations, currentConsultation, dispatch]);

    if (error) return (
        <div className="alert alert-danger m-3">
          <h4>Error loading consultations</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => dispatch(getConsultations())}
          >
            Retry
          </button>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="container-fluid body">
                <div className="row">
                    <Sidebar onSelect={setActiveButton} activeButton={activeButton} />
                    
                    <div className="col-5 left-box">
                        <Search />
                        <Messages />
                    </div>

                    <div className="col right-box bg d-none d-md-block">
                        <Routes>
                            <Route path="chat/:consultationId" element={<Chat />} />
                            <Route path="*" element={
                                <>
                                    {activeButton === "chat" && <div className="p-3">Select a conversation to start chatting</div>}
                                    {activeButton === "calls" && <Contacts />}
                                    {activeButton === "news" && <News />}
                                    {activeButton === "doctors" && <DoctorsList />}
                                    {activeButton === "hospitals" && <Maps />}
                                    {activeButton === "settings" && <Settings />}
                                </>
                            }/>
                        </Routes>
                    </div>
                </div>

                <MobileFooter activeButton={activeButton} setActiveButton={setActiveButton} />
                
                <footer className="footer text-center py-2 bg-light">
                    <div className="container">
                        <span className="small-text text-muted">© Copyright Beatcraft 2024</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};


const MobileFooter = ({ activeButton, setActiveButton }) => (
    <footer className="footer text-center py-2 bg-light d-block d-sm-none">
        <div className="container">
            <div className="p-2">
                <div className="d-flex justify-content-between pt-3">
                    {['chat', 'calls', 'news', 'doctors', 'hospitals', 'settings'].map((button) => (
                        <button 
                            key={button}
                            className={`btn border-0 pt-3 ${activeButton === button ? 'active' : ''}`}
                            onClick={() => setActiveButton(button)}
                        >
                            <i className={`bi bi-${getButtonIcon(button)} linktag`} />
                        </button>
                    ))}
                </div>
            </div>
            <span className="small-text text-muted">© Copyright Beatcraft 2024</span>
        </div>
    </footer>
);

const getButtonIcon = (button) => {
    const icons = {
        chat: 'chat',
        calls: 'telephone',
        news: 'newspaper',
        doctors: 'heart-pulse',
        hospitals: 'hospital',
        settings: 'gear'
    };
    return icons[button] || 'circle';
};

export default PatientHome;