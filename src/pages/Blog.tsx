
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Dice Mosaic Blog</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <article className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Getting Started with Dice Mosaics</h2>
            <p className="text-gray-600 mb-4">
              Learn how to create your first dice mosaic, from selecting the right image to arranging the dice perfectly.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
          
          <article className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Pricing Guide: How Much Will Your Mosaic Cost?</h2>
            <p className="text-gray-600 mb-4">
              A comprehensive breakdown of dice costs and how to estimate your project's budget.
            </p>
            <a href="#" className="text-dice-primary hover:underline">Read more →</a>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
