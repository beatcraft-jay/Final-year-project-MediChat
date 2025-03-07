import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWebSocket, disconnectWebSocket, getChatMessages, sendMessage } from '../actions/auth';
import { Outlet, useParams } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const Chat = () => {
  const { consultationId } = useParams();
  const dispatch = useDispatch();
  const messages = useSelector(state => state.chat.messages);
  const user = useSelector(state => state.auth.user);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { connected } = useSelector(state => state.chat);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!consultationId) return;
  
    dispatch(connectWebSocket(consultationId)).then((ws) => {
      if (ws) {
        socketRef.current = ws;
      }
    });
  
    dispatch(getChatMessages(consultationId));
  
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        dispatch(disconnectWebSocket());
      }
      dispatch({ type: 'CLEAR_CHAT' });
    };
  }, [consultationId, dispatch]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = e.target.message.value.trim();
    
    if (message && socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        await dispatch(sendMessage(consultationId, message));
        e.target.message.value = '';
      } catch (error) {
        console.error('Message send failed:', error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!consultationId) {
    return <div className="alert alert-warning">Please select a consultation to start chatting</div>;
  }

  return (
    <ErrorBoundary>
    <div>
    {!connected && (
        <div className="alert alert-warning">
          Connecting to chat server...
        </div>
      )}
      <div className="Chatting" style={{ height: '70vh', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`d-flex flex-row justify-content-${msg.sender.id === user.id ? 'end' : 'start'}`}>
            {msg.sender.id !== user.id && (
              <img 
                className="User-img mx-2" 
                src={msg.sender.profile_image || 'assets/img/user5.jpg'} 
                alt="User" 
              />
            )}
            <div>
              <p className={`small p-2 me-3 mb-1 rounded-3 ${msg.sender.id === user.id ? 'bg-success text-white' : 'bg-body-tertiary'}`}>
                {msg.content}
              </p>
              <p className={`small ${msg.sender.id === user.id ? 'me-3' : 'ms-3'} mb-3 rounded-3`}>
                {new Date(msg.timestamp).toLocaleTimeString()} | {new Date(msg.timestamp).toLocaleDateString()}
              </p>
            </div>
            {msg.sender.id === user.id && (
              <img 
                className="User-img mx-2" 
                src={(user.doctor?.profile_image || user.patient?.profile_image) || 'assets/img/me.jpg'} 
                alt="Me" 
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="btn btn-success" type="submit">
            Send
          </button>
        </div>
      </form>
    </div>
    </ErrorBoundary>
  );
};

export default Chat;