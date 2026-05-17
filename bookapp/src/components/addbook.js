import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, 
  Form, FormGroup, Label, Input, Button 
} from 'reactstrap';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addBook, resetBooks } from '../Features/BookSlice';

const AddBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { isSuccess, isError, message, isLoading } = useSelector((state) => state.books);

  // Protect the route - redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess) {
      alert(message || "Book added successfully!");
      dispatch(resetBooks());
      navigate('/');
    }
    if (isError) {
      alert(message);
      dispatch(resetBooks());
    }
  }, [isSuccess, isError, message, navigate, dispatch]);
  
  // State for form fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);
    formData.append('rating', rating);
    formData.append('userEmail', user.email);
    if (image) formData.append('image', image);

    dispatch(addBook(formData));
  };

  // Do not render the form if the user is not logged in (while redirecting)
  if (!user) return null;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '25px' }}>
            <div 
              style={{ 
                height: '100px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <h2 className="text-white fw-bold m-0">Add New Book</h2>
            </div>
            <CardBody className="p-4">
              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <Label for="title" className="small text-uppercase fw-bold text-secondary ps-2">Book Title</Label>
                  <br/>

                  <Input 
                    type="text" 
                    id="title" 
                    placeholder="Enter book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                    className="border-0 bg-light p-3"
                    style={{ borderRadius: '12px' }}
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="author" className="small text-uppercase fw-bold text-secondary ps-2">Author</Label>
                  <br/>
                  <Input 
                    type="text" 
                    id="author" 
                    placeholder="Enter author's name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required 
                    className="border-0 bg-light p-3"
                    style={{ borderRadius: '12px' }}
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="description" className="small text-uppercase fw-bold text-secondary ps-2">Description / Summary</Label>
                  <br/>
                  <Input 
                    type="textarea" 
                    id="description" 
                    placeholder="What is this book about?"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-0 bg-light p-3"
                    style={{ borderRadius: '12px' }}
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="image" className="small text-uppercase fw-bold text-secondary ps-2">Cover Image</Label>
                  <br/>
                  <Input 
                    type="file" 
                    id="image" 
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="form-control border-0 bg-light"
                    style={{ borderRadius: '50px' }}
                  />
                </FormGroup>

                <FormGroup className="mb-4 text-center">
                  <br/>
                  <Label className="small text-uppercase fw-bold d-block text-secondary mb-2">My Rating</Label>
                  <div className="d-flex justify-content-center gap-1">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <FaStar 
                          key={index}
                          size={35} 
                          color={ratingValue <= (hover || rating) ? "#f8c426" : "#9c9da1"}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                          onClick={() => setRating(ratingValue)}
                          style={{ cursor: 'pointer', transition: 'color 200ms ease-in-out' }}
                        />
                      );
                    })}
                  </div>
                </FormGroup>

                <Button 
                  color="primary" 
                  block 
                  disabled={isLoading}
                  className="py-3 fw-bold border-0 shadow-sm mb-3"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '15px'
                  }}
                >
                  {isLoading ? "ADDING..." : "ADD TO COLLECTION"}
                </Button>
                
                <Button 
                  type="button" 
                  color="link" 
                  block 
                  onClick={() => navigate('/')} 
                  className="text-muted text-decoration-none fw-bold"
                  style={{ 
                    paddingLeft: '5',
                    paddingRight: '5',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

export default AddBook;