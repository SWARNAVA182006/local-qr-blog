import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBlog } from '@/contexts/BlogContext';
import { Heart, MessageCircle, Bookmark, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PostCard = ({ post, onEdit, onDelete }) => {
  const { currentUser, likePost, addComment, toggleSavePost } = useBlog();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = post.likedBy?.includes(currentUser?.id);
  const isSaved = post.savedBy?.includes(currentUser?.id);
  const isAuthor = post.authorId === currentUser?.id;

  const handleLike = () => {
    likePost(post.id);
    toast({
      title: isLiked ? 'Unliked' : 'Liked',
      description: isLiked ? 'Post removed from likes' : 'Post liked successfully',
    });
  };

  const handleSave = () => {
    toggleSavePost(post.id);
    toast({
      title: isSaved ? 'Unsaved' : 'Saved',
      description: isSaved ? 'Post removed from saved' : 'Post saved successfully',
    });
  };

  const handleComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted',
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{post.title}</h2>
            <Link to={`/user/${post.authorId}`}>
              <p className="text-sm text-muted-foreground hover:text-foreground">
                by {post.authorName}
              </p>
            </Link>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit?.(post)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete?.(post.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full gap-4">
          <Button
            variant={isLiked ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
            className="flex-1"
          >
            <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            {post.likes || 0}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex-1"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {post.comments?.length || 0}
          </Button>
          <Button
            variant={isSaved ? 'default' : 'outline'}
            size="sm"
            onClick={handleSave}
            className="flex-1"
          >
            <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>

        {showComments && (
          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button onClick={handleComment}>Post</Button>
            </div>
            <div className="space-y-2">
              {post.comments?.map((comment) => (
                <div key={comment.id} className="border-l-2 border-primary pl-4">
                  <p className="text-sm font-semibold text-foreground">{comment.userName}</p>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
