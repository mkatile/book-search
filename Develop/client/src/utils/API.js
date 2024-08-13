// route to get logged in user's info (needs the token)
export const getMe = (token) => {
  return fetch('/graphql', {
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
  }).then(response => response.json());
};

export const createUser = (userData) => {
  return fetch('/graphql', {
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
  }).then(response => response.json());
};


export const loginUser = (userData) => {
  return fetch('/graphql', {
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
  }).then(response => response.json());
};

// save book data for a logged in user
export const saveBook = (bookData, token) => {
  return fetch('/graphql', {
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
  }).then(response => response.json());
};


// remove saved book data for a logged in user
export const deleteBook = (bookId, token) => {
  return fetch('/graphql', {
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
  }).then(response => response.json());
};


// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};