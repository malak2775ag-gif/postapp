import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, CardBody, Button, Badge, Form, FormGroup, Input, Label } from 'reactstrap';
import { FaStar, FaArrowLeft, FaCommentDots } from 'react-icons/fa';
import { FaThumbsUp } from "react-icons/fa6";
import { fetchBooks } from '../Features/BookSlice';
import { addComment, likeComment } from '../Features/commentSlice';
import moment from 'moment';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  
  const { user } = useSelector((state) => state.users);
  const { books } = useSelector((state) => state.books);
  const book = books.find((b) => b._id === id);

  useEffect(() => {
    // If books aren't loaded (e.g., on page refresh), fetch them
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < rating ? "#ffc107" : "#e4e5e9"} size={24} />
    ));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const commentData = {
      text: commentText,
      userEmail: user.email,
      username: user.username,
    };

    dispatch(addComment({ bookId: id, commentData }));
    setCommentText("");
  };

  const handleLike = (commentId) => {
    dispatch(likeComment({ bookId: id, commentId, userEmail: user.email }));
  };

  if (!book) {
    return (
      <Container className="py-5 text-center">
        <h4>Loading book details...</h4>
        <Button color="link" onClick={() => navigate('/')}>Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button 
        color="link" 
        className="text-decoration-none text-secondary mb-4 p-0 d-flex align-items-center" 
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back to Bookshelf
      </Button>

      <Card className="border-0 shadow-lg" style={{ borderRadius: '25px', overflow: 'hidden' }}>
        <Row className="g-0">
          <Col md={5} lg={4} className="bg-light">
            <div className="h-100 d-flex align-items-center justify-content-center p-4">
              <img 
                src={book.image ? `http://localhost:3001/uploads/${book.image}` : 'https://via.placeholder.com/300x450?text=No+Cover'} 
                alt={book.title}
                className="img-fluid shadow-sm"
                style={{ borderRadius: '15px', maxHeight: '500px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          </Col>
          <Col md={7} lg={8}>
            <CardBody className="p-4 p-lg-5">
              <div className="mb-4">
                <Badge color="primary" className="mb-2 px-3 py-2 rounded-pill" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  Book Review
                </Badge>
                <h1 className="display-5 fw-bold text-dark">{book.title}</h1>
                <h4 className="text-muted mb-3">by {book.author}</h4>
                <hr className="my-4" />
              </div>

              <div className="mb-4">
                <h5 className="text-uppercase small fw-bold text-secondary mb-3">Your Rating</h5>
                <div className="d-flex align-items-center">
                  <div className="me-3">{renderStars(book.rating)}</div>
                  <span className="fw-bold text-dark h5 mb-0">{book.rating}/5</span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-uppercase small fw-bold text-secondary mb-3">Summary & Thoughts</h5>
                <p className="lead text-dark" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                  {book.description || "No description provided for this book."}
                </p>
              </div>

              <div className="mt-5 pt-4 border-top">
                <Row className="text-muted small">
                  <Col sm={6}>
                    <p className="mb-0">Shared by: <strong>{book.userEmail}</strong></p>
                  </Col>
                  {book.createdAt && (
                    <Col sm={6} className="text-sm-end">
                      <p className="mb-0">Added on: {new Date(book.createdAt).toLocaleDateString()}</p>
                    </Col>
                  )}
                </Row>
              </div>
              
              <Button 
                color="primary" 
                className="mt-4 px-4 py-2 fw-bold border-0 shadow-sm"
                style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                onClick={() => navigate('/')}
              >
                Return to Collection
              </Button>
            </CardBody>
          </Col>
        </Row>
      </Card>

      {/* Discussion Section */}
      <div className="mt-5">
        <h3 className="mb-4 d-flex align-items-center">
          <FaCommentDots className="me-2 text-primary" /> Discussion
        </h3>

        {/* Comment Form */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
          <CardBody>
            <Form onSubmit={handleAddComment}>
              <FormGroup>
                <Label className="small text-uppercase fw-bold text-secondary">Write a comment</Label>
                <Input 
                  type="textarea" 
                  placeholder="What are your thoughts on this book?" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="border-0 bg-light p-3"
                  style={{ borderRadius: '12px' }}
                  rows="3"
                />
              </FormGroup>
              <div className="text-end">
                <Button 
                  color="primary" 
                  className="px-4 py-2 fw-bold border-0 shadow-sm"
                  style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>

        {/* Comments List */}
        <div className="d-flex flex-column gap-3">
          {book.comments && book.comments.length > 0 ? (
            book.comments.map((comment) => (
              <Card key={comment._id} className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <CardBody className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{comment.username || comment.userEmail}</h6>
                      <small className="text-muted">{moment(comment.createdAt).fromNow()}</small>
                    </div>
                  </div>
                  <p className="text-dark mb-3">{comment.text}</p>
                  <div className="d-flex align-items-center gap-3">
                    <Button 
                      color="link" 
                      className={`p-0 text-decoration-none d-flex align-items-center ${comment.likes?.users?.includes(user?.email) ? 'text-primary' : 'text-secondary'}`}
                      onClick={() => handleLike(comment._id)}
                    >
                      <FaThumbsUp className="me-1" /> 
                      <small className="fw-bold">{comment.likes?.count || 0}</small>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted py-4">No comments yet. Start the conversation!</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default BookDetails;