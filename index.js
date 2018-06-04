require('dotenv').load();
const app = require('./server/server');

app.listen(process.env.PORT, () => {
   console.log('Listening on port 4000');
   console.log('The value of PORT is:', process.env.PORT);
   console.log('The value of PORT is:', process.env.MONGODB_URI);

});