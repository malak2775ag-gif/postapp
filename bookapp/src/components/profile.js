import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Container,Row,Col,Card,CardBody,Label,Button,CardText,Alert,} from 'reactstrap';
import { reset } from '../Features/UserSlice';
import { useNavigate } from 'react-router-dom';
import Location from "./Location";
import profileImg from '../assets/profile.png';

const Profile = () => {
  const { user, isError, message } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear global success/error states when the page loads
  useEffect(() => {
    dispatch(reset());
    if (!user) navigate('/login');
  }, [user, navigate, dispatch]);

  if (!user) return null;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '25px' }}>
            <div 
              style={{ 
                height: '140px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <h2 className="text-white fw-bold">My Profile</h2>
            </div>
            <CardBody className="px-4 pb-5 pt-0 text-center">
              <div className="mb-4" style={{ marginTop: '-70px' }}>
                <img 
                  src={user.image ? `http://localhost:3001/uploads/${user.image}` : profileImg} 
                  alt="Profile" 
                  className="rounded-circle shadow border border-5 border-white"
                  style={{ width: '140px', height: '140px', objectFit: 'cover', backgroundColor: '#f8f9fa', borderRadius: '50%'}}
                />
              </div>

              {isError && <Alert color="danger" className="rounded-pill">{message}</Alert>}
              
              <div className="mb-4">
                <h3 className="fw-bold text-dark mb-1">{user.username}</h3>
                
                
                <p className="text-muted mb-0">{user.email}</p>
                <Location />
              </div>

              <Row className="g-3 text-start">
                <Col md={6}>
                  <div className="p-3 rounded-4" style={{ background: '#f0f2f5' }}>
                    <Label className="small text-uppercase fw-bolder text-secondary mb-1 d-block">Gender</Label>
                    <CardText className="mb-0 fw-bold text-dark text-capitalize">{user.gender}</CardText>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 rounded-4" style={{ background: '#f0f2f5' }}>
                    <Label className="small text-uppercase fw-bolder text-secondary mb-1 d-block">Member Since</Label>
                    <CardText className="mb-0 fw-bold text-dark">
                      {new Date(user.joindate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </CardText>
                  </div>
                </Col>
              </Row>

              <Button 
                color="primary" 
                className="w-100 mt-5 py-3 fw-bold border-0 shadow" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px',
                  letterSpacing: '1px'
                }}
                onClick={() => navigate('/update-profile')}
              >
                UPDATE ACCOUNT
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;