package com.librahub.library.repository;

import com.librahub.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(b.genre) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(b.isbn) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Book> search(@Param("q") String query);

    List<Book> findByGenreIgnoreCase(String genre);
    List<Book> findByAvailableCopiesGreaterThan(int copies);

    @Query("SELECT COALESCE(SUM(b.availableCopies), 0) FROM Book b")
    Long sumAvailableCopies();
}
