# imgureddit
A simple API for collecting all images from a given subreddit posted to Imgur.
See it live: https://imgureddit.herokuapp.com/

## Routes:
/
Index page with explanation

/r/{subreddit}
See imgur posts in the specified subreddit. Defaults to sort by recent.

/r/{subreddit}?sort={sort}&offset={offset}
Sort - sort by top this week or most recent
Offset - page through results by 10 each time
Both of these parameters are optional and order doesn't matter.


## Author
Lewis Horwood
@lewiebot
https://github.com/Lewis65

Completed for FreeCodeCamp's back-end API Challenges.
See the user stories: https://www.freecodecamp.com/challenges/image-search-abstraction-layer
