import React, { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Music2, Youtube, Instagram, Link as LinkIcon, Volume2, VolumeX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ======== CONFIG ========
const SITE_CONFIG = {
  contactEmail: 'drblackoutofficial@gmail.com',
  spotifyEmbedSrc: 'https://open.spotify.com/embed/artist/303ESft4GOklhvhPIDsXdr?utm_source=generator',
  appleMusicEmbedSrc: 'https://embed.music.apple.com/us/album/ethereal-2/1811094718',
  socials: [
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCxVrBRV0h1Chbi-IEtecb-w' },
    { label: 'Instagram', href: 'https://www.instagram.com/drblackoutt/' },
    { label: 'X', href: 'https://x.com/drblackoutt' },
  ],
}

const TRACKS: Array<{ title: string; url: string; cover?: string; featuring?: string }> = [
  { title: 'Moncler', url: '/moncler.mp3', cover: '/covers/moncler.jpg' },
  { title: 'Thief in the Night', url: '/thief-in-the-night.mp3', cover: '/covers/thief.jpg' },
  { title: 'Ethereal', url: '/ethereal.mp3', cover: '/covers/ethereal.jpg' },
  { title: "U Don't Care", url: '/u-dont-care.mp3', cover: '/covers/u-dont-care.jpg' },
  { title: 'Wannabe Rapper', url: '/wannabe-rapper.mp3', cover: '/covers/wannabe-rapper.jpg' },
  { title: '3 Forgiatos', url: '/3-forgiatos.mp3', cover: '/covers/3-forgiatos.jpg' },
]

const YOUTUBE_VIDEO_IDS = ['wZNrG9REzxo', '3lkqnvLS8h4']

const SOCIALS: Array<{ label: string; href: string; icon: React.ReactNode }> = SITE_CONFIG.socials.map((s) => ({
  ...s,
  icon: s.label === 'YouTube' ? <Youtube className='w-5 h-5'/> : s.label === 'Instagram' ? <Instagram className='w-5 h-5'/> : <LinkIcon className='w-5 h-5'/>,
}))

// ======== AUDIO PLAYER HOOK ========
function useAudioPlaylist(urls: string[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [index, setIndex] = useState(0)
  const [isPlaying, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  const current = urls[index]

  const play = () => { const el = audioRef.current; if(!el) return; el.play(); setPlaying(true) }
  const pause = () => { const el = audioRef.current; if(!el) return; el.pause(); setPlaying(false) }
  const toggle = () => isPlaying ? pause() : play()
  const prev = () => setIndex(i => (i - 1 + urls.length) % urls.length)
  const next = () => setIndex(i => (i + 1) % urls.length)
  const onEnded = () => next()

  return { audioRef, index, setIndex, isPlaying, muted, setMuted, current, toggle, prev, next, onEnded }
}

// ======== UI ========
function Nav() {
  return (
    <nav className='sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        <a href='#top' className='font-black text-xl tracking-tight'>Dr. Blackout</a>
        <div className='flex items-center gap-4 text-sm'>
          <a href='#music' className='hover:underline'>Music</a>
          <a href='#videos' className='hover:underline'>Videos</a>
          <a href='#about' className='hover:underline'>About</a>
          <a href='#contact' className='hover:underline'>Contact</a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section id='top' className='relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-zinc-800'/>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}
        className='relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-white'>
        <p className='uppercase tracking-widest text-xs text-zinc-300'>Artist • Producer • Storyteller</p>
        <h1 className='text-4xl md:text-6xl font-extrabold leading-tight mt-3'>Dr. Blackout</h1>
        <p className='text-zinc-200 mt-4 max-w-2xl'>Versatile sound. Hope and vulnerability. From autotune rap to indie alt — crafted to connect.</p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <a href='#music'><Button className='px-5'><Music2 className='mr-2 h-4 w-4'/>Listen</Button></a>
          <a href='#videos'><Button variant='outline' className='px-5 border-white/40 text-white hover:bg-white/10'><Youtube className='mr-2 h-4 w-4'/>Watch</Button></a>
        </div>
      </motion.div>
      <div className='absolute -bottom-32 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-white/10 blur-3xl'/>
    </section>
  )
}

function TrackList({ tracks, currentIndex, onSelect }:{ tracks: typeof TRACKS; currentIndex: number; onSelect: (i:number)=>void }) {
  return (
    <div className='space-y-2'>
      {tracks.map((t,i)=>(
        <button key={i} onClick={()=>onSelect(i)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${i===currentIndex?'bg-black text-white border-black':'hover:bg-zinc-50'}`}>
          <img src={t.cover || '/covers/placeholder.jpg'} alt='cover' className='w-12 h-12 rounded-lg object-cover'/>
          <div className='text-left'>
            <div className='font-semibold'>{t.title}</div>
            {t.featuring && <div className='text-xs text-zinc-500'>feat. {t.featuring}</div>}
          </div>
        </button>
      ))}
    </div>
  )
}

function AudioPlayer() {
  const urls = useMemo(()=> TRACKS.map(t=>t.url), [])
  const { audioRef, index, setIndex, isPlaying, muted, setMuted, current, toggle, prev, next, onEnded } = useAudioPlaylist(urls)
  const track = TRACKS[index]
  return (
    <Card className='rounded-2xl shadow-sm'>
      <CardContent className='p-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <img src={track.cover || '/covers/placeholder.jpg'} className='w-full md:w-48 h-48 object-cover rounded-2xl' alt={track.title}/>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-xs uppercase tracking-widest text-zinc-500'>Now Playing</div>
                <h3 className='text-xl font-bold'>{track.title}</h3>
              </div>
              <div className='flex items-center gap-2'>
                <Button onClick={prev} variant='outline' className='p-2 rounded-full'><SkipBack className='w-4 h-4'/></Button>
                <Button onClick={toggle} className='p-2 rounded-full'>{isPlaying ? <Pause className='w-4 h-4'/> : <Play className='w-4 h-4'/>}</Button>
                <Button onClick={next} variant='outline' className='p-2 rounded-full'><SkipForward className='w-4 h-4'/></Button>
                <Button onClick={()=>setMuted(!muted)} variant='ghost' className='p-2 rounded-full'>{muted ? <VolumeX className='w-4 h-4'/> : <Volume2 className='w-4 h-4'/>}</Button>
              </div>
            </div>
            <audio ref={audioRef} src={current} onEnded={onEnded} controls className='w-full mt-3' muted={muted}/>
            <div className='mt-4'>
              <TrackList tracks={TRACKS} currentIndex={index} onSelect={(i)=> setIndex(i) }/>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MusicSection(){
  return (
    <section id='music' className='max-w-6xl mx-auto px-4 py-16'>
      <div className='flex items-center gap-2 mb-6'>
        <Music2 className='w-5 h-5'/>
        <h2 className='text-2xl font-bold'>Music</h2>
      </div>
      <AudioPlayer/>
      <div className='grid md:grid-cols-2 gap-6 mt-8'>
        <Card className='rounded-2xl'>
          <CardContent className='p-0'>
            <iframe
              title='Spotify'
              className='w-full h-[352px] rounded-2xl'
              allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
              loading='lazy'
              src={SITE_CONFIG.spotifyEmbedSrc}
            />
          </CardContent>
        </Card>
        <Card className='rounded-2xl'>
          <CardContent className='p-0'>
            <iframe
              allow='autoplay *; encrypted-media *; fullscreen *; clipboard-write'
              frameBorder='0'
              height='352'
              style={{ width: '100%', overflow: 'hidden', borderRadius: '1rem' }}
              sandbox='allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation'
              src={SITE_CONFIG.appleMusicEmbedSrc}
              title='Apple Music'
            />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function VideoGrid(){
  return (
    <section id='videos' className='max-w-6xl mx-auto px-4 py-16'>
      <div className='flex items-center gap-2 mb-6'>
        <Youtube className='w-5 h-5'/>
        <h2 className='text-2xl font-bold'>Videos</h2>
      </div>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {YOUTUBE_VIDEO_IDS.map((id) => (
          <Card key={id} className='rounded-2xl overflow-hidden'>
            <CardContent className='p-0'>
              <div className='aspect-video w-full'>
                <iframe
                  className='w-full h-full'
                  src={`https://www.youtube.com/embed/${id}`}
                  title='YouTube video player'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function About(){
  return (
    <section id='about' className='max-w-6xl mx-auto px-4 py-16'>
      <h2 className='text-2xl font-bold mb-4'>About</h2>
      <div className='grid md:grid-cols-2 gap-8 items-start'>
        <img src='/covers/ethereal.jpg' alt='Dr. Blackout' className='rounded-2xl w-full object-cover'/>
        <div className='prose max-w-none'>
          <p>
            Dr. Blackout is the creative persona of Jason Ntiamoah — blending autotune rap, pop punk, indie alt, and indie pop into stories about hope, vulnerability, and self-expression.
          </p>
          <p>
            Performances and releases are crafted to connect real experiences with ambitious sound design and melody. Tap in below to listen, watch, and follow.
          </p>
          <div className='flex flex-wrap gap-3 mt-4'>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target='_blank' rel='noreferrer'>
                <Button variant='outline' className='rounded-2xl'>{s.icon}<span className='ml-2'>{s.label}</span></Button>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact(){
  return (
    <section id='contact' className='max-w-6xl mx-auto px-4 py-16'>
      <h2 className='text-2xl font-bold mb-4'>Contact</h2>
      <Card className='rounded-2xl'>
        <CardContent className='p-6'>
          <p className='text-zinc-600 mb-4'>For bookings, features, press, and inquiries, drop your email. This simple form opens your mail client — swap it for Formspree/Resend later.</p>
          <form action={`mailto:${SITE_CONFIG.contactEmail}`} method='post' encType='text/plain' className='flex gap-3 max-w-xl'>
            <Input type='email' placeholder='your@email.com' required className='rounded-2xl'/>
            <Button type='submit' className='rounded-2xl'>Get in touch</Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

function Footer(){
  return (
    <footer className='border-t'>
      <div className='max-w-6xl mx-auto px-4 py-8 text-sm text-zinc-500 flex flex-col md:flex-row items-center justify-between gap-3'>
        <div>© {new Date().getFullYear()} Dr. Blackout. All rights reserved.</div>
        <div className='flex items-center gap-3'>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target='_blank' rel='noreferrer' className='hover:text-zinc-800 flex items-center gap-1'>
              {s.icon}<span>{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default function DrBlackoutSite(){
  return (
    <div className='min-h-screen bg-white text-zinc-900'>
      <Nav/>
      <Hero/>
      <MusicSection/>
      <VideoGrid/>
      <About/>
      <Contact/>
      <Footer/>
    </div>
  )
}
