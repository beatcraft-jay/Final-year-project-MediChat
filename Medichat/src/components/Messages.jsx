import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getConsultations, setCurrentConsultation } from '../actions/auth';
import ErrorBoundary from './ErrorBoundary';
import { Outlet, useParams } from 'react-router-dom';

const Messages = () => {
  const dispatch = useDispatch();
  const consultationsData = useSelector(state => state.consultations.data);
  const consultations = consultationsData?.results || [];
  const { consultationId } = useParams();

  useEffect(() => {
    dispatch(getConsultations());
  }, [dispatch]);

  useEffect(() => {
    if (consultationId) {
      dispatch(setCurrentConsultation(consultationId));
    }
  }, [consultationId, dispatch]);

  return (
    <ErrorBoundary>
    <div className="chat-box main-text d-none d-md-block top">
      <ul className="list-unstyled mb-0">
        {consultations.length === 0 ? (
          <li className="p-2 text-center text-muted">No consultations available</li>
        ) : (
          consultations.map(consultation => (
            <li key={consultation.id} className="p-2 border-bottom">
              <Link to={`chat/${consultation.id}`}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-row">
                    <div>
                      <img 
                        className="User-img-massage" 
                        src={consultation.doctor?.profile_image || 'assets/img/user2.jpg'} 
                        alt="Doctor"
                      />
                    </div>
                    <div className="pt-1 mx-2">
                      <p className="mb-0 text-success main-text">
                        {consultation.doctor?.name || 'Unknown Doctor'}
                      </p>
                      <p className="small text-muted">
                        {consultation.latest_message?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1">
                    {consultation.unread_count > 0 && (
                      <span className="badge bg-danger rounded-pill float-end">
                        {consultation.unread_count}
                      </span>
                    )}
                    <p className="small text-muted mb-1">
                      {consultation.latest_message?.timestamp && 
                        new Date(consultation.latest_message.timestamp).toLocaleDateString()
                      }
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
    </ErrorBoundary>
  );
};

export default Messages;
