// modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({
    extended: true
}));
const port = 4000;
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./DB/register.db');
app.set('view engine', 'ejs');
const nodemailer = require('nodemailer');

// Rutas ----------------------------------------->
app.get('/', (req, res) => {
    res.render('registro', {
        nombre: 'ADSI'
    });
});

// File Statics ------------>

app.use(express.static(__dirname + '/public'));

app.post('/registro', (req, res) => {
    let name = req.body.nombre;
    let lastName = req.body.apellido;
    let residencia = req.body.residencia;
    let document = req.body.documento;
    let num_id = req.body.num_id;
    let email = req.body.email;
    let password = req.body.password;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    db.run(`INSERT INTO Registro(name, lastName, residencia, document, num_id,email,password) 
    VALUES(?, ?, ?, ?, ?, ?,?)`,
        [name, lastName, residencia, document, num_id, email, hash],
        function (error) {
            if (!error) {
                console.log("Insert OK");
            } else {
                console.log("Insert error", error);
            }
        }
    );
    res.render('registro');

    // Envio de correo de registro
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'alertfemc@gmail.com',
            pass: 'xcvjrfbcpbtcsznd'
        }
    });

    // send email
    transporter.sendMail({
        from: 'alertfemc@gmail.com',
        to: email,
        subject: 'Test Email Subjects',
        html: '<h1>REGRISTRO EXITOSO</h1><h2>GRACIAS POR EXISTIR 737</H2><img src="https://res.cloudinary.com/click-alert-fem/image/upload/v1654792461/samples/logos/LOGOO_tvefoj.jpg">'
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
});


app.post('/logicalogin', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //se pasa una variable sencilla a la vista
    db.get("SELECT password FROM Registro WHERE email=$email", {
        $email: email
    }, (error, rows) => {
        console.log("wwww", rows.password);
        if (bcrypt.compareSync(password, rows.password)) {
            return res.send("logueado exitosamente");
        }
        return res.send('usuario y contraseña incorrecta');
    })

});





app.get('/login', (req, res) => {
    //se pasa una variable sencilla a la vista
    res.render('login');
})




// Servidor ---------------------------------->
app.listen(port, () => {
    console.log('Server running uvu');
});

// ------------------------------>


app.post('/login', (req, res) => {
    let document = req.body.document;
    let password = req.body.password;
    res.send(`Ingrese su documento: ${document} Ingrese su contraseña: ${password}`);
});