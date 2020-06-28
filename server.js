// https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/

// DATABASE_URL=postgresql://mais:1234@localhost:5432/labsql

// 'use strict';
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT||8080;
// app.use(express.static('./public'))//عشان اخليه يشغل ملف الانديكس 
// //('/') this route it will run the html index page

// app.get('/hello', (request, response) => {
//   response.status(200).send('<h1 style="color: rgb(103, 255, 2);">Hello</h1>');
// });
// app.get('/data', (request, response) => {
//   let data = [{ name: 'Javascript' }, { name: 'python' }, { name: 'C#' }];
//   response.status(200).json(data);
// });

// app.get('*', (request, response) =>//هاد اخر راوت دايما ممنوع احطو قبل اي راوت
//   response.status(404).send('404 page not found')
// );
// app.listen(PORT, () => console.log(`listing to port ${PORT}`));//دايما اخر سطر

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//كيف اسحب داتا من ملف جيسن require('./data/geo.json') اهم فكرة
// 'use strict';
// require('dotenv').config();//عشان يسمحلي ادخل ع ملف .env
// // Application Dependencies
// const express = require('express');//عشان يعملي السيرفر
// const cors = require('cors');//عمل ربط بين الباك اند والفرونت اند وبخلي السيرفر يرد ع الريكويست 
// //====================
// // Application Setup
// const PORT = process.env.PORT || 4000;//عشان اعرف البورت الي بدي يشتغل علي 
// const app = express();//عشان يعمل رن للسيرفر
// app.use(cors());
// //====================

// // API Routes
// app.get('/location', (request, response) => {
//   try {//وظيفتها تغطي كل الاحتمالات..في حال النجاح رح تعمل الكود تبعها
//     const geoData = require('./data/geo.json');
//     const city = request.query.city;
//     console.log(city);//tokyo
//     console.log(request.query);//{ city: 'tokyo' }
//     const locationData = new Location(city, geoData);
//     response.status(200).json(locationData);//رح يرجع اوبجيكت واحد الي هو فيه اسم المدينة وموقعها
//   } catch (error) {//في حال الفشل رح يتنفذ هاد
//     errorHandler(error, request, response);
//   }
// });
// //وظيفة الكونستراكتر اني استخلص الداتا من ملف الجيسون واكون اوبجيت بالمعلومات المحددة الي انا بدي اياها 
// function Location(city, geoData) {
//   this.search_query = city;
//   this.formatted_query = geoData[0].display_name;//geoData اسم ملف الجيسون
//   this.latitude = geoData[0].lat;
//   this.longitude = geoData[0].lon;
// }

// //____________________
// app.get('/weather', (request, response) => {
//   try {
//     const weatherDateData = require('./data/darksky.json');//اذا كتبت المكان غلط بطلع ايرور "MODULE_NOT_FOUND"
//     let DateWeatherArr = [];
    
    
//     for (let i = 0; i < weatherDateData.data.length; i++) {
//       let dateAndWeatherObj$$ = new weather(weatherDateData, i);
//       DateWeatherArr.push(dateAndWeatherObj$$);
//     }
//     console.log(DateWeatherArr);
//     response.send(DateWeatherArr);//{} اذا كتبت اسم متغير مش موجود بطلع المتصفح
//   } catch (error) {
//     errorHandler(error, request, response);
//   }
// });

// function weather(fileDarkSky, indexx) {
//   this.time = new Date(fileDarkSky.data[indexx].valid_date).toDateString();
//   //console.log(new Date("2020-04-05").toDateString());
//   //Sun Apr 05 2020 استعملتها عشان احول التاريخ هيك
//   this.forecast = fileDarkSky.data[indexx].weather.description;
 
// }

