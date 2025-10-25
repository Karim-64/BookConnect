/* Sample data*/
const books = [
  { 
    id: 1,
    title: "Frankenstein", 
    author: "Mary Shelley", 
    rating: 4, 
    cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    dateRead: "2024-02-15",
    shelf: "read",
    shelves: ["read", "classics", "favorites"]
  },
  { 
    id: 2,
    title: "The Great Gatsby", 
    author: "F. Scott Fitzgerald", 
    rating: 4, 
    cover: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781524879761/the-great-gatsby-9781524879761_hr.jpg",
    dateRead: "2024-01-22",
    shelf: "read",
    shelves: ["read", "classics"]
  },
  { 
    id: 3,
    title: "Pride and Prejudice", 
    author: "Jane Austen", 
    rating: 5, 
    cover: "https://i.ebayimg.com/images/g/k9UAAeSwb0Jos~6g/s-l1600.webp",
    dateRead: "2023-12-10",
    shelf: "read",
    shelves: ["read", "classics", "favorites"]
  },
  { 
    id: 4,
    title: "1984", 
    author: "George Orwell", 
    rating: 5, 
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    dateRead: "2024-03-05",
    shelf: "read",
    shelves: ["read", "classics"]
  },
  { 
    id: 5,
    title: "To Kill a Mockingbird", 
    author: "Harper Lee", 
    rating: 4, 
    cover: "https://covers.openlibrary.org/b/id/8225631-L.jpg",
    dateRead: "2023-11-18",
    shelf: "read",
    shelves: ["read", "classics"]
  },
  { 
    id: 6,
    title: "To the Lighthouse", 
    author: "Virginia Woolf", 
    rating: 0, 
    cover: "https://covers.openlibrary.org/b/id/8231991-L.jpg",
    dateRead: "",
    shelf: "currently-reading",
    shelves: ["currently-reading", "fiction"]
  },
  { 
    id: 7,
    title: "The Hobbit", 
    author: "J. R. R. Tolkien", 
    rating: 0, 
    cover: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
    dateRead: "",
    shelf: "to-read",
    shelves: ["to-read", "fiction"]
  },
  { 
    id: 8,
    title: "One Hundred Years of Solitude", 
    author: "Gabriel García Márquez", 
    rating: 4, 
    cover: "https://covers.openlibrary.org/b/id/8228690-L.jpg",
    dateRead: "2024-01-05",
    shelf: "read",
    shelves: ["read", "fiction"]
  }
];

/* Helper functions*/
function makeStarSVG(filled = true) {
  // return inline star svg string; filled = true/false for filled/outline
  if (filled) {
    return `<svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" style="color:#f6b438"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.951c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.286-3.951a1 1 0 00-.364-1.118L2.063 9.378c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.951z"/></svg>`;
  } else {
    return `<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" style="color:#f6b438"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.951c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.286-3.951a1 1 0 00-.364-1.118L2.063 9.378c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.951z"/></svg>`;
  }
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

/* Render books table*/
const booksTableBody = document.getElementById('booksTableBody');
let currentShelf = "all";

function renderBooksTable() {
  booksTableBody.innerHTML = '';
  
  // Show loading state
  booksTableBody.parentElement.classList.add('loading');
  
  // Small delay to show loading (for demo purposes)
  setTimeout(() => {
    // Filter books based on current shelf
    let filteredBooks = books;
    
    if (currentShelf !== "all") {
      filteredBooks = filteredBooks.filter(book => 
        book.shelves.includes(currentShelf)
      );
    }
    
    if (filteredBooks.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 40px; color: var(--muted);">
          No books found in this category.
        </td>
      `;
      booksTableBody.appendChild(row);
    } else {
      filteredBooks.forEach(book => {
        const row = document.createElement('tr');
        
        // Build rating stars
        const starsHtml = book.rating > 0 
          ? [1,2,3,4,5].map(i => i<=book.rating ? makeStarSVG(true) : makeStarSVG(false)).join('')
          : '<span class="muted">Not rated</span>';
        
        // Build shelf tags
        const shelfTags = book.shelves
          .filter(shelf => shelf !== book.shelf)
          .map(shelf => `<span class="shelf-tag">${escapeHtml(shelf)}</span>`)
          .join(' ');
        
        row.innerHTML = `
          <td>
            <div class="book-title-cell">
              <div class="table-book-cover">
                <img src="${book.cover}" alt="${escapeHtml(book.title)} cover" loading="lazy">
              </div>
              <div class="book-title-info">
                <div class="book-title">${escapeHtml(book.title)}</div>
                <div class="book-author">${escapeHtml(book.author)}</div>
              </div>
            </div>
          </td>
          <td>${escapeHtml(book.author)}</td>
          <td>
            <div class="rating-cell" aria-label="Rating: ${book.rating} of 5">
              <div class="stars">${starsHtml}</div>
            </div>
          </td>
          <td>
            <div class="date-read">${formatDate(book.dateRead)}</div>
          </td>
          <td>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span class="shelf-tag" style="background: rgba(11,143,140,0.15);">${escapeHtml(book.shelf)}</span>
              ${shelfTags}
            </div>
          </td>
        `;
        booksTableBody.appendChild(row);
      });
    }
    
    // Remove loading state
    booksTableBody.parentElement.classList.remove('loading');
  }, 300);
}

/* Shelf selection behavior*/
const shelfItems = document.querySelectorAll('.shelf-list li');
function setActiveShelf(key) {
  // Toggle active class
  shelfItems.forEach(item => {
    item.classList.toggle('active', item.dataset.shelf === key);
  });
  
  // Update current shelf
  currentShelf = key;
  
  // Update section title
  const titleMap = {
    all: 'All Books',
    read: 'Read Books',
    'currently-reading': 'Currently Reading',
    'to-read': 'Want to Read',
    'favorites': 'Favorite Books',
  };
  document.getElementById('sectionTitle').textContent = titleMap[key] || 'Books';
  
  // Re-render table
  renderBooksTable();
}

shelfItems.forEach(item => {
  item.addEventListener('click', () => setActiveShelf(item.dataset.shelf));
  // Keyboard accessibility
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveShelf(item.dataset.shelf);
    }
  });
});

/** Initial render*/
renderBooksTable();
setActiveShelf('all');