// https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/

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
//كيف اسحب داتا من ملف جيسن require('./data/geo.json') اهم فكرة
'use strict';
require('dotenv').config();//عشان يسمحلي ادخل ع ملف .env
// Application Dependencies
const express = require('express');//عشان يعملي السيرفر
const cors = require('cors');//عمل ربط بين الباك اند والفرونت اند وبخلي السيرفر يرد ع الريكويست 
//====================
// Application Setup
const PORT = process.env.PORT || 4000;//عشان اعرف البورت الي بدي يشتغل علي 
const app = express();//عشان يعمل رن للسيرفر
app.use(cors());
//====================

// API Routes
app.get('/location', (request, response) => {
  try {//وظيفتها تغطي كل الاحتمالات..في حال النجاح رح تعمل الكود تبعها
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    console.log(city);//tokyo
    console.log(request.query);//{ city: 'tokyo' }
    const locationData = new Location(city, geoData);
    response.status(200).json(locationData);//رح يرجع اوبجيكت واحد الي هو فيه اسم المدينة وموقعها
  } catch (error) {//في حال الفشل رح يتنفذ هاد
    errorHandler(error, request, response);
  }
});
//وظيفة الكونستراكتر اني استخلص الداتا من ملف الجيسون واكون اوبجيت بالمعلومات المحددة الي انا بدي اياها 
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;//geoData اسم ملف الجيسون
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

//____________________
app.get('/weather', (request, response) => {
  try {
    const weatherDateData = require('./data/darksky.json');//اذا كتبت المكان غلط بطلع ايرور "MODULE_NOT_FOUND"
    let DateWeatherArr = [];
    
    
    for (let i = 0; i < weatherDateData.data.length; i++) {
      let dateAndWeatherObj$$ = new weather(weatherDateData, i);
      DateWeatherArr.push(dateAndWeatherObj$$);
    }
    console.log(DateWeatherArr);
    response.send(DateWeatherArr);//{} اذا كتبت اسم متغير مش موجود بطلع المتصفح
  } catch (error) {
    errorHandler(error, request, response);
  }
});

function weather(fileDarkSky, indexx) {
  this.time = new Date(fileDarkSky.data[indexx].valid_date).toDateString();
  //console.log(new Date("2020-04-05").toDateString());
  //Sun Apr 05 2020 استعملتها عشان احول التاريخ هيك
  this.forecast = fileDarkSky.data[indexx].weather.description;
 
}

app.use('*', notFoundHandler);
// app.use('*', (request, response)=> {
//   response.status(404).send('NOT FOUND!!')});
//___________________
// HELPER FUNCTIONS
function notFoundHandler(request, response) {
  response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}
// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`listing to port ${PORT}`));
///////////////////////////////////////////////////////////////////

