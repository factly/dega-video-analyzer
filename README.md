# Dega Video Analyzer
===========

Project is to create web application to fact check videos in the lines of: [https://informationisbeautiful.net/visualizations/what-the-health-netflix-documentary-fact-checked-debunked/](https://informationisbeautiful.net/visualizations/what-the-health-netflix-documentary-fact-checked-debunked/)

This would help with the project we currently have with Youtube to report videos with fake news. 

This would also help with Youtube integrating messages into their videos to show that there is extra reading available while the video is playing at the timings where rating is false. Just like how facebook does for the stories while being shared. The same logic can be applied for Facebook as well.

## Notes
 - This will be an add-on service for Dega. Organizations using Dega can use their own rating system to provide the ratings for the claims.
 - Will start with Youtube videos & extend the same to Facebook videos
 - The user interface on the website will be in similar lines to the example mentioned above
 - The list page for video analyses will be similar to the following: [https://informationisbeautiful.net/visualizations/based-on-a-true-true-story/](https://informationisbeautiful.net/visualizations/based-on-a-true-true-story/)
 - An interface needs to be provided in the Dega admin portal to create/manage the video fact checks

## Work done so far

 - Some work is already done to develop required API in NodeJS: [https://github.com/factly/dega-video-analyzer](https://github.com/factly/dega-video-analyzer). We will need to change this logic to using Golang like the rest of the APIs