import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Forgot from "./components/Forgot";
import ResetPassword from "./components/ResetPassword";
import NavBar from "./components/NavBar";
import AdminDashboard from "./components/AdminDashboard";
import ClientDashboard from "./components/ClientDashboard";
import UserList from "./components/UserList";
import MyBid from "./components/MyBid";
import FreelancerDashboard from "./components/FreelancerDashboard";
import PostProject from "./components/PostProject";
import Project from "./components/Project";
import Home from "./components/Home";
import Feedback from "./components/Feedback";
import FeedbackList from "./components/FeedbackList"; // Import Feedback Page
import Profile from "./components/Profile";
import FreelancerProfile from "./components/FreelancerProfile";
import ManageProjects from "./components/ManageProjects";
import { Outlet } from "react-router-dom";
import Payment from "./components/Payment";
import PaymentHistory from "./components/PaymentHistory";
import Earnings from "./components/Earnings"; // ✅ Add this line
import TransactionMonitoring from "./components/TransactionMonitoring";


  

import Viewbids from "./components/Viewbids";
import OngoingProjects from "./components/OngoingProjects";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/navbar" element={<NavBar />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Dashboard with Nested Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="userlist" element={<UserList />} />
            <Route path="feedback" element={<FeedbackList />} /> {/* Feedback Page */}
            <Route path="transactions" element={<TransactionMonitoring />} /> {/* ✅ Added Route */}
          </Route>

          {/* Client Routes */}
          <Route path="/client-dashboard" element={<ClientDashboard />}>
  <Route path="viewbids" element={<Viewbids />} />
  <Route path="payment" element={<Payment />} />
  <Route path="payment-history" element={<PaymentHistory />} />

  <Route path="manage-projects" element={<ManageProjects />} />
</Route>

          <Route path="/profile" element={<Profile />} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/feedback" element={<Feedback />} />
          
         

          {/* Freelancer Dashboard with Nested Routes */}
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />}>
          <Route path="ongoing" element={<OngoingProjects />} />


          <Route path="project" element={<Project />} />
          <Route path="bids" element={<MyBid />} />
          <Route path="earnings" element={<Earnings />} />  // ✅ Add this line

  {/* Other nested routes */}
</Route>
            
            <Route path="/profile" element={<FreelancerProfile />} />  // ✅ Separate Route

          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
