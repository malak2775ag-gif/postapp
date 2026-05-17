import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Container,Row,Col,Card,CardBody,Label,Button,CardText,Alert,} from 'reactstrap';
import { reset } from '../Features/UserSlice';
import { fetchBooks } from '../Features/BookSlice';
import { useNavigate } from 'react-router-dom';
import * as ENV from "../config";
import Location from "./Location";
import profileImg from '../assets/profile.png';

const Profile = () => {
  const { user, isError, message } = useSelector((state) => state.users);
  const { books } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMyBooks, setShowMyBooks] = useState(false);

  // Clear global success/error states when the page loads
  useEffect(() => {
    dispatch(reset());
    if (!user) navigate('/login');
    if (user && books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [user, navigate, dispatch, books.length]);

  if (!user) return null;

  const userBooks = books.filter((book) => book.userEmail?.toLowerCase() === user.email.toLowerCase());

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
                  src={user.image ? `${ENV.IMAGE_BASE_URL}/${user.image}` : profileImg} 
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

              <div className="w-100 mt-3 d-flex justify-content-center">
                <label
                  className="d-flex align-items-center gap-3 px-4 py-3 rounded-4 shadow-sm"
                  style={{
                    background: showMyBooks ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                    color: showMyBooks ? '#fff' : '#343a40',
                    cursor: 'pointer',
                    width: '100%',
                    border: showMyBooks ? '1px solid rgba(255,255,255,0.3)' : '1px solid #dee2e6',
                    transition: 'background 0.2s ease, color 0.2s ease',
                  }}
                  onClick={() => setShowMyBooks((prev) => !prev)}
                >
                  <input
                    type="radio"
                    name="showMyBooks"
                    checked={showMyBooks}
                    readOnly
                    style={{ width: '18px', height: '18px', accentColor: '#fff' }}
                  />
                  <span className="fw-bold">{showMyBooks ? 'My Books are visible' : 'Click to show my books'}</span>
                </label>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {showMyBooks && (
        <Row className="justify-content-center mt-4">
          <Col md={10} lg={8}>
            <Card className="border-0 shadow-sm rounded-4">
              <CardBody className="p-4">
                <h4 className="fw-bold mb-4">My Books</h4>
                {userBooks.length > 0 ? (
                  <Row className="g-3">
                    {userBooks.map((book) => (
                      <Col key={book._id} xs={12} sm={6}>
                        <Card
                          className="h-100 shadow-sm"
                          style={{
                            borderRadius: '18px',
                            border: '1px solid #dee2e6',
                            background: '#ffffff',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <CardBody className="d-flex flex-column justify-content-between">
                            <h5 className="fw-bold mb-4">{book.title}</h5>
                            <Button
                              color="primary"
                              size="sm"
                              className="px-4 py-2 fw-bold align-self-end"
                              style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                border: 'none',
                              }}
                              onClick={() => navigate(`/book/${book._id}`)}
                            >
                              View Details
                            </Button>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-muted mb-0">You haven't added any books yet.</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Profile;