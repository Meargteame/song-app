const http = require('https');

const songs = [
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    genre: "Rock",
    duration: "5:55",
    releaseYear: 1975,
    coverArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    lyrics: "Is this the real life? Is this just fantasy?\nCaught in a landslide, no escape from reality...\nOpen your eyes, look up to the skies and see..."
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    genre: "Pop",
    duration: "3:20",
    releaseYear: 2020,
    coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    lyrics: "I've been tryna call\nI've been on my own for long enough\nMaybe you can show me how to love, maybe..."
  },
  {
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    genre: "Rock",
    duration: "6:30",
    releaseYear: 1976,
    coverArt: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    lyrics: "On a dark desert highway, cool wind in my hair\nWarm smell of colitas, rising up through the air..."
  },
  {
    title: "Take Five",
    artist: "Dave Brubeck",
    album: "Time Out",
    genre: "Jazz",
    duration: "5:24",
    releaseYear: 1959,
    coverArt: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    lyrics: "Instrumental Jazz Masterpiece in 5/4 time."
  },
  {
    title: "Get Lucky",
    artist: "Daft Punk ft. Pharrell Williams",
    album: "Random Access Memories",
    genre: "Electronic",
    duration: "4:08",
    releaseYear: 2013,
    coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    lyrics: "Like the legend of the phoenix\nAll ends with beginnings\nWhat keeps the planet spinning\nThe force from the beginning..."
  },
  {
    title: "Lose Yourself",
    artist: "Eminem",
    album: "8 Mile",
    genre: "Hip-Hop",
    duration: "5:26",
    releaseYear: 2002,
    coverArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    lyrics: "Look, if you had one shot, or one opportunity\nTo seize everything you ever wanted in one moment\nWould you capture it, or just let it slip?"
  },
  {
    title: "Smooth Operator",
    artist: "Sade",
    album: "Diamond Life",
    genre: "R&B",
    duration: "4:18",
    releaseYear: 1984,
    coverArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    lyrics: "Diamond life, lover boy\nHe moves in space with minimum waste and maximum joy\nCity lights and business nights..."
  },
  {
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    genre: "Electronic",
    duration: "4:03",
    releaseYear: 2011,
    coverArt: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    lyrics: "Waiting in a car\nWaiting for a ride in the dark\nThe night city grows\nLook and see her eyes, they glow..."
  }
];

function postSong(song) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(song);
    const options = {
      hostname: 'song-app-v0u8.onrender.com',
      port: 443,
      path: '/api/songs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`Posted "${song.title}": Status ${res.statusCode}`);
        resolve(body);
      });
    });

    req.on('error', (e) => {
      console.error(`Error posting "${song.title}":`, e.message);
      resolve(null);
    });

    req.write(data);
    req.end();
  });
}

async function seed() {
  console.log('Seeding MongoDB database via Render API...');
  for (const song of songs) {
    await postSong(song);
  }
  console.log('Seeding complete!');
}

seed();
