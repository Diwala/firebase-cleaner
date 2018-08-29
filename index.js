const admin = require('firebase-admin');
const CONFIG = require('./config');
const moment = require('moment');


const firebase = admin.initializeApp({
  credential: admin.credential.cert(CONFIG.FIREBASE.ADMIN),
  databaseURL: CONFIG.FIREBASE.DATABASE_URL
});

const ref = firebase.database().ref('/')
const nowMinus1HourInUnix = parseInt(moment().subtract(1,'hour').unix())
console.log(`Checking if any snapshots are up to this time`);
console.log(`Unix: ${nowMinus1HourInUnix}`);
console.log(`Formated: ${moment.unix(nowMinus1HourInUnix).format('MMMM Do YYYY, h:mm:ss a')}`);


ref
  .orderByChild("created")
  .endAt(nowMinus1HourInUnix)
  .once("value")
  .then((snapshot) => {
    if(snapshot.hasChildren()) {
      snapshot.forEach((item)=> {
        console.log(item);
        ref.child(item.key).remove()
        .then(() => {
          console.log("Remove succesfull");
          process.exit(0)
        })
        .catch((error)=> {
          console.log(error);
          process.exit(1)
        })
      })
    } else {
      console.log('Could not find any snapshots with that filter')
      process.exit(0)
    }
  });
