import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Button,Container,Row,Col,Form,Input,FormGroup,Label,} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../Features/UserSlice';
import logo from '../assets/hibr_logo.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select state from the Redux store
  const { isSuccess, isError, message, isLoading } = useSelector((state) => state.users);

  // Effect to handle navigation and errors after state updates
  useEffect(() => {
    if (isSuccess) {
      navigate("/"); // Navigate to the default route (Home)
      dispatch(reset()); // Reset success/error states for future actions
    }
    if (isError) {
      alert(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, navigate, dispatch]);

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    // Create an object with the email and password the user entered.
    const userData = {
      email: email,
      password: password,
    };
    // Send the 'login' action to Redux with the userData.
    // This will trigger the login logic (likely an API call) defined in the UserSlice.
    dispatch(login(userData));
  };
  return (
    <>
    <Container fluid>
      <Row className="formrow justify-content-center">
        <Col className="columndiv1" md="6" lg="4">
          <Form className="div-form" onSubmit={handleLogin}>
            <div className="text-center mb-4">
              <img src={logo} alt="HIBR Logo" style={{ height: '100px', borderRadius: '50%' }} />
            </div>
            <h2 className="text-center mb-4 text-primary">Login to HIBR</h2>

            <FormGroup>
              <Label htmlFor="email">Email or Username</Label>
              <br/>
              <Input 
                type="text" 
                id="email" 
                placeholder="Enter your email or username..." 
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </FormGroup>
            <br/>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <br/>
              <Input 
                type="password" 
                id="password" 
                placeholder="Enter your password..." 
                value={password}
                onChange={(e) => setpassword(e.target.value)} 
              />
            </FormGroup>
            <br/>


            <Button 
              type="submit" 
              color="primary" 
              className="button w-100 mt-3 py-3 fw-bold border-0 shadow-sm" 
              disabled={isLoading} 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px'
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <p className="smalltext mt-3">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </Form>
        </Col>
        {/* Empty column to balance the layout (takes up the other 6 grid spaces) */}
      </Row>
    </Container>
    </>
  );
}
export default Login;