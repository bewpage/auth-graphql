require('dotenv').config();
const app = require('./server/server');

app.listen(process.env.PORT, () => {
   console.log('The value of dev PORT is:', process.env.PORT);
});