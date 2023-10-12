const express = require('express');
const app = express();
const redis = require('redis');
const path = require('path');
const cors = require('cors')
const axios = require('axios');
const redisURL =  process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient({url:redisURL});
const DEFAULT_EXPIRATION = 3600; // default redis expiration time 1hr
// connect to redis
(async()=>{
  try {
    await client.connect()
    console.log('Connected to Redis');
  } catch (e) {
    console.error(e);
  }
})();
// client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client Connected'));
// Set up the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(cors())

// GET request handler for the home page
app.get('/', (req, res) => {
    // return home.ejs file of views folder
    res.render('home');

});

const createResponse = async (endpoint) => {
  let data = await client.get(endpoint);
  if(data) {
    const ttl = await client.ttl(endpoint);
    return {data: JSON.parse(data), cacheHit: true, ttl: ttl};
  }else{
    let {data}=await axios.get("https://jsonplaceholder.typicode.com/"+endpoint)
    await client.setEx(endpoint, DEFAULT_EXPIRATION, JSON.stringify(data));
    return {data, cacheHit: false};
  }
}
app.get('/users', async (req, res) => {
  const result =  await createResponse('users');
  return res.json(result)
});

app.get('/posts', async (req, res) => {
  const result =  await createResponse('posts');
  return res.json(result)
});

app.get('/comments', async (req, res) => {
  const result =  await createResponse('comments');
  return res.json(result)
});

app.get('/albums', async (req, res) => {
  const result =  await createResponse('albums');
  return res.json(result)
});

app.get('/photos', async (req, res) => {
  const result =  await createResponse('photos');
  return res.json(result)
});

app.get('/todos',async(req,res)=>{
  const result =  await createResponse('todos');
  return res.json(result)
})

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
