# gigflow
Gigflow is a mini-freelance marketplace platform.The goal is to built a system where clients can post gigs and freelancers can apply for them.

## Technical Stack 
  ● Frontend: React.js + CSS. 
  ● Backend: Node.js + Express.js. 
  ● Database: PstgreSQL. 
  ● Authentication: JWT (JSON Web Tokens) with HttpOnly cookies.

## Features
A. User Authentication 
  ● Secure Sign-up and Login. 
  ● Roles are fluid: Any user can post a job (Client) or bid on a job (Freelancer).

B. Gig Management (CRUD) 
  ● Browse Gigs: A public/private feed showing all "Open" jobs. 
  ● Search/Filter: Users should be able to search for jobs by title. 
  ● Job Posting: A form for logged-in users to post a job with Title, Description, and Budget.

C. The "Hiring" Logic 
1. Bidding: A freelancer submits a "Bid" (message + price) on a gig. 
2. Review: The Client who posted the job sees a list of all Bids. 
3. Hiring: The Client clicks a "Hire" button on one specific Bid. 
   ○ Logic: The Gig status must change from open to assigned. 
   ○ Logic: The chosen Bid status becomes hired. 
   ○ Logic: All other Bids for that same Gig should automatically be marked as rejected. 
