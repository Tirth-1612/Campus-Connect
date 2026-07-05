import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';

import ProtectedRoute from './routes/ProtectedRoute';

import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentClubs from './pages/student/Clubs';
import StudentSavedAnnouncements from './pages/student/SavedAnnouncements';
import StudentSavedEvents from './pages/student/SavedEvents';

import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyProfile from './pages/faculty/Profile';
import CreateAnnouncementFaculty from './pages/faculty/CreateAnnouncement';
import CreateEventFaculty from './pages/faculty/CreateEvent';
import FacultySavedAnnouncements from './pages/faculty/SavedAnnouncements';
import FacultySavedEvents from './pages/faculty/SavedEvents';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import AdminCreateAnnouncement from './pages/admin/CreateAnnouncement';
import AdminCreateEvent from './pages/admin/CreateEvent';
import AdminCreateClub from './pages/admin/CreateClub';
import JoinRequests from './pages/admin/JoinRequests';
import ClubMembers from './pages/admin/ClubMembers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student */}
        <Route element={<ProtectedRoute roles={['student']} />}>
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/student/profile" element={<StudentProfile />} />
          <Route path="/dashboard/student/clubs" element={<StudentClubs />} />
          <Route path="/dashboard/student/saved/announcements" element={<StudentSavedAnnouncements />} />
          <Route path="/dashboard/student/saved/events" element={<StudentSavedEvents />} />
        </Route>

        {/* Faculty */}
        <Route element={<ProtectedRoute roles={['faculty']} />}>
          <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
          <Route path="/dashboard/faculty/profile" element={<FacultyProfile />} />
          <Route path="/dashboard/faculty/announcements/create" element={<CreateAnnouncementFaculty />} />
          <Route path="/dashboard/faculty/events/create" element={<CreateEventFaculty />} />
          <Route path="/dashboard/faculty/saved/announcements" element={<FacultySavedAnnouncements />} />
          <Route path="/dashboard/faculty/saved/events" element={<FacultySavedEvents />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/profile" element={<AdminProfile />} />
          <Route path="/dashboard/admin/announcements/create" element={<AdminCreateAnnouncement />} />
          <Route path="/dashboard/admin/events/create" element={<AdminCreateEvent />} />
          <Route path="/dashboard/admin/clubs/create" element={<AdminCreateClub />} />
          <Route path="/dashboard/admin/requests" element={<JoinRequests />} />
          <Route path="/dashboard/admin/members" element={<ClubMembers />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//saved events and annoucements --> app.jsx, /components/cards/EventCard.jsx,  /components/cards/AnnoucementCard.jsx, /components/common/sidebar.jsx