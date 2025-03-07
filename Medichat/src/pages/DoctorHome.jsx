import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDoctorUser, getConsultations, setCurrentConsultation } from '../actions/auth';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import Chat from '../components/Chat';
import Messages from '../components/Messages';
import Search from '../components/Search';
import DoctorsList from '../components/DoctorsList';
import Maps from '../components/Maps';
import Sidebar from '../components/Sidebar';
import News from '../components/News';
import Settings from '../components/Settings';
import Consultations from '../components/Consultations';
import Notes from '../components/Notes';

const DoctorHome = () => {
  const [activeButton, setActiveButton] = useState("chat");
  const dispatch = useDispatch();

  const { loading: consultationsLoading } = useSelector(state => state.consultations);
  const { loading: userLoading } = useSelector(state => state.auth);

  if (userLoading || consultationsLoading) {
    return <div className="loading-overlay">Loading...</div>;
  }
    
  const {
    data: consultations,
    current: currentConsultation,
    loading,
    error
  } = useSelector(state => state.consultations);
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user?.is_doctor) {
      dispatch(getConsultations());
      dispatch(getDoctorUser());
    }
  }, [dispatch, user?.is_doctor]);  
  
  useEffect(() => {
    if (consultations?.results?.length > 0 && !currentConsultation) {
      const firstConsultation = consultations.results[0];
      if (firstConsultation.id !== currentConsultation?.id) {
        dispatch(setCurrentConsultation(firstConsultation.id));
      }
    }
  }, [consultations, currentConsultation, dispatch]);

  return (
    <div>
      <Navbar />
      <div className="container-fluid body">
        <div className="row">
            <Sidebar onSelect={setActiveButton} />

            <div className="col-5 left-box">
                <Search />
                <Messages />
            </div>

            <div className="col right-box bg d-none d-md-block">
                {activeButton === "chat" && <Chat consultationId={currentConsultation?.id} />}
                {activeButton === "consultations" && <Consultations />}
                {activeButton === "news" && <News />}
                {activeButton === "doctors" && <DoctorsList />}
                {activeButton === "notes" && <Notes />}
                {activeButton === "hospitals" && <Maps />}
                {activeButton === "settings" && <Settings />}
            </div>
        </div>
      </div>
      <footer className="footer text-center py-2 bg-light">
        <div className="container">
            <div className="p-2 d-block d-sm-none">
                <div className="d-flex justify-content-between pt-3">
                    <button className="btn border-0 pt-3"><Link to=""><i className="bi bi-chat linktag"></i></Link></button>
                    <button className="btn border-0 pt-3"><Link to=""><i className="bi bi-telephone linktag"></i></Link></button>
                    <button className="btn border-0 pt-3"><Link to=""><i className="bi bi-newspaper linktag"></i></Link></button>
                    <button className="btn border-0 pt-3"><Link to=""><i className="bi bi-heart-pulse linktag"></i></Link></button>
                    <button className="btn border-0 pt-3"><Link to=""><i className="bi bi-hospital linktag"></i></Link></button>
                    <button className="btn border-0 pt-3"><Link to=""><i className="bi bi-gear linktag"></i></Link></button>
                </div>
            </div>
            <span className="small-text text-muted">© Copyright Beatcraft 2024</span>
        </div>
    </footer>
  </div>
  );
};

export default DoctorHome;