import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link, 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar,
  Badge
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ThemeSwitcher } from "./theme-switcher";
import { useVoting } from "../context/voting-context";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useVoting();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar maxWidth="xl" className="border-b border-divider">
        <NavbarBrand>
          <RouteLink to="/" className="flex items-center gap-2">
            <Icon icon="lucide:vote" className="text-primary text-2xl" />
            <p className="font-bold text-inherit">BlockVote</p>
          </RouteLink>
        </NavbarBrand>
        
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link as={RouteLink} to="/" color="foreground">
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link as={RouteLink} to="/profile" color="foreground">
              My Votes
            </Link>
          </NavbarItem>
        </NavbarContent>
        
        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex">
            <ThemeSwitcher />
          </NavbarItem>
          
          <NavbarItem>
            <Badge content={3} color="danger">
              <Button 
                isIconOnly 
                variant="light" 
                aria-label="Notifications"
              >
                <Icon icon="lucide:bell" className="text-lg" />
              </Button>
            </Badge>
          </NavbarItem>
          
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user.name}
                size="sm"
                src={`https://img.heroui.chat/image/avatar?w=200&h=200&u=${user.id}`}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:settings" />
                  <span>Settings</span>
                </div>
              </DropdownItem>
              <DropdownItem key="profile_page" as={RouteLink} to="/profile">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:user" />
                  <span>Profile</span>
                </div>
              </DropdownItem>
              <DropdownItem key="help_and_feedback">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:help-circle" />
                  <span>Help & Feedback</span>
                </div>
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:log-out" />
                  <span>Log Out</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      
      <footer className="py-6 px-4 border-t border-divider">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:vote" className="text-primary text-xl" />
              <p className="font-semibold">BlockVote</p>
              <span className="text-default-500 text-sm">© {new Date().getFullYear()}</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" color="foreground" size="sm">Privacy</Link>
              <Link href="#" color="foreground" size="sm">Terms</Link>
              <Link href="#" color="foreground" size="sm">Contact</Link>
              <Link href="#" color="foreground" size="sm">About</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};