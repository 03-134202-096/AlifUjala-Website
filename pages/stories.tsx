import Stories from "../components/Stories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white" style={{backgroundImage: 'url(/images/Background_website.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Navbar />
      <main className="container mx-auto py-10 px-4 flex-1">
        <Stories />
      </main>
      <Footer />
    </div>
  );
}
