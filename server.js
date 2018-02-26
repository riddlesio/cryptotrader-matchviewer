const fs          = require('fs');
const koa         = require('koa');
const body        = require('koa-body');
const serve       = require('koa-static');
const router      = require('koa-router')();

const app = koa();

app.use(serve('./web'));
app.use(body());

router.get('/data', function *(next) {

    try {
        this.body = fs.readFileSync('./src/js/data/dummyData.json');
        this.contentType = 'application/json';
    } catch (error) {
        this.body = error.message;
        this.status = 500;
    }

    yield next;
});

app.use(router.routes());

app.listen(8686);
console.log('Server listening at http://127.0.0.1:8686');
