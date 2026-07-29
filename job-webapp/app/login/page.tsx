import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Welcome Back</h1>
        <LoginForm />
      </div>
    </div>
  )
}

