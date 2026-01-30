import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, gigAPI, bidAPI } from "../services/api";
import GigCard from "../components/GigCard";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const user = React.useMemo(() => authAPI.getCurrentUser(), []);

  const [myGigs, setMyGigs] = useState([]);

  const [myBids, setMyBids] = useState([]);
  const [assignedGigs, setAssignedGigs] = useState([]);

  const [stats, setStats] = useState({
    totalGigs: 0,
    openGigs: 0,
    assignedGigs: 0,
    completedGigs: 0,
    totalBids: 0,
    hiredBids: 0,
    pendingBids: 0,
    rejectedBids: 0,
  });

  useEffect(() => {
    if (!user && initialLoad) {
      navigate("/login");
      return;
    }
    setInitialLoad(false);
  }, [user, navigate, initialLoad]);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    console.log(`📊 Loading dashboard data for ${user.role}: ${user.name}`);

    try {
      setLoading(true);

      if (user.role === "client") {
        console.log("Fetching client gigs...");

        const gigsResponse = await gigAPI.getMyGigs();
        console.log("Client gigs response:", gigsResponse);

        const gigs = gigsResponse.data || gigsResponse || [];
        setMyGigs(gigs);

        console.log(`Found ${gigs.length} gigs for client`);

        const openGigs = gigs.filter((g) => g.status === "open").length;
        const assignedGigs = gigs.filter(
          (g) => g.status === "assigned" || g.status === "closed",
        ).length;
        const completedGigs = gigs.filter(
          (g) => g.status === "completed",
        ).length;

        setStats({
          totalGigs: gigs.length,
          openGigs,
          assignedGigs,
          completedGigs,
          totalBids: 0,
          hiredBids: 0,
          pendingBids: 0,
          rejectedBids: 0,
        });
      } else if (user.role === "freelancer") {
        console.log("Fetching freelancer data...");

        let bids = [];
        try {
          const bidsResponse = await bidAPI.getMyBids();
          console.log("Bids response:", bidsResponse);
          bids = bidsResponse.data || bidsResponse || [];
        } catch (bidError) {
          console.error("Error loading bids:", bidError);
          bids = [];
        }

        let assigned = [];
        try {
          const assignedResponse = await bidAPI.getAssignedGigs();
          console.log("Assigned gigs response:", assignedResponse);
          assigned = assignedResponse.data || assignedResponse || [];
        } catch (assignedError) {
          console.error("Error loading assigned gigs:", assignedError);
          assigned = [];
        }

        setMyBids(bids);
        setAssignedGigs(assigned);

        const hiredBids = bids.filter((b) => b.status === "hired").length;
        const pendingBids = bids.filter((b) => b.status === "pending").length;
        const rejectedBids = bids.filter((b) => b.status === "rejected").length;

        setStats({
          totalBids: bids.length,
          hiredBids,
          pendingBids,
          rejectedBids,
          assignedGigs: assigned.length,
          totalGigs: 0,
          openGigs: 0,
          completedGigs: 0,
        });

        console.log(
          `Found ${bids.length} bids, ${assigned.length} assigned gigs`,
        );
      }
    } catch (error) {
      console.error("❌ Error loading dashboard:", error);
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  if (!user) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading && initialLoad) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const DebugInfo = () => (
    <div className="card mb-3 p-3">
      <div className="flex-between">
        <div>
          <small className="text-muted"></small>
          <div className="mt-1">
            <code className="small">
              Role: {user.role} | Bids: {myBids.length} | Gigs: {myGigs.length}
            </code>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="card mb-3">
        <div className="flex-between">
          <div>
            <h1 className="mb-1">Dashboard</h1>
            <p className="card-description">
              Welcome back, <strong>{user.name}</strong>! You are logged in as a{" "}
              <span
                className={`status-badge status-${user.role === "client" ? "open" : "assigned"}`}
              >
                {user.role}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            {user.role === "client" ? (
              <Link to="/create-gig" className="btn btn-primary">
                + Post New Gig
              </Link>
            ) : (
              <Link to="/browse" className="btn btn-success">
                Browse Gigs
              </Link>
            )}
          </div>
        </div>
      </div>

      <DebugInfo />

      {!loading && (
        <div className="grid grid-4 gap-2 mb-3">
          {user.role === "client" ? (
            <>
              <StatCard
                title="Total Gigs"
                value={stats.totalGigs}
                color="primary"
                icon="📋"
              />
              <StatCard
                title="Open Gigs"
                value={stats.openGigs}
                color="success"
                icon="🔓"
              />
              <StatCard
                title="In Progress"
                value={stats.assignedGigs}
                color="warning"
                icon="⏳"
              />
              <StatCard
                title="Completed"
                value={stats.completedGigs}
                color="purple"
                icon="✅"
              />
            </>
          ) : (
            <>
              <StatCard
                title="Total Bids"
                value={stats.totalBids}
                color="primary"
                icon="📨"
              />
              <StatCard
                title="Hired Jobs"
                value={stats.hiredBids}
                color="success"
                icon="🎯"
              />
              <StatCard
                title="Pending Bids"
                value={stats.pendingBids}
                color="warning"
                icon="⏳"
              />
              <StatCard
                title="Not Selected"
                value={stats.rejectedBids}
                color="danger"
                icon="❌"
              />
            </>
          )}
        </div>
      )}

      {loading ? (
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your data...</p>
          </div>
        </div>
      ) : user.role === "client" ? (
        <ClientDashboard
          myGigs={myGigs}
          stats={stats}
          user={user}
          loadData={loadDashboardData}
        />
      ) : (
        <FreelancerDashboard
          myBids={myBids}
          assignedGigs={assignedGigs}
          stats={stats}
          user={user}
          loadData={loadDashboardData}
        />
      )}
    </div>
  );
}

