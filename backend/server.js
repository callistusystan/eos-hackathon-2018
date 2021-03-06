var EOS = require('eosjs');
var http = require('http').createServer();
var io = require('socket.io')(http);

const wif = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
const pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'

const EOS_CONFIG = {
    contractName: 'food.ctr',
    contractSender: 'food.ctr',
    clientConfig: {
        keyProvider: ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'],
        httpEndpoint: 'http://localhost:8888'
    }
};

const eos = EOS(EOS_CONFIG.clientConfig);
var port = process.env.PORT || 3300;

var SALES = [];

var SALE_ID = 500;
var NAME_TO_SOCKET = {};

getSales();

let numClients = 0

io.on('connection', client => {
    if(numClients > 50){
        return
    }
    numClients+=1
    client.emit('getSales', SALES);

    client.on('createAcc', createAcc);
    client.on('getFoods', (args) => {
        getFoods(args)
        .then(res => {
            console.log(res);
            client.emit('getFoods', res);
        });
    });
    client.on('getSales', getSales);
    client.on('createSale', createSale);
    client.on('createFood', createFood);
    client.on('processTransaction', processTransaction);
    client.on('disconnect',()=>numClients-=1)
});

function getFoods(accountName, callback) {
    return eos.getTableRows({
        code: EOS_CONFIG.contractName,
        scope: accountName || 'callistus',
        table:'foods',
        json: true,
    });
}

function getSales() {
    eos.getTableRows({
        code: EOS_CONFIG.contractName,
        scope: EOS_CONFIG.contractName,
        table:'sales',
        json: true,
        limit: 12412984124
    }).then(({ rows }) => {
        SALES = rows;
        console.log('GOT SALES', SALES);
        io.emit('getSales', rows);
    });
}

function createAcc(accountName, callback) {
    console.log('createAcc', accountName);
    eos.transaction(tr => {
        tr.newaccount({
            creator: 'eosio',
            name: accountName,
            owner: pubkey,
            active: pubkey,
        })

        tr.buyrambytes({
            payer: 'eosio',
            receiver: 'myaccount',
            bytes: 8192
        })

        tr.delegatebw({
            from: 'eosio',
            receiver: 'myaccount',
            stake_net_quantity: '10.0000 SYS',
            stake_cpu_quantity: '10.0000 SYS',
            transfer: 0
        })
    }).then(res => {
        eos.contract(EOS_CONFIG.contractName).then((contract) => {
            contract.createacc(
                accountName,
                { authorization: [accountName] }
            ).then(res => {
                console.log('RES', res);

                callback(true);
            }).catch(err => {
                callback(false);
            });
        })
    }).catch(err => {
        callback(false);
    });
}

function createSale(args) {
    const { seller, type_of_sale, qr_code, count, price, description } = args;
    console.log('CREATING SALES', args, SALE_ID);
    eos.contract(EOS_CONFIG.contractName).then((contract) => {
        contract.createsale(
            {
                seller: seller || 'callistus',
                sale_id: SALE_ID,
                type_of_sale,
                qr_code,
                count,
                price,
                description
            },
            { authorization: [seller || 'callistus'] }
        ).then(res => {
            getSales();
            getFoods(seller);
            SALE_ID++;
        }).catch(err => {
            console.log(err);
        });
    });
}

function createFood({ curOwner, qr_code, food_name, expiry_date, location, image, count, units, price }) {
    console.log('CREATE FOOD')
    eos.contract(EOS_CONFIG.contractName).then((contract) => {
        console.log('CREATING FOOD');
        contract.createfood(
            {
                curOwner: curOwner || 'callistus',
                qr_code,
                food_name,
                expiry_date,
                location,
                image: '',
                count,
                units,
                price
            },
            { authorization: [curOwner] }
        ).then(res => {
            getFoods(curOwner);
        });
    });
}

function processTransaction({ curOwner, newOwner, qr_code, count, type_of_sale, sale_id }) {
    eos.contract(EOS_CONFIG.contractName).then((contract) => {
        contract.setfoodowner(
            {
                curOwner: curOwner  || 'callistus',
                newOwner,
                qr_code,
                count,
                type_of_sale,
                sale_id
            },
            { authorization: [curOwner || 'callistus', newOwner || 'evelyn'] }
        ).then(res => {
            getSales();
            getFoods(curOwner);
            getFoods(newOwner);
        }).catch(res => {

        });
    })
}

http.listen(port, function(){
    console.log('listening on *:'+port);
});