const { hash } = require("bcryptjs");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UsersController {
    async create (request, response) {
        const { name, email, password } = request.body;
        const database = await sqliteConnection();
        const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if ( checkUserExist ) {
            throw new AppError("Esse email já está cadastrado.");
        }

        const hashedPassword = await hash(password, 8);

        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
            );

        response.status(201).json({});
    }
}

module.exports = UsersController;