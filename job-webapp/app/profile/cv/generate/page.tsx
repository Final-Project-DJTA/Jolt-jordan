import CVGenerateForm from "@/components/cv/cv-generate-form"

export default function CVGeneratePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Generate CV</h1>
        <p className="text-gray-600 mb-6">Fill in your details to generate a professional CV</p>
        <CVGenerateForm />
      </div>
    </div>
  )
}

