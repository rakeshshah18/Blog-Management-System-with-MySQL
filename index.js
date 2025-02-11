const express = require('express');
const bodyParser = require('body-parser');
const blogRoutes = require('./src/routes/blog.routes');
const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes')
const { testDBConnection} = require('./src/config/db');
const app = express();
app.use(bodyParser.json());




app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);


testDBConnection();
app.listen(3000, () => console.log('Server running on port 3000'));