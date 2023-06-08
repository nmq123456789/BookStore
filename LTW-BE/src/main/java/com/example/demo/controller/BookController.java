package com.example.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Book;
import com.example.demo.entity.Cart;
import com.example.demo.entity.Comment;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.service.impl.CartService;
import com.example.demo.service.impl.CommentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class BookController {
	
	@Autowired
	private BookRepository DAO;
	
	@Autowired
	ObjectMapper objectMapper;
	
	@Autowired
	CartRepository cartRepository;
	
	@Autowired
	CommentRepository commentRepository;
	
	@GetMapping("/")
	public String a() {
		return "login";
	}
	
	@GetMapping("/books")
	public List<Book> getAll(){
		return DAO.findAll();
	}
	
	@GetMapping("/book/{bookcode}")
	public Book book(@PathVariable String bookcode){
		return DAO.findById(Long.valueOf(bookcode)).orElse(new Book());
	}
	
	private String saveImg(MultipartFile img) throws IOException {
		String dir = "D:\\Data\\REACTJS\\ltw\\src\\assets\\images";
		String fileName = UUID.randomUUID().toString() + img.getOriginalFilename();
		Path path = Paths.get(dir, fileName);
		Files.copy(img.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
		return fileName;
	}
	
	@PostMapping("/book/save/{bookcode}")
	public ResponseEntity<Book> addBook(@RequestParam(value = "img",required = false) MultipartFile img, @RequestParam("book") String book) {
	    try {
	        Book newBook = objectMapper.readValue(book, Book.class);
	        if (img != null) {
	            String path = saveImg(img);
	            newBook.setImgName(path);
	        }

	        if (DAO.existsByTitleAndAuthor(newBook.getTitle(), newBook.getAuthor())) {
	            return ResponseEntity.status(401).body(null);
	        } else {
	            DAO.save(newBook);
	            return ResponseEntity.ok(newBook);
	        }
	        
	    } catch (JsonMappingException e) {
	        e.printStackTrace();
	    } catch (JsonProcessingException e) {
	        e.printStackTrace();
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	}

	
	@PutMapping("/book/save/{bookcode}")
	public ResponseEntity<Book> editBook(@RequestParam(value = "img", required = false) MultipartFile img, @RequestParam("book") String book) {
	    try {
	        Book newBook = objectMapper.readValue(book, Book.class);
	        if (img != null) {
	            String path = saveImg(img);
	            newBook.setImgName(path);
	        }

	        if (DAO.existsByTitleAndAuthorAndIdNot(newBook.getTitle(), newBook.getAuthor(), newBook.getId())) {
	            return ResponseEntity.status(401).body(null);
	        } else {
	            DAO.save(newBook);
	            return ResponseEntity.ok(newBook);
	        }
	    } catch (JsonMappingException e) {
	        e.printStackTrace();
	    } catch (JsonProcessingException e) {
	        e.printStackTrace();
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	}

	
	@DeleteMapping("/delete/{dlt}")
	public List<Book> updateBook(@PathVariable String dlt) {
//		DAO.deleteById(Long.valueOf(dlt));
//		return DAO.findAll();
		Long bookId = Long.valueOf(dlt);

	    List<Comment> commentsToDelete = commentRepository.findByBookId(bookId);
	    commentRepository.deleteAll(commentsToDelete);

	    List<Cart> cartsToDelete = cartRepository.findAllById_BookId(bookId);
	    cartRepository.deleteAll(cartsToDelete);

	    DAO.deleteById(bookId);
	    return DAO.findAll();
	}
	
	@GetMapping("/search/{key}")
	public List<Book> searchBook(@PathVariable String key){
		return DAO.findByTitleContains(key);
	}
}
