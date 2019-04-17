var express = require('express');
var router = express.Router();
var Hotel = require('../models/Hotels');
var Room = require('../models/Rooms');

var multer = require('multer');
var shortid = require('shortid');
var storage = multer.diskStorage({
  // nơi lưu trữ ảnh đc upload lên server
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  // quy định tên file đc upload lên
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '' + file.originalname);
  }
});
var upload = multer({ storage: storage });

/*Phòng khách sạn*/
router.get('/', function (req, res, next) {
  Room.find({})
    .populate('room_hotels')
    .exec((err, data) => {
      console.log(data);
      res.render('index', { room: data });
      // res.json(data);
    });
});

router.get('/room/add', function (req, res, next) {
  Hotel.find({}, function (err, data) {
    res.render('room/room_add', { hotel: data });
    // res.json(data);
  })
});

router.post('/room/save-add', upload.single('room_image'), function (req, res, next) {
  //thu thập dữ liệu từ form
  let { room_number, room_hotels,
    room_floor, room_single,
    room_price, room_status, room_detail } = req.body;

  //tạo ra đối tượng mới dạng Hotel
  let model = new Room();

  //Cập nhật lại thông tin đối tượng vừa tạ0 với cơ sở dữ liệu thu thập được từ form
  model.room_number = room_number;
  model.room_hotels = room_hotels;
  model.room_floor = room_floor;
  model.room_single = room_single;
  model.room_price = room_price;
  model.room_status = room_status;
  model.room_detail = room_detail;

  model.room_image = req.file.path.replace('public', '');

  //Lưu đối tượng với cơ sở dữ liệu
  model.save(function (err) {
    //Điều hướng website về danh sách danh mục
    res.redirect('/');
  });
});

router.get('/room/edit', function (req, res, next) {
  Hotel.find({}, function (err, data) {
    res.render('room/room_edit', { hotel: data });
    // res.json(data);
  })

  Room.find({}, function (err, data) {
    res.render('room/room_edit', { room: data });
    // res.json(data);
  })
});

router.get('/room/edit/:pId', (req, res, next) => {
  Hotel.find({}, (err, data) => {

    Room.findOne({ _id: req.params.pId }, (err, roomData) => {
      if (err) {
        res.send('ID phòng không tồn tại');
      }

      for (var i = 0; i < data.length; i++) {
        if (data[i]._id == roomData.room_hotels.toString()) {
          data[i].selected = true;
        }
      }
      res.render('room/room_edit', { hotel: data, room: roomData });
    });

  })
});

router.post('/room/save-edit', upload.single('room_image'), function (req, res, next) {
  Room.findOne({ _id: req.body.id }, function (err, model) {
    if (err) {
      res.redirect('back');
    }
  
    //Cập nhật lại thông tin đối tượng vừa tạ0 với cơ sở dữ liệu thu thập được từ form
    model.room_number = req.body.room_number;
    model.room_hotels = req.body.room_hotels;
    model.room_floor = req.body.room_floor;
    model.room_single = req.body.room_single;
    model.room_price = req.body.room_price;
    model.room_status = req.body.room_status;
    model.room_detail = req.body.room_detail;
    if (req.file != null) {
      model.room_image = req.file.path.replace('public', '');
    }

    model.save(function (err) {
      if (err) {
        res.send('Save Error');
      }

      res.redirect('/');
    })
  })
});

router.get('/room/remove/:cateID', function (req, res, next) {
  Room.deleteOne({ _id: req.params.cateID }, function (err) {
    res.redirect('/');
  })
});


/*Khách sạn*/
router.get('/hotel', function (req, res, next) {
  Hotel.find({}, function (err, data) {
    console.log(data);
    res.render('hotel/hotels', { hotel: data });
    // res.json(data);
  })
});

router.get('/hotel/add', function (req, res, next) {
  res.render('hotel/hotel_add');
});

router.post('/hotel/save-add', upload.single('hotel_image'), function (req, res, next) {
  //thu thập dữ liệu từ form
  let { hotel_name, hotel_city,
    hotel_address, hotel_owner,
    hotel_license_number, hotel_total_floor } = req.body;

  //tạo ra đối tượng mới dạng Hotel
  let model = new Hotel();

  //Cập nhật lại thông tin đối tượng vừa tạ0 với cơ sở dữ liệu thu thập được từ form
  model.hotel_name = hotel_name;
  model.hotel_city = hotel_city;
  model.hotel_address = hotel_address;
  model.hotel_owner = hotel_owner;
  model.hotel_license_number = hotel_license_number;
  model.hotel_total_floor = hotel_total_floor;

  model.hotel_image = req.file.path.replace('public', '');

  //Lưu đối tượng với cơ sở dữ liệu
  model.save(function (err) {
    //Điều hướng website về danh sách danh mục
 ;
   res.redirect('/hotel');
  });
})
router.get('/hotel/edit/:cID', function (req, res, next) {
  var cID = req.params.cID;
  Hotel.findOne({ _id: cID }, function (err, data) {
    if (err) {
      res.send('Không tồn tại');
    }
    res.render('hotel/hotel_edit', { hotel: data });
  })
});

router.post('/hotel/save-edit', upload.single('hotel_image'), function (req, res, next) {

  // neu khong upload anh => req.file == null
  let { id, hotel_name, hotel_city,
    hotel_address, hotel_owner,
    hotel_license_number, hotel_total_floor } = req.body;

  Hotel.findOne({ _id: id }, function (err, model) {
    if (err) {
      res.send('ID Không tồn tại');
    }

    model.hotel_name = hotel_name;
    model.hotel_city = hotel_city;
    model.hotel_address = hotel_address;
    model.hotel_owner = hotel_owner;
    model.hotel_license_number = hotel_license_number;
    model.hotel_total_floor = hotel_total_floor;
    if (req.file != null) {
      model.hotel_image = req.file.path.replace('public', '');
    }
    model.save(function (err) {
      if (err) {
        res.send('Cập nhật không thành công');
      }

      res.redirect('/hotel');
    })
  })
});

router.get('/hotel/remove/:id', function (req, res, next) {
  Hotel.remove({ _id: req.params.id }, () => {
    Room.remove({ room_hotels: req.params.id }, () => {
      res.redirect('/hotel');
    })
  })
});

router.get('/hotel/remove/:cateID', function (req, res, next) {
  Hotel.deleteOne({ _id: req.params.cateID }, function (err) {
    res.redirect('/hotel');
  })
});

// APP

router.get('/hotelapp', function (req, res, next) {
  Hotel.find({}, function (err, data) {
    console.log(data);
    res.json(data);
  })
});

router.get('/infroom/:cID', function (req, res, next) {
  Room.find({room_hotels : req.params.cID})
    .populate('room_hotels')
    .exec((err, data) => {
      console.log(data);
      // res.render('index', { room: data });
      res.json(data);
    });
});





module.exports = router;
