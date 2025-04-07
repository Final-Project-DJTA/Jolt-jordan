import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Create an Account</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

