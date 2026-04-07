package com.librahub.library.service;

import com.librahub.library.exception.ResourceNotFoundException;
import com.librahub.library.model.Book;
import com.librahub.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getAllBooks() { return bookRepository.findAll(); }

    public Book getById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + id));
    }

    public List<Book> search(String q) {
        return (q == null || q.isBlank()) ? bookRepository.findAll() : bookRepository.search(q);
    }

    public List<Book> getByGenre(String genre) { return bookRepository.findByGenreIgnoreCase(genre); }

    public Book create(Book book) {
        if (book.getAvailableCopies() == null) book.setAvailableCopies(book.getTotalCopies());
        return bookRepository.save(book);
    }

    public Book update(Long id, Book d) {
        Book b = getById(id);
        b.setTitle(d.getTitle()); b.setAuthor(d.getAuthor()); b.setIsbn(d.getIsbn());
        b.setGenre(d.getGenre()); b.setPublisher(d.getPublisher()); b.setPublishYear(d.getPublishYear());
        b.setTotalCopies(d.getTotalCopies()); b.setAvailableCopies(d.getAvailableCopies());
        b.setDescription(d.getDescription());
        return bookRepository.save(b);
    }

    public void delete(Long id) { getById(id); bookRepository.deleteById(id); }

    public long count() { return bookRepository.count(); }
    public long availableCount() { return bookRepository.sumAvailableCopies(); }
}
