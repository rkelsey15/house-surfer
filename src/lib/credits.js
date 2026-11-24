// Credits for the stock photos. They set a mood only: the welcome screen and the
// empty states. They never appear on a real home or address (CLAUDE.md rule 4).
//
// All are from Pexels, whose license lets anyone use and edit the photos for free,
// with or without credit. We credit the photographers anyway.
// License: https://www.pexels.com/license/

export const MOOD_PHOTOS = {
  // Welcome screen: a Queen Anne style Victorian. No house number or street sign shows.
  welcome: {
    file: 'images/mood/welcome-queen-anne.jpg',
    title: 'Green and Yellow House Surrounded by Trees',
    photographer: 'Bryce Carithers',
    photographerUrl: 'https://www.pexels.com/@bryce-carithers-11680701/',
    pageUrl: 'https://www.pexels.com/photo/green-and-yellow-house-surrounded-by-trees-6761688/',
    source: 'Pexels',
  },
  sidewalk: {
    file: 'images/mood/sidewalk-trees.jpg',
    title: 'Sidewalk in City in a Residential Area',
    photographer: 'Yena Kwon',
    photographerUrl: 'https://www.pexels.com/@beyondthedream/',
    pageUrl: 'https://www.pexels.com/photo/sidewalk-in-city-in-a-residential-area-8200445/',
    source: 'Pexels',
  },
  street: {
    file: 'images/mood/quiet-street.jpg',
    title: 'Charming Suburban Street with Colorful Houses',
    photographer: 'Peter Jochim',
    photographerUrl: 'https://www.pexels.com/@peterjochim-fotografie/',
    pageUrl: 'https://www.pexels.com/photo/charming-suburban-street-with-colorful-houses-31726753/',
    source: 'Pexels',
  },
}

export const PEXELS_LICENSE_URL = 'https://www.pexels.com/license/'

// "Photo: Yena Kwon on Pexels"
export const creditLine = (photo) => `Photo: ${photo.photographer} on ${photo.source}`

// Sample photos of houses (Part F). About 1 in 3 homes shows one as its cover, labeled
// "Sample photo, not this home". They are stand-ins, never a photo of the real address.
// All are Pexels (free license). Files are 1200 px wide WebP in public/images/sample/.
const P = (id, title, photographer, profile, slug) => ({
  id,
  file: `images/sample/${id}.webp`,
  title,
  photographer,
  photographerUrl: `https://www.pexels.com/@${profile}/`,
  pageUrl: `https://www.pexels.com/photo/${slug ? slug + '-' : ''}${id}/`,
  source: 'Pexels',
})

export const SAMPLE_PHOTOS = [
  P('9572044', 'Facade of a House', 'Erik Mclean', 'introspectivedsgn', 'facade-of-a-house'),
  P('4917105', 'Old building facade near walkway between plants', 'Maria Orlova', 'orlovamaria', 'old-building-facade-near-walkway-between-plants'),
  P('4061979', 'Brown and White Wooden House Near Bare Trees', 'Erik Mclean', 'introspectivedsgn', 'brown-and-white-wooden-house-near-bare-trees'),
  P('259685', 'White Concrete House Under Sky', 'Pixabay', 'pixabay', 'white-concrete-house-under-sky'),
  P('4157121', 'Wooden fence of high cottage in suburb', 'Erik Mclean', 'introspectivedsgn', 'wooden-fence-of-high-cottage-in-suburb'),
  P('280222', 'White and Gray Wooden House Near Grass Field and Trees', 'Pixabay', 'pixabay', 'white-and-gray-wooden-house-near-grass-field-and-trees'),
  P('5071177', 'Photo of a House Exterior', 'Curtis Adams', 'curtis-adams-1694007', 'photo-of-a-house-exterior'),
  P('8031890', 'Plants Planted Outside a House', 'Curtis Adams', 'curtis-adams-1694007', 'plants-planted-outside-a-house'),
  P('5661019', 'A Beautiful House Under Blue Sky', 'Get Lost Mike', 'michaelgaultphotos', 'a-beautiful-house-under-blue-sky'),
  P('5353890', 'View of a House', 'Curtis Adams', 'curtis-adams-1694007', 'view-of-a-house'),
  P('5502227', 'House with Gray Roof', 'Curtis Adams', 'curtis-adams-1694007', 'house-with-gray-roof'),
  P('5524205', 'Brown and White House Near Green Grass Field Under Blue Sky', 'Clay Elliot', 'ibidsy', 'brown-and-white-house-near-green-grass-field-under-blue-sky'),
  P('5524166', 'Brown and White Wooden House Near Green Trees', 'Clay Elliot', 'ibidsy', 'brown-and-white-wooden-house-near-green-trees'),
  P('221024', 'Brown 2-storey House Beside Tree', 'Pixabay', 'pixabay', 'brown-2-storey-house-beside-tree'),
  P('30419060', 'Charming Victorian House in Michigan', 'James Wilson', 'james-wilson-560941481', 'charming-victorian-house-in-michigan'),
  P('12238679', 'Residential House Exterior with a Garden', 'David McElwee', 'davidmcelwee', 'residential-house-exterior-with-a-garden'),
  P('15875708', 'Spring Blossoms on Trees around House', 'David McElwee', 'davidmcelwee', 'spring-blossoms-on-trees-around-house'),
  P('3935320', 'Blue and Gray Wooden House Near Bare Trees', 'Curtis Adams', 'curtis-adams-1694007', 'blue-and-gray-wooden-house-near-bare-trees'),
  P('5587932', 'Facade of a House', 'Get Lost Mike', 'michaelgaultphotos', 'facade-of-a-house'),
  P('209296', 'Gray Painted House', 'Pixabay', 'pixabay', 'gray-painted-house'),
]
