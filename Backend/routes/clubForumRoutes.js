import express from 'express';
import authMiddleware from '../modules/authMiddleware.js';
import {
  getClubPosts,
  createClubPost,
  deleteClubPost,
  getPostComments,
  createPostComment,
  deletePostComment
} from '../controllers/clubForumController.js';

const router = express.Router();

// Apply auth middleware to all forum endpoints
router.use(authMiddleware);

// Post routes
router.get('/:clubId/posts', getClubPosts);
router.post('/:clubId/posts', createClubPost);
router.delete('/:clubId/posts/:postId', deleteClubPost);

// Comment routes
router.get('/posts/:postId/comments', getPostComments);
router.post('/posts/:postId/comments', createPostComment);
router.delete('/posts/:postId/comments/:commentId', deletePostComment);

export default router;
