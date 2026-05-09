import net from 'net';
import fs from 'fs';

const PORT = 5050;
const DB_FILE = './salas_db.json';

// Persistência: Carrega ou cria o banco de dados
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}));

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const raw = data.toString().trim();
        const [command, ...args] = raw.split('|');

        // Lógica de Trava: O Node.js processa um evento por vez no Event Loop
        // garantindo que duas reservas não ocorram simultaneamente no objeto db.
        let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));

        if (command === 'CHECK') {
            socket.write(`DATA|${JSON.stringify(db)}\n`);
        } 
        else if (command === 'RESERVE') {
            const [sala, hora] = args;
            const key = `${sala}_${hora}`;
            if (!db[key]) {
                db[key] = { status: 'Ocupado', id: Date.now() }; // Reserva e gera ID
                fs.writeFileSync(DB_FILE, JSON.stringify(db));
                socket.write(`OK|Reserva ${db[key].id} confirmada\n`);
            } else {
                socket.write(`ERR|Sala ja ocupada nesse horario\n`);
            }
        }
        else if (command === 'CANCEL') {
            const [id] = args;
            // Lógica para remover do JSON usando o ID...
            socket.write(`OK|Cancelamento processado\n`);
        }
    });
});

server.listen(PORT, () => console.log(`Servidor TCP em C:\\Codigos\\srse ouvindo na porta ${PORT}`));