# A Netlify CMS tutorial
[Netlify](https://www.netlify.com/) is a headless CMS written in React.js that follows the [JAM](https://jamstack.org/) stack logic that fits surprisingly well in our dev workflow, as it can help us serve content and automate our deployments at the same time. In this tutorial we will try Netlify, install it locally, and then connect it to our github repository.
With recent front-end Javascript and CSS framework explosion, Netlify has evolved around a rich ecosystem and became flexible enough to support pretty much every [popular static site generator out there](https://www.staticgen.com).

## Test Netlify from localhost without installation.
1. Create the files required for netlify setup:
    - `config.yml`
    - `index.html`
    - `index.js`

2. Connect `index.html` with Netlify core source files:
```html
  <head>
    <link href="https://unpkg.com/netlify-cms/dist/cms.css" rel="stylesheet"/>
  </head>
  <body>
    <script src="https://unpkg.com/netlify-cms/dist/cms.js"></script>
  </body>
```
3. Create the `index.js` file:

 ```js
  import CMS from 'netlify-cms'
  import CSS from 'netlify-cms/dist/cms.css'

  export default {
      CMS,
      CSS
  }
 ```

4. Define Netlify configuration variables and [field entry types]() in `config.yml` file: 

```yml
backend:
  name: test-repo # Used in routes

media_folder: "img"

collections: 
  - name: "articles" # Used in routes
    label: "Article" # Used in the React UI
    folder: "articles/first_article" # Path to the documents
    filter: # filter entries based on the value of a single field
      field: language
      value: en
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}" # Filename template, e.g., YYYY-MM-DD-title.md
    create: true # Allow users to create new documents in this collection
    fields: # The fields for each document, usually in front matter
        - {name: "title", label: "Title", widget: "string"}
        - {label: "Publish Date", name: "date", widget: "datetime"}
        - {name: "body", label: "Body", widget: "markdown"}
        - {label: "Featured Image", name: "thumbnail", widget: "image"}
        - {name: "slug", label: "Slug", widget: "string" }
        - {name: "layout", label: "Layout", widget: "hidden", default: "articledetail"}

exclude:
  - admin/index.js
  - webpack.config.js
  - package.json
  - server.js
  - README.md
```

**Note:** At this point we don't even need a module bundler like webpack or rollup, however we do need a server to serve our static files locally. Anyone of the following npm packages will do for now:
- [serve](https://www.npmjs.com/package/serve) 
- [node-serve](https://www.npmjs.com/package/node-serve) 
- [http-server](https://www.npmjs.com/package/http-server)

5. Create the server configuration file:
  We will use `yarn add serve -D` and create a `server.js` file in our root directory:

```js
  // ./server.js
  const serve = require('serve')

  const server = serve(__dirname, {
    port: 1568,
    open: true,
    ignore: ['node_modules', 'bower_components']
  })
```

**Note:** Serving from a custom folder is easy:

```js
  // ./server.js
  let admin = '__dirname' + '/admin' 

  const server = serve(admin, {
    ...
  }) 
```

6. Run the server with `node server.js` or `yarn start`. If everything goes well, the following message will appear in your terminal:

```bash

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │    Serving!                                      │
  │                                                  │
  │    - Local:            http://localhost:1568     │
  │    - On Your Network:  http://ip_address:1568    │
  │                                                  │
  │    Copied local address to clipboard!            │
  │                                                  │
  └──────────────────────────────────────────────────┘

```

7. Go to the above address and you will be greeted by the admin panel. Just click on the login button and enter your CMS. You can create and edit entries, however there is no persistance yet. Everything is served from memory.

## Install Netlify locally and use it with a static site generator

1. Environment setup: `yarn init`
2. Install netlify: `yarn add netlify-cms`
3. Inform the platform about your node version: `node -v > .nvmrc`
4. In case you are already using a static site generator like Jekyll create an `admin` directory and move required files in it: `config.yml`, `index.html` and `index.js`. Then you can define and add more dependencies. 

  - Install Ruby bundler:
  ```bash
  gem install bundler
  ```

  - In Jekyll's example create a `Gemfile` in the root of our project:
  
  ```yml

  source "https://rubygems.org"
  gem 'jekyll', '~> 3.6.2'

  ```

  - Install Jekyll and create the `Gemfile.lock` dependency file:
  ```bash
  bundle install
  ```

  - Add generated `_site` folder to `.gitignore` file.

  - Install webpack and create the `webpack.config.js` file:
  ```js
  import path from 'path';

  module.exports = {
    entry: "./admin/index.js",
    output: {
        path: `${__dirname}/admin`,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=public/fonts/[name].[ext]'
            }
        ]
    }
  };
  ```

  - Add generated js bundle to your `index.html` file: 
  ```html
  <script src="./bundle.js"></script>
  ```

  - Create scripts in `package.json` file:
  ```JSON
  "scripts": {
    "dev": "webpack && jekyll serve",
    "bld": "webpack && jekyll build"
  },
  ```

5. Install your front-end poison of choice: `yarn add babel-core react or vue ...blah...`
6. Adjust `webpack.config.js` accordingly with the proper js loader.
7. Connect to Netlify and start coding !

## Connect with Github
1. Stop the local server and create a github repository. When will start netlify again you will find a button with the label “Login With GitHub” and then we can follow the authentication steps.

2. Change first lines in `config.yml` to:
```yml
  backend:
    name: github
    repo: github_username/github_repo_name
    branch: master
```

3. For a more complete guide follow this [tutorial](https://github.com/netlify/netlify-cms/blob/master/docs/quick-start.md)

## Allways use Netlify-cli
So far we have installed and tested minimal Netlify instance locally step by step just to get ourselves familiar with this great tool. 
However from now on for installation, deployment and continuous integration we must learn how to use the [Netlify command tools](https://www.netlify.com/docs/cli/).

## Next Steps

### 1. Create a simple blog with React
We have many options here. Here some of my favorites:

  i. [react-static](https://github.com/nozzle/react-static) is recommended if you don't want to dive into [Gatsby](https://www.gatsbyjs.org/) and [GraphQl](https://www.howtographql.com/) for something simple. 

  **Read:** 
  - Check React static [examples and templates](https://github.com/nozzle/react-static#examples-and-templates)
  - Try [react-static-generator](https://www.npmjs.com/package/react-static-generator)
  - Take a look at [React app deployment with Firebase connection](https://coderjourney.com/tutorials/how-to-deploy-a-react-application/)

  ii. [react-snapshot](https://github.com/geelen/react-snapshot)

  iii. [static site generator webpack plugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin)


### 2. Create a simple blog with Vue
[Nuxt](https://nuxtjs.org/) with [nuxt-netlify-cms-module](https://github.com/medfreeman/nuxt-netlify-cms-module) recommended.

  **Read:**
  - [Improving the deployment of a Nuxt site using Netlify](https://www.vuejsradar.com/deploying-nuxt-to-netlify)


### 3. Learn how to use it with the static site generator of your choice: 

Tutorials and links about how to use Netlify...
- [with Jekyll](https://www.netlify.com/blog/2015/10/28/a-step-by-step-guide-jekyll-3.0-on-netlify/)
- [with Gitbook](https://www.netlify.com/blog/2015/12/08/a-step-by-step-guide-gitbook-on-netlify/)
- [with Hugo](https://www.netlify.com/blog/2016/09/21/a-step-by-step-guide-victor-hugo-on-netlify/)
- [with Hexo](https://www.netlify.com/blog/2015/10/26/a-step-by-step-guide-hexo-on-netlify/)
- [with Gatsby](https://www.netlify.com/blog/2016/02/24/a-step-by-step-guide-gatsby-on-netlify/)
- [with Nuxt](https://codeburst.io/create-a-static-site-in-15-minutes-or-less-using-vue-js-e4e2a9945ee6)
- [with Lektor](https://www.netlify.com/blog/2016/09/21/a-step-by-step-guide-victor-hugo-on-netlify/)
- [with Cactus](https://www.netlify.com/blog/2016/04/08/a-step-by-step-guide-cactus-on-netlify/)

### 4. Read the [docs](https://www.netlify.com/docs/) 

If you think Netlify CMS is a useful project please donate and/or Contribute to [community](https://www.netlifycms.org/community/)

Useful links:
- [Headless CMS](https://headlesscms.org/)
- [JAMstack for Clients: Benefits, Static Site CMS, & Limitations](https://dev.to/couellet/jamstack-for-clients-benefits-static-site-cms--limitations-2a9)
- [Static is the new dynamic](https://www.thenewdynamic.org/)
- [Moving Smashing Away from WordPress](https://www.netlify.com/blog/2017/03/16/smashing-magazine-just-got-10x-faster/)
- [Creating a MVP with Netlify, Zapier and Google Sheets](https://medium.com/joppalogic/creating-a-mvp-with-netlify-zapier-and-google-sheets-58c9973acacd)
- [Netlify quick start](https://github.com/netlify/netlify-cms/blob/master/docs/quick-start.md)
- [Exploring Netlify CMS, a React & Git-Based Content Management System](https://snipcart.com/blog/netlify-cms-react-git-workflow)
- [How to Build a Serverless, SEO-friendly React blog with Netlify](https://buttercms.com/blog/serverless-react-blog-tutorial)
- [Reddit](https://www.reddit.com/search?q=Netlify)
- [Gitter](https://gitter.im/netlify/community)
