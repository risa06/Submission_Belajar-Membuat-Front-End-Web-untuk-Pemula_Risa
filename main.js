const books = [];
const RENDER_EVENT  = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const textBook = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const generatedID = generateID();
    const bookObject = generateBookObject(generatedID, textBook, author, year, false);
    
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateID() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title, 
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted == false)
            uncompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
    }    
});

function makeBook(bookObject) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis: " + bookObject.author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun: " + bookObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("book_list")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const unfinishButton = document.createElement("button");
        unfinishButton.innerText = "Belum selesai dibaca";
        unfinishButton.classList.add("newGreen");
        unfinishButton.addEventListener("click", function() {
            unfinishBookFromCompleted(bookObject.id);
        });        
        const trashButton = document.createElement("button");
        trashButton.innerText = "Hapus buku";
        trashButton.classList.add("newRed");
        trashButton.addEventListener("click", function() {
            removeBookFromCompleted(bookObject.id);
        });
        container.append(unfinishButton, trashButton);
    }
    else {
        const finishButton = document.createElement("button");
        finishButton.innerText = "Sudah selesai dibaca";
        finishButton.classList.add("newGreen");
        finishButton.addEventListener("click", function() {
            addBookToCompleted(bookObject.id);
        });
        const trashButton = document.createElement("button");
        trashButton.innerText = "Hapus buku";
        trashButton.classList.add("newRed");
        trashButton.addEventListener("click", function() {
            removeBookFromCompleted(bookObject.id);
        });
        container.append(finishButton, trashButton);
    }
    
    return container;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }

    return null
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function unfinishBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id == bookId) {
            return index
        }
    }

    return -1
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser Anda tidak mendukung local storage");
        return false
    }

    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}