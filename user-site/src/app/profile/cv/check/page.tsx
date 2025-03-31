import CVCheckForm from "@/components/cv/cv-check-form"

export default function CVCheckPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">CV Check</h1>
        <p className="text-gray-600 mb-6">Upload your CV to get AI-powered feedback and suggestions</p>
        <CVCheckForm />
      </div>
    </div>
  )
}

