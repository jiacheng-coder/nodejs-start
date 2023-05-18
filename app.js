const querystring = require('querystring');
const handleBlogRoute = require('./src/routes/blog.js')

const serverHandler = (req,res)=>{
  // 设置响应格式
  res.setHeader('Content-Type', 'application/json');
  // 获取请求路径
  const url = req.url
  const path = url.split('?')[0]
  // 解析 query
  req.query = querystring.parse(url.split('?')[1])
  req.path = path
  // 处理post数据
  const getPostData = (req)=>{
    const promise = new Promise((resolve, reject)=>{
      if (req.method!=='POST') {
        resolve({})
        return
      }
      if (req.headers['content-type']!=='application/json') {
        resolve({})
        return
      }
      let postData = ''
      req.on('data',chunk=>{
        postData += chunk.toString()
      })
      req.on('end',()=>{
        if (!postData){
          resolve({})
          return
        }
        resolve(JSON.parse(postData))
      })
    })
    return promise
  }
  // post
  getPostData(req).then(postData=>{
    req.body = postData
    // 博客相关的路由
    const blogData = handleBlogRoute(req,res)
    if (blogData){
      res.end(JSON.stringify(blogData))
      return
    }
    res.writeHead(404,{'Content-Type': 'text/plain'})
    res.write('404 Not Found')
    res.end()
  })
}

module.exports = serverHandler