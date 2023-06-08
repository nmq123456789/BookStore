package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Comment;
import com.example.demo.service.impl.CommentService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class CommentController {

	@Autowired
	CommentService commentService;

	@GetMapping("/comments/{bookId}")
	public List<Comment> getBookComments(@PathVariable String bookId) {
		return commentService.findCommentsByBookId(Long.valueOf(bookId));
	}

	@PostMapping("/comment/{bookId}/{userId}")
	public Comment postComment(@PathVariable Long bookId, @PathVariable Long userId, @RequestBody Comment comment) {
		Comment newComment = commentService.postComment(userId, bookId, comment.getComment(), comment.getRating());
		return newComment;
	}
	
	@PutMapping("/comments/{commentId}")
	public Comment putComment(@PathVariable Long commentId, @RequestBody Comment comment) {
		return commentService.putComment(commentId, comment.getComment());
	}

	@DeleteMapping("/comments/{commentId}")
	public void deleteComment(@PathVariable String commentId) {
		commentService.deleteComment(Long.valueOf(commentId));
	}
}
