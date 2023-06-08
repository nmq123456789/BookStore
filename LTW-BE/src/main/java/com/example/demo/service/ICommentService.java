package com.example.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Comment;

@Service
public interface ICommentService {
	List<Comment> findCommentsByBookId(Long bookId);
	
	Comment putComment(Long commentId, String comment);
	
	Comment postComment(Long userId, Long bookId, String comment, int rating);
	
	void deleteComment(Long commentId);
}
