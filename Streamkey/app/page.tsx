import Hero from './components/Hero'
import FeaturedContent from './components/FeaturedContent'
import ContentRow from './components/ContentRow'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <div className="space-y-8 pb-8">
        <FeaturedContent />
        <ContentRow title="Trending" type="trending" />
        <ContentRow title="Neue Filme" type="movie" />
        <ContentRow title="Beliebte Serien" type="tv" />
      </div>
    </div>
  )
}

