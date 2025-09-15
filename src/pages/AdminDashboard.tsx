import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Bell,
  LogOut,
  Settings,
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  X,
  Info,
  Activity,
  Star,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useContext } from "react";
import { UserContext } from "@/App";

const AdminDashboard = () => {
  // State for real users and team members
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  // Helper function to get user name by ID or email
  const getUserName = (userId: any, userEmail: any, fallbackName: any) => {
    if (fallbackName && fallbackName !== 'Unknown' && fallbackName !== 'Unknown Client' && fallbackName !== 'Unknown User') {
      return fallbackName;
    }
    
    if (userId !== undefined && userId !== null) {
      const user = users.find(u => String(u.id) === String(userId));
      if (user) return user.name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email || String(user.id);
    }
    
    if (userEmail) {
      const user = users.find(u => u.email === userEmail);
      if (user) return user.name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email;
    }
    
    if (typeof userEmail === 'string' && userEmail) return userEmail;
    if (userId !== undefined && userId !== null) return String(userId);
    return 'Unknown User';
  };

  // Helper function to get user email by ID or name
  const getUserEmail = (userId: any, userName: any, fallbackEmail: any) => {
    if (fallbackEmail && fallbackEmail !== 'No email') {
      return fallbackEmail;
    }
    
    if (userId !== undefined && userId !== null) {
      const user = users.find(u => String(u.id) === String(userId));
      if (user) return user.email || 'No email';
    }
    
    if (userName) {
      const user = users.find(u => u.name === userName || (`${u.first_name ?? ''} ${u.last_name ?? ''}`).trim() === userName || u.email === userName);
      if (user) return user.email || 'No email';
    }
    
    return (typeof userName === 'string' && userName.includes('@')) ? userName : 'No email';
  };
  const [teamMembers, setTeamMembers] = useState<any[]>([]); // Initialize team members
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState("");
  
  // Overview data state
  const [overviewData, setOverviewData] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  
  // Message form state
  const [messageData, setMessageData] = useState({
    recipient: "",
    subject: "",
    content: ""
  });
  
  // Blog form state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogDate, setBlogDate] = useState("");
  const [blogStatus, setBlogStatus] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogSubmitting, setBlogSubmitting] = useState(false);

  // Refresh functions for real-time updates
  const refreshUsers = async () => {
    setUsersLoading(true);
    try {
      const { adminService } = await import("@/lib/services");
      const res = await adminService.getUsers({ page: 1, limit: 100 });
      if (res.success) {
        setUsers(res.data || []);
        setUsersError("");
      } else {
        setUsersError(res.error || "Failed to load users");
      }
    } catch (error) {
      setUsersError("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const refreshTeamMembers = async () => {
    setTeamLoading(true);
    try {
      const { adminService } = await import("@/lib/services");
      const res = await adminService.getTeam();
      if (res.success) {
        setTeamMembers(res.data || []);
        setTeamError("");
      } else {
        setTeamError(res.error || "Failed to load team members");
      }
    } catch (error) {
      setTeamError("Failed to load team members");
    } finally {
      setTeamLoading(false);
    }
  };

  const refreshProgressUpdates = async () => {
    setProgressUpdatesLoading(true);
    try {
      const { apiClient } = await import("@/lib/api");
      const res = await apiClient.get('/progress-updates');
      if (Array.isArray(res)) {
        setProgressUpdates(res || []);
        setProgressUpdatesError("");
      } else {
        setProgressUpdatesError("Failed to load progress updates");
      }
    } catch (error) {
      setProgressUpdatesError("Failed to load progress updates");
    } finally {
      setProgressUpdatesLoading(false);
    }
  };

  // Fetch users and team members from backend
  useEffect(() => {
    setUsersLoading(true);
    setTeamLoading(true);
    setOverviewLoading(true);
    import("@/lib/services").then(({ adminService }) => {
      adminService.getUsers({ page: 1, limit: 100 }).then(res => {
        if (res.success) {
          setUsers(res.data || []);
          setUsersError("");
        } else {
          setUsersError(res.error || "Failed to load users");
        }
        setUsersLoading(false);
      }).catch(() => {
        setUsersError("Failed to load users");
        setUsersLoading(false);
      });
      adminService.getTeam().then(res => {
        if (res.success) {
          setTeamMembers(res.data || []);
          setTeamError("");
        } else {
          setTeamError(res.error || "Failed to load team members");
        }
        setTeamLoading(false);
      }).catch(() => {
        setTeamError("Failed to load team members");
        setTeamLoading(false);
      });
      adminService.getAnalytics().then(res => {
        if (res.success) {
          setOverviewData(res.data);
          setOverviewError("");
        } else {
          setOverviewError(res.error || "Failed to load overview data");
        }
        setOverviewLoading(false);
      }).catch(() => {
        setOverviewError("Failed to load overview data");
        setOverviewLoading(false);
      });
    });
  }, []);
  // Handle profile picture upload for new user
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setNewUser(prev => ({ ...prev, profilePicture: file }));
    }
  };
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserForUsersTabOpen, setAddUserForUsersTabOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
    phone: "",
    profilePicture: null as File | null
  });
  const [newUserForUsersTab, setNewUserForUsersTab] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
    role: "",
    status: "Active",
    joinedDate: "",
    phone: "",
    profilePicture: null as File | null
  });
  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>({});
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userAction, setUserAction] = useState({ open: false, type: '', user: null });
  
  // Team Member Tab State
  const [teamSearch, setTeamSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState({ role: "all", team: "all", status: "all" });
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<number[]>([]);
  const [editTeamMemberOpen, setEditTeamMemberOpen] = useState(false);
  const [viewTeamMemberOpen, setViewTeamMemberOpen] = useState(false);
  const [currentTeamMember, setCurrentTeamMember] = useState<any>(null);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [projectAction, setProjectAction] = useState({ open: false, type: '', project: null });
  const [filterOpen, setFilterOpen] = useState(false);
  const [requestAction, setRequestAction] = useState({ open: false, type: '', request: null });
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [messageAction, setMessageAction] = useState({ open: false, type: '', message: null });
  const [responseMessageOpen, setResponseMessageOpen] = useState(false);
  const [responseMessageData, setResponseMessageData] = useState({
    to: "",
    subject: "",
    message: ""
  });
  const [blogAction, setBlogAction] = useState({ open: false, type: '', post: null });
  const [addPostOpen, setAddPostOpen] = useState(false);
  const [adminProfileOpen, setAdminProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const [adminProfilePic, setAdminProfilePic] = useState(user?.profilePic || "http://localhost:8000/admin-profile.jpg");
  const [adminProfileEdit, setAdminProfileEdit] = useState(false);
  const [adminProfileData, setAdminProfileData] = useState({
    name: user?.name || "Admin",
    email: user?.email || "admin@hawisoftware.com",
    role: user?.role || "System Administrator"
  });

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    client: "",
    description: "",
    projectType: "",
    startDate: "",
    endDate: "",
    budget: "",
    teamMembers: [],
    status: "",
    progress: "",
    files: []
  });

  // Send Progress to User State
  const [sendProgressOpen, setSendProgressOpen] = useState(false);
  const [progressData, setProgressData] = useState({
    clientId: "",
    projectId: "",
    progressPercentage: "",
    completedMilestones: "",
    currentStatus: "",
    nextDeadline: "",
    lastUpdate: "",
    notes: "",
    attachments: []
  });

  // Receive New Project Request State
  const [receiveRequestOpen, setReceiveRequestOpen] = useState(false);
  const [newProjectRequest, setNewProjectRequest] = useState({
    clientName: "",
    clientEmail: "",
    projectTitle: "",
    projectType: "",
    description: "",
    timeline: "",
    budget: "",
    requirements: "",
    features: "",
    targetAudience: "",
    additionalNotes: ""
  });



  // Sample data for dropdowns
  const clients = [
    { id: 1, name: "John Doe", company: "Tech Innovations Inc." },
    { id: 2, name: "Sarah Johnson", company: "Digital Solutions" },
    { id: 3, name: "Mike Wilson", company: "StartupXYZ" },
    { id: 4, name: "Emily Brown", company: "Global Tech Corp" }
  ];

  const projectTypes = [
    "Web Development",
    "Mobile App Development",
    "E-commerce Platform",
    "Software Development",
    "UI/UX Design",
    "Quality Assurance",
    "Software Consultancy",
    "Custom Software Solution"
  ];

  // Removed duplicate hardcoded teamMembers array

  const projectStatuses = ["Planning", "In Progress", "Review", "Testing", "Completed", "On Hold", "Cancelled"];
  
  const userRoles = ["Senior Developer", "Frontend Developer", "Backend Developer", "UI/UX Designer", "Project Manager", "QA Engineer"];
  const userRolesForUsersTab = ["Admin", "Client"];
  
  const teams = ["Development", "Design", "QA", "Project Management", "Marketing"];
  

  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When adminProfilePic changes, update context
  useEffect(() => {
    if (user) {
      setUser({ ...user, profilePic: adminProfilePic });
    }
  }, [adminProfilePic, user]);

  const handleLogout = () => {
    console.log("Admin logged out");
    navigate("/");
  };

  // User form validation function
  const validateUserForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newUser.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (newUser.fullName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    if (!newUser.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!newUser.role) {
      errors.role = "Please select a user role";
    }

    if (newUser.phone && !/^\+251\s\d{9}$/.test(newUser.phone)) {
      errors.phone = "Phone number must be in format: +251 912345678";
    }

    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle user creation for Team tab
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUserForm()) {
      return;
    }

    setIsCreatingUser(true);
    
    try {
      // Use real API call
      const { adminService } = await import("@/lib/services");
      // Use a default password for now, or update UI to collect it
      const response = await adminService.addTeamMember({
        name: newUser.fullName,
        email: newUser.email,
        password: "changeme123", // Default password
        role: "Team Member", // Default role
        department: newUser.department,
        status: "Active", // Default status
        phone: newUser.phone
      });
      if (response.success) {
        setNewUser({
          fullName: "",
          email: "",
          role: "",
          department: "",
          status: "Active",
          phone: "",
          profilePicture: null
        });
        setUserFormErrors({});
        setAddUserOpen(false);
        alert("Team member created successfully!");
        // Refresh team members list
        refreshTeamMembers();
      } else {
        alert(response.error || "Error creating team member. Please try again.");
      }
    } catch (error) {
      console.error('Error creating team member:', error);
      alert("Error creating team member. Please try again.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Handle user creation for Users tab
  const handleCreateUserForUsersTab = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newUserForUsersTab.fullName.trim() || !newUserForUsersTab.email.trim() || !newUserForUsersTab.password.trim() || !newUserForUsersTab.role || !newUserForUsersTab.company.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCreatingUser(true);
    try {
      const { authService } = await import("@/lib/services");
      const response = await authService.register({
        name: newUserForUsersTab.fullName,
        email: newUserForUsersTab.email,
        password: newUserForUsersTab.password,
        password_confirmation: newUserForUsersTab.password,
        company: newUserForUsersTab.company,
        phone: newUserForUsersTab.phone
      });
      if (response.success) {
        setNewUserForUsersTab({
          fullName: "",
          email: "",
          password: "",
          company: "",
          role: "",
          status: "Active",
          joinedDate: "",
          phone: "",
          profilePicture: null
        });
        setAddUserForUsersTabOpen(false);
        alert("User created successfully!");
        // Refresh users list
        refreshUsers();
      } else {
        alert(response.error || "Error creating user. Please try again.");
      }
    } catch (err) {
      console.error('Error creating user:', err);
      alert("Error creating user. Please try again.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Team Member Functions
  const filteredTeamMembers = teamMembers.filter(member => {
  const matchesSearch = member.name.toLowerCase().includes(teamSearch.toLowerCase()) || member.role.toLowerCase().includes(teamSearch.toLowerCase());
    const matchesRole = !teamFilter.role || teamFilter.role === "all" || member.role === teamFilter.role;
    const matchesDepartment = !teamFilter.team || teamFilter.team === "all" || member.department === teamFilter.team;
    const matchesStatus = !teamFilter.status || teamFilter.status === "all" || member.status === teamFilter.status;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const paginatedTeamMembers = filteredTeamMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTeamMembers.length / itemsPerPage);

  const handleTeamMemberSelection = (memberId: number) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAllTeamMembers = () => {
    if (selectedTeamMembers.length === paginatedTeamMembers.length) {
      setSelectedTeamMembers([]);
    } else {
      setSelectedTeamMembers(paginatedTeamMembers.map(member => member.id));
    }
  };

  const handleEditTeamMember = (member: any) => {
    setCurrentTeamMember(member);
    setEditTeamMemberOpen(true);
  };

  const handleViewTeamMember = (member: any) => {
    setCurrentTeamMember(member);
    setViewTeamMemberOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedTeamMembers.length > 0) {
      // Simulate bulk delete
      console.log('Deleting team members:', selectedTeamMembers);
      setSelectedTeamMembers([]);
      setBulkActionOpen(false);
      alert(`${selectedTeamMembers.length} team member(s) deleted successfully!`);
    }
  };

  const exportTeamMembers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Team', 'Status', 'Phone', 'Joined Date', 'Completed Tasks', 'Performance'],
      ...filteredTeamMembers.map(member => [
          member.name,
          member.email,
          member.role,
          member.department,
          member.status,
          member.phone,
          member.joinedDate,
          member.completedTasks,
          member.performance
        ])
      ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team-members.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Form validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newProject.title.trim()) {
      errors.title = "Project title is required";
    } else if (newProject.title.length > 100) {
      errors.title = "Project title must be less than 100 characters";
    }

    if (!newProject.client) {
      errors.client = "Please select a client";
    }

    if (newProject.description && newProject.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    if (!newProject.projectType) {
      errors.projectType = "Please select a project type";
    }

    if (!newProject.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!newProject.endDate) {
      errors.endDate = "End date is required";
    } else if (newProject.startDate && newProject.endDate && new Date(newProject.endDate) <= new Date(newProject.startDate)) {
      errors.endDate = "End date must be after start date";
    }

    if (!newProject.budget) {
      errors.budget = "Budget is required";
    } else if (isNaN(Number(newProject.budget)) || parseFloat(newProject.budget) <= 0) {
      errors.budget = "Budget must be a positive number";
    }

    if (newProject.teamMembers.length === 0) {
      errors.teamMembers = "Please select at least one team member";
    }

    if (!newProject.status) {
      errors.status = "Please select a project status";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('New project submitted:', newProject);
      
      // Reset form
      setNewProject({
        title: "",
        client: "",
        description: "",
        projectType: "",
        startDate: "",
        endDate: "",
        budget: "",
        teamMembers: [],
        status: "",
        progress: "",
        files: []
      });
      setFormErrors({});
      setAddProjectOpen(false);
      
      // Show success message (you can implement a toast notification here)
      alert("Project created successfully!");
      
    } catch (error) {
      console.error('Error creating project:', error);
      alert("Error creating project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewProject(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  // Remove file
  const removeFile = (index: number) => {
    setNewProject(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Add team member
  const addTeamMember = (memberId: string) => {
    const numericId = parseInt(memberId);
    if (!isNaN(numericId) && !newProject.teamMembers.includes(numericId)) {
      setNewProject(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, numericId]
      }));
    }
  };



  // Handle client selection
  const handleClientSelection = (value: string) => {
    setNewProject(prev => ({ ...prev, client: value }));
  };



  // Remove team member
  const removeTeamMember = (memberId: number) => {
    setNewProject(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(id => id !== memberId)
    }));
  };

  // Removed duplicate hardcoded users array

  // Projects state and fetch from backend
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  // Progress updates state
  const [progressUpdates, setProgressUpdates] = useState<any[]>([]);
  const [progressUpdatesLoading, setProgressUpdatesLoading] = useState(true);
  const [progressUpdatesError, setProgressUpdatesError] = useState("");

  // User project requests state (projects created by users that need admin approval)
  const [userProjectRequests, setUserProjectRequests] = useState<any[]>([]);
  const [userProjectRequestsLoading, setUserProjectRequestsLoading] = useState(true);
  const [userProjectRequestsError, setUserProjectRequestsError] = useState("");

  useEffect(() => {
    setProjectsLoading(true);
    import("@/lib/api").then(({ apiClient }) => {
      apiClient.get('/admin/projects').then(res => {
        if (Array.isArray(res)) {
          setProjects(res || []);
          setProjectsError("");
        } else {
          setProjectsError("Failed to load projects");
        }
        setProjectsLoading(false);
      }).catch(() => {
        setProjectsError("Failed to load projects");
        setProjectsLoading(false);
      });
    });
  }, []);

  // Fetch progress updates
  useEffect(() => {
    setProgressUpdatesLoading(true);
    import("@/lib/api").then(({ apiClient }) => {
      apiClient.get('/progress-updates').then(res => {
        if (Array.isArray(res)) {
          setProgressUpdates(res || []);
          setProgressUpdatesError("");
        } else {
          setProgressUpdatesError("Failed to load progress updates");
        }
        setProgressUpdatesLoading(false);
      }).catch(() => {
        setProgressUpdatesError("Failed to load progress updates");
        setProgressUpdatesLoading(false);
      });
    });
  }, []);

  // Fetch user project requests from admin endpoint
  useEffect(() => {
    setUserProjectRequestsLoading(true);
    import("@/lib/api").then(({ apiClient }) => {
      apiClient.get('/admin/projects').then(res => {
        if (Array.isArray(res)) {
          setUserProjectRequests(res || []);
          setUserProjectRequestsError("");
        } else {
          setUserProjectRequestsError("Failed to load user project requests");
        }
        setUserProjectRequestsLoading(false);
      }).catch(() => {
        setUserProjectRequestsError("Failed to load user project requests");
        setUserProjectRequestsLoading(false);
      });
    });
  }, []);

  // Service Requests state and fetch from backend
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [serviceRequestsLoading, setServiceRequestsLoading] = useState(true);
  const [serviceRequestsError, setServiceRequestsError] = useState("");

  useEffect(() => {
    setServiceRequestsLoading(true);
    import("@/lib/api").then(({ apiClient }) => {
      apiClient.get('/admin/services').then(res => {
        if (Array.isArray(res)) {
          setServiceRequests(res || []);
          setServiceRequestsError("");
        } else {
          setServiceRequestsError("Failed to load service requests");
        }
        setServiceRequestsLoading(false);
      }).catch(() => {
        setServiceRequestsError("Failed to load service requests");
        setServiceRequestsLoading(false);
      });
    });
  }, []);
    {
  // Removed leftover hardcoded serviceRequests array

  // Blog Posts state and fetch from backend
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogPostsLoading, setBlogPostsLoading] = useState(true);
  const [blogPostsError, setBlogPostsError] = useState("");

  useEffect(() => {
    setBlogPostsLoading(true);
    import("@/lib/services").then(({ blogService }) => {
      blogService.getBlogPosts({ page: 1, limit: 100, includeAll: true }).then(res => {
        if (res.success) {
          setBlogPosts(res.data || []);
          setBlogPostsError("");
        } else {
          setBlogPostsError(res.error || "Failed to load blog posts");
        }
        setBlogPostsLoading(false);
      }).catch(() => {
        setBlogPostsError("Failed to load blog posts");
        setBlogPostsLoading(false);
      });
    });
  }, []);

  // Blog post creation handler (for new post form)
  const handleCreateBlogPost = async (data: any) => {
    setBlogPostsLoading(true);
    let imageUrl = data.image_url || "";
    // If image is a File, upload it first (simulate upload, or use your backend endpoint if available)
    if (data.coverImage && typeof File !== 'undefined' && data.coverImage instanceof File) {
      // TODO: Replace this with your real image upload endpoint if available
      // For now, skip upload and set imageUrl to empty or a placeholder
      // imageUrl = await uploadImageAndGetUrl(data.coverImage);
      imageUrl = ""; // Set to empty or a placeholder
    }
    const payload = {
      title: data.title,
      author: data.author || "Admin",
      category: data.category,
      status: data.status || "Draft",
      image_url: imageUrl,
      content: data.content,
      publish_date: data.publish_date || null,
      excerpt: data.excerpt || (data.content ? data.content.substring(0, 120) + (data.content.length > 120 ? '...' : '') : ''),
      tags: data.tags || [],
      featured: data.featured || false,
      published: data.published || false,
    };
    const { blogService } = await import("@/lib/services");
    const res = await blogService.createBlogPost(payload);
    if (res.success) {
      // Refresh the blog posts list
      const { blogService: refreshService } = await import("@/lib/services");
      const refreshRes = await refreshService.getBlogPosts({ includeAll: true });
      if (refreshRes.success) {
        setBlogPosts(refreshRes.data || []);
      } else {
        // Fallback: add the new post to the existing list
        setBlogPosts([res.data, ...blogPosts]);
      }
      setBlogPostsError("");
      setAddPostOpen(false); // Close the dialog
    } else {
      setBlogPostsError(res.error || "Failed to create blog post");
    }
    setBlogPostsLoading(false);
  };

  // Messages state and fetch from backend
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState("");

  useEffect(() => {
    setMessagesLoading(true);
    import("@/lib/api").then(({ apiClient }) => {
      apiClient.get('/admin/messages').then((res: import("@/lib/api").ApiResponse<any>) => {
        if (res.success && Array.isArray(res.data)) {
          setMessages(res.data);
          setMessagesError("");
        } else {
          setMessagesError("Failed to load messages");
        }
        setMessagesLoading(false);
      }).catch(() => {
        setMessagesError("Failed to load messages");
        setMessagesLoading(false);
      });
    });
  }, []);

  // Fetch notifications from backend
  useEffect(() => {
    setNotificationsLoading(true);
    import("@/lib/api").then(({ apiClient }) => {
      apiClient.get('/admin/notifications').then((res: import("@/lib/api").ApiResponse<any>) => {
        if (res.success) {
          setNotifications(res.data || []);
        } else {
          console.error('Failed to load notifications:', res.error);
        }
        setNotificationsLoading(false);
      }).catch((error) => {
        console.error('Error loading notifications:', error);
        setNotificationsLoading(false);
      });
    });
  }, []);

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
            <Badge variant="secondary">Admin Dashboard</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationOpen(true)}>
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 flex items-center justify-center text-xs">
                {Array.isArray(notifications) ? notifications.length : 0}
              </Badge>
            </Button>
            <Avatar onClick={() => setAdminProfileOpen(true)} className="cursor-pointer">
              <AvatarImage src={(user as any)?.profilePic || (user as any)?.profile_picture || adminProfilePic || "http://localhost:8000/admin-profile.jpg"} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the home page and will need to login again to access the admin dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your business operations and monitor performance.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 lg:w-auto lg:grid-cols-7 gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="send-progress">Projects Progress</TabsTrigger>
            <TabsTrigger value="receive-requests">Requests</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-card hover-scale animate-slide-in-up">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold">{Array.isArray(users) ? users.length : 0}</p>
                      <p className="text-sm text-primary">Active</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-scale animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                      <p className="text-3xl font-bold">{overviewData?.stats?.active_projects || 0}</p>
                      <p className="text-sm text-blue-600">In progress</p>
                    </div>
                    <FolderOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-scale animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                      <p className="text-3xl font-bold">{overviewData?.stats?.pending_requests || 0}</p>
                      <p className="text-sm text-yellow-600">Needs attention</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projectsLoading ? (
                    <div>Loading projects...</div>
                  ) : projectsError ? (
                    <div className="text-red-500">{projectsError}</div>
                  ) : projects && projects.length > 0 ? (
                    projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <h4 className="font-medium">{project.title || project.name}</h4>
                          <p className="text-sm text-muted-foreground">Client: {project.clientName || project.client}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={project.status === "in-progress" || project.status === "In Progress" ? "default" : project.status === "review" || project.status === "Review" ? "secondary" : "outline"}>
                              {project.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="mt-2" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No projects found.</div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serviceRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <h4 className="font-medium">{request.request_title || request.title}</h4>
                        <p className="text-sm text-muted-foreground">From: {request.client_name || request.client}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={request.status === "Open" ? "destructive" : request.status === "In Progress" ? "default" : "secondary"}>
                            {request.status}
                          </Badge>
                          <Badge variant="outline">{request.priority}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search users..." className="pl-10 w-64" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setAddUserForUsersTabOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card className="glass-card">
              <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {(Array.isArray(users) ? users : []).filter(u => u.name && u.email && (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                              <AvatarFallback>{(user.name || 'Unknown').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.company}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "Client" ? "secondary" : "default"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                        <TableCell>{user.joined}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => setUserAction({ open: true, type: 'view', user })}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setUserAction({ open: true, type: 'edit', user })}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setUserAction({ open: false, type: '', user: null })}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete <b>{user.name}</b>?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                      // Simulate deletion
                                      console.log("Simulating deletion for user:", user);
                                      setUserAction({ ...userAction, open: false });
                                    }}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Member Tab */}
          <TabsContent value="team" className="space-y-6">
            {/* Team Member Overview */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Team Member Management</h2>
              <div className="flex items-center gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setAddUserOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </div>

            {/* Performance Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Team Members</p>
                      <p className="text-3xl font-bold">{teamMembers.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                      <p className="text-3xl font-bold">{teamMembers.filter(m => m.status === "Active").length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search team members by name or role..." 
                  className="pl-10" 
                  value={teamSearch} 
                  onChange={e => setTeamSearch(e.target.value)} 
                />
              </div>
              <div className="flex gap-2">
                <Select value={teamFilter.role} onValueChange={(value) => setTeamFilter(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="all">All Roles</SelectItem>
                    {Array.from(new Set(teamMembers.map(m => m.role))).map(role => (
                      <SelectItem key={String(role)} value={String(role)}>{String(role)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={teamFilter.team} onValueChange={(value) => setTeamFilter(prev => ({ ...prev, team: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by Department" />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="all">All Departments</SelectItem>
                    {projectsLoading ? (
                      <SelectItem disabled value="loading">Loading...</SelectItem>
                    ) : projectsError ? (
                      <SelectItem disabled value="error">{projectsError}</SelectItem>
                    ) : projects && projects.length > 0 ? (
                      Array.from(new Set(projects.map((project) => project.department || project.team || ""))).filter(Boolean).map((dept) => (
                        <SelectItem key={String(dept)} value={String(dept)}>{String(dept)}</SelectItem>
                      ))
                    ) : null}
                  </SelectContent>
                </Select>
                </div>
              </div>

            {/* Team Member Table */}
            <Card className="glass-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedTeamMembers.length === paginatedTeamMembers.length && paginatedTeamMembers.length > 0}
                          onCheckedChange={handleSelectAllTeamMembers}
                        />
                      </TableHead>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTeamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedTeamMembers.includes(member.id)}
                            onCheckedChange={() => handleTeamMemberSelection(member.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.profilePic} />
                              <AvatarFallback>{(member.name || 'Unknown').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <button 
                                className="font-medium hover:text-blue-600 transition-colors"
                                onClick={() => handleViewTeamMember(member)}
                              >
                                {member.name}
                              </button>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.department}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleViewTeamMember(member)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleEditTeamMember(member)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Member</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTeamMembers.length)} of {filteredTeamMembers.length} team members
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}


          </TabsContent>





          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Client Communications</h2>
                <p className="text-muted-foreground">Manage all client messages and communications</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setMessagesOpen(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send New Message
              </Button>
            </div>

            <Card className="glass-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messagesLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Loading messages...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : messagesError ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-red-500">
                          {messagesError}
                        </TableCell>
                      </TableRow>
                    ) : messages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No messages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {(() => {
                              // Use sender_id if fromId is not present
                              const senderId = message.fromId ?? message.sender_id;
                              const sender = users.find(u => String(u.id) === String(senderId));
                              const name = sender ? sender.name || sender.email || `User #${sender.id}` : (message.fromName || message.from || 'Unknown User');
                              const email = sender ? sender.email : (message.sender_email || message.email || 'No email');
                              return (
                                <>
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{name}</div>
                                    <div className="text-sm text-muted-foreground">{email}</div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{message.subject || 'No subject'}</TableCell>
                        <TableCell className="max-w-xs truncate">{message.content || message.message || 'No content'}</TableCell>
                        <TableCell>{message.created_at || message.timestamp || message.time || 'Unknown time'}</TableCell>
                        <TableCell>
                          <Badge variant={message.status === "Unread" || message.read === false ? "destructive" : "secondary"}>
                            {message.status || (message.read === false ? "Unread" : "Read")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setMessageAction({ open: true, type: 'view', message })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {
                              setResponseMessageData({
                                to: message.sender_email || message.email || '',
                                subject: `Re: ${message.subject || ''}`,
                                message: ""
                              });
                              setResponseMessageOpen(true);
                            }}>
                              <Send className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. The message from {message.from} will be permanently deleted.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => {
                                    console.log('Delete message:', message.id);
                                  }}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Blog Management</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setAddPostOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            <Card className="glass-card">
              <CardContent className="p-0">
                <Table>
                                      <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Likes</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {blogPostsLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Loading blog posts...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : blogPostsError ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-red-500">
                          {blogPostsError}
                        </TableCell>
                      </TableRow>
                    ) : blogPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No blog posts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.status === "Published" ? "default" : post.status === "Draft" ? "secondary" : "outline"}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.views}</TableCell>
                        <TableCell>{post.likes}</TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setBlogAction({ open: true, type: 'edit', post })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setBlogAction({ open: false, type: '', post: null })}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to delete <b>{post.title}</b>?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => {
                                    // Simulate deletion
                                    console.log("Simulating deletion for post:", post);
                                    setBlogAction({ ...blogAction, open: false });
                                  }}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

          {/* Projects Progress Tab */}
          <TabsContent value="send-progress" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Projects Progress</h2>
                <p className="text-muted-foreground">Update clients on their project progress and milestones</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setSendProgressOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Send Progress Update
              </Button>
            </div>

            <Card className="glass-card">
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
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Loading progress updates...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : progressUpdatesError ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-red-500">
                          {progressUpdatesError}
                        </TableCell>
                      </TableRow>
                    ) : progressUpdates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No progress updates sent yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      progressUpdates.map((update) => (
                        <TableRow key={update.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                                <AvatarFallback>{getUserName(update.client_id, update.client_email, update.client_name).split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{getUserName(update.client_id, update.client_email, update.client_name)}</div>
                                <div className="text-sm text-muted-foreground">Client</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{update.project || 'Unknown Project'}</div>
                              <div className="text-sm text-muted-foreground">Project</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={update.progress || 0} className="w-16" />
                              <span className="text-sm">{update.progress || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={update.current_status === "In Progress" ? "default" : update.current_status === "Review" ? "secondary" : "outline"}>
                              {update.current_status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>{update.last_update || 'N/A'}</TableCell>
                          <TableCell>{update.next_deadline || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => {
                                setProgressData({
                                  clientId: getUserName(update.client_id, update.client_email, update.client_name),
                                  projectId: update.project || 'Unknown Project',
                                  progressPercentage: (update.progress || 0).toString(),
                                  completedMilestones: update.completed_milestones || "Phase 1, Phase 2",
                                  currentStatus: update.current_status || 'Unknown',
                                  nextDeadline: update.next_deadline || '',
                                  lastUpdate: update.last_update || '',
                                  notes: update.notes || "",
                                  attachments: update.attachments || []
                                });
                                setSendProgressOpen(true);
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Progress Update?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The progress update for {update.project} will be permanently deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                      console.log('Delete progress update:', update.id);
                                      alert(`Progress update for ${update.project} has been deleted successfully.`);
                                    }}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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

          {/* Service & Project Requests Tab */}
          <TabsContent value="receive-requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Requests</h2>
                <p className="text-muted-foreground">Manage service requests and new project requests from clients</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setFilterOpen(true)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Sub-tabs for Requests */}
            <Tabs defaultValue="new-project-requests" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new-project-requests">New Project Requests</TabsTrigger>
                <TabsTrigger value="service-requests">Service Requests</TabsTrigger>
              </TabsList>

              {/* New Project Requests Sub-tab */}
              <TabsContent value="new-project-requests" className="space-y-4">
                <Card className="glass-card">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Project Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Timeline</TableHead>
                          <TableHead>Date Received</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userProjectRequestsLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span>Loading project requests...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : userProjectRequestsError ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-red-500">
                              {userProjectRequestsError}
                            </TableCell>
                          </TableRow>
                        ) : userProjectRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No project requests found
                            </TableCell>
                          </TableRow>
                        ) : (
                          userProjectRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                                  <AvatarFallback>{getUserName(request.user_id, request.user_email, request.client_name).split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{getUserName(request.user_id, request.user_email, request.client_name)}</div>
                                  <div className="text-sm text-muted-foreground">{getUserEmail(request.user_id, request.client_name, request.client_email)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{request.project_title || 'Untitled Project'}</div>
                                <div className="text-sm text-muted-foreground">New Request</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{request.type || 'General'}</Badge>
                            </TableCell>
                            <TableCell>{request.timeline || 'Not specified'}</TableCell>
                            <TableCell>{request.date_received || 'Unknown'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => {
                                  setNewProjectRequest({
                                    clientName: request.clientName,
                                    clientEmail: request.clientEmail,
                                    projectTitle: request.projectTitle,
                                    projectType: request.projectType,
                                    description: "Project description would be here",
                                    timeline: request.timeline,
                                    budget: request.budget,
                                    requirements: "Project requirements",
                                    features: "Project features",
                                    targetAudience: "Target audience",
                                    additionalNotes: "Additional notes"
                                  });
                                  setReceiveRequestOpen(true);
                                }}>
                                  <Eye className="h-4 w-4" />
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure you want to delete this request?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => console.log('Delete request:', request.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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

              {/* Service Requests Sub-tab */}
              <TabsContent value="service-requests" className="space-y-4">
                <Card className="glass-card">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted Date</TableHead>
                          <TableHead>Feedback & Satisfaction</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{request.request_title || request.title}</div>
                                <div className="text-sm text-muted-foreground">{request.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{getUserName(request.user_id, request.user_email, request.client_name).split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{getUserName(request.user_id, request.user_email, request.client_name)}</div>
                                  <div className="text-sm text-muted-foreground">{getUserEmail(request.user_id, request.client_name, request.user_email)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={request.priority === "High" ? "destructive" : request.priority === "Medium" ? "default" : "secondary"}>
                                {request.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={request.status === "Open" ? "destructive" : request.status === "In Progress" ? "default" : "secondary"}>
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{request.submitted_date || request.submittedDate}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} className={`h-3 w-3 ${star <= (request.feedback_rating || request.feedback?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">({request.feedback_rating || request.feedback?.rating || 0}/5)</span>
                                </div>
                                <Badge variant={(request.feedback_rating || request.feedback?.rating || 0) >= 4 ? "default" : (request.feedback_rating || request.feedback?.rating || 0) >= 3 ? "secondary" : "destructive"} className="text-xs">
                                  {request.satisfaction_level || request.feedback?.satisfaction || 'N/A'}
                                    </Badge>
                                <div className="text-xs text-muted-foreground max-w-[150px] truncate" title={request.feedback_comment || request.feedback?.comment}>
                                  "{request.feedback_comment || request.feedback?.comment || 'No comment'}"
                                    </div>
                              </div>
                            </TableCell>
                                                      <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => {
                                setRequestAction({ open: true, type: 'view', request });
                              }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setRequestAction({ open: false, type: '', request: null })}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete <b>{request.title}</b>?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                      // Simulate deletion
                                      console.log("Simulating deletion for request:", request);
                                      setRequestAction({ ...requestAction, open: false });
                                    }}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Analytics Tab */}
          {/* Removed Analytics Tab */}
        </Tabs>
      </div>

      {/* Notification Modal */}
      <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              View and manage your notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {notificationsLoading ? (
              <p className="text-muted-foreground">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-muted-foreground">No notifications.</p>
            ) : notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === "success" ? "bg-green-500" :
                  notification.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    </div>
            ))}
                    </div>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Modal */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Team
            </DialogTitle>
            <DialogDescription>
              Add a new team member to your organization with their details and role.
            </DialogDescription>
          </DialogHeader>
          <TooltipProvider>
            <form className="space-y-6" onSubmit={handleCreateUser}>
              {/* Team Information Section */}
                <div className="space-y-4">
               <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Team Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the user's full name (minimum 2 characters)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input 
                        placeholder="Enter full name" 
                        className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUser.fullName}
                      onChange={e => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                        required 
                      />
                    {userFormErrors.fullName && <p className="text-xs text-red-500">{userFormErrors.fullName}</p>}
                    </div>
                  
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter a valid email address for the user</p>
                        </TooltipContent>
                      </Tooltip>
                  </div>
                   <Input 
                     placeholder="user@example.com" 
                     type="email" 
                     className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUser.email}
                      onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                     required 
                   />
                    {userFormErrors.email && <p className="text-xs text-red-500">{userFormErrors.email}</p>}
                </div>
                  

                  
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Team Role</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the appropriate role for this team member</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))} value={newUser.role}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select Team Role" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {userRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {userFormErrors.role && <p className="text-xs text-red-500">{userFormErrors.role}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Department</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the department for this team member</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select onValueChange={(value) => setNewUser(prev => ({ ...prev, department: value }))} value={newUser.department}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {teams.map(team => (
                          <SelectItem key={team} value={team}>{team}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {userFormErrors.department && <p className="text-xs text-red-500">{userFormErrors.department}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the status for this team member</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select onValueChange={(value) => setNewUser(prev => ({ ...prev, status: value }))} value={newUser.status}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {userFormErrors.status && <p className="text-xs text-red-500">{userFormErrors.status}</p>}
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Phone Number</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional: Enter phone number in format +251 912345678</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                   <Input 
                      placeholder="+251 912345678" 
                     className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUser.phone}
                      onChange={e => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                   />
                    {userFormErrors.phone && <p className="text-xs text-red-500">{userFormErrors.phone}</p>}
                 </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Profile Picture</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional: Upload a profile picture (JPG, PNG, max 2MB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <div className="border-2 border-dashed border-blue-500/20 rounded-lg p-4 text-center hover:border-blue-500/40 transition-colors cursor-pointer" onClick={() => document.getElementById('profile-pic-input').click()}>
                        <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload profile picture</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG (max 2MB)</p>
                      </div>
                      <input 
                        id="profile-pic-input"
                        type="file" 
                        onChange={handleProfilePictureUpload} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/jpeg,image/png"
                      />
                    </div>
                    {newUser.profilePicture && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {newUser.profilePicture.name}
                        </Badge>
                      </div>
                    )}
                  </div>
               </div>
             </div>

             <DialogFooter className="pt-4 border-t border-border">
               <Button variant="outline" onClick={() => setAddUserOpen(false)} className="px-6">
                 Cancel
               </Button>
                <Button type="submit" className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" disabled={isCreatingUser}>
                  {isCreatingUser ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating User...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
               </Button>
            </DialogFooter>
          </form>
        </TooltipProvider>
      </DialogContent>
    </Dialog>

      {/* Add User Modal for Users Tab */}
      <Dialog open={addUserForUsersTabOpen} onOpenChange={setAddUserForUsersTabOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>
              Add a new user to the system with their details and permissions.
            </DialogDescription>
          </DialogHeader>
          <TooltipProvider>
            <form className="space-y-6" onSubmit={handleCreateUserForUsersTab}>
              {/* User Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the user's full name (minimum 2 characters)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      placeholder="Enter full name" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUserForUsersTab.fullName}
                      onChange={e => setNewUserForUsersTab(prev => ({ ...prev, fullName: e.target.value }))}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter a valid email address for the user</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      placeholder="user@example.com" 
                      type="email" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUserForUsersTab.email}
                      onChange={e => setNewUserForUsersTab(prev => ({ ...prev, email: e.target.value }))}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Password</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Create a secure password (min 8 chars, uppercase, lowercase, number)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      placeholder="Create a secure password" 
                      type="password" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUserForUsersTab.password}
                      onChange={e => setNewUserForUsersTab(prev => ({ ...prev, password: e.target.value }))}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Company</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the company name</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      placeholder="Enter company name" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUserForUsersTab.company}
                      onChange={e => setNewUserForUsersTab(prev => ({ ...prev, company: e.target.value }))}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">User Role</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the appropriate role for this user</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select onValueChange={(value) => setNewUserForUsersTab(prev => ({ ...prev, role: value }))} value={newUserForUsersTab.role}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select User Role" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {userRolesForUsersTab.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the status for this user</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select onValueChange={(value) => setNewUserForUsersTab(prev => ({ ...prev, status: value }))} value={newUserForUsersTab.status}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  

                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Joined Date</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the date when user joined</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      type="date" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUserForUsersTab.joinedDate}
                      onChange={e => setNewUserForUsersTab(prev => ({ ...prev, joinedDate: e.target.value }))}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Phone Number</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional: Enter phone number in format +251 912345678</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      placeholder="+251 912345678" 
                     className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newUserForUsersTab.phone}
                      onChange={e => setNewUserForUsersTab(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Profile Picture</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional: Upload a profile picture (JPG, PNG, max 2MB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <div className="border-2 border-dashed border-blue-500/20 rounded-lg p-4 text-center hover:border-blue-500/40 transition-colors cursor-pointer" onClick={() => document.getElementById('profile-pic-input-users').click()}>
                        <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload profile picture</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG (max 2MB)</p>
                      </div>
                      <input 
                        id="profile-pic-input-users"
                        type="file" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewUserForUsersTab(prev => ({ ...prev, profilePicture: file }));
                          }
                        }} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/jpeg,image/png"
                      />
                    </div>
                    {newUserForUsersTab.profilePicture && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {newUserForUsersTab.profilePicture.name}
                        </Badge>
                    </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setAddUserForUsersTabOpen(false)} className="px-6">
                  Cancel
                </Button>
                  <Button type="submit" className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" disabled={isCreatingUser}>
                  {isCreatingUser ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating User...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </DialogFooter>
          </form>
        </TooltipProvider>
      </DialogContent>
    </Dialog>

      {/* User Action Modal */}
      <Dialog open={userAction.open} onOpenChange={o => setUserAction({ ...userAction, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{userAction.type === 'view' ? 'View User' : userAction.type === 'edit' ? 'Edit User' : 'Delete User'}</DialogTitle>
            <DialogDescription>
              {userAction.type === 'view' ? 'View user details and information' : 
               userAction.type === 'edit' ? 'Edit user information and settings' : 
               'Delete user from the system'}
            </DialogDescription>
          </DialogHeader>
          {userAction.type === 'view' && userAction.user && (
            <div>
              <p><b>Name:</b> {userAction.user.name}</p>
              <p><b>Email:</b> {userAction.user.email}</p>
              <p><b>Company:</b> {userAction.user.company}</p>
              <p><b>Role:</b> {userAction.user.role}</p>
              <p><b>Status:</b> {userAction.user.status}</p>
              <p><b>Joined:</b> {userAction.user.joined}</p>
                  </div>
          )}
          {userAction.type === 'edit' && userAction.user && (
            <form className="space-y-2">
              <Input defaultValue={userAction.user.name} />
              <Input defaultValue={userAction.user.email} />
              <Input defaultValue={userAction.user.company} />
              <Input defaultValue={userAction.user.role} />
              <DialogFooter>
                <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Project Modal */}
      <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[50]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Project
            </DialogTitle>
            <DialogDescription>
              Create a new project with details, timeline, and team assignments.
            </DialogDescription>
          </DialogHeader>
          <TooltipProvider>
            <form className="space-y-6" onSubmit={handleProjectSubmit}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Project Title</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter a descriptive project name (max 100 characters)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      placeholder="e.g., E-commerce Platform Development" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newProject.title}
                      onChange={e => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      maxLength={100}
                      required 
                    />
                    {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Client Selection</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the client from existing clients or add a new one</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select onValueChange={handleClientSelection} value={newProject.client}>
                      <SelectTrigger 
                        className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      >
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.name}>{client.name} ({client.company})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.client && <p className="text-xs text-red-500">{formErrors.client}</p>}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Project Description</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Provide a detailed description of the project (optional, max 500 characters)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Textarea 
                      placeholder="Describe the project scope, objectives, and key requirements..." 
                      className="min-h-32 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                      value={newProject.description}
                      onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formErrors.description && <span className="text-red-500">{formErrors.description}</span>}</span>
                      <span>{newProject.description.length}/500</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Project Type</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the type of project you're creating</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select onValueChange={(value) => {
                      setNewProject(prev => ({ ...prev, projectType: value }));
                    }} value={newProject.projectType}>
                      <SelectTrigger 
                        className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      >
                        <SelectValue placeholder="Select Project Type" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {projectTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.projectType && <p className="text-xs text-red-500">{formErrors.projectType}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Project Status</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Set the current status of this project</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select onValueChange={(value) => {
                      setNewProject(prev => ({ ...prev, status: value }));
                    }} value={newProject.status}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select Project Status" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {projectStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.status && <p className="text-xs text-red-500">{formErrors.status}</p>}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2 mt-6">Timeline & Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Start Date</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select when the project will begin</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      type="date" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newProject.startDate}
                      onChange={e => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required 
                    />
                    {formErrors.startDate && <p className="text-xs text-red-500">{formErrors.startDate}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">End Date</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the project deadline (must be after start date)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      type="date" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newProject.endDate}
                      onChange={e => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                      min={newProject.startDate || new Date().toISOString().split('T')[0]}
                      required 
                    />
                    {formErrors.endDate && <p className="text-xs text-red-500">{formErrors.endDate}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Budget</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the total project budget (minimum $100)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      placeholder="e.g., 15000" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newProject.budget}
                      onChange={e => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                      type="number"
                      min="100"
                      step="100"
                      required 
                    />
                    {formErrors.budget && <p className="text-xs text-red-500">{formErrors.budget}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Progress</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Set the current progress percentage (0-100)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input 
                      placeholder="0-100" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={newProject.progress}
                      onChange={e => setNewProject(prev => ({ ...prev, progress: e.target.value }))}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2 mt-6">Team & Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Team Members</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select team members to assign to this project</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 p-3 border border-blue-500/20 rounded-md min-h-[44px]">
                      {newProject.teamMembers.length === 0 ? (
                        <span className="text-sm text-muted-foreground">No team members selected</span>
                      ) : (
                        newProject.teamMembers.map(memberId => (
                          <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                            {teamMembers.find(m => m.id === memberId)?.name}
                            <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTeamMember(memberId)} />
                          </Badge>
                        ))
                      )}
                    </div>
                    <Select onValueChange={(value) => addTeamMember(value)}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="Add team member" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {teamMembers.filter(m => !newProject.teamMembers.includes(m.id)).map(member => (
                          <SelectItem key={member.id} value={String(member.id)}>{member.name} ({member.role})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.teamMembers && <p className="text-xs text-red-500">{formErrors.teamMembers}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground">Upload Files</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach relevant documents, specifications, or reference files</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <div className="border-2 border-dashed border-blue-500/20 rounded-lg p-4 text-center hover:border-blue-500/40 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload-input').click()}>
                      <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload files or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, TXT, Images (max 10MB each)</p>
                      </div>
                      <input 
                        id="file-upload-input"
                        type="file" 
                        multiple 
                        onChange={handleFileUpload} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                      />
                    </div>
                    {newProject.files.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {newProject.files.map((file, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {file.name}
                            <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeFile(index)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setAddProjectOpen(false)} className="px-6">
                  Cancel
                </Button>
                <Button type="submit" className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TooltipProvider>
        </DialogContent>
      </Dialog>

      {/* Project Action Modal */}
      <Dialog open={projectAction.open} onOpenChange={o => setProjectAction({ ...projectAction, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{projectAction.type === 'view' ? 'Project Details' : 'Edit Project'}</DialogTitle>
          </DialogHeader>
          {projectAction.type === 'view' && projectAction.project && (
            <div>
              <p><b>Name:</b> {projectAction.project.name}</p>
              <p><b>Client:</b> {getUserName(projectAction.project.clientId, projectAction.project.clientEmail, projectAction.project.clientName || projectAction.project.client)}</p>
              <p><b>Status:</b> {projectAction.project.status}</p>
              <p><b>Deadline:</b> {projectAction.project.deadline}</p>
              <p><b>Budget:</b> {projectAction.project.budget}</p>
              <p><b>Team:</b> {projectAction.project.team.join(', ')}</p>
                    </div>
          )}
          {projectAction.type === 'edit' && projectAction.project && (
            <form className="space-y-2">
              <Input defaultValue={projectAction.project.name} />
              <Input defaultValue={projectAction.project.clientName || projectAction.project.client || ''} />
              <Input defaultValue={projectAction.project.deadline} type="date" />
              <Input defaultValue={projectAction.project.budget} />
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Requests</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <Input placeholder="Client Name" />
            <Input placeholder="Status" />
            <DialogFooter>
              <Button type="submit">Apply Filter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Service Request Edit Modal */}
      <Dialog open={requestAction.open} onOpenChange={o => setRequestAction({ ...requestAction, open: o })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Edit Service Request</DialogTitle>
            <DialogDescription className="text-center">
              Update service request details and feedback
            </DialogDescription>
          </DialogHeader>
          {requestAction.type === 'edit' && requestAction.request && (
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('Service request updated');
              setRequestAction({ ...requestAction, open: false });
              alert('Service request updated successfully!');
            }} className="space-y-6">
              {/* Request Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">Request Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Request Title</Label>
                    <Input
                      id="title"
                      defaultValue={requestAction.request.title}
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      defaultValue={requestAction.request.client}
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue={requestAction.request.category}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                        <SelectItem value="Software Development">Software Development</SelectItem>
                        <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                        <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                        <SelectItem value="Software Consultancy">Software Consultancy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="projectRelated">Project Related</Label>
                    <Input
                      id="projectRelated"
                      defaultValue={requestAction.request.projectRelated}
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={requestAction.request.description}
                    className="min-h-[100px] border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Priority and Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-600 border-b border-green-200 pb-2">Priority & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue={requestAction.request.priority}>
                      <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select defaultValue={requestAction.request.urgency}>
                      <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={requestAction.request.status}>
                      <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="expectedResolution">Expected Resolution</Label>
                  <Input
                    id="expectedResolution"
                    defaultValue={requestAction.request.expectedResolution}
                    className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-600 border-b border-purple-200 pb-2">Additional Information</h3>
              <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    defaultValue={requestAction.request.additionalNotes}
                    className="min-h-[80px] border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Feedback Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-2">Feedback Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Select defaultValue={requestAction.request.feedback.rating.toString()}>
                      <SelectTrigger className="h-11 border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="satisfaction">Satisfaction Level</Label>
                    <Select defaultValue={requestAction.request.feedback.satisfaction}>
                      <SelectTrigger className="h-11 border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200">
                        <SelectValue placeholder="Select satisfaction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Satisfied">Not Satisfied</SelectItem>
                        <SelectItem value="Satisfied">Satisfied</SelectItem>
                        <SelectItem value="Very Satisfied">Very Satisfied</SelectItem>
                        <SelectItem value="Extremely Satisfied">Extremely Satisfied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Feedback Comment</Label>
                  <Textarea
                    id="comment"
                    defaultValue={requestAction.request.feedback.comment}
                    className="min-h-[80px] border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="improvement">Improvement Suggestions</Label>
                  <Textarea
                    id="improvement"
                    defaultValue={requestAction.request.feedback.improvement}
                    className="min-h-[80px] border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              <DialogFooter className="pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={() => setRequestAction({ ...requestAction, open: false })} className="px-6">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                  Update Request
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Send New Message Modal */}
      <Dialog open={messagesOpen} onOpenChange={setMessagesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Send New Message</DialogTitle>
            <DialogDescription className="text-center">
              Send a message to clients or team members
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              // Validate required fields
              if (!messageData.recipient || !messageData.subject || !messageData.content) {
                alert("Please fill in all required fields (Recipient, Subject, Content)");
                return;
              }

              const { apiClient } = await import("@/lib/api");
              const response = await apiClient.post('/admin/messages', {
                recipient_name: messageData.recipient,
                subject: messageData.subject,
                content: messageData.content,
                sender_id: 2 // Always use 2 for admin
              });
              console.log('New message sent', response);
              setMessageData({
                recipient: "",
                subject: "",
                content: ""
              });
              setMessagesOpen(false);
              
              // Refresh messages list
              import("@/lib/api").then(({ apiClient }) => {
                apiClient.get('/admin/messages').then(res => {
                  if (Array.isArray(res)) {
                    setMessages(res || []);
                  }
                }).catch(() => {
                  console.error('Failed to refresh messages');
                });
              });
              
              alert('Message sent successfully!');
            } catch (error) {
              console.error('Error sending message:', error);
              alert("Failed to send message. Please try again.");
            }
          }} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Recipient *</Label>
                <Select required value={messageData.recipient} onValueChange={(value) => setMessageData(prev => ({ ...prev, recipient: value }))}>
                  <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersLoading ? (
                      <SelectItem disabled value="loading">Loading users...</SelectItem>
                    ) : usersError ? (
                      <SelectItem disabled value="error">{usersError}</SelectItem>
                    ) : users && users.length > 0 ? (
                      users
                        .filter(user =>
                          user.email !== "admin@hawi.com" &&
                          user.email !== "admin@hawisoftware.com" &&
                          user.role?.toLowerCase() !== "admin"
                        )
                        .map(user => (
                          <SelectItem key={user.id} value={user.name}>{user.name} ({user.email})</SelectItem>
                        ))
                    ) : (
                      <SelectItem disabled value="no-users">No users available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Enter message subject"
                  value={messageData.subject}
                  onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={messageData.content}
                  onChange={(e) => setMessageData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  className="min-h-[150px] border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setMessagesOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button type="submit" className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Post Modal */}
      <Dialog open={addPostOpen} onOpenChange={setAddPostOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Blog Post
            </DialogTitle>
            <DialogDescription>
              Create a new blog post with content, category, and publishing options.
            </DialogDescription>
          </DialogHeader>
          {/* Blog Post Form State */}
          {(() => {
            const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setBlogSubmitting(true);
              // Auto-generate excerpt and tags
              const excerpt = blogContent ? blogContent.substring(0, 120) + (blogContent.length > 120 ? '...' : '') : '';
              const tags = [];
              const featured = false;
              const payload: any = {
                title: blogTitle,
                content: blogContent,
                category: blogCategory,
                author: blogAuthor,
                status: blogStatus,
                publish_date: blogDate || null,
                image_url: "", // will be set in handleCreateBlogPost if image is uploaded
                coverImage: (typeof File !== 'undefined' && blogImage != null && ((blogImage as any) instanceof File)) ? blogImage : undefined,
                excerpt: blogContent ? blogContent.substring(0, 120) + (blogContent.length > 120 ? '...' : '') : '',
                tags: [],
                featured: false,
                published: blogStatus === "published",
              };
              await handleCreateBlogPost(payload);
              setBlogTitle("");
              setBlogAuthor("");
              setBlogDate("");
              setBlogStatus("");
              setBlogCategory("");
              setBlogImage("");
              setBlogContent("");
              setBlogSubmitting(false);
              setAddPostOpen(false);
            };
            return (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Blog Post Details</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Post Title</label>
                      <Input 
                        placeholder="Enter post title" 
                        className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        required 
                        value={blogTitle}
                        onChange={e => setBlogTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Author</label>
                      <Input 
                        placeholder="Enter author name" 
                        className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={blogAuthor}
                        onChange={e => setBlogAuthor(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Date</label>
                      <Input 
                        type="date"
                        className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={blogDate}
                        onChange={e => setBlogDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Status</label>
                      <Select value={blogStatus} onValueChange={setBlogStatus}>
                        <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Review">Under Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <Input 
                        placeholder="e.g., Web Development, Mobile Apps, Software Architecture" 
                        className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={blogCategory}
                        onChange={e => setBlogCategory(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-sm font-medium text-foreground">Image URL</label>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="url"
                        value={blogImage}
                        onChange={e => setBlogImage(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-sm font-medium text-foreground">Content</label>
                      <Textarea 
                        placeholder="Write your blog post content here... You can include markdown formatting, links, and rich text content." 
                        className="min-h-48 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                        value={blogContent}
                        onChange={e => setBlogContent(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setAddPostOpen(false)} className="px-6" type="button">
                    Cancel
                  </Button>
                  <Button type="submit" className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" disabled={blogSubmitting}>
                    {blogSubmitting ? "Adding..." : "Add Post"}
                  </Button>
                </DialogFooter>
              </form>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Blog Action Modal */}
      <Dialog open={blogAction.open} onOpenChange={o => setBlogAction({ ...blogAction, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{blogAction.type === 'view' ? 'View Post' : blogAction.type === 'edit' ? 'Edit Post' : 'Delete Post'}</DialogTitle>
          </DialogHeader>
          {blogAction.type === 'view' && blogAction.post && (
            <div>
              <p><b>Title:</b> {blogAction.post.title}</p>
              <p><b>Author:</b> {blogAction.post.author}</p>
              <p><b>Category:</b> {blogAction.post.category}</p>
              <p><b>Status:</b> {blogAction.post.status}</p>
              <p><b>Date:</b> {blogAction.post.date}</p>
              <p><b>Views:</b> {blogAction.post.views}</p>
                    </div>
          )}
          {blogAction.type === 'edit' && blogAction.post && (
            <form className="space-y-2" onSubmit={e => {
              e.preventDefault();
              // Handle form submission for blog post editing
              console.log('Blog post updated');
              setBlogAction({ ...blogAction, open: false });
            }}>
              <Input defaultValue={blogAction.post.title} />
              <Input defaultValue={blogAction.post.author} />
              <Input defaultValue={blogAction.post.category} />
              <Textarea defaultValue={blogAction.post.content} />
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Profile Modal */}
      <Dialog open={adminProfileOpen} onOpenChange={setAdminProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20 cursor-pointer" onClick={() => document.getElementById('admin-profile-pic-input').click()}>
              <AvatarImage src={adminProfilePic} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <input id="admin-profile-pic-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => {
                  const newProfilePic = ev.target?.result as string;
                  setAdminProfilePic(newProfilePic);
                  // Update user context and localStorage
                  if (setUser && user) {
                    const updated = { ...user, profilePic: newProfilePic };
                    setUser(updated);
                    try { 
                      localStorage.setItem('authUser', JSON.stringify(updated)); 
                    } catch (error) {
                      console.error('Failed to save profile picture to localStorage:', error);
                    }
                  }
                };
                reader.readAsDataURL(file);
              }
            }} />
            <div className="text-center">
              <h3 className="text-xl font-semibold">{adminProfileData.name}</h3>
              <p className="text-muted-foreground">{adminProfileData.email}</p>
              <p className="text-sm text-muted-foreground">{adminProfileData.role}</p>
                    </div>
            <Button onClick={() => setAdminProfileEdit(true)}>Edit Profile</Button>
                  </div>
        </DialogContent>
      </Dialog>

      {/* Admin Profile Edit Modal */}
      <Dialog open={adminProfileEdit} onOpenChange={setAdminProfileEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin Profile</DialogTitle>
          </DialogHeader>
                     <form className="space-y-6" onSubmit={async e => { 
             e.preventDefault(); 
             try {
               // Handle admin profile update
               const formData = new FormData();
               formData.append('name', adminProfileData.name);
               formData.append('email', adminProfileData.email);
               formData.append('role', adminProfileData.role);
               
               // Add profile picture if changed
               const profilePicInput = document.getElementById('admin-profile-edit-pic-input') as HTMLInputElement;
               if (profilePicInput?.files?.[0]) {
                 formData.append('profile_picture', profilePicInput.files[0]);
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
                 console.log('Admin profile updated:', result);
                 setAdminProfileEdit(false);
                 // Update user context and persist
                 if (setUser) {
                   const updated: any = { ...user, ...result.data };
                   try { localStorage.setItem('authUser', JSON.stringify(updated)); } catch {}
                   setUser(updated);
                 }
               } else {
                 console.error('Failed to update profile');
               }
             } catch (error) {
               console.error('Error updating profile:', error);
             }
           }}>
             {/* Profile Picture Section */}
             <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl border border-dashed border-blue-500/20">
               <Avatar className="w-24 h-24 cursor-pointer ring-4 ring-blue-500/10 hover:ring-blue-500/30 transition-all duration-300" onClick={() => document.getElementById('admin-profile-edit-pic-input').click()}>
                 <AvatarImage src={adminProfilePic} />
                 <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">AD</AvatarFallback>
               </Avatar>
               <input id="admin-profile-edit-pic-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                 const file = e.target.files && e.target.files[0];
                 if (file) {
                   const reader = new FileReader();
                   reader.onload = ev => {
                     const newProfilePic = ev.target?.result as string;
                     setAdminProfilePic(newProfilePic);
                     // Update user context and localStorage
                     if (setUser && user) {
                       const updated = { ...user, profilePic: newProfilePic };
                       setUser(updated);
                       try { 
                         localStorage.setItem('authUser', JSON.stringify(updated)); 
                       } catch (error) {
                         console.error('Failed to save profile picture to localStorage:', error);
                       }
                     }
                   };
                   reader.readAsDataURL(file);
                 }
               }} />
               <div className="text-center">
                 <p className="text-sm font-medium text-blue-600">Click to change profile picture</p>
                 <p className="text-xs text-muted-foreground">JPG, PNG or GIF (max. 2MB)</p>
               </div>
             </div>

             {/* Admin Information Section */}
             <div className="space-y-4">
               <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Administrator Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-foreground">Full Name</label>
                   <Input 
                     value={adminProfileData.name} 
                     onChange={e => setAdminProfileData({ ...adminProfileData, name: e.target.value })} 
                     className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                     placeholder="Enter administrator name"
                     required 
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-foreground">Email Address</label>
                   <Input 
                     value={adminProfileData.email} 
                     onChange={e => setAdminProfileData({ ...adminProfileData, email: e.target.value })} 
                     className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                     placeholder="admin@hawisoftware.com"
                     type="email" 
                     required 
                   />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <label className="text-sm font-medium text-foreground">Administrator Role</label>
                   <Input 
                     value={adminProfileData.role} 
                     onChange={e => setAdminProfileData({ ...adminProfileData, role: e.target.value })} 
                     className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                     placeholder="e.g., System Administrator, Super Admin"
                   />
                 </div>
               </div>
             </div>

             <DialogFooter className="pt-4 border-t border-border">
               <Button variant="outline" onClick={() => setAdminProfileEdit(false)} className="px-6">
                 Cancel
               </Button>
               <Button type="submit" className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                 Save Changes
               </Button>
             </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>



      {/* View Team Member Modal */}
      <Dialog open={viewTeamMemberOpen} onOpenChange={setViewTeamMemberOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Team Member Profile
            </DialogTitle>
            <DialogDescription>
              View team member details, performance, and project assignments.
            </DialogDescription>
          </DialogHeader>
          {currentTeamMember && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={currentTeamMember.profilePic} />
                  <AvatarFallback className="text-lg">{currentTeamMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{currentTeamMember.name}</h3>
                  <p className="text-muted-foreground">{currentTeamMember.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{currentTeamMember.role}</Badge>
                    <Badge variant="secondary">{currentTeamMember.department}</Badge>
                    <Badge variant={currentTeamMember.status === "Active" ? "default" : "secondary"}>
                      {currentTeamMember.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-sm">{currentTeamMember.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Joined Date</label>
                    <p className="text-sm">{currentTeamMember.joinedDate}</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{currentTeamMember.completedTasks}</p>
                    <p className="text-sm text-muted-foreground">Completed Tasks</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{currentTeamMember.currentProjects}</p>
                    <p className="text-sm text-muted-foreground">Current Projects</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{currentTeamMember.performance}%</p>
                    <p className="text-sm text-muted-foreground">Performance</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTeamMember.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Modal */}
      <Dialog open={editTeamMemberOpen} onOpenChange={setEditTeamMemberOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Team Member
            </DialogTitle>
            <DialogDescription>
              Update team member information, role, and project assignments.
            </DialogDescription>
          </DialogHeader>
          {currentTeamMember && (
            <form className="space-y-6" onSubmit={e => {
              e.preventDefault();
              console.log('Team member updated:', currentTeamMember);
              setEditTeamMemberOpen(false);
              alert("Team member updated successfully!");
            }}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Team Member Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input 
                      defaultValue={currentTeamMember.name}
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <Input 
                      defaultValue={currentTeamMember.email}
                      type="email" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Role</label>
                    <Select defaultValue={currentTeamMember.role}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(new Set(teamMembers.map(m => m.role))).map(role => (
                          <SelectItem key={String(role)} value={String(role)}>{String(role)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Team</label>
                    <Select defaultValue={currentTeamMember.department}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map(team => (
                          <SelectItem key={team} value={team}>{team}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <Select defaultValue={currentTeamMember.status}>
                      <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <Input 
                      defaultValue={currentTeamMember.phone}
                      placeholder="+251 912345678" 
                      className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setEditTeamMemberOpen(false)} className="px-6">
                  Cancel
                </Button>
                <Button type="submit" className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Team Member
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Action Modal */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit Team Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have selected {selectedTeamMembers.length} team member(s). Choose an action to apply to all selected members.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Change Role</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(teamMembers.map(m => m.role))).map(role => (
                    <SelectItem key={String(role)} value={String(role)}>{String(role)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Change Team</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select new team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Change Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setBulkActionOpen(false);
              alert("Bulk update applied successfully!");
            }}>
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Progress to User Modal */}
      <Dialog open={sendProgressOpen} onOpenChange={setSendProgressOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Project Progress Update</DialogTitle>
            <DialogDescription>
              Update your client on the current project progress and milestones
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              // Validate required fields
              if (!progressData.projectId || !progressData.clientId || !progressData.progressPercentage || !progressData.currentStatus) {
                alert("Please fill in all required fields (Project, Client, Progress %, Current Status)");
                return;
              }

              const { apiClient } = await import("@/lib/api");
              // Find the selected project and client
              const selectedProject = projects.find(p => String(p.id) === progressData.projectId);
              const selectedClient = users.find(u => u.name === progressData.clientId);
              
              if (!selectedProject) {
                alert("Please select a valid project");
                return;
              }
              
              if (!selectedClient) {
                alert("Please select a valid client");
                return;
              }
              
              const response = await apiClient.post('/progress-updates', {
                project: selectedProject.project_title || selectedProject.title || selectedProject.name || progressData.projectId,
                client_name: progressData.clientId,
                progress: parseInt(progressData.progressPercentage),
                current_status: progressData.currentStatus,
                completed_milestones: progressData.completedMilestones,
                next_deadline: progressData.nextDeadline,
                last_update: progressData.lastUpdate,
                notes: progressData.notes
              });
              console.log('Progress update sent:', response);
              setProgressData({
                clientId: "",
                projectId: "",
                progressPercentage: "",
                completedMilestones: "",
                currentStatus: "",
                nextDeadline: "",
                lastUpdate: "2024-01-15",
                notes: "",
                attachments: []
              });
              setSendProgressOpen(false);
              alert("Progress update sent successfully!");
              // Refresh progress updates list
              refreshProgressUpdates();
            } catch (error) {
              console.error('Error sending progress update:', error);
              alert("Failed to send progress update. Please try again.");
            }
          }} className="space-y-6">
            
            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientId">Client</Label>
                  <Select value={progressData.clientId} onValueChange={(value) => setProgressData(prev => ({ ...prev, clientId: value }))}>
                    <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersLoading ? (
                        <SelectItem disabled value="loading">Loading users...</SelectItem>
                      ) : usersError ? (
                        <SelectItem disabled value="error">{usersError}</SelectItem>
                      ) : users && users.length > 0 ? (
                        users
                          .filter(user =>
                            user.email !== "admin@hawi.com" &&
                            user.email !== "admin@hawisoftware.com" &&
                            user.role?.toLowerCase() !== "admin"
                          )
                          .map(user => (
                            <SelectItem key={user.id} value={user.name}>{user.name} ({user.email})</SelectItem>
                          ))
                      ) : (
                        <SelectItem disabled value="no-users">No users available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="projectId">Project</Label>
                  <Select value={progressData.projectId} onValueChange={(value) => setProgressData(prev => ({ ...prev, projectId: value }))}>
                    <SelectTrigger className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectsLoading ? (
                        <SelectItem disabled value="loading">Loading projects...</SelectItem>
                      ) : projectsError ? (
                        <SelectItem disabled value="error">{projectsError}</SelectItem>
                      ) : projects && projects.length > 0 ? (
                        projects.map(project => (
                          <SelectItem key={String(project.id)} value={String(project.id)}>{project.project_title || project.title || project.name}</SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-projects">No projects available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Progress Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600 border-b border-green-200 pb-2">Progress Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="progressPercentage">Progress Percentage</Label>
                  <Input
                    id="progressPercentage"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="75"
                    value={progressData.progressPercentage}
                    onChange={(e) => setProgressData(prev => ({ ...prev, progressPercentage: e.target.value }))}
                    className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="currentStatus">Current Status</Label>
                  <Select value={progressData.currentStatus} onValueChange={(value) => setProgressData(prev => ({ ...prev, currentStatus: value }))}>
                  <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Testing">Testing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nextDeadline">Next Deadline</Label>
                  <Input
                    id="nextDeadline"
                    type="date"
                    value={progressData.nextDeadline}
                    onChange={(e) => setProgressData(prev => ({ ...prev, nextDeadline: e.target.value }))}
                    className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="lastUpdate">Last Update</Label>
                  <Input
                    id="lastUpdate"
                    type="date"
                    value={progressData.lastUpdate}
                    onChange={(e) => setProgressData(prev => ({ ...prev, lastUpdate: e.target.value }))}
                    className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="completedMilestones">Completed Milestones</Label>
                <Textarea
                  id="completedMilestones"
                  placeholder="List completed milestones and achievements..."
                  value={progressData.completedMilestones}
                  onChange={(e) => setProgressData(prev => ({ ...prev, completedMilestones: e.target.value }))}
                  className="min-h-[100px] border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 border-b border-purple-200 pb-2">Additional Notes</h3>
              <div>
                <Label htmlFor="notes">Notes for Client</Label>
                <Textarea
                  id="notes"
                  placeholder="Provide any additional information, challenges, or updates for the client..."
                  value={progressData.notes}
                  onChange={(e) => setProgressData(prev => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[120px] border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setSendProgressOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Send Progress Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Receive New Project Request Modal */}
      <Dialog open={receiveRequestOpen} onOpenChange={setReceiveRequestOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Project Request Details</DialogTitle>
            <DialogDescription>
              Review and manage incoming project request from client
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log('Project request processed:', newProjectRequest);
            setNewProjectRequest({
              clientName: "",
              clientEmail: "",
              projectTitle: "",
              projectType: "",
              description: "",
              timeline: "",
              budget: "",
              requirements: "",
              features: "",
              targetAudience: "",
              additionalNotes: ""
            });
            setReceiveRequestOpen(false);
            alert("Project request processed successfully!");
          }} className="space-y-6">
            
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client name"
                    value={newProjectRequest.clientName}
                    onChange={(e) => setNewProjectRequest(prev => ({ ...prev, clientName: e.target.value }))}
                    className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={newProjectRequest.clientEmail}
                    onChange={(e) => setNewProjectRequest(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="h-11 border-blue-500/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600 border-b border-green-200 pb-2">Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectTitle">Project Title</Label>
                  <Input
                    id="projectTitle"
                    placeholder="Enter project title"
                    value={newProjectRequest.projectTitle}
                    onChange={(e) => setNewProjectRequest(prev => ({ ...prev, projectTitle: e.target.value }))}
                    className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select value={newProjectRequest.projectType} onValueChange={(value) => setNewProjectRequest(prev => ({ ...prev, projectType: value }))}>
                    <SelectTrigger className="h-11 border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the project in detail..."
                  value={newProjectRequest.description}
                  onChange={(e) => setNewProjectRequest(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px] border-green-500/20 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Timeline & Budget */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-600 border-b border-purple-200 pb-2">Timeline</h3>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select value={newProjectRequest.timeline} onValueChange={(value) => setNewProjectRequest(prev => ({ ...prev, timeline: value }))}>
                  <SelectTrigger className="h-11 border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="2 months">2 months</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="4 months">4 months</SelectItem>
                    <SelectItem value="5 months">5 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="6+ months">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Requirements & Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-2">Requirements & Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requirements">Key Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List the main requirements and functionality needed..."
                    value={newProjectRequest.requirements}
                    onChange={(e) => setNewProjectRequest(prev => ({ ...prev, requirements: e.target.value }))}
                    className="min-h-[100px] border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="features">Desired Features</Label>
                  <Textarea
                    id="features"
                    placeholder="List the features and capabilities desired..."
                    value={newProjectRequest.features}
                    onChange={(e) => setNewProjectRequest(prev => ({ ...prev, features: e.target.value }))}
                    className="min-h-[100px] border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="Describe the target audience for this project"
                  value={newProjectRequest.targetAudience}
                  onChange={(e) => setNewProjectRequest(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="h-11 border-orange-500/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-600 border-b border-gray-200 pb-2">Additional Notes</h3>
              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional information, special requirements, or notes..."
                  value={newProjectRequest.additionalNotes}
                  onChange={(e) => setNewProjectRequest(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  className="min-h-[100px] border-gray-500/20 focus:border-gray-500/50 focus:ring-2 focus:ring-gray-500/20 transition-all duration-200"
                />
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setReceiveRequestOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Process Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Response Message Dialog */}
      <Dialog open={responseMessageOpen} onOpenChange={setResponseMessageOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Response Message</DialogTitle>
            <DialogDescription>
              Send a response message to the client or team member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="response-to">To</Label>
              <Input 
                id="response-to"
                value={responseMessageData.to}
                onChange={(e) => setResponseMessageData({ ...responseMessageData, to: e.target.value })}
                className="h-11"
                placeholder="Recipient email"
              />
            </div>
            <div>
              <Label htmlFor="response-subject">Subject</Label>
              <Input 
                id="response-subject"
                value={responseMessageData.subject}
                onChange={(e) => setResponseMessageData({ ...responseMessageData, subject: e.target.value })}
                className="h-11"
                placeholder="Message subject"
              />
            </div>
            <div>
              <Label htmlFor="response-message">Message</Label>
              <Textarea 
                id="response-message"
                value={responseMessageData.message}
                onChange={(e) => setResponseMessageData({ ...responseMessageData, message: e.target.value })}
                className="min-h-[200px]"
                placeholder="Type your response message here..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseMessageOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:8000/api/usermessages', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    body: JSON.stringify({
                      subject: responseMessageData.subject,
                      message: responseMessageData.message,
                      recipient: responseMessageData.to,
                      priority: 'Normal'
                    }),
                  });

                  if (response.ok) {
                    console.log('Response message sent successfully');
                    alert('Response sent successfully!');
                    setResponseMessageOpen(false);
                    setResponseMessageData({ to: "", subject: "", message: "" });
                    
                    // Refresh messages
                    import("@/lib/api").then(({ apiClient }) => {
                      apiClient.get('/usermessages').then((res: any) => {
                        setMessages(Array.isArray(res) ? res : []);
                      }).catch(() => {
                        console.error('Failed to refresh messages');
                      });
                    });
                  } else {
                    const errorData = await response.json().catch(() => ({}));
                    alert(`Failed to send response: ${errorData.message || 'Please try again.'}`);
                  }
                } catch (error) {
                  console.error('Error sending response:', error);
                  alert('Error sending response. Please try again.');
                }
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Request Action Dialog */}
      <Dialog open={requestAction.open} onOpenChange={(open) => setRequestAction({ ...requestAction, open })}>
        <DialogContent className="max-w-2xl z-[99999]">
          <DialogHeader>
            <DialogTitle>
              {requestAction.type === 'view' ? 'View Service Request Details' : 
               requestAction.type === 'edit' ? 'Edit Service Request' : 'Delete Service Request'}
            </DialogTitle>
            <DialogDescription>
              {requestAction.type === 'view' ? 'View service request details and status' : 
               requestAction.type === 'edit' ? 'Edit service request information and feedback' : 
               'Delete service request from the system'}
            </DialogDescription>
          </DialogHeader>
          
          {requestAction.type === 'view' && requestAction.request && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="text-sm">{requestAction.request.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                  <Badge variant={requestAction.request.priority === "High" ? "destructive" : requestAction.request.priority === "Medium" ? "default" : "secondary"}>
                    {requestAction.request.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={requestAction.request.status === "Open" ? "destructive" : requestAction.request.status === "In Progress" ? "default" : "secondary"}>
                    {requestAction.request.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Submitted Date</Label>
                  <p className="text-sm">{requestAction.request.submittedDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <p className="text-sm">{requestAction.request.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Project Related</Label>
                  <p className="text-sm">{requestAction.request.projectRelated}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Urgency</Label>
                  <p className="text-sm">{requestAction.request.urgency}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Expected Resolution</Label>
                  <p className="text-sm">{requestAction.request.expectedResolution}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm">{requestAction.request.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
                <p className="text-sm">{requestAction.request.additionalNotes}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                <p className="text-sm">{requestAction.request.assignedTo}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Feedback</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= requestAction.request.feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm">({requestAction.request.feedback.rating}/5)</span>
                  </div>
                  <Badge variant={requestAction.request.feedback.rating >= 4 ? "default" : requestAction.request.feedback.rating >= 3 ? "secondary" : "destructive"}>
                    {requestAction.request.feedback.satisfaction}
                  </Badge>
                  <p className="text-sm">{requestAction.request.feedback.comment}</p>
                  <p className="text-sm text-muted-foreground">Improvement: {requestAction.request.feedback.improvement}</p>
                </div>
              </div>
            </div>
          )}

          {requestAction.type === 'edit' && requestAction.request && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-request-title">Title</Label>
                <Input 
                  id="edit-request-title"
                  defaultValue={requestAction.request.title}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="edit-request-description">Description</Label>
                <Textarea 
                  id="edit-request-description"
                  defaultValue={requestAction.request.description}
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-request-priority">Priority</Label>
                  <Select defaultValue={requestAction.request.priority}>
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
                  <Select defaultValue={requestAction.request.status}>
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
              <div>
                <Label htmlFor="edit-request-category">Category</Label>
                <Input 
                  id="edit-request-category"
                  defaultValue={requestAction.request.category}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="edit-request-notes">Additional Notes</Label>
                <Textarea 
                  id="edit-request-notes"
                  defaultValue={requestAction.request.additionalNotes}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}

        {requestAction.type === 'delete' && requestAction.request && (
            <div className="space-y-4">
              <p>Are you sure you want to delete the service request "{requestAction.request.title}"?</p>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestAction({ open: false, type: '', request: null })}>
                Cancel
              </Button>
            {requestAction.type === 'edit' && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => {
                console.log('Save service request changes');
                setRequestAction({ open: false, type: '', request: null });
              }}>
                Save Changes
              </Button>
            )}
            {requestAction.type === 'delete' && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => {
                console.log('Delete service request:', requestAction.request?.id);
                setRequestAction({ open: false, type: '', request: null });
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
              {messageAction.type === 'view' ? 'View message details and content' : 
               messageAction.type === 'edit' ? 'Edit message content and settings' : 
               'Delete message from the system'}
            </DialogDescription>
          </DialogHeader>
          
          {messageAction.type === 'view' && messageAction.message && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">To</Label>
                  <p className="text-sm">{messageAction.message.to || 'Admin'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{messageAction.message.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Subject</Label>
                  <p className="text-sm">{messageAction.message.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={messageAction.message.status === "Unread" ? "destructive" : "secondary"}>
                    {messageAction.message.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                  <p className="text-sm">{messageAction.message.time}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Message Content</Label>
                <p className="text-sm">{messageAction.message.content}</p>
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
                <Label htmlFor="edit-message-content">Message Content</Label>
                <Textarea 
                  id="edit-message-content"
                  defaultValue={messageAction.message.content}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="edit-message-status">Status</Label>
                <Select defaultValue={messageAction.message.status}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100]">
                    <SelectItem value="Unread">Unread</SelectItem>
                    <SelectItem value="Read">Read</SelectItem>
                  </SelectContent>
                </Select>
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
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => {
                console.log('Save message changes');
                setMessageAction({ open: false, type: '', message: null });
              }}>
                Save Changes
              </Button>
            )}
            {messageAction.type === 'delete' && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => {
                console.log('Delete message:', messageAction.message?.id);
                setMessageAction({ open: false, type: '', message: null });
              }}>
                Delete Message
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};
}
export default AdminDashboard;
