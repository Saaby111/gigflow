const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Welcome to <span className="text-blue-600">GigFlow</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        A mini freelance marketplace where clients post jobs and freelancers bid on them.
        Anyone can be both a client and a freelancer!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Post Jobs</h3>
          <p className="text-gray-600">
            As a client, post your gigs with title, description, and budget.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Submit Bids</h3>
          <p className="text-gray-600">
            As a freelancer, bid on gigs with your price and message.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Hire Freelancers</h3>
          <p className="text-gray-600">
            Review bids and hire the best freelancer for your job.
          </p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-0 md:space-x-6">
        <a 
          href="/gigs" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
        >
          Browse Available Gigs
        </a>
        <a 
          href="/register" 
          className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition duration-300"
        >
          Start Free Today
        </a>
      </div>
    </div>
  )
}

export default Home