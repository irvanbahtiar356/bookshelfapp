const books = [];
const RENDER_EVENT = "render-book";

const cek = document.getElementById("inputBookIsComplete");
const span = document.querySelector("span");
cek.addEventListener("input", function () {
  if (cek.checked) {
    span.innerText = "Selesai dibaca";
  } else {
    span.innerText = "Belum selesai dibaca";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const inputSearchBook = document.getElementById("searchBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  inputSearchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (typeof Storage) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const bookObject = {
    id: +new Date(),
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isCompleted: isComplete,
  };
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

function makeListBook(bookObject) {
  const mainContainer = document.createElement("article");
  mainContainer.classList.add("book_item");
  mainContainer.id = bookObject.id;

  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis : ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun : ${bookObject.year}`;

  const actionContianer = document.createElement("div");
  actionContianer.classList.add("action");

  if (bookObject.isCompleted) {
    const buttonUncompleted = document.createElement("button");
    buttonUncompleted.classList.add("green");
    buttonUncompleted.innerText = "Belum selesai dibaca";

    buttonUncompleted.addEventListener("click", function () {
      toUncompletedRead(bookObject.id);
    });

    const buttonDeleted = document.createElement("button");
    buttonDeleted.classList.add("red");
    buttonDeleted.innerText = "Hapus buku";

    buttonDeleted.addEventListener("click", function () {
      buatAlert(bookObject.id);
    });

    actionContianer.append(buttonUncompleted, buttonDeleted);
  } else {
    const buttonCompleted = document.createElement("button");
    buttonCompleted.classList.add("green");
    buttonCompleted.innerText = "Selesai dibaca";

    buttonCompleted.addEventListener("click", function () {
      toCompletedRead(bookObject.id);
    });

    const buttonDeleted = document.createElement("button");
    buttonDeleted.classList.add("red");
    buttonDeleted.innerText = "Hapus buku";

    buttonDeleted.addEventListener("click", function () {
      buatAlert(bookObject.id);
    });

    actionContianer.append(buttonCompleted, buttonDeleted);
  }

  mainContainer.append(textTitle, textAuthor, textYear, actionContianer);

  return mainContainer;
}

function toUncompletedRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

function toCompletedRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }

  return null;
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

const SAVE_EVENT = "save-book";

function saveBookData() {
  if (typeof Storage) {
    const parsed = JSON.stringify(books);
    localStorage.setItem("BOOKS", parsed);
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
}

document.addEventListener(SAVE_EVENT, function () {
  console.log("Data berhasil disimpan...");
});

function loadDataFromStorage() {
  const datas = localStorage.getItem("BOOKS");
  let data = JSON.parse(datas);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const book of books) {
    const bookListElement = makeListBook(book);

    if (!book.isCompleted) {
      incompleteBookshelfList.append(bookListElement);
    } else {
      completeBookshelfList.append(bookListElement);
    }
  }
});

function searchBook() {
  const searchBook = document.getElementById("searchBookTitle");
  const filter = searchBook.value.toUpperCase();
  const bookItem = document.querySelectorAll(
    "section.book_shelf > .book_list > .book_item"
  );
  for (let i = 0; i < bookItem.length; i++) {
    txtValue = bookItem[i].textContent || bookItem[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      bookItem[i].style.display = "";
    } else {
      bookItem[i].style.display = "none";
    }
  }
}

function buatAlert(bookObject) {
  const fullContainer = document.createElement("div");
  fullContainer.classList.add("full");

  const alertContainer = document.createElement("div");
  alertContainer.classList.add("alert-container");

  const p = document.createElement("p");
  p.innerText = "Apakah Anda yakin akan menghapus daftar buku ini ??";
  p.style.fontSize = "1.5 rem";

  const confirm = document.createElement("div");
  confirm.classList.add("confirm");

  const buttonYa = document.createElement("button");
  buttonYa.classList.add("green");
  buttonYa.innerText = "Ya";
  buttonYa.id = "buttonYa";
  buttonYa.addEventListener("click", function () {
    deleteBook(bookObject);
    fullContainer.style.display = "none";
  });

  const buttonTidak = document.createElement("button");
  buttonTidak.classList.add("red");
  buttonTidak.innerText = "Tidak";
  buttonTidak.id = "buttonTidak";
  buttonTidak.addEventListener("click", function () {
    fullContainer.style.display = "none";
  });

  confirm.append(buttonYa, buttonTidak);

  alertContainer.append(p, confirm);

  fullContainer.append(alertContainer);

  document.body.appendChild(fullContainer);
}