// app.use('*', notFoundHandler);
// // app.use('*', (request, response)=> {
// //   response.status(404).send('NOT FOUND!!')});
// //___________________
// // HELPER FUNCTIONS
// function notFoundHandler(request, response) {
//   response.status(404).send('NOT FOUND!!');
// }
// function errorHandler(error, request, response) {
//   response.status(500).send(error);
// }
// // Make sure the server is listening for requests
// app.listen(PORT, () => console.log(`listing to port ${PORT}`));

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent= require('superagent')

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailhandler);
app.get('/movies', movieshandler);
app.get('/yelp', yelphandler);


function locationHandler(request, response) {
  const city = request.query.city; 
  superagent(
    `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
  )    .then((res) => {
      console.log('zzzz' , res);
      
      const geoData = res.body;
      console.log("whats this ? :",geoData);
      
      const locationData = new Location(city, geoData);
      response.status(200).json(locationData);
    })
    .catch((err)=> errorHandler(err, request, response));
}


function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

//____________________

  function weatherHandler(request, response) {
    superagent(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.WEATHER_API_KEY}`
    )
      .then((weatherRes) => {
        console.log(weatherRes);
        const weatherSummaries = weatherRes.body.data.map((day) => {
          return new Weather(day);
        });
        response.status(200).json(weatherSummaries);
      })
      .catch((errT)=> errorHandler(errT, request, response));
  }
  
  
  function Weather(day) {
    this.forecast = day.weather.description;
    this.time = new Date(day.valid_date).toString().slice(0, 15);
  }

//___________________________________________________
  
    function trailhandler(request, response) {
    superagent(`https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxDistance=400&key=${process.env.TRAIL_API_KEY}`)
    
    .then((trailRes) => {   
        console.log(trailRes.body);
        const trailsobj = trailRes.body.trails.map((trail$$)=> {
            return new Trail(trail$$);
        });

        response.status(200).json(trailsobj);

    })
    .catch((errT)=> errorHandler(errT, request, response));
   
   };


   function Trail(trail$$) {
    this.name = trail$$.name;
    this.location = trail$$.location ;
    this.length = trail$$.length ;
    this.stars = trail$$.stars ;
    this.star$votes = trail$$.star_votes ;
    this.summary = trail$$.summary ;
    this.trail$url = trail$$.trail_url ;
    this.conditions= trail$$.conditions;
    this.conditions_date=trail$$.condition_date;
    this.conditions_time=trail$$.condtion_time
   
}

function movieshandler(request, response) {
    superagent(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${request.query.search_query}&page=1&include_adult=false`)
        .then((moviesRes) => {
            // console.log(moviesRes.body);
            // console.log(moviesRes);
            const moviesSummaries = moviesRes.body.results.map((movie$) => {
                // console.log(moviesRes);
                return new moviesCONS(movie$);
            });
            // console.log(moviesRes);
            response.status(200).json(moviesSummaries);
        })
        .catch((errT) => errorHandler(errT, request, response));
}


function moviesCONS(movie$) {
    this.title = movie$.title;
    this.overview = movie$.overview;
    this.average_votes = movie$.vote_average;
    this.total_votes = movie$.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500/${movie$.poster_path}`;
    this.popularity = movie$.popularity;
    this.released_on = movie$.release_date;
}






function yelphandler(request, response) {
    superagent(`https://api.yelp.com/v3/businesses/search?location=${request.query.search_query}`).set({ "Authorization": `Bearer ${process.env.YELP_API_KEY}`})
        .then((yelpRes) => {
            
            console.log(yelpRes);
            const yelpSummaries = yelpRes.body.businesses.map((yelp$) => {
                return new yelpCONS(yelp$);
            });
            response.status(200).json(yelpSummaries);
        })
        .catch((err) => errorHandler(err, request, response));
}


function yelpCONS(yelp$) {
    this.name =yelp$.name;
    this.image_url = yelp$.image_url;
    this.price = yelp$.price;
    this.rating= yelp$.rating;
    this.url= yelp$.url;
}


//______________________________________________
app.use('*', notFoundHandler);

function notFoundHandler(request, response) {
  response.status(404).send('page Not Found');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

app.listen(PORT,() => console.log('host :' , PORT))
