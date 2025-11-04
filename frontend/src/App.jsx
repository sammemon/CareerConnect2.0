import MessagesInbox from './pages/MessagesInbox';
import UserProfileEdit from './pages/UserProfileEdit';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobCategories from './pages/JobCategories';
import JobsMainCategories from './pages/JobsMainCategories';
import JobsSubCategories from './pages/JobsSubCategories';
import InternshipsMainCategories from './pages/InternshipsMainCategories';
import InternshipsSubCategories from './pages/InternshipsSubCategories';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import UserProfile from './pages/UserProfile';
import Messages from './pages/Messages';
import PostJob from './pages/PostJob';
import AdminPanel from './pages/AdminPanel';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import CareerAdvice from './pages/CareerAdvice';
import CareerAdviceResult from './pages/CareerAdviceResult';
import LearnMore from './pages/LearnMore';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Jobs Routes */}
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/job-categories" element={<JobCategories />} />
                <Route path="/jobs-categories" element={<JobsMainCategories />} />
                <Route path="/jobs-categories/:mainCategory" element={<JobsSubCategories />} />
                <Route path="/jobs/category/:categoryId" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                
                {/* Internships Routes */}
                <Route path="/internships-categories" element={<InternshipsMainCategories />} />
                <Route path="/internships-categories/:mainCategory" element={<InternshipsSubCategories />} />

                <Route path="/" element={<Home />} />
						<Route path="/career-advice" element={<CareerAdvice />} />
						<Route path="/career-advice/result" element={<CareerAdviceResult />} />
						<Route path="/learn-more" element={<LearnMore />} />
						<Route path="/jobs" element={<Jobs />} />
						<Route path="*" element={<Navigate to="/" replace />} />
                
                {/* Other Public Routes */}
                <Route path="/profile-view" element={<PublicProfile />} />
                <Route path="/u/:id" element={<UserProfile />} />
                <Route path="/messages/:userId" element={<Messages />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<About />} />

                {/* Protected Routes - All Authenticated Users */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile-edit"
                  element={
                    <ProtectedRoute>
                      <UserProfileEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages-inbox"
                  element={
                    <ProtectedRoute>
                      <MessagesInbox />
                    </ProtectedRoute>
                  }
                />

                {/* Employer Routes */}
                <Route
                  path="/post-job"
                  element={
                    <ProtectedRoute allowedRoles={['employer']}>
                      <PostJob />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                {/* Contact Us Route */}
                <Route path="/contact" element={<ContactUs />} />
                {/* About Us Route */}
                <Route path="/about" element={<About />} />

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
