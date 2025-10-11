import { StorageCalculator } from "@/components/storage-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">iPad Storage Calculator</h1>
          <p className="mt-3 text-xl text-gray-500">Estimate how much storage space you'll need for your new iPad</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
              <img src="/minimalist-ipad.png" alt="iPad illustration" className="max-w-full h-auto" />
            </div>
            <div className="md:w-2/3 p-6">
              <StorageCalculator />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
