const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use((req,res,next)=>{
  User.findById('6793624025fcd180611608a5')
    .then(user=> {
      req.user = user;
      next();
    })
    .catch(err=>{console.log(err)});
});
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    ''
  ).then(() => {
    User.findOne().then((user)=>{
      if (!user) {
        const newUser = new User({
          name: 'danilaprokopenko',
          email: 'test@test.com',
          cart: {
            items: []
          }
        });
        newUser.save();
      }
    })

    app.listen(3000)
  })
  .catch((err) => {console.log(err)});
