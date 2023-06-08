package com.example.demo.service.impl;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Comment;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ICommentService;

@Service
public class CommentService implements ICommentService{

	@Autowired
	CommentRepository commentRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	BookRepository bookRepository;
	
	@Override
	public List<Comment> findCommentsByBookId(Long bookId) {
		return commentRepository.findByBookId(bookId);
	}

	@Override
	public void deleteComment(Long commentId) {
		commentRepository.deleteById(commentId);
	}


	@Override
	public Comment putComment(Long commentId, String comment) {
		java.util.Date utilDate = java.util.Calendar.getInstance().getTime();
		Date sqlDate = new Date(utilDate.getTime());
		Comment cmt = commentRepository.findById(commentId).orElse(null);
		cmt.setDate(sqlDate);
		cmt.setComment(comment);
		return commentRepository.save(cmt);
	}

	@Override
	public Comment postComment(Long userId, Long bookId, String comment, int rating) {
		java.util.Date utilDate = java.util.Calendar.getInstance().getTime();
		Date sqlDate = new Date(utilDate.getTime());
		Comment newComment = new Comment(null, userRepository.findById(userId).get(),
				bookRepository.findById(bookId).get(), comment, rating, sqlDate);
		commentRepository.save(newComment);
		return newComment;
	}

}
