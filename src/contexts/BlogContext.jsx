import { createContext, useContext, useState, useEffect } from 'react';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedPosts = localStorage.getItem('posts');
    const savedUsers = localStorage.getItem('users');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  // User functions
  const createUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return newUser;
  };

  const updateUser = (userId, userData) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
    if (currentUser?.id === userId) {
      const updatedCurrentUser = { ...currentUser, ...userData };
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Post functions
  const createPost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      authorId: currentUser.id,
      authorName: currentUser.name,
      likes: 0,
      likedBy: [],
      comments: [],
      savedBy: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    return newPost;
  };

  const updatePost = (postId, postData) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, ...postData } : post
    ));
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const likePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy?.includes(currentUser.id);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...(post.likedBy || []), currentUser.id]
        };
      }
      return post;
    }));
  };

  const addComment = (postId, commentText) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now().toString(),
          userId: currentUser.id,
          userName: currentUser.name,
          text: commentText,
          createdAt: new Date().toISOString(),
        };
        return {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    }));
  };

  const toggleSavePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasSaved = post.savedBy?.includes(currentUser.id);
        return {
          ...post,
          savedBy: hasSaved
            ? post.savedBy.filter(id => id !== currentUser.id)
            : [...(post.savedBy || []), currentUser.id]
        };
      }
      return post;
    }));
  };

  const getSavedPosts = () => {
    return posts.filter(post => post.savedBy?.includes(currentUser?.id));
  };

  const getUserPosts = (userId) => {
    return posts.filter(post => post.authorId === userId);
  };

  const value = {
    currentUser,
    posts,
    users,
    createUser,
    updateUser,
    logout,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    toggleSavePost,
    getSavedPosts,
    getUserPosts,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
