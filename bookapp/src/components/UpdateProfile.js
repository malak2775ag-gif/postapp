import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { updateUserProfile, reset } from '../Features/UserSlice';
import { useNavigate } from 'react-router-dom';
import profileImg from '../assets/profile.png';

const UpdateProfile = () => {
  const { user, isSuccess, isError, message, isLoading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image ? `http://localhost:3001/uploads/${user.image}` : profileImg);

  // Clear leftover success state from login/register on mount
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess) {
      alert(message || "Profile updated successfully!");
      dispatch(reset());
      navigate('/profile');
    }
  }, [isSuccess, message, dispatch, navigate]);

  // Effect to update local state when user data changes (e.g., after a successful update)
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setGender(user.gender);
      setBirthdate(user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '');
      setPassword(''); // Clear password field after update
      setImagePreview(user.image ? `http://localhost:3001/uploads/${user.image}` : profileImg);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', user.email);
    formData.append('username', username);
    formData.append('gender', gender);
    formData.append('birthdate', birthdate);
    if (password) formData.append('password', password);
    if (image) formData.append('image', image);

    dispatch(updateUserProfile(formData));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : (user.image ? `http://localhost:3001/uploads/${user.image}` : profileImg));
  };
  if (!user) return null;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '25px' }}>
            <div 
              style={{ 
                height: '120px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <h2 className="text-white fw-bold">Edit Account</h2>
            </div>
            <CardBody className="px-4 pb-5 pt-0">
              <div className="text-center mb-4" style={{ marginTop: '-60px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="rounded-circle shadow border border-5 border-white"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', backgroundColor: '#f8f9fa' }}
                />
              </div>

              {isError && <Alert color="danger">{message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <Label for="username" className="small text-uppercase fw-bold text-secondary ps-2">Username</Label>
                  <Input 
                    type="text" 
                    id="username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    className="border-0 bg-light p-3"
                    style={{ borderRadius: '12px' }}
                  />
                </FormGroup>
                <br/>

                <FormGroup className="mb-3">
                  <Label for="gender" className="small text-uppercase fw-bold text-secondary ps-2">Gender</Label>
                  <Input 
                    type="select" 
                    id="gender"
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                    required 
                    className="border-0 bg-light p-3"
                    style={{ borderRadius: '12px', height: 'auto' }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Input>
                </FormGroup>
                <br/>

                <FormGroup className="mb-3">
                  <Label for="birthdate" className="small text-uppercase fw-bold text-secondary ps-2">Birthdate</Label>
                  <Input 
                    type="date" 
                    id="birthdate"
                    value={birthdate} 
                    onChange={(e) => setBirthdate(e.target.value)} 
                    required 
                    className="border-0 bg-light p-3"
                    style={{ borderRadius: '12px' }}
                  />
                </FormGroup>

                <br/>
                <FormGroup className="mb-3">
                  <Label for="image" className="small text-uppercase fw-bold text-secondary ps-2">Profile Image</Label>
                  <Input 
                    type="file" 
                    id="image"
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="form-control border-0 bg-light p-2"
                    style={{ borderRadius: '50px' }}
                  />
                </FormGroup>
                <br/>

                <FormGroup className="mb-4">
                  <Label for="password" className="small text-uppercase fw-bold text-secondary ps-2">New Password</Label>
                  <Input 
                    type="password" 
                    id="password"
                    placeholder="Leave blank to keep current" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="border-0 bg-light p-3"
                    style={{ borderRadius: '12px' }}
                  />
                </FormGroup>
                <br/>
                <Button 
                  color="primary" 
                  block 
                  disabled={isLoading} 
                  className="py-3 fw-bold border-0 shadow-sm mb-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '15px'
                  }}
                >
                  {isLoading ? "SAVING..." : "SAVE CHANGES"}
                </Button>
                <br/>
                <br/>
                <Button 
                  type="button" 
                  color="link" 
                  block 
                  onClick={() => navigate('/profile')} 
                  className="text-muted text-decoration-none fw-bold"
                  style={{ 
                    background: 'linear-gradient(135deg, #737b9d 0%, #764ba2 100%)',
                    borderRadius: '15px'
                  }}
                >
                  CANCEL
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProfile;