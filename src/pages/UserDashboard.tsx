import { useState } from "react";
// ...existing code...
// Error state for API failures
// Must be declared inside the component function
// Error state for API failures
// (moved after imports)
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Settings,
  LogOut,
  Mail,
  Phone,
  Calendar,
  Building,
  DollarSign,
  FileText,
  Star,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  Users,
  Target,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "@/App";
import { projectService, serviceRequestService, messageService, notificationService } from "@/lib/services";
import { useSharedDataStore, dashboardCommunication } from "@/lib/sharedDataService";

const UserDashboard = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newServiceRequestOpen, setNewServiceRequestOpen] = useState(false);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  
  // Action dialog states
  const [projectAction, setProjectAction] = useState({ open: false, type: '', project: null });
  const [serviceRequestAction, setServiceRequestAction] = useState({ open: false, type: '', request: null });
  const [messageAction, setMessageAction] = useState({ open: false, type: '', message: null });
  const [newProjectAction, setNewProjectAction] = useState({ open: false, type: '', project: null });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);

  // Shared data store for communication with AdminDashboard
  const { 
    currentUser,
    userProjects,
    userServiceRequests,
    userMessages,
    systemUpdates,
    updateUserProjects,
    updateUserServiceRequests,
    updateUserMessages
  } = useSharedDataStore();

  // Ensure user object has 'id' property for type safety
  type UserWithId = { id: string; email: string; role: string; profilePic?: string };
  const typedUser = user as UserWithId | null;

  // Set up communication with AdminDashboard
  useEffect(() => {
    // Notify admin when user performs actions
    const notifyAdmin = (actionType: string, data: any) => {
      dashboardCommunication.notifyAdminOfUserAction(typedUser?.id || 'unknown', actionType, data);
    };

    // Listen for system updates from AdminDashboard
    const unsubscribeSystemUpdate = dashboardCommunication.subscribe('system-updated', (data) => {
      console.log('User received system update:', data);
      // You can show these updates in the user dashboard
    });

    // Listen for user updates from AdminDashboard
    const unsubscribeUserUpdate = dashboardCommunication.subscribe('user-updated', (data) => {
      console.log('User received update:', data);
      // Update local state if needed
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeSystemUpdate();
      unsubscribeUserUpdate();
    };
  }, [typedUser?.id]);

  // Notifications helpers
  const loadNotifications = () => {
    notificationService.getNotifications().then(res => {
      console.log('Notifications response:', res);
      if (res.success) {
        setNotificationsList(res.data || []);
        console.log('Notifications loaded:', res.data);
      } else {
        console.error('Failed to load notifications:', res.error);
      }
    }).catch((error) => {
      console.error('Error loading notifications:', error);
    });
    notificationService.getUnreadCount().then(res => {
      console.log('Unread count response:', res);
      if (res.success && res.data) setUnreadCount(res.data.count);
    }).catch((error) => {
      console.error('Error loading unread count:', error);
    });
  };
  const markNotificationAsRead = (id: string) => {
    notificationService.markAsRead(id).then(() => loadNotifications());
  };
  const markAllNotificationsAsRead = () => {
    notificationService.markAllAsRead().then(() => loadNotifications());
  };

  // User profile state
  const [userData, setUserData] = useState<any>(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  
  // Initialize profile image URL from user context if available
  useEffect(() => {
    console.log('Profile picture useEffect - user:', user);
    const userWithProfile = user as any;
    if (user?.profilePic || userWithProfile?.profile_picture) {
      const picUrl = user.profilePic || userWithProfile.profile_picture;
      const fullUrl = picUrl ? (picUrl.startsWith('http') ? picUrl : `http://localhost:8000/${picUrl.replace(/^\//, '')}`) : "";
      console.log('Setting profile image from user context:', fullUrl);
      setProfileImageUrl(fullUrl);
    }
  }, [user]);

  // Also update profile image when userData changes
  useEffect(() => {
    console.log('Profile picture useEffect - userData:', userData);
    if (userData && userData.profile_picture) {
      const picUrl = userData.profile_picture;
      const fullUrl = picUrl ? (picUrl.startsWith('http') ? picUrl : `http://localhost:8000/${picUrl.replace(/^\//, '')}`) : "";
      console.log('Setting profile image from userData:', fullUrl);
      setProfileImageUrl(fullUrl);
    }
  }, [userData]);
  const [userLoading, setUserLoading] = useState(true);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [userProjectRequests, setUserProjectRequests] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Service requests state
  const [serviceRequests, setServiceRequests] = useState([]);
  const [serviceRequestsLoading, setServiceRequestsLoading] = useState(true);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  
  // Progress updates state
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [progressUpdatesLoading, setProgressUpdatesLoading] = useState(true);
  
  // Ref to track if data has been loaded to prevent multiple calls
  const dataLoadedRef = useRef(false);

  // Users state for helper functions
  const [users, setUsers] = useState<any[]>([]);

  // Helper function to get user name by ID or email
  const getUserName = (userId: any, userEmail: any, fallbackName: any) => {
    if (fallbackName && fallbackName !== 'Unknown' && fallbackName !== 'Unknown Client' && fallbackName !== 'Unknown User') {
      return fallbackName;
    }
    
    if (userId !== undefined && userId !== null) {
      const foundUser = users.find(u => String(u.id) === String(userId));
      if (foundUser) return foundUser.name;
    }
    
    if (userEmail && userEmail !== 'No email') {
      const foundUser = users.find(u => u.email === userEmail);
      if (foundUser) return foundUser.name;
    }
    
    if (userId !== undefined && userId !== null) return String(userId);
    return 'Unknown User';
  };

  // Helper function to get user email by ID or name
  const getUserEmail = (userId: any, userName: any, fallbackEmail: any) => {
    if (fallbackEmail && fallbackEmail !== 'No email') {
      return fallbackEmail;
    }
    
    if (userId !== undefined && userId !== null) {
      const foundUser = users.find(u => String(u.id) === String(userId));
      if (foundUser) return foundUser.email;
    }
    
    if (userName && userName !== 'Unknown User') {
      const foundUser = users.find(u => u.name === userName);
      if (foundUser) return foundUser.email;
    }
    
    return 'No email';
  };
  // Fetch data from backend
  useEffect(() => {
    // Only run if we have user identity and haven't loaded data yet
    const currentUserId = (userData?.id ?? typedUser?.id) ? String(userData?.id ?? typedUser?.id) : undefined;
    const currentEmail = userData?.email ?? user?.email;
    const hasIdentity = Boolean(currentUserId || currentEmail);
    
    if (!hasIdentity) {
      // Wait until we know who the user is
      setProjectsLoading(false);
      setServiceRequestsLoading(false);
      setMessagesLoading(false);
      setProgressUpdatesLoading(false);
      setUserLoading(false);
      return;
    }

    // Prevent multiple calls by checking if data has already been loaded
    if (dataLoadedRef.current) {
      return;
    }

    setProjectsLoading(true);
    setServiceRequestsLoading(true);
    setMessagesLoading(true);
    setProgressUpdatesLoading(true);
    setUserLoading(true);
    setError(null);

    // Fetch user's own projects only
    projectService.getProjects().then(res => {
      if (res.success) {
        // Filter projects to only show current user's projects
        const userProjects = (res.data || []).filter((project: any) => {
          const pid = project.clientId ?? project.client_id;
          const pEmail = project.clientEmail ?? project.client_email;
          return (currentUserId && String(pid) === currentUserId) || (currentEmail && pEmail === currentEmail);
        });
        setProjects(userProjects);
        console.log('User projects loaded:', userProjects);
      } else {
        setError(res.error || 'Failed to load projects');
      }
      setProjectsLoading(false);
    }).catch(() => {
      setError('Failed to load projects');
      setProjectsLoading(false);
    });

    // Notifications (requires auth)
    loadNotifications();

    // Load users for helper functions
    import("@/lib/api").then(({ apiClient }) => {
      apiClient.get('/users').then(res => {
        if (Array.isArray(res)) {
          setUsers(res || []);
        }
      }).catch(() => {
        // Ignore errors for users loading
      });
    });

    // Fetch user's project requests (submitted by user)
    import("@/lib/api").then(({ apiClient }) => {
      apiClient.get('/userprojects').then(res => {
        const raw: any = res as any;
        const arr = Array.isArray(raw) ? raw : (raw?.data || []);
        const onlyMine = arr.filter((p: any) => {
          const pid = p.clientId ?? p.client_id;
          const pEmail = p.clientEmail ?? p.client_email;
          return (currentUserId && String(pid) === currentUserId) || (currentEmail && pEmail === currentEmail);
        });
        setUserProjectRequests(onlyMine);
        console.log('User project requests loaded:', onlyMine);
      }).catch(() => {
        console.error('Failed to load user project requests');
        setUserProjectRequests([]);
      });
    });

    // Fetch user's own service requests only
    serviceRequestService.getServiceRequests().then(res => {
      if (res.success) {
        // Filter service requests to only show current user's requests
        const userServiceRequests = (res.data || []).filter((request: any) => {
          const rid = request.clientId ?? request.user_id;
          const rEmail = request.clientEmail ?? request.client_email;
          return (currentUserId && String(rid) === currentUserId) || (currentEmail && rEmail === currentEmail);
        });
        setServiceRequests(userServiceRequests);
        console.log('User service requests loaded:', userServiceRequests);
      } else {
        setError(res.error || 'Failed to load service requests');
      }
      setServiceRequestsLoading(false);
    }).catch(() => {
      setError('Failed to load service requests');
      setServiceRequestsLoading(false);
    });

    // Fetch user's own messages only
    messageService.getMessages && messageService.getMessages().then(res => {
      if (res.success) {
        // Filter messages to only show current user's messages (sent or received)
        const userMessages = (res.data || []).filter((message: any) => {
          const fromId = message.fromId ?? message.sender_id;
          const toId = message.toId ?? message.receiver_id;
          const fromEmail = message.fromEmail ?? message.from;
          const toEmail = message.toEmail ?? message.to;
          return (
            (currentUserId && (String(fromId) === currentUserId || String(toId) === currentUserId)) ||
            (currentEmail && (fromEmail === currentEmail || toEmail === currentEmail))
          );
        });
        setMessages(userMessages);
        console.log('User messages loaded:', userMessages);
      } else {
        setError(res.error || 'Failed to load messages');
      }
      setMessagesLoading(false);
    }).catch(() => {
      setError('Failed to load messages');
      setMessagesLoading(false);
    });

    // Fetch progress updates for current user only
    const fetchProgressUpdates = async () => {
      try {
        console.log('Starting to fetch progress updates...');
        
        const { apiClient } = await import("@/lib/api");
        const res = await apiClient.get('/progress-updates');
        console.log('Progress updates raw response:', res);
        const arr = Array.isArray(res) ? res : [];
        console.log('Progress updates array:', arr);
        
        // Filter progress updates for current user only
        const currentUserId = (userData?.id ?? typedUser?.id) ? String(userData?.id ?? typedUser?.id) : undefined;
        const currentEmail = userData?.email ?? user?.email;
        
        const userProgressUpdates = arr.filter((update: any) => {
          const updateClientId = update.client_id || update.clientId;
          const updateClientEmail = update.client_email || update.clientEmail;
          const updateClientName = update.client_name || update.clientName;
          
          // Match by user ID, email, or name
          return (currentUserId && String(updateClientId) === currentUserId) ||
                 (currentEmail && updateClientEmail === currentEmail) ||
                 (currentEmail && updateClientName === currentEmail);
        });
        
        setProgressUpdates(userProgressUpdates);
        console.log('Progress updates loaded (filtered for user):', userProgressUpdates);
        console.log('Setting loading to false, progressUpdates length:', userProgressUpdates.length);
        
        // Set loading state to false
        setProgressUpdatesLoading(false);
        console.log('Loading state set to false');
        
      } catch (error) {
        console.error('Failed to load progress updates:', error);
        setProgressUpdatesLoading(false);
        setError('Failed to load progress updates');
      }
    };
    
    fetchProgressUpdates();

    // Fetch user profile even if context is empty but token exists
    const hasToken = (() => { try { return !!localStorage.getItem('authToken'); } catch { return false; } })();
    if (user || hasToken) {
      import("@/lib/services").then(({ userService }) => {
        userService.getProfile().then(res => {
          if (res.success) {
            // Handle case where res.data might be an array
            const profileData = Array.isArray(res.data) ? res.data[0] : res.data;
            setUserData(profileData);
            const profilePicUrl = profileData.profilePic || profileData.profile_picture || "";
            // Ensure the URL is properly formatted
            const fullUrl = profilePicUrl ? (profilePicUrl.startsWith('http') ? profilePicUrl : `http://localhost:8000/${profilePicUrl.replace(/^\//, '')}`) : "";
            setProfileImageUrl(fullUrl);
            console.log('User profile loaded:', profileData);
            // Sync to context/localStorage for global use
            try {
              const merged = { ...(user || {}), ...profileData } as any;
              localStorage.setItem('authUser', JSON.stringify(merged));
            } catch {}
          } else {
            console.error('Failed to load user profile:', res.error);
            // Fallback to user context data
            setUserData({
              name: user.name || user.email || 'User',
              email: user.email || '',
              phone: user.phone || '',
              company: user.company || '',
              profilePic: user.profilePic || ''
            });
          }
          setUserLoading(false);
        }).catch((error) => {
          console.error('Error loading user profile:', error);
          // Fallback to user context data
          setUserData({
            name: user.name || user.email || 'User',
            email: user.email || '',
            phone: user.phone || '',
            company: user.company || '',
            profilePic: user.profilePic || ''
          });
          setUserLoading(false);
        });
      });
    } else {
      setUserLoading(false);
    }
    
    // Mark data as loaded to prevent multiple calls
    dataLoadedRef.current = true;
  }, [user, userData]);

  // Sample feedback data
  const feedback = [
    {
      id: 1,
      projectTitle: "E-commerce Website",
      rating: 5,
      comment: "Excellent work! The team delivered exactly what we needed.",
      submittedDate: "2024-01-15"
    }
  ];

  // Sample recent activities
  // Generate recent activities from real data
  const recentActivities = [
    ...projects.slice(0, 2).map((project, index) => ({
      id: `project-${project.id}`,
      type: "project",
      message: `Project '${project.title}' status: ${project.status}`,
      timestamp: project.updatedAt || project.createdAt || "Recently"
    })),
    ...serviceRequests.slice(0, 2).map((request, index) => ({
      id: `request-${request.id}`,
      type: "request", 
      message: `Service request: ${request.title} (${request.status})`,
      timestamp: request.createdAt || "Recently"
    })),
    ...messages.slice(0, 2).map((message, index) => ({
      id: `message-${message.id}`,
      type: "message",
      message: `Message: ${message.subject}`,
      timestamp: message.timestamp || message.createdAt || "Recently"
    }))
  ].slice(0, 4); // Limit to 4 most recent activities

  // State for profile edit
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });

  useEffect(() => {
    if (userData) {
      setEditProfile({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        company: userData.company || ""
      });
    }
  }, [userData]);

  // State for password change
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // State for new service request
  const [newServiceRequest, setNewServiceRequest] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
    projectRelated: "",
    urgency: "",
    expectedResolution: "",
    additionalNotes: "",
    feedback: {
      rating: 5,
      comment: "",
      satisfaction: "",
      improvement: ""
    }
  });

  // State for new message
  const [newMessage, setNewMessage] = useState({
    subject: "",
    message: "",
    recipient: "",
    priority: "Normal"
  });

  // State for feedback
  const [newFeedback, setNewFeedback] = useState({
    projectTitle: "",
    rating: 5,
    comment: ""
  });

  // State for new project submission
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    projectType: "",
    budget: "",
    timeline: "",
    requirements: "",
    features: "",
    targetAudience: "",
    additionalNotes: "",
    submittedDate: new Date().toISOString().split('T')[0]
  });

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editProfile.name);
      formData.append('email', editProfile.email);
      formData.append('phone', editProfile.phone);
      formData.append('company', editProfile.company);
      
      // Add profile picture if changed
      if (profileImageFile) {
        formData.append('profile_picture', profileImageFile);
      }
      
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Profile updated:', result);
        setUserData(result.data);
        const newUrl = result.data.profile_picture || result.data.profilePic || "";
        // Ensure the URL is properly formatted
        const fullUrl = newUrl ? (newUrl.startsWith('http') ? newUrl : `http://localhost:8000/${newUrl.replace(/^\//, '')}`) : "";
        setProfileImageUrl(fullUrl);
        // persist to context/localStorage
        try {
          const updated: any = { ...(user || {}), ...result.data };
          localStorage.setItem('authUser', JSON.stringify(updated));
          setUser(updated);
        } catch {}
        setEditProfileOpen(false);
        alert("Profile updated successfully!");
      } else {
        console.error('Failed to update profile');
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          current_password: passwordChange.currentPassword,
          new_password: passwordChange.newPassword,
          new_password_confirmation: passwordChange.confirmPassword
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Password changed:', result);
        setPasswordChange({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setChangePasswordOpen(false);
        alert("Password changed successfully!");
      } else {
        const errorData = await response.json();
        console.error('Failed to change password:', errorData);
        alert(errorData.message || "Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert("Error changing password. Please try again.");
    }
  };

  const handleSubmitServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const serviceRequestData = {
        title: newServiceRequest.title,
        description: newServiceRequest.description,
        priority: newServiceRequest.priority,
        category: newServiceRequest.category,
        projectRelated: newServiceRequest.projectRelated,
        urgency: newServiceRequest.urgency,
        expectedResolution: newServiceRequest.expectedResolution,
        additionalNotes: newServiceRequest.additionalNotes,
        feedback: newServiceRequest.feedback
      };

      console.log('Sending service request:', serviceRequestData);
      console.log('Auth token:', localStorage.getItem('authToken'));

      const response = await fetch('http://localhost:8000/api/user_service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(serviceRequestData),
      });

      console.log('Service request response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Service request submitted successfully:', result);

        // Optimistically add to Service Requests and refresh overview
        const created = result.data || result;
        const normalized = {
          id: String(created.id ?? Date.now()),
          title: created.title ?? newServiceRequest.title,
          description: created.description ?? newServiceRequest.description,
          type: created.type ?? created.category ?? newServiceRequest.category ?? 'support',
          priority: created.priority ?? newServiceRequest.priority,
          status: created.status ?? 'Pending',
          clientId: String(created.user_id ?? (user as any)?.id ?? ''),
          clientName: created.user_name ?? userData?.name ?? '',
          createdAt: created.created_at ?? new Date().toISOString(),
          updatedAt: created.updated_at ?? new Date().toISOString(),
        } as any;
        setServiceRequests(prev => [normalized, ...prev]);

        // Notify admin dashboard
        dashboardCommunication.notifyAdminOfServiceRequestAction(
          normalized.id,
          'new-service-request',
          {
            title: normalized.title,
            priority: normalized.priority,
            category: normalized.type,
            urgency: newServiceRequest.urgency,
            submittedDate: new Date().toISOString().split('T')[0]
          }
        );

        setNewServiceRequest({
          title: "",
          description: "",
          priority: "",
          category: "",
          projectRelated: "",
          urgency: "",
          expectedResolution: "",
          additionalNotes: "",
          feedback: {
            rating: 5,
            comment: "",
            satisfaction: "",
            improvement: ""
          }
        });
        setNewServiceRequestOpen(false);
        alert("Service request and feedback submitted successfully! Our team will review your request and get back to you within 24-48 hours.");
      } else {
        console.error('Failed to submit service request');
        alert("Failed to submit service request. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
      alert("Error submitting service request. Please try again.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();


    try {

      const messageData = {
        recipient_name: 'Admin', // Must match backend validation
        subject: newMessage.subject,
        content: newMessage.message,
      };

      console.log('Sending message:', messageData);
      const result = await messageService.createMessage(messageData);
      if (result.success && result.data) {
        const created = result.data;
        setMessages(prev => [created, ...prev]);

        // Notify admin dashboard of new message
        dashboardCommunication.notifyAdminOfUserAction(
          typedUser?.id || 'unknown',
          'new-message',
          {
            to: created.toName ?? 'Admin',
            subject: created.subject,
            content: created.content,
          }
        );

        setNewMessage({
          subject: "",
          message: "",
          recipient: "",
          priority: "Normal"
        });
        setNewMessageOpen(false);
        alert("Message sent successfully! Our team will respond within 24 hours.");
      } else {
        console.error('Failed to send message:', result.error);
        alert(`Failed to send message: ${result.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert("Error sending message. Please check your connection and try again.");
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New feedback:', newFeedback);
    setNewFeedback({
      projectTitle: "",
      rating: 5,
      comment: ""
    });
    setFeedbackOpen(false);
    alert("Feedback submitted successfully!");
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        title: newProject.title,
        projectType: newProject.projectType,
        description: newProject.description,
        budget: newProject.budget,
        timeline: newProject.timeline,
        requirements: newProject.requirements,
        features: newProject.features,
        targetAudience: newProject.targetAudience,
        additionalNotes: newProject.additionalNotes
      };

      const response = await fetch('http://localhost:8000/api/userprojects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Project submitted successfully:', result);
        
        // Optimistically add to New Project list and Overview counts
        const created = result.data || result;
        const normalized = {
          id: String(created.id ?? Date.now()),
          title: created.project_title ?? newProject.title,
          description: created.description ?? newProject.description,
          type: created.type ?? newProject.projectType,
          status: created.status ?? 'Pending Review',
          timeline: created.timeline ?? newProject.timeline,
          submittedDate: created.date_received ?? new Date().toISOString().split('T')[0],
          clientName: created.client_name ?? userData?.name ?? '',
          clientEmail: created.client_email ?? userData?.email ?? '',
          clientId: (user as any)?.id,
          progress: 10,
          priority: 'Medium',
          budget: 0,
          spent: 0,
          startDate: created.date_received ?? new Date().toISOString(),
          endDate: created.endDate ?? new Date().toISOString(),
        } as any;
        setUserProjectRequests(prev => [normalized, ...prev]);
        setProjects(prev => [normalized, ...prev]);

        // Notify admin dashboard of new project submission
        dashboardCommunication.notifyAdminOfProjectAction(
          normalized.id,
          'new-project',
          {
            title: normalized.title,
            projectType: normalized.type,
            timeline: normalized.timeline,
            submittedDate: normalized.submittedDate
          }
        );
        
        setNewProject({
          title: "",
          description: "",
          projectType: "",
          budget: "",
          timeline: "",
          requirements: "",
          features: "",
          targetAudience: "",
          additionalNotes: "",
          submittedDate: new Date().toISOString().split('T')[0]
        });
        setAddProjectOpen(false);
        alert("Project submitted successfully! Our team will review your request and get back to you within 24-48 hours.");
      } else {
        console.error('Failed to submit project');
        alert("Failed to submit project. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert("Error submitting project. Please try again.");
    }
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      // Update the profile image URL state
      setProfileImageUrl(imageUrl);
      console.log('Profile image changed:', file.name);
      alert("Profile image updated successfully!");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "In Progress": return "secondary";
      case "Planning": return "outline";
      case "Completed": return "default";
      case "Pending": return "outline";
      default: return "outline";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project": return <FileText className="h-4 w-4" />;
      case "request": return <AlertCircle className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Always render shell immediately; show skeletons where needed instead of blocking whole page
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img src="https://www.hawisoftware.com/wp-content/uploads/2021/08/logohawi.png" alt="Hawi Software Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-lg">Hawi Software</span>
              </Link>
              <Badge variant="secondary">User Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationOpen(true)}>
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              </Button>
              <Avatar onClick={() => setEditProfileOpen(true)} className="cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={profileImageUrl} />
                <AvatarFallback>{userData && userData.name ? userData.name.split(' ').map(n => n[0]).join('') : "U"}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.name || user?.name || user?.email || "User"}</h1>
          <p className="text-muted-foreground">Manage your projects and communicate with our team.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 lg:w-auto lg:grid-cols-6 gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="project-progress">Project Progress</TabsTrigger>
            <TabsTrigger value="new-project">New Project</TabsTrigger>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="communication">Message</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-card hover-scale animate-slide-in-up">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                      <p className="text-3xl font-bold">{projects.length}</p>
                      <p className="text-sm text-green-600">Active projects</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-scale animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Service Requests</p>
                      <p className="text-3xl font-bold">{serviceRequests.length}</p>
                      <p className="text-sm text-blue-600">Active requests</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-scale animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                      <p className="text-3xl font-bold">{messages.filter(m => !m.read).length}</p>
                      <p className="text-sm text-purple-600">New messages</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Recent Activities */}
            <Card className="glass-card hover-scale animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                  </CardTitle>
                </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="text-primary">
                        {getActivityIcon(activity.type)}
                        </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                </CardContent>
              </Card>
          </TabsContent>

          {/* Project Progress Tab */}
          <TabsContent value="project-progress" className="space-y-6">
            <div className="flex items-center justify-between">
                      <div>
                <h2 className="text-2xl font-bold">Track My Project Progress & Deadlines</h2>
                <p className="text-muted-foreground">Monitor your active projects and upcoming milestones</p>
                      </div>
                    </div>
                    
            <Card className="glass-card hover-scale">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Next Deadline</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressUpdatesLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span>Loading progress updates...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : progressUpdates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No progress updates available
                        </TableCell>
                      </TableRow>
                    ) : (
                      progressUpdates.map((update) => (
                        <TableRow key={update.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                                <AvatarFallback>{update.client?.name ? update.client.name.split(' ').map(n => n[0]).join('') : "C"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{update.client?.name || "Client"}</div>
                                <div className="text-sm text-muted-foreground">Client</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{update.project}</div>
                              <div className="text-sm text-muted-foreground">Project</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={update.progress} className="w-16" />
                              <span className="text-sm">{update.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(update.current_status)}>{update.current_status}</Badge>
                          </TableCell>
                          <TableCell>{update.last_update || "N/A"}</TableCell>
                          <TableCell>{update.next_deadline || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => setProjectAction({ open: true, type: 'view', project: update })}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                  </CardContent>
                </Card>
          </TabsContent>

          {/* New Project Request Tab */}
          <TabsContent value="new-project" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Submit New Project Request</h2>
                <p className="text-muted-foreground">Submit a new project proposal for our team to review</p>
              </div>
              <Button onClick={() => setAddProjectOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Submit New Project
              </Button>
            </div>
            
            <Card className="glass-card hover-scale">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userProjectRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No project requests submitted yet. Click "Submit New Project" to get started.
                        </TableCell>
                      </TableRow>
                    ) : userProjectRequests.map((project) => (
                      <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.title || project.project_title}</div>
                            <div className="text-sm text-muted-foreground">{project.description || 'Project description'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{project.type || project.projectType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={project.status === "Approved" ? "default" : project.status === "Under Review" ? "secondary" : project.status === "In Progress" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.timeline}</TableCell>
                        <TableCell>{project.submittedDate || project.date_received || project.created_at || project.createdAt || 'Unknown date'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setNewProjectAction({ open: true, type: 'view', project })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setNewProjectAction({ open: true, type: 'edit', project })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setNewProjectAction({ open: true, type: 'delete', project })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
              <h2 className="text-2xl font-bold">Service Requests</h2>
                <p className="text-muted-foreground">Submit and track your service requests</p>
              </div>
              <Button onClick={() => setNewServiceRequestOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
            
            <Card className="glass-card hover-scale">
              <CardContent className="p-0">
                <Table>
                                      <TableHeader>
                      <TableRow>
                        <TableHead>Request</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Feedback & Satisfaction</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {serviceRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.title}</div>
                            <div className="text-sm text-muted-foreground">{request.description}</div>
                        </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(request.priority)}>{request.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(request.status)}>{request.status}</Badge>
                        </TableCell>
                        <TableCell>{request.submittedDate || request.created_at || request.createdAt || request.date_received || 'Unknown date'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className={`h-3 w-3 ${star <= (request.feedback?.rating ?? 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">({(request.feedback?.rating ?? 0)}/5)</span>
                            </div>
                            <Badge variant={(request.feedback?.rating ?? 0) >= 4 ? "default" : (request.feedback?.rating ?? 0) >= 3 ? "secondary" : "destructive"} className="text-xs">
                              {request.feedback?.satisfaction ?? 'N/A'}
                            </Badge>
                            <div className="text-xs text-muted-foreground max-w-[150px] truncate" title={request.feedback?.comment ?? ''}>
                              "{request.feedback?.comment ?? ''}"
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setServiceRequestAction({ open: true, type: 'view', request })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setServiceRequestAction({ open: true, type: 'edit', request })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setServiceRequestAction({ open: true, type: 'delete', request })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                  </CardContent>
                </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Communication Center</h2>
                <p className="text-muted-foreground">Connect with our development team and track all communications</p>
                </div>
              <Button onClick={() => setNewMessageOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Send className="h-4 w-4 mr-2" />
                Send New Message
              </Button>
            </div>



            <Card className="glass-card hover-scale">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No messages yet. Click "Send New Message" to start a conversation.
                        </TableCell>
                      </TableRow>
                    ) : messages.map((msg) => (
                      <TableRow key={msg.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">{getUserName(msg.toId, msg.toEmail, msg.to || 'Admin').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{getUserName(msg.toId, msg.toEmail, msg.to || 'Admin')}</div>
                              <div className="text-sm text-muted-foreground">{getUserEmail(msg.toId, msg.to || 'Admin', msg.toEmail)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{msg.subject}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm text-muted-foreground">{msg.content || msg.message || 'No content'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{msg.timestamp || msg.created_at || msg.createdAt || msg.time || 'Unknown time'}</div>
                        </TableCell>
                        <TableCell>
                          {!msg.read ? (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">New</Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-200">Read</Badge>
                          )}
                        </TableCell>
                                                <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setMessageAction({ open: true, type: 'view', message: msg })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setMessageAction({ open: true, type: 'edit', message: msg })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setMessageAction({ open: true, type: 'delete', message: msg })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Profile Management</h2>
              <p className="text-muted-foreground">Manage your account settings and personal information</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information Card */}
              <Card className="glass-card hover-scale lg:col-span-2">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
              </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                                            <Avatar 
                        className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => document.getElementById('profile-image-input')?.click()}
                      >
                        <AvatarImage src={profileImageUrl} />
                        <AvatarFallback className="text-lg">{userData && userData.name ? userData.name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
                  </Avatar>
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{userData && userData.name ? userData.name : 'User'}</h3>
                      <p className="text-sm text-muted-foreground">{userData && userData.role ? userData.role : ''}</p>
                   </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{userData ? userData.email : ""}</p>
                       </div>
                       </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{userData ? userData.phone : ""}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Building className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Company</p>
                        <p className="text-sm text-muted-foreground">{userData ? userData.company : ""}</p>
                      </div>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings Card */}
              <Card className="glass-card hover-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-12" onClick={() => setEditProfileOpen(true)}>
                    <Edit className="h-4 w-4 mr-3" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12" onClick={() => setChangePasswordOpen(true)}>
                    <Settings className="h-4 w-4 mr-3" />
                    Change Password
                  </Button>

              </CardContent>
            </Card>
            </div>


          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Edit Profile</DialogTitle>
            <DialogDescription className="text-center">Update your personal information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editProfile.name}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editProfile.email}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editProfile.phone}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={editProfile.company}
                  onChange={(e) => setEditProfile(prev => ({ ...prev, company: e.target.value }))}
                  className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setEditProfileOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Update Profile
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Change Password</DialogTitle>
            <DialogDescription className="text-center">Update your account password</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordChange.currentPassword}
                  onChange={(e) => setPasswordChange(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordChange.newPassword}
                  onChange={(e) => setPasswordChange(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordChange.confirmPassword}
                  onChange={(e) => setPasswordChange(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Service Request Modal */}
      <Dialog open={newServiceRequestOpen} onOpenChange={setNewServiceRequestOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Submit Service Request & Feedback</DialogTitle>
            <DialogDescription className="text-center">Submit your service request and provide feedback to help us improve</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitServiceRequest} className="space-y-6">
            {/* Service Request Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">Service Request Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                  <Label htmlFor="title">Request Title *</Label>
                   <Input
                id="title"
                    placeholder="e.g., Login Issue, Feature Request, Bug Report"
                value={newServiceRequest.title}
                onChange={(e) => setNewServiceRequest(prev => ({ ...prev, title: e.target.value }))}
                     required
                    className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                   />
                 </div>
            <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newServiceRequest.category} onValueChange={(value) => setNewServiceRequest(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="Bug Fix">Bug Fix</SelectItem>
                      <SelectItem value="Feature Request">Feature Request</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Enhancement">Enhancement</SelectItem>
                      <SelectItem value="Performance Issue">Performance Issue</SelectItem>
                      <SelectItem value="Security Concern">Security Concern</SelectItem>
                      <SelectItem value="UI/UX Improvement">UI/UX Improvement</SelectItem>
                      <SelectItem value="Integration Request">Integration Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                   <Textarea
                id="description"
                  placeholder="Please provide a detailed description of your request, including steps to reproduce if it's a bug..."
                value={newServiceRequest.description}
                onChange={(e) => setNewServiceRequest(prev => ({ ...prev, description: e.target.value }))}
                     required
                  className="min-h-[100px] border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                   />
                 </div>
            </div>

            {/* Priority and Urgency */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600 border-b border-green-200 pb-2">Priority & Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <Label htmlFor="priority">Priority Level *</Label>
                <Select value={newServiceRequest.priority} onValueChange={(value) => setNewServiceRequest(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="z-[999999]">
                      <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                 </div>
              <div>
                  <Label htmlFor="urgency">Urgency *</Label>
                  <Select value={newServiceRequest.urgency} onValueChange={(value) => setNewServiceRequest(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent className="z-[999999]">
                      <SelectItem value="Immediate">Immediate (Same day)</SelectItem>
                      <SelectItem value="Urgent">Urgent (1-2 days)</SelectItem>
                      <SelectItem value="Normal">Normal (3-5 days)</SelectItem>
                      <SelectItem value="Low">Low (1-2 weeks)</SelectItem>
                  </SelectContent>
                </Select>
               </div>
                <div>
                  <Label htmlFor="expectedResolution">Expected Resolution</Label>
                  <Select value={newServiceRequest.expectedResolution} onValueChange={(value) => setNewServiceRequest(prev => ({ ...prev, expectedResolution: value }))}>
                    <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="Same day">Same day</SelectItem>
                      <SelectItem value="1-2 days">1-2 days</SelectItem>
                      <SelectItem value="1 week">1 week</SelectItem>
                      <SelectItem value="2 weeks">2 weeks</SelectItem>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
             </div>
              </div>
            </div>

            {/* Project Related Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 border-b border-purple-200 pb-2">Project Information</h3>
              <div>
                <Label htmlFor="projectRelated">Related Project (if applicable)</Label>
                <Select value={newServiceRequest.projectRelated} onValueChange={(value) => setNewServiceRequest(prev => ({ ...prev, projectRelated: value }))}>
                  <SelectTrigger className="h-11 border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select related project" />
                  </SelectTrigger>
                  <SelectContent className="z-[999999]">
                    <SelectItem value="None">Not related to any project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.title}>{project.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional information, screenshots, or context that might help us understand your request better..."
                  value={newServiceRequest.additionalNotes}
                  onChange={(e) => setNewServiceRequest(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  className="min-h-[80px] border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Feedback Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-2">Feedback & Satisfaction</h3>
              <div>
                <Label>Overall Experience Rating</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewServiceRequest(prev => ({ 
                        ...prev, 
                        feedback: { ...prev.feedback, rating: star }
                      }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= (newServiceRequest.feedback?.rating ?? 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {(newServiceRequest.feedback?.rating ?? 0)}/5 stars
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="satisfaction">Satisfaction Level</Label>
                <Select value={newServiceRequest.feedback?.satisfaction ?? ''} onValueChange={(value) => setNewServiceRequest(prev => ({ 
                  ...prev, 
                  feedback: { 
                    rating: prev.feedback?.rating ?? 0,
                    comment: prev.feedback?.comment ?? '',
                    satisfaction: value,
                    improvement: prev.feedback?.improvement ?? ''
                  }
                }))}>
                  <SelectTrigger className="h-11 border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200">
                    <SelectValue placeholder="How satisfied are you with our services?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Very Satisfied">Very Satisfied</SelectItem>
                    <SelectItem value="Satisfied">Satisfied</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Dissatisfied">Dissatisfied</SelectItem>
                    <SelectItem value="Very Dissatisfied">Very Dissatisfied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="feedbackComment">Feedback Comments</Label>
                <Textarea
                  id="feedbackComment"
                  placeholder="Please share your thoughts about our services, what we're doing well, and areas for improvement..."
                  value={newServiceRequest.feedback?.comment ?? ''}
                  onChange={(e) => setNewServiceRequest(prev => ({ 
                    ...prev, 
                    feedback: { 
                      rating: prev.feedback?.rating ?? 0,
                      comment: e.target.value,
                      satisfaction: prev.feedback?.satisfaction ?? '',
                      improvement: prev.feedback?.improvement ?? ''
                    }
                  }))}
                  className="min-h-[80px] border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="improvement">Suggestions for Improvement</Label>
                <Textarea
                  id="improvement"
                  placeholder="What could we do better? Any specific suggestions for improving our services?"
                  value={newServiceRequest.feedback?.improvement ?? ''}
                  onChange={(e) => setNewServiceRequest(prev => ({ 
                    ...prev, 
                    feedback: { 
                      rating: prev.feedback?.rating ?? 0,
                      comment: prev.feedback?.comment ?? '',
                      satisfaction: prev.feedback?.satisfaction ?? '',
                      improvement: e.target.value
                    }
                  }))}
                  className="min-h-[80px] border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setNewServiceRequestOpen(false)} className="px-6">
                 Cancel
               </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Submit Request & Feedback
              </Button>
             </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>

      {/* New Message Modal */}
      <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Send New Message</DialogTitle>
            <DialogDescription className="text-center">Connect with our team for any questions or support</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendMessage} className="space-y-6">
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value="Admin"
                disabled
                className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your message"
                value={newMessage.subject}
                onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                required
                className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
                </div>
            <div>
              <Label htmlFor="message">Message</Label>
                   <Textarea
                id="message"
                placeholder="Please provide detailed information about your inquiry, question, or request..."
                value={newMessage.message}
                onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                     required
                className="min-h-[120px] border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                   />
                 </div>
            <DialogFooter className="pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setNewMessageOpen(false)} className="px-6">
                 Cancel
               </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Send Message
              </Button>
             </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>



      {/* New Project Submission Modal */}
      <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Submit New Project Request</DialogTitle>
            <DialogDescription className="text-center">Tell us about your project and we'll provide you with a detailed proposal</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProject} className="space-y-6">
            {/* Project Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., E-commerce Website, Mobile App, CRM System"
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select value={newProject.projectType} onValueChange={(value) => setNewProject(prev => ({ ...prev, projectType: value }))}>
                    <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                      <SelectItem value="Software Development">Software Development</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                      <SelectItem value="Software Consultancy">Software Consultancy</SelectItem>
                      <SelectItem value="Custom Software Solution">Custom Software Solution</SelectItem>
                </SelectContent>
              </Select>
                </div>
                 </div>
            <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your project, including its purpose, goals, and objectives..."
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  required
                  className="min-h-[100px] border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                 </div>
                 </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600 border-b border-green-200 pb-2">Timeline</h3>
            <div>
                <Label htmlFor="timeline">Timeline *</Label>
                <Select value={newProject.timeline} onValueChange={(value) => setNewProject(prev => ({ ...prev, timeline: value }))}>
                  <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2-3 months">2-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                    <SelectItem value="Flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Requirements and Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 border-b border-purple-200 pb-2">Requirements & Features</h3>
              <div>
                <Label htmlFor="requirements">Key Requirements *</Label>
              <Textarea
                  id="requirements"
                  placeholder="List the main requirements and functionality you need in your project..."
                  value={newProject.requirements}
                  onChange={(e) => setNewProject(prev => ({ ...prev, requirements: e.target.value }))}
                required
                  className="min-h-[100px] border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                   />
                 </div>
              <div>
                <Label htmlFor="features">Desired Features</Label>
                <Textarea
                  id="features"
                  placeholder="Describe any specific features, integrations, or technologies you'd like to include..."
                  value={newProject.features}
                  onChange={(e) => setNewProject(prev => ({ ...prev, features: e.target.value }))}
                  className="min-h-[80px] border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Target Audience and Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-2">Additional Information</h3>
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Small businesses, Enterprise clients, End users"
                  value={newProject.targetAudience}
                  onChange={(e) => setNewProject(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="h-11 border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any other information, preferences, or special requirements you'd like us to know..."
                  value={newProject.additionalNotes}
                  onChange={(e) => setNewProject(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  className="min-h-[80px] border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="submittedDate">Submitted Date</Label>
                <Input
                  id="submittedDate"
                  type="date"
                  value={newProject.submittedDate}
                  onChange={(e) => setNewProject(prev => ({ ...prev, submittedDate: e.target.value }))}
                  className="h-11 border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setAddProjectOpen(false)} className="px-6">
                 Cancel
               </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Submit Project Request
              </Button>
             </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>

      {/* Project Action Dialog */}
      <Dialog open={projectAction.open} onOpenChange={(open) => setProjectAction({ ...projectAction, open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {projectAction.type === 'view' ? 'View Project Details' : 
               projectAction.type === 'edit' ? 'Edit Project' : 'Delete Project'}
            </DialogTitle>
            <DialogDescription>
              {projectAction.type === 'view' ? 'Project details overview' : 
               projectAction.type === 'edit' ? 'Update project information' : 'Confirm project deletion'}
            </DialogDescription>
          </DialogHeader>
          
          {projectAction.type === 'view' && projectAction.project && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Project Title</Label>
                  <p className="text-sm">{projectAction.project.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={getStatusColor(projectAction.project.status)}>{projectAction.project.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={projectAction.project.progress} className="w-16" />
                    <span className="text-sm">{projectAction.project.progress}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                  <Badge variant={getPriorityColor(projectAction.project.priority)}>{projectAction.project.priority}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                  <p className="text-sm">{projectAction.project.budget.toLocaleString()} birr</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Spent</Label>
                  <p className="text-sm">{projectAction.project.spent.toLocaleString()} birr</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                  <p className="text-sm">{projectAction.project.startDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                  <p className="text-sm">{projectAction.project.endDate}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm">{projectAction.project.description}</p>
              </div>
            </div>
          )}

          {projectAction.type === 'edit' && projectAction.project && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Project Title</Label>
                <Input 
                  id="edit-title"
                  defaultValue={projectAction.project.title}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description"
                  defaultValue={projectAction.project.description}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={projectAction.project.status}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select defaultValue={projectAction.project.priority}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {projectAction.type === 'delete' && projectAction.project && (
            <div className="space-y-4">
              <p>Are you sure you want to delete the project "{projectAction.project.title}"?</p>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectAction({ open: false, type: '', project: null })}>
              Cancel
            </Button>
            {projectAction.type === 'edit' && (
              <Button onClick={() => {
                console.log('Save project changes');
                setProjectAction({ open: false, type: '', project: null });
              }}>
                Save Changes
              </Button>
            )}
            {projectAction.type === 'delete' && (
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" onClick={async () => {
                try {
                  const { apiClient } = await import("@/lib/api");
                  await apiClient.delete(`/userprojects/${projectAction.project?.id}`);
                  console.log('Project deleted successfully');
                  // Refresh projects list
                  const res = await projectService.getProjects();
                  if (res.success) {
                    const currentUserId = (userData?.id ?? typedUser?.id) ? String(userData?.id ?? typedUser?.id) : undefined;
                    const currentEmail = userData?.email ?? user?.email;
                    const userProjects = (res.data || []).filter((project: any) => {
                      const pid = project.clientId ?? project.client_id;
                      const pEmail = project.clientEmail ?? project.client_email;
                      return (currentUserId && String(pid) === currentUserId) || (currentEmail && pEmail === currentEmail);
                    });
                    setProjects(userProjects);
                  }
                  setProjectAction({ open: false, type: '', project: null });
                  alert('Project deleted successfully!');
                } catch (error) {
                  console.error("Error deleting project:", error);
                  alert("Error deleting project");
                }
              }}>
                Delete Project
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Request Action Dialog */}
      <Dialog open={serviceRequestAction.open} onOpenChange={(open) => setServiceRequestAction({ ...serviceRequestAction, open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {serviceRequestAction.type === 'view' ? 'View Service Request Details' : 
               serviceRequestAction.type === 'edit' ? 'Edit Service Request' : 'Delete Service Request'}
            </DialogTitle>
            <DialogDescription>
              {serviceRequestAction.type === 'view' ? 'Service request details overview' : 
               serviceRequestAction.type === 'edit' ? 'Update service request information' : 'Confirm service request deletion'}
            </DialogDescription>
          </DialogHeader>
          
          {serviceRequestAction.type === 'view' && serviceRequestAction.request && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="text-sm">{serviceRequestAction.request.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                  <Badge variant={getPriorityColor(serviceRequestAction.request.priority)}>{serviceRequestAction.request.priority}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={getStatusColor(serviceRequestAction.request.status)}>{serviceRequestAction.request.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Submitted Date</Label>
                  <p className="text-sm">{serviceRequestAction.request.submittedDate}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm">{serviceRequestAction.request.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Feedback</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= (serviceRequestAction.request?.feedback?.rating ?? 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm">({(serviceRequestAction.request?.feedback?.rating ?? 0)}/5)</span>
                  </div>
                  <Badge variant={(serviceRequestAction.request?.feedback?.rating ?? 0) >= 4 ? "default" : (serviceRequestAction.request?.feedback?.rating ?? 0) >= 3 ? "secondary" : "destructive"}>
                    {serviceRequestAction.request?.feedback?.satisfaction ?? 'N/A'}
                  </Badge>
                  <p className="text-sm">{serviceRequestAction.request?.feedback?.comment ?? ''}</p>
                </div>
              </div>
            </div>
          )}

          {serviceRequestAction.type === 'edit' && serviceRequestAction.request && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-request-title">Title</Label>
                <Input 
                  id="edit-request-title"
                  defaultValue={serviceRequestAction.request.title}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="edit-request-description">Description</Label>
                <Textarea 
                  id="edit-request-description"
                  defaultValue={serviceRequestAction.request.description}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-request-priority">Priority</Label>
                  <Select defaultValue={serviceRequestAction.request.priority}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-request-status">Status</Label>
                  <Select defaultValue={serviceRequestAction.request.status}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {serviceRequestAction.type === 'delete' && serviceRequestAction.request && (
            <div className="space-y-4">
              <p>Are you sure you want to delete the service request "{serviceRequestAction.request.title}"?</p>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setServiceRequestAction({ open: false, type: '', request: null })}>
              Cancel
            </Button>
            {serviceRequestAction.type === 'edit' && (
              <Button onClick={() => {
                console.log('Save service request changes');
                setServiceRequestAction({ open: false, type: '', request: null });
              }}>
                Save Changes
              </Button>
            )}
            {serviceRequestAction.type === 'delete' && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={async () => {
                try {
                  // Call backend to delete service request
                  const response = await fetch(`http://localhost:8000/api/user_service-requests/${serviceRequestAction.request?.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (response.ok) {
                    // Remove from local state
                    setServiceRequests(prev => prev.filter(r => r.id !== serviceRequestAction.request?.id));
                    setServiceRequestAction({ open: false, type: '', request: null });
                    console.log("Service request deleted successfully");
                  } else {
                    console.error("Failed to delete service request");
                    alert("Failed to delete service request");
                  }
                } catch (error) {
                  console.error("Error deleting service request:", error);
                  alert("Error deleting service request");
                }
              }}>
                Delete Request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Action Dialog */}
      <Dialog open={messageAction.open} onOpenChange={(open) => setMessageAction({ ...messageAction, open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {messageAction.type === 'view' ? 'View Message Details' : 
               messageAction.type === 'edit' ? 'Edit Message' : 'Delete Message'}
            </DialogTitle>
            <DialogDescription>
              {messageAction.type === 'view' ? 'Message details overview' : 
               messageAction.type === 'edit' ? 'Update message content' : 'Confirm message deletion'}
            </DialogDescription>
          </DialogHeader>
          
          {messageAction.type === 'view' && messageAction.message && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Recipient</Label>
                  <p className="text-sm">{messageAction.message.to || 'Admin'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={messageAction.message.read ? "default" : "secondary"}>
                    {messageAction.message.read ? 'Read' : 'Unread'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Subject</Label>
                  <p className="text-sm">{messageAction.message.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                  <p className="text-sm">{messageAction.message.timestamp}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Message</Label>
                <p className="text-sm">{messageAction.message.message}</p>
              </div>
            </div>
          )}

          {messageAction.type === 'edit' && messageAction.message && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-message-subject">Subject</Label>
                <Input 
                  id="edit-message-subject"
                  defaultValue={messageAction.message.subject}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="edit-message-content">Message</Label>
                <Textarea 
                  id="edit-message-content"
                  defaultValue={messageAction.message.message}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          {messageAction.type === 'delete' && messageAction.message && (
            <div className="space-y-4">
              <p>Are you sure you want to delete the message "{messageAction.message.subject}"?</p>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageAction({ open: false, type: '', message: null })}>
              Cancel
            </Button>
            {messageAction.type === 'edit' && (
              <Button onClick={() => {
                console.log('Save message changes');
                setMessageAction({ open: false, type: '', message: null });
              }}>
                Save Changes
              </Button>
            )}
            {messageAction.type === 'delete' && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={async () => {
                try {
                  // Call backend to delete message
                  const response = await fetch(`http://localhost:8000/api/usermessages/${messageAction.message?.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (response.ok) {
                    // Remove from local state
                    setMessages(prev => prev.filter(m => m.id !== messageAction.message?.id));
                    setMessageAction({ open: false, type: '', message: null });
                    console.log("Message deleted successfully");
                  } else {
                    console.error("Failed to delete message");
                    alert("Failed to delete message");
                  }
                } catch (error) {
                  console.error("Error deleting message:", error);
                  alert("Error deleting message");
                }
              }}>
                Delete Message
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Project Action Dialog */}
      <Dialog open={newProjectAction.open} onOpenChange={(open) => setNewProjectAction({ ...newProjectAction, open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {newProjectAction.type === 'view' ? 'View Project Request Details' : 
               newProjectAction.type === 'edit' ? 'Edit Project Request' : 'Delete Project Request'}
            </DialogTitle>
            <DialogDescription>
              {newProjectAction.type === 'view' ? 'Project request details overview' : 
               newProjectAction.type === 'edit' ? 'Update project request information' : 'Confirm project request deletion'}
            </DialogDescription>
          </DialogHeader>
          
          {newProjectAction.type === 'view' && newProjectAction.project && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Project Title</Label>
                  <p className="text-sm">{newProjectAction.project.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <Badge variant="outline">{newProjectAction.project.type}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={newProjectAction.project.status === "Approved" ? "default" : newProjectAction.project.status === "Under Review" ? "secondary" : newProjectAction.project.status === "In Progress" ? "default" : "secondary"}>
                    {newProjectAction.project.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Timeline</Label>
                  <p className="text-sm">{newProjectAction.project.timeline}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Submitted Date</Label>
                  <p className="text-sm">{newProjectAction.project.submittedDate}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm">{newProjectAction.project.description}</p>
              </div>
            </div>
          )}

          {newProjectAction.type === 'edit' && newProjectAction.project && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-project-title">Project Title</Label>
                <Input 
                  id="edit-project-title"
                  defaultValue={newProjectAction.project.title}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="edit-project-description">Description</Label>
                <Textarea 
                  id="edit-project-description"
                  defaultValue={newProjectAction.project.description}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-project-type">Type</Label>
                  <Select defaultValue={newProjectAction.project.type}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[999999]">
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                      <SelectItem value="Custom Software">Custom Software</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-project-timeline">Timeline</Label>
                  <Input 
                    id="edit-project-timeline"
                    defaultValue={newProjectAction.project.timeline}
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          )}

          {newProjectAction.type === 'delete' && newProjectAction.project && (
            <div className="space-y-4">
              <p>Are you sure you want to delete the project request "{newProjectAction.project.title}"?</p>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectAction({ open: false, type: '', project: null })}>
              Cancel
            </Button>
            {newProjectAction.type === 'edit' && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => {
                console.log('Save project request changes');
                setNewProjectAction({ open: false, type: '', project: null });
              }}>
                Save Changes
              </Button>
            )}
            {newProjectAction.type === 'delete' && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={async () => {
                try {
                  // Call backend to delete project request
                  const response = await fetch(`http://localhost:8000/api/userprojects/${newProjectAction.project?.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (response.ok) {
                    // Remove from local state
                    setUserProjectRequests(prev => prev.filter(p => p.id !== newProjectAction.project?.id));
                    setNewProjectAction({ open: false, type: '', project: null });
                    console.log("Project request deleted successfully");
                  } else {
                    console.error("Failed to delete project request");
                    alert("Failed to delete project request");
                  }
                } catch (error) {
                  console.error("Error deleting project request:", error);
                  alert("Error deleting project request");
                }
              }}>
                Delete Request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Modal */}
      <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Recent updates and alerts</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notificationsList.length === 0 ? (
              <DialogDescription>No notifications.</DialogDescription>
            ) : notificationsList.map((notification: any) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === "success" ? "bg-green-500" :
                  notification.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(notification.createdAt || notification.created_at).toLocaleString()}</p>
                </div>
                {!notification.isRead && (
                  <Button size="sm" variant="ghost" onClick={() => markNotificationAsRead(String(notification.id))}>Mark read</Button>
                )}
              </div>
            ))}
            {notificationsList.length > 0 && (
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={markAllNotificationsAsRead}>Mark all as read</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;