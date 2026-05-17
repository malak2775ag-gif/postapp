// Importing components from 'reactstrap' library to create a styled form and layout
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Controller } from "react-hook-form"; // Import Controller
import {
  Label,         // Added Label for consistency with reactstrap
  Form,          // A wrapper for form elements
  Input,         // A field for user input (like email or password)
  FormGroup,     // Groups a label and input together
  Button,
  Container,
  Row,
  Col,
  
} from "reactstrap";

// Importing 'useState' hook from React to manage form input values
import { useState } from "react";

// Importing the validation schema for the form (defines rules for valid input)
import { userSchemaValidation } from "../Validations/UserValidations";

// Importing 'yup' library, which helps define the validation rules
import * as yup from "yup";

// Importing 'useForm' from 'react-hook-form' to simplify form handling and validation
import { useForm } from "react-hook-form";

// Importing 'yupResolver' to connect 'yup' validation with 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";

import { registerUser } from "../Features/UserSlice";
import logo from '../assets/hibr_logo.png';

const Register = () => {
  // useSelector retrieves the current list of users from the Redux store
  const { isLoading } = useSelector((state) => state.users);

  // useForm hook from 'react-hook-form' to handle form validation and submission
  const {
    register, // Registers input fields to track their values and validate them
    handleSubmit, // Function to handle form submission when the form is valid
    control,
    formState: { errors }, // Object containing validation error messages for each field
  } = useForm({
    // Connects the Yup validation schema to react-hook-form
    resolver: yupResolver(userSchemaValidation),
  });

  // useDispatch hook to dispatch Redux actions (like adding or updating users)
  const dispatch = useDispatch();

  // useNavigate hook to redirect the user to another page (e.g., login page)
  const navigate = useNavigate();

  // Function to handle form submission when the form is valid
  const onSubmit = async (data) => {
    try {
      // 'data' contains the validated form values (name, email, password, confirmPassword)
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        gender: data.gender,
        birthdate: data.birthdate,
      };

      // Dispatch the action and wait for it to finish successfully before navigating
      const resultAction = await dispatch(registerUser(userData));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/login");
      } else {
        const errorMsg = resultAction.payload?.message || resultAction.payload || "Unknown error";
        alert("Registration failed: " + errorMsg);
      }
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };
  

  // JSX (React's HTML-like syntax) to render the form and layout
  return (
    // Container from reactstrap to create a responsive layout
    <Container fluid>
      {/* Row to organize the form in a grid layout */}
      <Row className="formrow justify-content-center">
        <Col md="6" lg="4">
          {/* Form element with onSubmit event tied to handleSubmit (from react-hook-form) */}
          <Form className="div-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center mb-4">
              <img src={logo} alt="HIBR Logo" style={{ height: '100px', borderRadius: '50%' }} />
            </div>
            <h2 className="text-center mb-4 text-primary">Join HIBR</h2> {/* Added a title for the form */}
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Enter your username..."
                    {...field}
                  />
                  <p className="error">{errors.username?.message}</p>
                </FormGroup>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="text"
                    id="email"
                    placeholder="Enter your email..."
                    {...field}
                  />
                  <p className="error">{errors.email?.message}</p>
                </FormGroup>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter your password..."
                    {...field}
                  />
                  <p className="error">{errors.password?.message}</p>
                </FormGroup>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password..."
                    {...field}
                  />
                  <p className="error">{errors.confirmPassword?.message}</p>
                </FormGroup>
              )}
            />

            <Controller
              name="birthdate"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label htmlFor="birthdate">Birth Date</Label>
                  <Input
                    type="date"
                    id="birthdate"
                    {...field}
                  />
                  <p className="error">{errors.birthdate?.message}</p>
                </FormGroup>
              )}
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    type="select"
                    id="gender"
                    {...field}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Input>
                  <p className="error">{errors.gender?.message}</p>
                </FormGroup>
              )}
            />

              {/* Submit button to register the user */}
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
                {isLoading ? "Registering..." : "Register"}
              </Button>
            <p className="smalltext">
          Already Registered? <Link to="/login">Login </Link>
        </p>
          </Form>
        </Col>
      </Row>
  {/*o
        <Col md={6}>
          <table>
            <tbody>
              {userList.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>
                    <Button onClick={() => handleDelete(user.email)}>
                      Delete User
                    </Button>
                    <Button onClick={() => handleUpdate(user.email)}>
                      Update User
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>  */}
    </Container>
  );
};

// Export the Register component so it can be used in other parts of the app
export default Register;