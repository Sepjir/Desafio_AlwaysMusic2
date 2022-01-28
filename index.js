//Almacenando el objeto Pool del modulo PostgreSQL de Node
const {Pool} = require("pg")

//Objeto de configuración de Pool
const config = {
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "usuarios",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
}

//Capturando comandos de consola
const comandos = process.argv.slice(2)

//Instanciando Pool con el objeto de configuración
const pool = new Pool(config)

// función añadir estudiante con el comando: node index.js nuevo 'nombre' 'rut' curso nivel
async function addUser() {
    pool.connect(async(errC, client, release) => {
        if(errC) return console.error("Ha habido un problema de conexión a la BD", errC.code)

        const SQLQuery = {
            name: "fetch-user",
            text: "insert into usuario (nombre, rut, curso, nivel) values ($1, $2, $3, $4) RETURNING *;",
            values: [`${comandos[1]}`, `${comandos[2]}`, `${comandos[3]}`, `${comandos[4]}`]
        }
    
        const res = await client.query(SQLQuery)
        console.log(`El estudiante "${comandos[1]}" ha sido agregado exitosamente`)
        release()
        pool.end()

    })
    
}

//función para consultar todos los estudiantes con el comando: node index.js consulta
async function consultarTabla() {

    pool.connect(async(errC, client, release) => {
        if(errC) return console.error("Ha habido un problema de conexión a la BD", errC.code)

        const SQLQuery = {
            name: "fetch-user",
            rowMode: "array",
            text: "SELECT * FROM usuario",
        }

        const res = await client.query(SQLQuery)
        console.log("Estudiantes: ", res.rows)
        release()
        pool.end()
    })
}

// función consultar por rut con el comando: node index.js rut '12.345.678-9'
async function consultarRUT() {

    pool.connect(async(errC, client, release) => {
        if(errC) return console.error("Ha habido un problema de conexión a la BD", errC.code)

        const SQLQuery = {
            name: "fetch-user",
            rowMode: "array",
            text: "SELECT * FROM usuario WHERE rut = $1",
            values: [`${comandos[1]}`]
        }

        const res = await client.query(SQLQuery)
        console.log(`El estudiante con rut ${comandos[1]} es el siguiente:`, res.rows)
        release()
        pool.end()

    })
    
}
// función para editar el nivel del estudiante, con el comando: node index.js editar nombre rut curso nuevo nivel
async function editUser() {
    pool.connect(async(errC, client, release) => {
        if(errC) return console.error("Ha habido un problema de conexión a la BD", errC.code)

        const SQLQuery = {
            name: "fetch-user",
            text: "UPDATE usuario SET nivel = $1 WHERE rut = $2",
            values: [`${comandos[4]}`, `${comandos[2]}`]
        }

        const res = await client.query(SQLQuery)
        console.log(`El estudiante "${comandos[1]}" ha sido editado con éxito`)
        release()
        pool.end()

    })
}

//función eliminar a estudiante al ingresar comando: node index.js eliminar rut
async function eliminar() {
    pool.connect(async (errC, client, release) => {
        if(errC) return console.error("Ha habido un problema de conexión a la BD", errC.code)

        const SQLQuery = {
            name: "fetch-user",
            text: "DELETE FROM usuario WHERE rut = $1",
            values: [`${comandos[1]}`]
        }

        const res = await client.query(SQLQuery)
        console.log(`Registro de estudiante con rut ${comandos[1]} ha sido eliminado`)
        release()
        pool.end()
    })
}

//Condicionales para desencadenar las funciones
if (comandos[0] == "nuevo") {
    addUser()
}if (comandos[0] == "consulta") {
    consultarTabla()
}if (comandos[0] == "editar") {
    editUser()
}if (comandos[0] == "eliminar") {
    eliminar()
}if (comandos[0] == "rut") {
    consultarRUT()
}

