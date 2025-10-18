import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useBlog } from '@/contexts/BlogContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { userId } = useParams();
  const { users, getUserPosts, deletePost } = useBlog();
  const { toast } = useToast();
  const navigate = useNavigate();

  const user = users.find(u => u.id === userId);
  const userPosts = getUserPosts(userId);

  const handleEdit = (post) => {
    navigate('/create', { state: { post } });
  };

  const handleDelete = (postId) => {
    deletePost(postId);
    toast({
      title: 'Post deleted',
      description: 'Post has been deleted successfully',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">User not found</p>
        </main>
      </div>
    );
  }

  const qrData = JSON.stringify({
    name: user.name,
    email: user.email,
    bio: user.bio,
    userId: user.id,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{user.name}'s Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-4">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold text-foreground">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-semibold text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="text-foreground">{user.bio || 'No bio yet'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                    <p className="text-lg font-semibold text-foreground">{userPosts.length}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Profile QR Code</h3>
                  <div className="bg-card p-4 rounded-lg border">
                    <QRCodeSVG value={qrData} size={200} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Scan to view profile details
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Posts by {user.name}</h2>
            {userPosts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No posts yet</p>
            ) : (
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
