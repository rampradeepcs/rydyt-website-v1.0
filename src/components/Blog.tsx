import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { asset } from '../lib/asset'
import './blog.css'

const EASE = [0.16, 1, 0.3, 1] as const

const POSTS = [
  {
    slug: 'singleday-vs-multiday-rides-what-changes',
    category: 'Motorcycle Touring & Long-Distance Riding',
    title: 'Single-Day vs Multi-Day Rides: What Changes?',
    excerpt:
      'Planning a motorcycle trip? Discover the key differences between single-day and multi-day rides, including packing essentials, route planning, bike preparation, and safety tips to make every journey smoother, safer, and more enjoyable with Rydyt.',
    img: '/assets/blog/e01b26dd4910.jpg',
    date: 'July 14, 2026',
  },
  {
    slug: 'managing-fuel-stops-breaks-and-rest-stops-efficiently',
    category: 'Ride Planning & Safety',
    title: 'Managing Fuel Stops, Breaks, and Rest Stops Efficiently',
    excerpt:
      'How to plan fuel stops, rest breaks, and hydration for safer, smoother motorcycle rides. Discover practical tips to reduce fatigue, improve comfort, and enjoy every journey with smart ride planning.',
    img: '/assets/blog/08fd23d0eaa5.jpg',
    date: 'July 14, 2026',
  },
  {
    slug: 'planning-a-monsoon-motorcycle-trip',
    category: 'Seasonal Riding & Planning',
    title: 'Planning a Monsoon Motorcycle Trip',
    excerpt:
      'Ride confidently through the rainy season with expert tips on motorcycle preparation, wet-weather riding techniques, route planning, and essential gear for a safe monsoon adventure.',
    img: '/assets/blog/cce230c03974.jpg',
    date: 'July 14, 2026',
  },
]

export default function Blog() {
  return (
    <section className="section blog" id="blog">
      <div className="blog-head">
        <span className="blog-badge">BLOG</span>
        <h2 className="h-lg">From The Road</h2>
        <p className="lead">
          Stories, tips and riding insights straight from the Rydyt team.
        </p>
      </div>

      <div className="blog-cards">
        {POSTS.map((p, i) => (
          <motion.a
            key={p.slug}
            className="blog-home-card"
            href={`blog-${p.slug}.html`}
            data-cursor="hover"
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: i * 0.12, ease: EASE }}
          >
            <div className="blog-home-thumb">
              <img src={asset(p.img)} alt={p.title} loading="lazy" draggable={false} />
              <span className="blog-home-cat">{p.category}</span>
            </div>
            <div className="blog-home-body">
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <div className="blog-home-foot">
                <span>{p.date}</span>
                <span className="blog-home-more">
                  Read More <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="blog-viewall">
        <a className="btn btn-ghost" href="blog.html" data-cursor="hover">
          View All Posts <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}
