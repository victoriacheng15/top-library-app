/* eslint-disable no-undef */
/* eslint-disable prefer-const */
// add a book and clear all book buttons
const buttons = document.querySelectorAll('[data-btn]')
const form = document.querySelector('form')
const bookshelf = document.querySelector('.bookshelf')
const modalConatiner = document.querySelector('.modal-container')
const modalClose = document.querySelector('.modal-close')

// set up library information
const totalBooks = document.querySelector('.total')
const unreadBooks = document.querySelector('.unread')

let myLibrary = []

class Book {
  constructor (title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
  }
}

const BtnStatus = (nameBtn, text) => {
  if (text === 'not read yet') {
    nameBtn.textContent = text
    nameBtn.style.backgroundColor = 'hsla(0, 100%, 50%, 0.5)'
  } else {
    nameBtn.textContent = text
    nameBtn.style.backgroundColor = 'hsla(120, 100%, 25%, 0.5)'
  }
}

const createBook = (book) => {
  const bookSection = document.createElement('section')
  const bookTitle = document.createElement('h2')
  const bookAuthor = document.createElement('p')
  const bookPages = document.createElement('p')
  const readYetBtn = document.createElement('button')
  const delBtn = document.createElement('button')

  bookSection.classList.add('book')
  bookSection.dataset.index = `${myLibrary.indexOf(book)}`

  bookTitle.textContent = book.title
  bookSection.appendChild(bookTitle)

  bookAuthor.textContent = `Author: ${book.author}`
  bookSection.appendChild(bookAuthor)

  bookPages.textContent = `Pages: ${book.pages}`
  bookSection.appendChild(bookPages)

  book.read === false
    ? BtnStatus(readYetBtn, 'not read yet')
    : BtnStatus(readYetBtn, 'done read')
  bookSection.appendChild(readYetBtn)

  delBtn.textContent = 'delete'
  bookSection.appendChild(delBtn)

  bookshelf.appendChild(bookSection)

  // button event listeners
  readYetBtn.addEventListener('click', () => {
    book.read = !book.read
    setLocalStorage()
    displayLibraryInfo()
    showBookshelf()
  })

  delBtn.addEventListener('click', () => {
    myLibrary.splice(myLibrary.indexOf(book), 1)
    setLocalStorage()
    displayLibraryInfo()
    showBookshelf()
  })
}

const setLocalStorage = () => {
  localStorage.setItem('library', JSON.stringify(myLibrary))
}

const getLocalStorage = () => {
  let library = JSON.parse(localStorage.getItem('library'))
  myLibrary = library
  showBookshelf()
}

const clearBookshelf = () => {
  const books = document.querySelectorAll('.book')
  books.forEach(book => bookshelf.removeChild(book))
}

const showBookshelf = () => {
  clearBookshelf()
  myLibrary.map(book => createBook(book))
}

const displayLibraryInfo = () => {
  totalBooks.textContent = myLibrary.length
  unreadBooks.textContent = myLibrary.filter(book => book.read === true).length
}

const openOrCloseModal = () => {
  modalConatiner.classList.toggle('hide')
}

const addBookstoShelf = (e) => {
  e.preventDefault()
  let title = form.title.value
  let author = form.author.value
  let pages = form.pages.value
  let read = JSON.parse(form.read.value) // convert string to boolean

  let newBook = new Book(title, author, pages, read)
  myLibrary.push(newBook)
  setLocalStorage()
  showBookshelf()
  displayLibraryInfo()
  openOrCloseModal()
  form.reset()
}

const clearEverything = () => {
  clearBookshelf()
  myLibrary = []
  // localStorage.removeItem('library')
}

const getBooksFromLocalStorage = () => {
  localStorage.library
    ? getLocalStorage()
    : showBookshelf()
}

getBooksFromLocalStorage()
displayLibraryInfo()

// event listeners
form.addEventListener('submit', (e) => addBookstoShelf(e))

buttons.forEach(btn => btn.addEventListener('click', () => {
  if (btn.dataset.btn === 'add') openOrCloseModal()
  if (btn.dataset.btn === 'clear') clearEverything()
}))

modalClose.addEventListener('click', openOrCloseModal)
