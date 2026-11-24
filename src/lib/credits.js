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
