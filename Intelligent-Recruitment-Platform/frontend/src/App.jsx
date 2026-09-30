import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CandidateDashboard from "./pages/candidate/Dashboard";
import Jobs from "./pages/candidate/Jobs";
import JobDetails from "./pages/candidate/JobDetails";
import Applications from "./pages/candidate/Applications";
import SavedJobs from "./pages/candidate/SavedJobs";
import Matching from "./pages/candidate/Matching";
import Interviews from "./pages/candidate/Interviews";
import Notifications from "./pages/candidate/Notifications";
import Profile from "./pages/candidate/Profile";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import MyJobs from "./pages/recruiter/MyJobs";
import RecruiterJobDetails from "./pages/recruiter/RecruiterJobDetails";
import EditJob from "./pages/recruiter/EditJob";
import RecruiterApplications from "./pages/recruiter/Applications";
import CreateJob from "./pages/recruiter/CreateJob";
import RecruiterInterviews from "./pages/recruiter/Interviews";
import RecruiterNotifications from "./pages/recruiter/Notifications";
import RecruiterProfile from "./pages/recruiter/Profile";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />

        {/* Candidate */}
       <Route
  path="/candidate/dashboard"
  element={<CandidateDashboard />}
/>

        <Route
  path="/candidate/jobs"
  element={<Jobs />}
/>
<Route
  path="/candidate/jobs/:id"
  element={<JobDetails />}
/>

        <Route
  path="/candidate/applications"
  element={<Applications />}
/>
        <Route
  path="/candidate/saved-jobs"
  element={<SavedJobs />}
/>
        <Route
  path="/candidate/matching"
  element={<Matching />}
/>

        <Route
  path="/candidate/interviews"
  element={<Interviews />}
/>

        <Route
  path="/candidate/notifications"
  element={<Notifications />}
/>
<Route
  path="/candidate/profile"
  element={<Profile />}
/>
        {/* Recruiter */}
        <Route
  path="/recruiter/dashboard"
  element={<RecruiterDashboard />}
/>

        <Route
  path="/recruiter/jobs"
  element={<MyJobs />}
/>
<Route
  path="/recruiter/jobs/:id"
  element={<RecruiterJobDetails />}
/>
<Route
  path="/recruiter/jobs/:id/edit"
  element={<EditJob />}
/>
        <Route
    path="/recruiter/jobs/create"
    element={<CreateJob />}
/>

        <Route
    path="/recruiter/applications"
    element={<RecruiterApplications />}
/>
        <Route
    path="/recruiter/interviews"
    element={<RecruiterInterviews />}
/>

        <Route
    path="/recruiter/notifications"
    element={<RecruiterNotifications />}
/>
<Route
    path="/recruiter/profile"
    element={<RecruiterProfile />}
/>
        {/* Home */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;