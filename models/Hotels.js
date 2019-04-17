var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelsSchema = new Schema({
  hotel_name:  {type: String, unique : true, required : true, dropDups: true},

  hotel_city: {type: String, default: null},

  hotel_address: {type: String, default: null},

  hotel_owner: {type: String, default: null},

  hotel_license_number: {type: String, default: null},

  hotel_total_floor: {type: String, default: null},
  
  hotel_image: {type: String, default: null}
});

module.exports = mongoose.model('hotels', hotelsSchema);