// ===== STAT CARD COMPONENT =====
function StatCard({ title, value, color, icon }) {
  const colorClasses = {
    primary: "bg-primary-light text-primary",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    danger: "bg-danger-light text-danger",
    purple: "bg-purple-light text-purple",
  };

  return (
    <div className="stat-card">
      <div className="flex-between mb-1">
        <div className={`stat-icon ${colorClasses[color]}`}>{icon}</div>
        <div className="stat-number" style={{ color: `var(--${color})` }}>
          {value}
        </div>
      </div>
      <p className="stat-label">{title}</p>
    </div>
  );
}

function ClientDashboard({ myGigs, stats, user, loadData }) {
  return (
    <>
      <div className="card mb-3">
        <div className="flex-between mb-2">
          <h2>My Gigs ({myGigs.length})</h2>
          <div className="flex gap-2">
            <button onClick={loadData} className="btn btn-outline btn-sm">
              Refresh
            </button>
            <Link to="/create-gig" className="btn btn-primary btn-sm">
              + Create New
            </Link>
          </div>
        </div>

        {myGigs.length > 0 ? (
          <div className="grid grid-3 gap-2">
            {myGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">You haven't posted any gigs yet.</p>
            <Link to="/create-gig" className="btn btn-primary">
              Post Your First Gig
            </Link>
          </div>
        )}
      </div>

      {stats.openGigs > 0 && (
        <div className="card mb-3">
          <h2 className="mb-2">Open Gigs ({stats.openGigs})</h2>
          <p className="card-description mb-2">
            These gigs are open for bids. Share them to get more freelancers!
          </p>

          <div className="grid grid-2 gap-2">
            {myGigs
              .filter((gig) => gig.status === "open")
              .slice(0, 4)
              .map((gig) => (
                <div key={gig.id} className="card card-hover">
                  <div className="flex-between mb-2">
                    <h3 className="card-title">{gig.title}</h3>
                    <span className="status-badge status-open">Open</span>
                  </div>
                  <p className="card-description">
                    {gig.description?.substring(0, 100)}...
                  </p>
                  <div className="text-right mt-2">
                    <Link
                      to={`/gig/${gig.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {stats.assignedGigs > 0 && (
        <div className="card">
          <h2 className="mb-2">Gigs In Progress ({stats.assignedGigs})</h2>
          <div className="grid grid-2 gap-2">
            {myGigs
              .filter(
                (gig) => gig.status === "assigned" || gig.status === "closed",
              )
              .map((gig) => (
                <div key={gig.id} className="card card-hover">
                  <div className="flex-between mb-2">
                    <h3 className="card-title">{gig.title}</h3>
                    <span className="status-badge status-assigned">
                      In Progress
                    </span>
                  </div>
                  <p className="card-description">
                    {gig.assignedFreelancerId ? (
                      <>Assigned to freelancer #{gig.assignedFreelancerId}</>
                    ) : (
                      <>Currently in progress</>
                    )}
                  </p>
                  <div className="text-right mt-2">
                    <Link
                      to={`/gig/${gig.id}`}
                      className="btn btn-warning btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

function FreelancerDashboard({ myBids, assignedGigs, stats, user, loadData }) {
  return (
    <>
      <div className="card mb-3">
        <div className="flex-between mb-2">
          <h2>My Bids ({myBids.length})</h2>
          <div className="flex gap-2">
            <button onClick={loadData} className="btn btn-outline btn-sm">
              Refresh
            </button>
            <Link to="/browse" className="btn btn-success btn-sm">
              Find More Gigs
            </Link>
          </div>
        </div>

        {myBids.length > 0 ? (
          <div className="grid grid-2 gap-2">
            {myBids.map((bid) => (
              <div key={bid.id} className="card card-hover">
                <div className="flex-between mb-2">
                  <div>
                    <h3 className="card-title">
                      {bid.gig?.title || `Gig #${bid.gigId}`}
                    </h3>
                    <small className="text-muted">Your Bid: ${bid.price}</small>
                  </div>
                  <span className={`status-badge status-${bid.status}`}>
                    {bid.status}
                  </span>
                </div>

                <p className="card-description mb-2">
                  {bid.proposal || bid.message || "No proposal provided"}
                </p>

                <div className="flex-between">
                  <small className="text-muted">
                    Submitted:{" "}
                    {new Date(bid.createdAt || new Date()).toLocaleDateString()}
                  </small>
                  <Link
                    to={`/gig/${bid.gigId}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Gig
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">
              You haven't submitted any bids yet.
            </p>
            <Link to="/browse" className="btn btn-success">
              Browse Available Gigs
            </Link>
          </div>
        )}
      </div>

      <div className="card mb-3">
        <div className="flex-between mb-2">
          <h2>Assigned Gigs ({assignedGigs.length})</h2>
          <button onClick={loadData} className="btn btn-outline btn-sm">
            Refresh
          </button>
        </div>

        {assignedGigs.length > 0 ? (
          <div className="grid grid-2 gap-2">
            {assignedGigs.map((gig) => (
              <div key={gig.id} className="card card-hover">
                <div className="flex-between mb-2">
                  <h3 className="card-title">{gig.title}</h3>
                  <span className="status-badge status-assigned">Assigned</span>
                </div>

                <p className="card-description mb-2">
                  {gig.description?.substring(0, 150)}...
                </p>

                <div className="flex-between">
                  <div>
                    <strong className="text-dark">Budget:</strong> ${gig.budget}
                    {gig.deadline && (
                      <div className="text-muted small">
                        Deadline: {new Date(gig.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Link
                      to={`/gig/${gig.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                    <button className="btn btn-success btn-sm">
                      Submit Work
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">
              No assigned gigs yet. Keep bidding on gigs to get hired!
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="mb-2">Bid Status Summary</h2>
        <div className="grid grid-3 gap-2">
          <div className="stat-card text-center">
            <div className="status-badge status-pending badge-lg mx-auto">
              {stats.pendingBids}
            </div>
            <h4 className="stat-label mt-1">Pending</h4>
            <p className="text-muted small">Awaiting client review</p>
          </div>

          <div className="stat-card text-center">
            <div className="status-badge status-hired badge-lg mx-auto">
              {stats.hiredBids}
            </div>
            <h4 className="stat-label mt-1">Hired</h4>
            <p className="text-muted small">Active projects</p>
          </div>

          <div className="stat-card text-center">
            <div className="status-badge status-rejected badge-lg mx-auto">
              {stats.rejectedBids}
            </div>
            <h4 className="stat-label mt-1">Not Selected</h4>
            <p className="text-muted small">Keep trying!</p>
          </div>
        </div>

        <div className="text-center mt-3">
          <Link to="/browse" className="btn btn-success">
            Find More Gigs to Bid On
          </Link>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
