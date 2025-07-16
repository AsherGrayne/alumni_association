import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('token');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (token) {
      // Verify token and set user
      setIsLoggedIn(true);
    }
    setIsDarkMode(savedDarkMode);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'directory':
        return <DirectoryTab />;
      case 'jobs':
        return <JobsTab currentUser={currentUser} isLoggedIn={isLoggedIn} />;
      case 'events':
        return <EventsTab currentUser={currentUser} isLoggedIn={isLoggedIn} />;
      case 'donations':
        return <DonationsTab currentUser={currentUser} isLoggedIn={isLoggedIn} />;
      case 'stories':
        return <StoriesTab />;
      case 'profile':
        return <ProfileTab currentUser={currentUser} isLoggedIn={isLoggedIn} />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">Alumni Association</h1>
          <nav className="nav-menu">
            <button 
              className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
            <button 
              className={`nav-btn ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => setActiveTab('directory')}
            >
              Directory
            </button>
            <button 
              className={`nav-btn ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </button>
            <button 
              className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
            <button 
              className={`nav-btn ${activeTab === 'donations' ? 'active' : ''}`}
              onClick={() => setActiveTab('donations')}
            >
              Donations
            </button>
            <button 
              className={`nav-btn ${activeTab === 'stories' ? 'active' : ''}`}
              onClick={() => setActiveTab('stories')}
            >
              Success Stories
            </button>
            {isLoggedIn && (
              <button 
                className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            )}
          </nav>
          <div className="auth-section">
            {!isLoggedIn ? (
              <AuthButtons onLogin={handleLogin} />
            ) : (
              <div className="user-info">
                <span>Welcome, {currentUser?.firstName || 'Alumni'}!</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {renderContent()}
      </main>

      {/* Dark Mode Toggle Button */}
      <div className="dark-mode-button-container">
        <button 
          className={`dark-mode-button ${isDarkMode ? 'dark' : 'light'}`}
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// Component for Authentication
function AuthButtons({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    graduationYear: '',
    fieldOfStudy: ''
  });

  const handleSubmit = async (e, isLogin = true) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        onLogin(data);
        setShowLogin(false);
        setShowRegister(false);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Connection error. Please try again.');
    }
  };

  return (
    <div className="auth-buttons">
      <button className="login-btn" onClick={() => setShowLogin(true)}>
        Login
      </button>
      <button className="register-btn" onClick={() => setShowRegister(true)}>
        Register
      </button>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Login</h2>
            <form onSubmit={(e) => handleSubmit(e, true)}>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Login</button>
                <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Register</h2>
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Graduation Year"
                value={formData.graduationYear}
                onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Register</button>
                <button type="button" onClick={() => setShowRegister(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Tab Components
function HomeTab() {
  return (
    <div className="tab-content">
      <h2>Welcome to Alumni Association</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>1,250+ <span className="demo-tag">demo</span></h3>
          <p>Active Alumni</p>
        </div>
        <div className="stat-card">
          <h3>50+ <span className="demo-tag">demo</span></h3>
          <p>Companies</p>
        </div>
        <div className="stat-card">
          <h3>25+ <span className="demo-tag">demo</span></h3>
          <p>Events This Year</p>
        </div>
        <div className="stat-card">
          <h3>$50K+ <span className="demo-tag">demo</span></h3>
          <p>Total Donations</p>
        </div>
      </div>
      <div className="feature-highlights">
        <h3>Platform Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <h4>Alumni Directory</h4>
            <p>Connect with fellow graduates and expand your professional network through our comprehensive alumni directory.</p>
          </div>
          <div className="feature-item">
            <h4>Job Portal</h4>
            <p>Find career opportunities and post job openings within the alumni network to support professional growth.</p>
          </div>
          <div className="feature-item">
            <h4>Events & Reunions</h4>
            <p>Stay updated on upcoming events, reunions, and professional development opportunities.</p>
          </div>
          <div className="feature-item">
            <h4>Donations</h4>
            <p>Support your alma mater through secure donation channels to contribute to institutional development.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectoryTab() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alumni');
      if (response.ok) {
        const data = await response.json();
        setAlumni(data);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="tab-content">Loading alumni directory...</div>;
  }

  return (
    <div className="tab-content">
      <h2>Alumni Directory</h2>
      <div className="directory-grid">
        {alumni.map((person) => (
          <div key={person._id} className="alumni-card">
            <div className="alumni-avatar">
              {person.firstName?.[0]}{person.lastName?.[0]}
            </div>
            <div className="alumni-info">
              <h3>{person.firstName} {person.lastName}</h3>
              <p>Class of {person.graduationYear}</p>
              <p>{person.fieldOfStudy}</p>
              {person.currentCompany && (
                <p>Works at {person.currentCompany}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobsTab({ currentUser, isLoggedIn }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(null);
  const [showApplication, setShowApplication] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    field: ''
  });
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    field: '',
    description: '',
    requirements: '',
    salary: '',
    contactEmail: ''
  });
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    resume: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.type) params.append('type', filters.type);
      if (filters.field) params.append('field', filters.field);

      const response = await fetch(`http://localhost:5000/api/jobs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobForm,
          postedBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Anonymous'
        }),
      });
      
      if (response.ok) {
        setShowPostJob(false);
        setJobForm({
          title: '',
          company: '',
          location: '',
          type: 'Full-time',
          field: '',
          description: '',
          requirements: '',
          salary: '',
          contactEmail: ''
        });
        fetchJobs();
        alert('Job posted successfully!');
      } else {
        alert('Error posting job');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please login to apply for jobs');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${showApplication.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantId: currentUser.id,
          ...applicationForm
        }),
      });
      
      if (response.ok) {
        setShowApplication(null);
        setApplicationForm({ coverLetter: '', resume: '' });
        alert('Application submitted successfully!');
      } else {
        alert('Error submitting application');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
    }
  };

  if (loading) {
    return <div className="tab-content">Loading jobs...</div>;
  }

  return (
    <div className="tab-content">
      <div className="jobs-header">
        <h2>Job Portal</h2>
        {isLoggedIn && (
          <button 
            className="post-job-btn"
            onClick={() => setShowPostJob(true)}
          >
            Post a Job
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="jobs-filters">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
          className="filter-input"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <input
          type="text"
          placeholder="Field"
          value={filters.field}
          onChange={(e) => setFilters({...filters, field: e.target.value})}
          className="filter-input"
        />
      </div>

      {/* Jobs List */}
      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className="job-company">{job.company} <span className="demo-tag">demo</span></span>
            </div>
            <div className="job-details">
              <p className="job-location">{job.location}</p>
              <p className="job-type">{job.type}</p>
              <p className="job-salary">{job.salary}</p>
            </div>
            <p className="job-description">{job.description.substring(0, 150)}...</p>
            <div className="job-actions">
              <button 
                className="view-job-btn"
                onClick={() => setShowJobDetail(job)}
              >
                View Details
              </button>
              {isLoggedIn && (
                <button 
                  className="apply-job-btn"
                  onClick={() => setShowApplication(job)}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Job Modal */}
      {showPostJob && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Post a Job</h2>
            <form onSubmit={handlePostJob}>
              <input
                type="text"
                placeholder="Job Title"
                value={jobForm.title}
                onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={jobForm.company}
                onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={jobForm.location}
                onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                required
              />
              <select
                value={jobForm.type}
                onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              <input
                type="text"
                placeholder="Field"
                value={jobForm.field}
                onChange={(e) => setJobForm({...jobForm, field: e.target.value})}
                required
              />
              <textarea
                placeholder="Job Description"
                value={jobForm.description}
                onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                required
                rows="4"
              />
              <textarea
                placeholder="Requirements"
                value={jobForm.requirements}
                onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                required
                rows="3"
              />
              <input
                type="text"
                placeholder="Salary Range"
                value={jobForm.salary}
                onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Contact Email"
                value={jobForm.contactEmail}
                onChange={(e) => setJobForm({...jobForm, contactEmail: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Post Job</button>
                <button type="button" onClick={() => setShowPostJob(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {showJobDetail && (
        <div className="modal-overlay">
          <div className="modal job-detail-modal">
            <h2>{showJobDetail.title}</h2>
            <div className="job-detail-info">
              <p><strong>Company:</strong> {showJobDetail.company} <span className="demo-tag">demo</span></p>
              <p><strong>Location:</strong> {showJobDetail.location}</p>
              <p><strong>Type:</strong> {showJobDetail.type}</p>
              <p><strong>Field:</strong> {showJobDetail.field}</p>
              <p><strong>Salary:</strong> {showJobDetail.salary}</p>
              <p><strong>Posted by:</strong> {showJobDetail.postedBy} <span className="demo-tag">demo</span></p>
              <p><strong>Posted:</strong> {new Date(showJobDetail.postedDate).toLocaleDateString()}</p>
            </div>
            <div className="job-detail-content">
              <h3>Description</h3>
              <p>{showJobDetail.description}</p>
              <h3>Requirements</h3>
              <p>{showJobDetail.requirements}</p>
            </div>
            <div className="modal-buttons">
              {isLoggedIn && (
                <button 
                  onClick={() => {
                    setShowJobDetail(null);
                    setShowApplication(showJobDetail);
                  }}
                >
                  Apply Now
                </button>
              )}
              <button onClick={() => setShowJobDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplication && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Apply for {showApplication.title}</h2>
            <form onSubmit={handleApply}>
              <textarea
                placeholder="Cover Letter"
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                required
                rows="6"
              />
              <textarea
                placeholder="Resume/Experience Summary"
                value={applicationForm.resume}
                onChange={(e) => setApplicationForm({...applicationForm, resume: e.target.value})}
                required
                rows="4"
              />
              <div className="modal-buttons">
                <button type="submit">Submit Application</button>
                <button type="button" onClick={() => setShowApplication(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EventsTab({ currentUser, isLoggedIn }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(null);
  const [showRegistration, setShowRegistration] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Reunion',
    capacity: '',
    organizer: '',
    contactEmail: ''
  });
  const [registrationForm, setRegistrationForm] = useState({
    attendeeName: '',
    attendeeEmail: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterType) params.append('type', filterType);

      const response = await fetch(`http://localhost:5000/api/events?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventForm,
          organizer: eventForm.organizer || 'Alumni Association',
          contactEmail: eventForm.contactEmail || 'events@alumni.edu'
        }),
      });

      if (response.ok) {
        setShowCreateEvent(false);
        setEventForm({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          type: 'Reunion',
          capacity: '',
          organizer: '',
          contactEmail: ''
        });
        fetchEvents();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error creating event. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/events/${showRegistration.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendeeId: currentUser?.id || 1,
          attendeeName: registrationForm.attendeeName || `${currentUser?.firstName} ${currentUser?.lastName}`,
          attendeeEmail: registrationForm.attendeeEmail || currentUser?.email
        }),
      });

      if (response.ok) {
        setShowRegistration(null);
        setRegistrationForm({
          attendeeName: '',
          attendeeEmail: ''
        });
        fetchEvents();
        alert('Registration successful!');
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error registering for event. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Reunion': '#4CAF50',
      'Networking': '#2196F3',
      'Workshop': '#FF9800',
      'Homecoming': '#9C27B0',
      'Conference': '#F44336'
    };
    return colors[type] || '#666';
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Events & Reunions</h2>
        <div className="tab-actions">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="Reunion">Reunion</option>
              <option value="Networking">Networking</option>
              <option value="Workshop">Workshop</option>
              <option value="Homecoming">Homecoming</option>
              <option value="Conference">Conference</option>
            </select>
            <button onClick={fetchEvents} className="search-btn">Search</button>
          </div>
          {isLoggedIn && (
            <button 
              onClick={() => setShowCreateEvent(true)}
              className="create-btn"
            >
              Create Event
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <span 
                  className="event-type"
                  style={{ backgroundColor: getEventTypeColor(event.type) }}
                >
                  {event.type}
                </span>
                <span className="demo-tag">demo</span>
              </div>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <p><strong>Date:</strong> {formatDate(event.date)}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Organizer:</strong> {event.organizer}</p>
                <p><strong>Capacity:</strong> {event.registeredCount}/{event.capacity}</p>
              </div>
              <div className="event-actions">
                <button 
                  onClick={() => setShowEventDetail(event)}
                  className="detail-btn"
                >
                  View Details
                </button>
                {isLoggedIn && event.registeredCount < event.capacity && (
                  <button 
                    onClick={() => setShowRegistration(event)}
                    className="register-btn"
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Event</h2>
            <form onSubmit={handleCreateEvent}>
              <input
                type="text"
                placeholder="Event Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Event Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                required
                rows="4"
              />
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                required
              />
              <input
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                required
              />
              <select
                value={eventForm.type}
                onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
                required
              >
                <option value="Reunion">Reunion</option>
                <option value="Networking">Networking</option>
                <option value="Workshop">Workshop</option>
                <option value="Homecoming">Homecoming</option>
                <option value="Conference">Conference</option>
              </select>
              <input
                type="number"
                placeholder="Capacity"
                value={eventForm.capacity}
                onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Organizer"
                value={eventForm.organizer}
                onChange={(e) => setEventForm({...eventForm, organizer: e.target.value})}
              />
              <input
                type="email"
                placeholder="Contact Email"
                value={eventForm.contactEmail}
                onChange={(e) => setEventForm({...eventForm, contactEmail: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="submit">Create Event</button>
                <button type="button" onClick={() => setShowCreateEvent(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showEventDetail && (
        <div className="modal-overlay">
          <div className="modal event-detail-modal">
            <h2>{showEventDetail.title}</h2>
            <div className="event-detail-info">
              <p><strong>Type:</strong> {showEventDetail.type}</p>
              <p><strong>Date:</strong> {formatDate(showEventDetail.date)}</p>
              <p><strong>Time:</strong> {showEventDetail.time}</p>
              <p><strong>Location:</strong> {showEventDetail.location}</p>
              <p><strong>Organizer:</strong> {showEventDetail.organizer} <span className="demo-tag">demo</span></p>
              <p><strong>Contact:</strong> {showEventDetail.contactEmail}</p>
              <p><strong>Capacity:</strong> {showEventDetail.registeredCount}/{showEventDetail.capacity}</p>
            </div>
            <div className="event-detail-content">
              <h3>Description</h3>
              <p>{showEventDetail.description}</p>
            </div>
            <div className="modal-buttons">
              {isLoggedIn && showEventDetail.registeredCount < showEventDetail.capacity && (
                <button 
                  onClick={() => {
                    setShowEventDetail(null);
                    setShowRegistration(showEventDetail);
                  }}
                >
                  Register for Event
                </button>
              )}
              <button onClick={() => setShowEventDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistration && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Register for {showRegistration.title}</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Your Name"
                value={registrationForm.attendeeName}
                onChange={(e) => setRegistrationForm({...registrationForm, attendeeName: e.target.value})}
                defaultValue={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={registrationForm.attendeeEmail}
                onChange={(e) => setRegistrationForm({...registrationForm, attendeeEmail: e.target.value})}
                defaultValue={currentUser?.email || ''}
              />
              <div className="modal-buttons">
                <button type="submit">Register</button>
                <button type="button" onClick={() => setShowRegistration(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DonationsTab({ currentUser, isLoggedIn }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCampaignDetail, setShowCampaignDetail] = useState(null);
  const [showDonate, setShowDonate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    goal: '',
    category: 'Scholarship',
    organizer: '',
    contactEmail: ''
  });
  const [donationForm, setDonationForm] = useState({
    amount: '',
    message: '',
    isAnonymous: false
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory) params.append('category', filterCategory);

      const response = await fetch(`http://localhost:5000/api/campaigns?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...campaignForm,
          organizer: campaignForm.organizer || 'Alumni Association',
          contactEmail: campaignForm.contactEmail || 'donations@alumni.edu'
        }),
      });

      if (response.ok) {
        setShowCreateCampaign(false);
        setCampaignForm({
          title: '',
          description: '',
          goal: '',
          category: 'Scholarship',
          organizer: '',
          contactEmail: ''
        });
        fetchCampaigns();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error creating campaign. Please try again.');
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${showDonate.id}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorId: currentUser?.id || 1,
          donorName: donationForm.isAnonymous ? 'Anonymous' : `${currentUser?.firstName} ${currentUser?.lastName}`,
          donorEmail: currentUser?.email || 'anonymous@email.com',
          amount: donationForm.amount,
          message: donationForm.message,
          isAnonymous: donationForm.isAnonymous
        }),
      });

      if (response.ok) {
        setShowDonate(null);
        setDonationForm({
          amount: '',
          message: '',
          isAnonymous: false
        });
        fetchCampaigns();
        alert('Thank you for your donation!');
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error processing donation. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Scholarship': '#4CAF50',
      'Infrastructure': '#2196F3',
      'Sports': '#FF9800',
      'Research': '#9C27B0',
      'Technology': '#F44336'
    };
    return colors[category] || '#666';
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Donations & Giving</h2>
        <div className="tab-actions">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sports">Sports</option>
              <option value="Research">Research</option>
              <option value="Technology">Technology</option>
            </select>
            <button onClick={fetchCampaigns} className="search-btn">Search</button>
          </div>
          {isLoggedIn && (
            <button 
              onClick={() => setShowCreateCampaign(true)}
              className="create-btn"
            >
              Create Campaign
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading campaigns...</div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-header">
                <span 
                  className="campaign-category"
                  style={{ backgroundColor: getCategoryColor(campaign.category) }}
                >
                  {campaign.category}
                </span>
                <span className="demo-tag">demo</span>
              </div>
              <h3 className="campaign-title">{campaign.title}</h3>
              <p className="campaign-description">{campaign.description}</p>
              <div className="campaign-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                  ></div>
                </div>
                <div className="progress-stats">
                  <span>{formatCurrency(campaign.raised)} raised</span>
                  <span>of {formatCurrency(campaign.goal)} goal</span>
                </div>
              </div>
              <div className="campaign-details">
                <p><strong>Organizer:</strong> {campaign.organizer}</p>
                <p><strong>Contact:</strong> {campaign.contactEmail}</p>
              </div>
              <div className="campaign-actions">
                <button 
                  onClick={() => setShowCampaignDetail(campaign)}
                  className="detail-btn"
                >
                  View Details
                </button>
                <button 
                  onClick={() => setShowDonate(campaign)}
                  className="donate-btn"
                >
                  Donate Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Campaign</h2>
            <form onSubmit={handleCreateCampaign}>
              <input
                type="text"
                placeholder="Campaign Title"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Campaign Description"
                value={campaignForm.description}
                onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                required
                rows="4"
              />
              <input
                type="number"
                placeholder="Fundraising Goal ($)"
                value={campaignForm.goal}
                onChange={(e) => setCampaignForm({...campaignForm, goal: e.target.value})}
                required
              />
              <select
                value={campaignForm.category}
                onChange={(e) => setCampaignForm({...campaignForm, category: e.target.value})}
                required
              >
                <option value="Scholarship">Scholarship</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Sports">Sports</option>
                <option value="Research">Research</option>
                <option value="Technology">Technology</option>
              </select>
              <input
                type="text"
                placeholder="Organizer"
                value={campaignForm.organizer}
                onChange={(e) => setCampaignForm({...campaignForm, organizer: e.target.value})}
              />
              <input
                type="email"
                placeholder="Contact Email"
                value={campaignForm.contactEmail}
                onChange={(e) => setCampaignForm({...campaignForm, contactEmail: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="submit">Create Campaign</button>
                <button type="button" onClick={() => setShowCreateCampaign(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {showCampaignDetail && (
        <div className="modal-overlay">
          <div className="modal campaign-detail-modal">
            <h2>{showCampaignDetail.title}</h2>
            <div className="campaign-detail-info">
              <p><strong>Category:</strong> {showCampaignDetail.category}</p>
              <p><strong>Goal:</strong> {formatCurrency(showCampaignDetail.goal)}</p>
              <p><strong>Raised:</strong> {formatCurrency(showCampaignDetail.raised)}</p>
              <p><strong>Progress:</strong> {getProgressPercentage(showCampaignDetail.raised, showCampaignDetail.goal).toFixed(1)}%</p>
              <p><strong>Organizer:</strong> {showCampaignDetail.organizer} <span className="demo-tag">demo</span></p>
              <p><strong>Contact:</strong> {showCampaignDetail.contactEmail}</p>
            </div>
            <div className="campaign-progress-detail">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage(showCampaignDetail.raised, showCampaignDetail.goal)}%` }}
                ></div>
              </div>
            </div>
            <div className="campaign-detail-content">
              <h3>Description</h3>
              <p>{showCampaignDetail.description}</p>
            </div>
            <div className="modal-buttons">
              <button 
                onClick={() => {
                  setShowCampaignDetail(null);
                  setShowDonate(showCampaignDetail);
                }}
              >
                Donate to Campaign
              </button>
              <button onClick={() => setShowCampaignDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {showDonate && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Donate to {showDonate.title}</h2>
            <form onSubmit={handleDonate}>
              <input
                type="number"
                placeholder="Donation Amount ($)"
                value={donationForm.amount}
                onChange={(e) => setDonationForm({...donationForm, amount: e.target.value})}
                required
                min="1"
              />
              <textarea
                placeholder="Message (Optional)"
                value={donationForm.message}
                onChange={(e) => setDonationForm({...donationForm, message: e.target.value})}
                rows="3"
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={donationForm.isAnonymous}
                  onChange={(e) => setDonationForm({...donationForm, isAnonymous: e.target.checked})}
                />
                Make donation anonymous
              </label>
              <div className="modal-buttons">
                <button type="submit">Donate</button>
                <button type="button" onClick={() => setShowDonate(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StoriesTab() {
  return (
    <div className="tab-content">
      <h2>Success Stories</h2>
      <p>Success stories functionality coming soon. This will showcase alumni achievements and notable contributions.</p>
    </div>
  );
}

function ProfileTab({ currentUser, isLoggedIn }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    graduationYear: currentUser?.graduationYear || '',
    fieldOfStudy: currentUser?.fieldOfStudy || '',
    currentCompany: '',
    jobTitle: '',
    location: '',
    phone: '',
    bio: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sample data for profile sections
  const userActivity = [
    {
      id: 1,
      type: 'donation',
      title: 'Donated to Student Scholarship Fund',
      amount: '$500',
      date: '2024-01-20',
      description: 'Supporting student scholarships'
    },
    {
      id: 2,
      type: 'event',
      title: 'Registered for Annual Alumni Reunion',
      date: '2024-01-15',
      description: 'Looking forward to connecting with fellow alumni'
    },
    {
      id: 3,
      type: 'job',
      title: 'Applied for Senior Software Engineer',
      company: 'TechCorp',
      date: '2024-01-10',
      description: 'Application submitted successfully'
    }
  ];

  const userStats = {
    totalDonations: 3,
    totalAmount: '$1,250',
    eventsAttended: 5,
    jobsApplied: 8,
    profileCompleteness: 85
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would update the user profile via API
      alert('Profile updated successfully!');
      setShowEditProfile(false);
    } catch (error) {
      alert('Error updating profile. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    try {
      // In a real app, this would change the password via API
      alert('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Error changing password. Please try again.');
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      donation: '💰',
      event: '📅',
      job: '💼'
    };
    return icons[type] || '📝';
  };

  const getActivityColor = (type) => {
    const colors = {
      donation: '#4CAF50',
      event: '#2196F3',
      job: '#FF9800'
    };
    return colors[type] || '#666';
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="tab-content">
        <h2>Profile</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button 
          onClick={() => setShowEditProfile(true)}
          className="edit-profile-btn"
        >
          Edit Profile
        </button>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
              </div>
            </div>
            <div className="profile-info">
              <h3>{currentUser.firstName} {currentUser.lastName}</h3>
              <p className="profile-email">{currentUser.email}</p>
              <p className="profile-graduation">Class of {currentUser.graduationYear}</p>
              <p className="profile-field">{currentUser.fieldOfStudy}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{userStats.totalDonations}</span>
                <span className="stat-label">Donations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userStats.eventsAttended}</span>
                <span className="stat-label">Events</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userStats.jobsApplied}</span>
                <span className="stat-label">Applications</span>
              </div>
            </div>
          </div>

          <div className="profile-nav">
            <button 
              className={`profile-nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              Overview
            </button>
            <button 
              className={`profile-nav-btn ${activeSection === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveSection('activity')}
            >
              Activity
            </button>
            <button 
              className={`profile-nav-btn ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="profile-content">
          {activeSection === 'overview' && (
            <div className="profile-overview">
              <div className="overview-section">
                <h3>Profile Completeness</h3>
                <div className="completeness-bar">
                  <div 
                    className="completeness-fill"
                    style={{ width: `${userStats.profileCompleteness}%` }}
                  ></div>
                </div>
                <p>{userStats.profileCompleteness}% Complete</p>
              </div>

              <div className="overview-section">
                <h3>Recent Activity</h3>
                <div className="recent-activity">
                  {userActivity.slice(0, 3).map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div 
                        className="activity-icon"
                        style={{ backgroundColor: getActivityColor(activity.type) }}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-details">
                        <h4>{activity.title}</h4>
                        <p>{activity.description}</p>
                        <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="quick-action-btn">
                    Update Profile
                  </button>
                  <button className="quick-action-btn">
                    View Donations
                  </button>
                  <button className="quick-action-btn">
                    Manage Events
                  </button>
                  <button className="quick-action-btn">
                    Job Applications
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'activity' && (
            <div className="profile-activity">
              <h3>Activity History</h3>
              <div className="activity-list">
                {userActivity.map(activity => (
                  <div key={activity.id} className="activity-card">
                    <div 
                      className="activity-icon"
                      style={{ backgroundColor: getActivityColor(activity.type) }}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      {activity.amount && (
                        <span className="activity-amount">{activity.amount}</span>
                      )}
                      <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="profile-settings">
              <h3>Account Settings</h3>
              
              <div className="settings-section">
                <h4>Profile Information</h4>
                <div className="settings-info">
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Last Login:</strong> {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="settings-section">
                <h4>Security</h4>
                <button 
                  onClick={() => setShowChangePassword(true)}
                  className="settings-btn"
                >
                  Change Password
                </button>
              </div>

              <div className="settings-section">
                <h4>Privacy</h4>
                <div className="privacy-options">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Show my profile in alumni directory
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Receive email notifications
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    Allow contact from other alumni
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="First Name"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                required
              />
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Graduation Year"
                  value={profileForm.graduationYear}
                  onChange={(e) => setProfileForm({...profileForm, graduationYear: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={profileForm.fieldOfStudy}
                  onChange={(e) => setProfileForm({...profileForm, fieldOfStudy: e.target.value})}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Current Company"
                value={profileForm.currentCompany}
                onChange={(e) => setProfileForm({...profileForm, currentCompany: e.target.value})}
              />
              <input
                type="text"
                placeholder="Job Title"
                value={profileForm.jobTitle}
                onChange={(e) => setProfileForm({...profileForm, jobTitle: e.target.value})}
              />
              <input
                type="text"
                placeholder="Location"
                value={profileForm.location}
                onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              />
              <textarea
                placeholder="Bio"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                rows="4"
              />
              <div className="modal-buttons">
                <button type="submit">Update Profile</button>
                <button type="button" onClick={() => setShowEditProfile(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Change Password</button>
                <button type="button" onClick={() => setShowChangePassword(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
