const mongoose = require('mongoose')
const express = require('express')
const app = express();
const port = 3000;
const path = require('path');

const fruits = require('./model/Fruits');
const upload = require('./Upload');
const users = require('./model/Users');

app.listen(port, () => {
    console.log('Dang chay cong ', port)
})

const uri = 'mongodb+srv://slide3:123@sanphams.9silvsv.mongodb.net/Lab'

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

try {
    mongoose.connect(uri)
    console.log('Connect succsess');
} catch (err) {
    console.log('Ket noi that bai: ', err);
}

app.get('/list', async (req, res) => {
    res.send(await fruits.find())
})

app.post('/add-fruits', upload.array('image', 5), async (req, res) => {
    try {
        const data = req.body; 
        const { files } = req 
        const urlsImage =
            files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
        const newfruit = new fruits({
            image: urlsImage, 
            name: data.name,
            quantity: data.quantity,
            price: data.price,     
            distributor: data.distributor,       
            description: data.description, 
        });
        const result = (await newfruit.save()); 
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

app.post('/add-user', upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

        const newUser = new users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avartar: imageUrl,
        });

        const result = await newUser.save();
        if (result) {
            res.json({
                "status": 200,
                "message": "Thêm thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Thêm không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": 500,
            "message": "Đã xảy ra lỗi",
            "data": []
        });
    }
});

app.post('/register-send-email', upload.single('avartar'), async (req, res) => {
    try {
        const data = req.body;
        const { file } = req
        const avatar = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        const newUser = users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avartar: avatar,
        })
        const result = await newUser.save()
        if (result) { 
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await users.findOne({ username, password })
        if (user) {
            res.json({
                "status": 200,
                "messenger": "Đăng nhâp thành công",
                "data": user
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, đăng nhập không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await fruits.findByIdAndDelete(id)

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, xóa không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
    }
})

app.put('/update-fruit/:id', upload.array('image', 5), async (req, res) => {
    try {
        const fruitId = req.params.id;
        const data = req.body;
        const files = req.files;

        const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

        const result = await fruits.findByIdAndUpdate(fruitId, {
            image: urlsImage,
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            distributor: data.distributor,
            description: data.description,
        });

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Cập nhật thành công",
                "data": result
            });
        } else {
            res.status(404).json({
                "status": 404,
                "messenger": "Không tìm thấy trái cây",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": 500,
            "messenger": "Lỗi, không thể cập nhật trái cây",
            "data": []
        });
    }
});

app.put('/update-no-image/:id', upload.array('image', 5), async (req, res) => {
    try {
        const fruitId = req.params.id;
        const data = req.body;

        const result = await fruits.findByIdAndUpdate(fruitId, {
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            distributor: data.distributor,
            description: data.description,
        });

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Cập nhật thành công",
                "data": result
            });
        } else {
            res.status(404).json({
                "status": 404,
                "messenger": "Không tìm thấy trái cây",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": 500,
            "messenger": "Lỗi, không thể cập nhật trái cây",
            "data": []
        });
    }
});

app.get('/search', async (req, res) => {
    try {
        const tuKhoa = req.query.key; 
       
        const ketQuaTimKiem = await fruits.find({ name: { $regex: new RegExp(tuKhoa, "i") } });

        if (ketQuaTimKiem.length > 0) {
            res.json(ketQuaTimKiem);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
})


const sapxepgiamdan = (products) => {
    return products.sort((a, b) => b.price - a.price);
}

app.get('/giam-dan', async (req, res) => {
    try {
        let cay = await fruits.find();
        let sortedProducts = sapxepgiamdan(cay);
        res.json(sortedProducts);
    } catch (error) {
        console.error('Lỗi khi sắp xếp danh sách sản phẩm theo giá tăng dần:', error);
        res.status(500).send('Đã xảy ra lỗi khi sắp xếp danh sách sản phẩm');
    }
});

const sapxeptangdan = (products) => {
    return products.sort((a, b) => a.price - b.price);
}

app.get('/tang-dan', async (req, res) => {
    try {
        let cay = await fruits.find();
        let sortedProducts = sapxeptangdan(cay);
        res.json(sortedProducts);
    } catch (error) {
        console.error('Lỗi khi sắp xếp danh sách sản phẩm theo giá giảm dần:', error);
        res.status(500).send('Đã xảy ra lỗi khi sắp xếp danh sách sản phẩm');
    }
});


app.get('/search-gia', async (req, res) => {
    try {
        const gia = req.query.key; 
       
        const ketQuaTimKiem = await fruits.find({ price: { $gte: gia } });

        if (ketQuaTimKiem.length > 0) {
            res.json(ketQuaTimKiem);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
})