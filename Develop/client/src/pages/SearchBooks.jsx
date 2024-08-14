import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';

import Auth from '../utils/auth';
import { SAVE_BOOK } from '../utils/mutations'; 
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);

      if (!response.ok) {
        throw new Error('Something went wrong with the Google Books API!');
      }

      const { items } = await response.json();

      if (!items) {
        throw new Error('No books found!');
      }

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || ''
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleSaveBook = async (book) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.error('User must be logged in to save a book.');
      return false;
    }

    try {
      const { data } = await saveBook({
        variables: {
          newBook: {
            bookId: book.bookId,
            authors: book.authors,
            description: book.description,
            title: book.title,
            image: book.image,
            link: book.link
          }
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      console.log('Book saved successfully:', data.saveBook);
      return true;
    } catch (error) {
      console.error('Error saving book:', error);
      return false;
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
