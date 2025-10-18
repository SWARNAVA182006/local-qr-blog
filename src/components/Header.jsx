import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBlog } from '@/contexts/BlogContext';
import { Home, User, Bookmark, LogOut, PenSquare } from 'lucide-react';

const Header = () => {
  const { currentUser, logout } = useBlog();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground">
            BlogHub
          </Link>
          
          {currentUser ? (
            <nav className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="ghost" size="sm">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </Link>
              <Link to="/saved">
                <Button variant="ghost" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Saved
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
