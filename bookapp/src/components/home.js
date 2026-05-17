import { Container, Row, Col, Button, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchBooks } from "../Features/BookSlice";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.users.user?.email);
  const { books, isLoading } = useSelector((state) => state.books);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/login');
    } else {
      dispatch(fetchBooks());
    }
  }, [email, navigate, dispatch]);

  // Filter books into user's shelf and others
  const myBooks = books.filter(book => book.userEmail === email);
  const otherBooks = books.filter(book => book.userEmail !== email);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < rating ? "#ffc107" : "#e4e5e9"} size={16} />
    ));
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          <div className="p-4 border rounded bg-white shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary m-0">Your Bookshelf</h2>
              <Button 
                color="primary" 
                onClick={() => navigate('/addbook')}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px',
                  border: 'none'
                }}
              >
                + Add Book
              </Button>
            </div>
            <p className="text-muted">Welcome to your reading tracker. Start adding books to your collection!</p>
            <hr />

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading your library...</p>
              </div>
            ) : (
              <>
            {/* User's Bookshelf Section */}
            <section className="mt-4">
              <h4 className="mb-3 text-secondary">My Shelf</h4>
              {myBooks.length > 0 ? (
                <Row>
                  {myBooks.map((book) => (
                    <Col key={book._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <Card 
                        className="h-100 border-0 shadow-sm" 
                        style={{ borderRadius: '15px', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => navigate(`/book/${book._id}`)}
                      >
                        <div style={{ height: '220px', overflow: 'hidden' }}>
                          <CardImg 
                            top 
                            src={book.image ? `http://localhost:3001/uploads/${book.image}` : 'https://via.placeholder.com/150x220?text=No+Cover'} 
                            alt={book.title}
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <CardBody className="p-3">
                          <CardTitle tag="h6" className="fw-bold mb-1 text-truncate">{book.title}</CardTitle>
                          <CardSubtitle tag="small" className="text-muted d-block mb-2">{book.author}</CardSubtitle>
                          <div className="mb-1">{renderStars(book.rating)}</div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="small text-muted italic">You haven't added any books yet.</p>
              )}
            </section>

            {/* Others' Collections Section */}
            <section className="mt-5">
              <h4 className="mb-3 text-secondary">Explore Other Collections</h4>
              {otherBooks.length > 0 ? (
                <Row>
                  {otherBooks.map((book) => (
                    <Col key={book._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <Card 
                        className="h-100 border-0 shadow-sm" 
                        style={{ borderRadius: '15px', opacity: 0.9, cursor: 'pointer' }}
                        onClick={() => navigate(`/book/${book._id}`)}
                      >
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          <CardImg 
                            top 
                            src={book.image ? `http://localhost:3001/uploads/${book.image}` : 'https://via.placeholder.com/150x200?text=No+Cover'} 
                            alt={book.title}
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <CardBody className="p-3 bg-light">
                          <CardTitle tag="h6" className="fw-bold mb-1 text-truncate">{book.title}</CardTitle>
                          <CardSubtitle tag="small" className="text-muted d-block">{book.author}</CardSubtitle>
                          <div className="mt-2">{renderStars(book.rating)}</div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="small text-muted italic">No other users have shared books yet.</p>
              )}
            </section>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;