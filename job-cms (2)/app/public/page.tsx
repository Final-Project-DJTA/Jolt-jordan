export default function PublicWelcomePage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-6">Welcome to Jojo Jobs</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          The complete job management platform for employers and recruiters.
          Sign in to access the dashboard and manage your job listings.
        </p>
      </div>
    )
  }