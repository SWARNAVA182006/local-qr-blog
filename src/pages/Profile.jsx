import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useBlog } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateUser, getUserPosts } = useBlog();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  const userPosts = getUserPosts(currentUser?.id);

  const handleSave = () => {
    updateUser(currentUser.id, { name, email, bio });
    setIsEditing(false);
    toast({
      title: 'Success',
      description: 'Profile updated successfully',
    });
  };

  const qrData = JSON.stringify({
    name: currentUser?.name,
    email: currentUser?.email,
    bio: currentUser?.bio,
    userId: currentUser?.id,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Name
                        </label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Bio
                        </label>
                        <Textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>Save</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-4">
                        <User className="w-12 h-12 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="text-lg font-semibold text-foreground">{currentUser?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-lg font-semibold text-foreground">{currentUser?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bio</p>
                        <p className="text-foreground">{currentUser?.bio || 'No bio yet'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Posts</p>
                        <p className="text-lg font-semibold text-foreground">{userPosts.length}</p>
                      </div>
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Your QR Code</h3>
                  <div className="bg-card p-4 rounded-lg border">
                    <QRCodeSVG value={qrData} size={200} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Scan this QR code to view profile details
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
