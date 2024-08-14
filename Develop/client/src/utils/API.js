// Get logged-in user's info
export const getMe = async (token) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            me {
              _id
              username
              email
              bookCount
              savedBooks {
                bookId
                authors
                description
                title
                image
                link
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            addUser(username: "${userData.username}", email: "${userData.email}", password: "${userData.password}") {
              token
              user {
                _id
                username
                email
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Log in a user
export const loginUser = async (userData) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            login(email: "${userData.email}", password: "${userData.password}") {
              token
              user {
                _id
                username
                email
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

// Save book data for a logged-in user
export const saveBook = async (bookData, token) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation {
            saveBook(newBook: {
              bookId: "${bookData.bookId}",
              authors: ${JSON.stringify(bookData.authors)},
              title: "${bookData.title}",
              description: "${bookData.description}",
              image: "${bookData.image}",
              link: "${bookData.link}"
            }) {
              _id
              username
              savedBooks {
                bookId
                title
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving book:', error);
  }
};

// Remove saved book data for a logged-in user
export const deleteBook = async (bookId, token) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation {
            removeBook(bookId: "${bookId}") {
              _id
              username
              savedBooks {
                bookId
                title
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

// Search Google Books API
export const searchGoogleBooks = async (query) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching Google Books:', error);
  }
};
