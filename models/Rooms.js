var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomsSchema = new Schema({
  room_number:  {type: String, unique : true, required : true, dropDups: true},

  room_hotels:  {type: Schema.Types.ObjectId, ref: 'hotels'},

  room_floor: {type: Number, default: null},

  room_single: {type: String, default: null},

  room_price: {type: Number, default: null},

  room_status: {type: String, default: null},

  room_detail: {type: String, default: null},
  
  room_image: {type: String, default: null}
});

module.exports = mongoose.model('rooms', roomsSchema);