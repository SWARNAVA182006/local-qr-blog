import { useNavigate } from 'react-router-dom';
import { useBlog } from '@/contexts/BlogContext';
import PostCard from '@/components/PostCard';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const SavedPosts = () => {
  const { getSavedPosts, deletePost } = useBlog();
  const { toast } = useToast();
  const navigate = useNavigate();

  const savedPosts = getSavedPosts();

  const handleEdit = (post) => {
    navigate('/create', { state: { post } });
  };

  const handleDelete = (postId) => {
    deletePost(postId);
    toast({
      title: 'Post deleted',
      description: 'Your post has been deleted successfully',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Saved Posts</h1>
        <div className="max-w-3xl mx-auto">
          {savedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No saved posts yet</p>
            </div>
          ) : (
            savedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedPosts;
