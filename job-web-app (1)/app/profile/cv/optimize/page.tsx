import CVOptimizeForm from "@/components/cv/cv-optimize-form"

export default function CVOptimizePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Optimize Your CV</h1>
        <p className="text-gray-600 mb-6">Use AI to enhance your CV based on the feedback you received</p>
        <CVOptimizeForm />
      </div>
    </div>
  )
}

