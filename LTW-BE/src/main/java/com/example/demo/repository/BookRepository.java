package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long>{
	public List<Book> findByTitle(String title);
	public List<Book> findByTitleContains(String title);
	public List<Book> findByTitleAndAuthor(String title, String author);
	boolean existsByTitleAndAuthor(String title, String author);
	boolean existsByTitleAndAuthorAndIdNot(String title, String author, Long id);
}
