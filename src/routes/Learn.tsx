import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { lessons } from "../lib/data";
import { Link } from "react-router-dom";

export default function Learn() {
  return (
    <div className="px-4 md:px-6 py-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">Todas las Lecciones</h2>
        <p className="text-white/80">Navega a través de nuestra biblioteca de señas para aprender.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:border-white/20 transition-colors h-full">
            <CardHeader>
              <CardTitle className="text-white">{lesson.title}</CardTitle>
              <CardDescription className="text-white/80">{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-3">
                <Button asChild variant="secondary" className="bg-white/90 hover:bg-white text-gray-900 border border-white/60 shadow-sm">
                  <Link to={`/learning?lesson=${encodeURIComponent(lesson.title)}`}>Aprender</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                  <Link to={`/practice?sign=${encodeURIComponent(lesson.title)}`}>Practicar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
