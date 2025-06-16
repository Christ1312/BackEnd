const { nanoid } = require('nanoid');
const books = require('./books.js');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
 
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
 
  const newBook = {
   name, 
   year, 
   author, 
   summary, 
   publisher, 
   pageCount, 
   readPage, 
   reading,
   finished: readPage === pageCount, 
   id, 
   insertedAt, 
   updatedAt,
  };
 
  books.push(newBook);
 
  const isSuccess = books.filter((Book) => Book.id === id).length > 0;
 
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllbooksHandler = () => ({
  status: 'success',
  data: {
    books: books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }))
  }
});

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
 
  const Book = books.filter((n) => n.id === bookId)[0];
 
if (Book !== undefined) {
    return {
      status: 'success',
      data: {
        book: Book,
      },
    };
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
 
  const { 
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    reading, 
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
 
  const index = books.findIndex((Book) => Book.id === bookId);
 
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage, 
      reading,
      updatedAt,
    };
 
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
 
  const index = books.findIndex((Book) => Book.id === bookId);
 
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
 
const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
 
module.exports = {
  addBookHandler,
  getAllbooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
